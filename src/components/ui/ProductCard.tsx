"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ShoppingCart, Star } from "lucide-react";
import { useCartStore, useWishlistStore } from "@/store";
import { useState } from "react";
import { cn } from "@/lib/utils";
// Dynamic import for FavoriteButton to avoid hydration mismatches with wishlist store
const FavoriteButton = dynamic(() => import("./FavoriteButton"), { ssr: false });
import { useBlackFlash } from "@/hooks/useBlackFlash";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  category: string;
  image_url: string;
  images?: string[];
  rating: number;
  reviews: number;
  character_slug: string;
  stock?: number;
  currency?: string;
  tags?: string[];
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();
  const [isHovered, setIsHovered] = useState(false);
  const { triggerBlackFlash } = useBlackFlash();

  const isSaved = isInWishlist(product.id);
  const isLimited = product.price >= 15000 || (product.stock && product.stock <= 5);

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    triggerBlackFlash(e);
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image_url || (product.images && product.images[0]) || "",
    });
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleItem(product.id);
  };

  const productTags = product.tags || [];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
      className="product-card-wrap group flex flex-col h-full bg-surface border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-colors"
      data-limited={isLimited ? "true" : "false"}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${product.id}`} className="relative block aspect-[4/5] overflow-hidden bg-muted/20">
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {isLimited && (
            <span className="product-badge px-2 py-1 text-[10px] font-black uppercase tracking-widest text-white rounded shadow-lg">
              LIMITED
            </span>
          )}
          {productTags.slice(0, 1).map((tag) => (
            <span key={tag} className="px-2 py-1 text-[10px] font-black uppercase tracking-widest bg-background/80 backdrop-blur-md rounded border border-border text-foreground">
              {tag}
            </span>
          ))}
        </div>
        
        <FavoriteButton 
          productId={product.id} 
          size={16} 
          className={cn(
            "absolute top-3 right-3 z-10 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 border border-border/50 translate-y-2 group-hover:translate-y-0 shadow-lg w-10 h-10",
            isInWishlist(product.id) 
              ? "bg-primary text-white border-primary opacity-100 scale-110" 
              : "bg-background/80 text-foreground opacity-0 group-hover:opacity-100"
          )}
        />

        {/* Product Image */}
        <div className="absolute inset-0 p-4 transition-transform duration-700 ease-out group-hover:scale-110">
          <Image
            src={product.image_url || (product.images && product.images[0]) || ""}
            alt={product.name}
            fill
            className="object-contain p-4"
            sizes="(max-width: 768px) 50vw, 20vw"
          />
        </div>
        
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
          <button 
            onClick={handleAddToCart}
            className="w-full py-3.5 bg-primary text-white font-black tracking-[0.2em] text-[10px] uppercase rounded-lg hover:bg-accent transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary/20"
          >
            <ShoppingCart size={14} />
            MANIFEST ARTIFACT
          </button>
        </div>
      </Link>

      <div className="p-4 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <Link href={`/product/${product.id}`} className="block">
            <h3 className="font-bold text-foreground leading-tight hover:text-primary transition-colors line-clamp-2 uppercase text-xs tracking-wider">
              {product.name}
            </h3>
          </Link>
        </div>
        
        <div className="flex items-center gap-1.5 mb-4">
          <Star size={12} className="fill-primary text-primary" />
          <span className="text-[10px] font-black text-foreground">{product.rating}</span>
          <span className="text-[10px] font-black tracking-widest text-muted-foreground uppercase opacity-50">({product.reviews})</span>
        </div>

        <div className="mt-auto flex items-end justify-between">
          <p className="font-cinzel font-black text-lg text-foreground tracking-wide">
            {product.price.toLocaleString()} <span className="text-[10px] text-muted-foreground tracking-widest">{product.currency || 'DZD'}</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
