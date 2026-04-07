import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createClient } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

// --- Theme Store ---
interface ThemeState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  showCurtain: boolean;
  setShowCurtain: (show: boolean) => void;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'dark',
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      setTheme: (theme) => set({ theme }),
      showCurtain: true,
      setShowCurtain: (show) => set({ showCurtain: show }),
      toast: null,
      showToast: (message, type = 'success') => set({ toast: { message, type } }),
      hideToast: () => set({ toast: null }),
    }),
    { name: 'theme-storage' }
  )
);

// --- Cart Store ---
interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
  color?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => set((state) => {
        const existingItem = state.items.find(i => i.id === item.id);
        if (existingItem) {
          return {
            items: state.items.map(i => i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i)
          };
        }
        return { items: [...state.items, item] };
      }),
      removeItem: (id) => set((state) => ({ items: state.items.filter(i => i.id !== id) })),
      updateQuantity: (id, quantity) => set((state) => ({
        items: state.items.map(i => i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i)
      })),
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
    }),
    { name: 'cart-storage' }
  )
);

// --- Auth Store (Mock) ---
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinDate?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  checkSession: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      checkSession: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Fetch additional profile data (avatar etc.)
          const { data: profileData } = await supabase
            .from('profiles')
            .select('avatar_url')
            .eq('id', session.user.id)
            .single();

          set({ 
            user: {
              id: session.user.id,
              email: session.user.email!,
              name: session.user.user_metadata.full_name || 'Sorcerer',
              avatar: profileData?.avatar_url || session.user.user_metadata.avatar_url || '/images/logo.png',
              joinDate: session.user.created_at
            },
            isAuthenticated: true,
            isLoading: false
          });
        } else {
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      updateUser: (data) => set((state) => {
        if (!state.user) return state;
        return { user: { ...state.user, ...data } };
      }),
      logout: async () => {
        try {
          // Explicitly clear state first to prevent UI lag/freezes
          set({ user: null, isAuthenticated: false });
          
          const { error } = await supabase.auth.signOut();
          if (error) {
            console.warn('[Auth] SignOut Warning:', error.message);
          }
          
          // Clear any remaining auth-related storage just in case
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth-storage');
            // We use window.location.href in components to force a clean reload if needed
          }
        } catch (error) {
          console.error('[Auth] Logout Fatal Error:', error);
          set({ user: null, isAuthenticated: false });
        }
      },
    }),
    { name: 'auth-storage' }
  )
);

// --- Wishlist Store ---
interface WishlistState {
  items: string[]; // store product IDs
  toggleItem: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  syncWithSupabase: () => Promise<void>;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      isInWishlist: (productId) => get().items.includes(productId),
      
      syncWithSupabase: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data } = await supabase
          .from('user_favorites')
          .select('product_id')
          .eq('user_id', session.user.id);

        if (data) {
          const favoriteIds = data.map(f => f.product_id);
          set({ items: [...new Set([...get().items, ...favoriteIds])] });
        }
      },

      toggleItem: async (productId) => {
        const isCurrentlyIn = get().items.includes(productId);
        
        // Optimistic UI Update
        if (isCurrentlyIn) {
          set({ items: get().items.filter(id => id !== productId) });
        } else {
          set({ items: [...get().items, productId] });
        }

        // Supabase Sync if Logged In
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          if (isCurrentlyIn) {
            await supabase
              .from('user_favorites')
              .delete()
              .match({ user_id: session.user.id, product_id: productId });
          } else {
            await supabase
              .from('user_favorites')
              .insert({ user_id: session.user.id, product_id: productId });
          }
        }
      },
    }),
    { name: 'wishlist-storage' }
  )
);
