"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  LogOut, Package, MapPin, User as UserIcon, Heart, 
  Settings, Camera, ShoppingBag, Clock, ChevronRight, 
  Trash2, ExternalLink
} from "lucide-react";
import { useAuthStore, useThemeStore } from "@/store";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Order {
  id: string;
  created_at: string;
  total_amount: number;
  status: string;
  items: string;
  wilaya: string;
  delivery_type: string;
}

interface FavoriteProduct {
  id: string;
  name: string;
  price: number;
  image_url: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, updateUser } = useAuthStore();
  const showToast = useThemeStore((state) => state.showToast);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("orders");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Protect route & Fetch Data
  useEffect(() => {
    if (mounted) {
      if (!isAuthenticated) {
        router.push("/auth/login");
      } else if (user) {
        fetchUserData();
      }
    }
  }, [mounted, isAuthenticated, user, router]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Orders
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (ordersData) setOrders(ordersData);

      // 2. Fetch Favorites
      const { data: favsData } = await supabase
        .from('user_favorites')
        .select('product_id, products(id, name, price, image_url)')
        .eq('user_id', user?.id);
      
      if (favsData) {
        const flattenedFavs = favsData.map((f: any) => f.products).filter(Boolean);
        setFavorites(flattenedFavs);
      }
    } catch (err) {
      console.error("Error fetching profile data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file size (e.g., 2MB)
    if (file.size > 2 * 1024 * 1024) {
      showToast("Artifact image too large (Max 2MB)", "error");
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // 1. Upload to Supabase Storage with overwriting permissions
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // 3. Update Profiles Table (explicitly .update().eq() to bypass RLS "insert" violations)
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // 4. Update Local State
      updateUser({ avatar: publicUrl });
      showToast("Appearance Manifested Successfully", "success");
    } catch (err: any) {
      console.error("Avatar Upload Error:", err);
      // Detailed error logging as requested
      const errorMessage = err?.message || err?.error_description || "Failed to manifest appearance";
      showToast(errorMessage, "error");
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      // Force clean reload to clear all memory and transients
      window.location.href = "/";
    } catch (err) {
      console.error("Logout Redirect Error:", err);
      window.location.href = "/";
    }
  };

  if (!mounted || !isAuthenticated || !user) return null;

  return (
    <div className="min-h-screen bg-background pt-24 pb-24 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Profile Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface/40 backdrop-blur-xl border border-border p-8 md:p-10 rounded-3xl mb-10 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center md:items-center gap-8"
        >
          {/* Avatar Section */}
          <div className="relative group/avatar">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-background overflow-hidden shadow-2xl shadow-primary/20 bg-muted/20 relative">
              <Image 
                src={user.avatar || "/images/logo.png"} 
                alt={user.name} 
                fill 
                className="object-cover transition-transform duration-500 group-hover/avatar:scale-110"
              />
              {uploading && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            <label className="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity rounded-full z-10 text-[10px] font-bold text-white tracking-widest uppercase disabled:cursor-not-allowed">
              <Camera size={24} className="mb-2" />
              {uploading ? "Manifesting..." : "Manifest Image"}
              <input 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={handleAvatarUpload}
                disabled={uploading}
              />
            </label>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-3">
              <h1 className="font-cinzel text-3xl md:text-4xl font-black text-foreground tracking-wider uppercase">
                {user.name}
              </h1>
              <span className="inline-flex items-center px-3 py-1 bg-primary/10 border border-primary/30 text-primary rounded-full text-[10px] font-bold tracking-widest uppercase mx-auto md:mx-0">
                Special Grade Sorcerer
              </span>
            </div>
            <p className="text-muted-foreground mb-6 font-medium tracking-wide flex items-center justify-center md:justify-start gap-2">
              <Mail size={14} /> {user.email}
              <span className="mx-1">•</span>
              <Clock size={14} /> Joined {new Date(user.joinDate || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-6 py-2.5 bg-background border border-border text-xs font-bold tracking-widest uppercase text-muted-foreground hover:text-red-500 hover:border-red-500/50 transition-all rounded-xl shadow-lg hover:shadow-red-500/10"
              >
                <LogOut size={16} /> Breaking Binding Vow (Logout)
              </button>
            </div>
          </div>

          {/* Stats Teaser */}
          <div className="hidden lg:flex gap-12 px-8 py-6 bg-background/30 rounded-2xl border border-border/50">
            <div className="text-center">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Orders</p>
              <p className="font-cinzel text-2xl font-black text-primary">{orders.length}</p>
            </div>
            <div className="w-px h-full bg-border" />
            <div className="text-center">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Liked</p>
              <p className="font-cinzel text-2xl font-black text-primary">{favorites.length}</p>
            </div>
          </div>
        </motion.div>

        {/* Dashboard Navigation */}
        <div className="flex border-b border-border mb-10 gap-8 overflow-x-auto no-scrollbar">
          {[
            { id: "orders", label: "Orders", icon: ShoppingBag },
            { id: "favorites", label: "Saved Artifacts", icon: Heart },
            { id: "settings", label: "Domain Configuration", icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 pb-4 text-xs font-bold tracking-[0.2em] uppercase transition-all relative",
                activeTab === tab.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon size={16} />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "orders" && (
              <div className="space-y-6">
                {loading ? (
                  <div className="py-20 flex justify-center"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
                ) : orders.length > 0 ? (
                  <div className="grid gap-4">
                    {orders.map((order) => (
                      <div key={order.id} className="bg-surface/30 border border-border rounded-2xl p-6 hover:border-primary/30 transition-all group">
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                              <Package size={24} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-cinzel font-black tracking-widest text-foreground">ORDER #{order.id.toUpperCase()}</h3>
                                {(() => {
                                  const status = order.status?.toUpperCase() || 'PENDING';
                                  const config: Record<string, { bg: string, text: string }> = {
                                    'PENDING': { bg: 'bg-amber-500/10', text: 'text-amber-500' },
                                    'PROCESSING': { bg: 'bg-blue-500/10', text: 'text-blue-500' },
                                    'SHIPPED': { bg: 'bg-indigo-500/10', text: 'text-indigo-500' },
                                    'DELIVERED': { bg: 'bg-green-500/10', text: 'text-green-500' },
                                    'CANCELLED': { bg: 'bg-red-500/10', text: 'text-red-500' },
                                    'REFUNDED': { bg: 'bg-gray-500/10', text: 'text-gray-500' },
                                    'COMPLETED': { bg: 'bg-emerald-500/10', text: 'text-emerald-500' },
                                  };
                                  const styles = config[status] || config['PENDING'];
                                  return (
                                    <span className={cn(
                                      "px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest",
                                      styles.bg,
                                      styles.text
                                    )}>
                                      {status}
                                    </span>
                                  );
                                })()}
                              </div>
                              <p className="text-xs text-muted-foreground mb-3">{new Date(order.created_at).toLocaleDateString()} • {order.items.split(',').length} items</p>
                              <p className="text-sm font-medium text-foreground max-w-lg line-clamp-1">{order.items}</p>
                            </div>
                          </div>
                          <div className="flex flex-row md:flex-col justify-between items-end gap-2 text-right">
                            <p className="font-cinzel text-xl font-black text-primary">{order.total_amount.toLocaleString()} DZD</p>
                            <Link 
                              href={`/profile/orders/${order.id}`}
                              className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground hover:text-primary transition-all flex items-center gap-1 group/btn hover:underline underline-offset-4 decoration-primary/30"
                            >
                              View Decree <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-24 bg-surface/10 border border-dashed border-border rounded-3xl">
                    <Package size={48} className="text-muted-foreground mb-4 opacity-30" />
                    <p className="text-muted-foreground font-medium tracking-widest uppercase text-sm mb-6">No Records Manifested</p>
                    <Link href="/shop" className="px-8 py-3 bg-primary text-white font-bold tracking-widest uppercase rounded-xl hover:bg-accent transition-all shadow-lg shadow-primary/20">
                      Browse Full Armory
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === "favorites" && (
              <div>
                {loading ? (
                  <div className="py-20 flex justify-center"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
                ) : favorites.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {favorites.map((fav) => (
                      <div key={fav.id} className="group bg-surface/30 border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all hover:shadow-2xl hover:shadow-primary/5">
                        <div className="aspect-square relative overflow-hidden bg-muted/10">
                          {fav.image_url ? (
                             <Image src={fav.image_url} alt={fav.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                          ) : (
                             <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-[10px] uppercase font-bold">No Vision</div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-sm text-foreground line-clamp-1 mb-1">{fav.name}</h3>
                          <div className="flex justify-between items-center">
                            <p className="font-cinzel text-xs font-black text-primary">{fav.price.toLocaleString()} DZD</p>
                            <Link href={`/product/${fav.id}`} className="text-muted-foreground hover:text-primary transition-colors">
                              <ExternalLink size={14} />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-24 bg-surface/10 border border-dashed border-border rounded-3xl">
                    <Heart size={48} className="text-muted-foreground mb-4 opacity-30" />
                    <p className="text-muted-foreground font-medium tracking-widest uppercase text-sm mb-6">Your Heart is Void</p>
                    <Link href="/shop" className="px-8 py-3 bg-primary text-white font-bold tracking-widest uppercase rounded-xl hover:bg-accent transition-all">
                      Choose Your Fighter
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === "settings" && (
              <div className="max-w-2xl">
                <div className="bg-surface/30 border border-border rounded-3xl p-8 space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-primary tracking-widest uppercase border-b border-primary/20 pb-2">Vow Details</h3>
                    <div className="grid gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Sorcerer Name</label>
                        <input defaultValue={user.name} className="w-full bg-background border border-border rounded-xl py-3 px-4 text-foreground focus:border-primary outline-none transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Communication Scroll (Email)</label>
                        <input readOnly value={user.email} className="w-full bg-background/50 border border-border rounded-xl py-3 px-4 text-muted-foreground outline-none cursor-not-allowed" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <h3 className="text-sm font-bold text-primary tracking-widest uppercase border-b border-primary/20 pb-2">Destructive Impulses</h3>
                    <button className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-red-500 hover:bg-red-500/10 px-4 py-2 rounded-lg transition-all outline-none border border-transparent hover:border-red-500/20">
                      <Trash2 size={14} /> Expel Domain (Delete Account)
                    </button>
                  </div>

                  <div className="pt-6 border-t border-border">
                    <button className="w-full md:w-auto px-10 py-4 bg-primary text-white font-bold tracking-widest uppercase rounded-xl hover:bg-accent transition-all shadow-xl shadow-primary/20">
                      Solidify Resonance (Save Changes)
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Mail(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}
