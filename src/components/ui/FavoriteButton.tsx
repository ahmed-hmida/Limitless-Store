"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import { useWishlistStore } from "@/store";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface FavoriteButtonProps {
  productId: string;
  size?: number;
  className?: string;
}

export default function FavoriteButton({ productId, size = 20, className }: FavoriteButtonProps) {
  const { toggleItem, isInWishlist } = useWishlistStore();
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Only read from store after hydration to avoid SSR/client mismatch
  const isSaved = isMounted ? isInWishlist(productId) : false;

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAnimating(true);
    await toggleItem(productId);
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "relative flex items-center justify-center rounded-full transition-all duration-300",
        isSaved 
          ? "bg-primary text-white shadow-[0_0_15px_rgba(var(--primary),0.4)]" 
          : "bg-background/80 text-foreground hover:text-primary backdrop-blur-md border border-border/50",
        className
      )}
      aria-label={isSaved ? "Remove from Arsenal" : "Add to Arsenal"}
    >
      <motion.div
        animate={isAnimating ? {
          scale: [1, 1.4, 1],
          rotate: [0, 15, -15, 0],
        } : {}}
        transition={{ duration: 0.5, ease: "backOut" }}
      >
        <Heart 
          size={size} 
          className={cn(
            "transition-colors duration-300",
            isSaved ? "fill-white" : "fill-transparent"
          )} 
        />
      </motion.div>

      {/* Ripple Effect on Click */}
      <AnimatePresence>
        {isAnimating && (
          <motion.span
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-primary rounded-full z-[-1]"
          />
        )}
      </AnimatePresence>
    </button>
  );
}
