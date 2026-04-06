"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlistStore } from "@/store";
import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/ui/ProductCard";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  category: string;
  image_url: string;
  images: string[];
  rating: number;
  reviews: number;
  character_slug: string;
  stock: number;
  currency: string;
  tags: string[];
}

export default function WishlistPage() {
  const { items, syncWithSupabase } = useWishlistStore();
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    syncWithSupabase();
  }, [syncWithSupabase]);

  useEffect(() => {
    async function fetchWishlistProducts() {
      if (!mounted || items.length === 0) {
        setWishlistProducts([]);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .in('id', items);
      
      if (!error && data) {
        // Map any missing tags or legacy fields
        const mappedData = data.map(p => ({
          ...p,
          tags: [p.subcategory, p.category].filter(Boolean),
        }));
        setWishlistProducts(mappedData);
      }
      setLoading(false);
    }
    
    fetchWishlistProducts();
  }, [items, mounted]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background pt-24 pb-24">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 border-b border-border pb-6 flex items-center justify-between">
           <div>
              <h1 className="font-cinzel text-4xl font-bold tracking-widest text-foreground mb-2">
                YOUR ARSENAL
              </h1>
              <p className="text-muted-foreground uppercase text-[10px] tracking-[0.3em] font-black underline underline-offset-8 decoration-primary">Saved artifacts for your next domain expansion.</p>
           </div>
           <div className="bg-surface px-6 py-3 rounded-xl border border-border shadow-lg shadow-black/40">
             <span className="font-black text-2xl text-primary font-cinzel">{items.length}</span>
             <span className="text-[10px] font-black tracking-[0.2em] uppercase ml-3 text-muted-foreground">Stored Items</span>
           </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
             <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
             <p className="font-cinzel tracking-[0.3em] text-muted-foreground">DETECTING CURSES...</p>
          </div>
        ) : wishlistProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
            {wishlistProducts.map(product => (
              <ProductCard key={product.id} product={product as any} />
            ))}
          </div>
        ) : (
          <div className="py-32 flex flex-col items-center justify-center text-center bg-surface/50 backdrop-blur-sm border-2 border-dashed border-border rounded-3xl group transition-all hover:bg-surface/80">
             <Heart size={64} className="text-muted opacity-30 mb-8 transition-transform group-hover:scale-125 duration-500" />
             <h2 className="font-cinzel text-2xl font-bold tracking-[0.2em] text-foreground mb-4 uppercase">
               NO SAVED ARTIFACTS
             </h2>
             <p className="text-muted-foreground mb-10 max-w-sm text-sm leading-relaxed px-4">
               The store of your sorcerer power is currently empty. Explore the artifacts and mark your preferences to prepare for battle.
             </p>
             <Link 
               href="/shop" 
               className="group relative px-10 py-5 bg-primary text-white font-black tracking-[0.3em] uppercase overflow-hidden rounded-xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
             >
               <span className="relative z-10">Expand Arsenal</span>
               <div className="absolute inset-0 bg-accent translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
             </Link>
          </div>
        )}
      </div>
    </div>
  );
}
