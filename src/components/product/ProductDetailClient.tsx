"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { Star, Share2, ShieldCheck, Truck, ShoppingCart } from "lucide-react";
import { CHARACTERS } from "@/lib/mockData";
import { useCartStore, useWishlistStore } from "@/store";
import { cn } from "@/lib/utils";
import ImageZoom from "@/components/ui/ImageZoom";
// Dynamic import for FavoriteButton to avoid hydration mismatches with wishlist store
const FavoriteButton = dynamic(() => import("@/components/ui/FavoriteButton"), { ssr: false });

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  subcategory: string;
  image_url: string;
  images: string[];
  gallery_images?: string[];
  sizes: string[];
  colors: string[];
  rating: number;
  reviews: number;
  character_slug: string;
  stock: number;
  currency: string;
}

export default function ProductDetailClient({ product }: { product: Product }) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const { isInWishlist } = useWishlistStore();
  
  const [selectedSize, setSelectedSize] = useState<string | null>(product.sizes?.[0] || null);
  const [selectedColor, setSelectedColor] = useState<string | null>(product.colors?.[0] || null);
  
  // Priority: gallery_images[0] -> image_url -> placeholder
  const initialImage = (product.gallery_images && product.gallery_images.length > 0) 
    ? product.gallery_images[0] 
    : (product.images && product.images.length > 0)
    ? product.images[0]
    : product.image_url || "";
    
  const [activeImage, setActiveImage] = useState<string>(initialImage);
  const [quantity, setQuantity] = useState(1);

  const character = CHARACTERS.find((c) => c.slug === product.character_slug);
  const allImages = [...(product.gallery_images || []), ...(product.images || [])].filter((img, i, self) => img && self.indexOf(img) === i);

  const handleAddToCart = () => {
    addItem({
      id: `${product.id}-${selectedSize}-${selectedColor}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: activeImage || product.image_url || "",
      size: selectedSize || undefined,
      color: selectedColor || undefined,
    });
    router.push("/cart");
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-24">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <nav className="flex text-sm text-muted-foreground font-medium tracking-wide">
          <NextLink href="/shop" className="hover:text-primary transition-colors uppercase tracking-widest">Shop</NextLink>
          <span className="mx-2">/</span>
          <NextLink href={`/shop?category=${product.category}`} className="hover:text-primary transition-colors uppercase tracking-widest">{product.category}</NextLink>
          <span className="mx-2">/</span>
          <span className="text-foreground font-bold">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">

          {/* Image Gallery */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            <div
              className="aspect-[4/5] rounded-2xl border border-border flex items-center justify-center relative overflow-hidden group shadow-2xl shadow-black/50"
              style={{ background: `linear-gradient(135deg, ${character?.color || '#333'}20, ${character?.glowColor || '#666'}10)` }}
            >
              <div className="absolute top-4 left-4 z-10">
                <span className={cn(
                  "px-4 py-1.5 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg backdrop-blur-md border border-white/10",
                  product.stock > 0 ? "bg-primary/80" : "bg-red-500/80"
                )}>
                  {product.stock > 0 ? "IN STOCK" : "OUT OF STOCK"}
                </span>
              </div>
              
              <div className="absolute inset-0 p-8 flex items-center justify-center">
                <ImageZoom
                  src={activeImage}
                  alt={product.name}
                  zoomScale={2.5}
                  className="z-10"
                />
              </div>

              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(circle at center, ${character?.glowColor || '#fff'}, transparent)` }}
              />
            </div>

            {allImages.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
                {allImages.map((img, i) => (
                  <button 
                    key={i} 
                    onClick={() => setActiveImage(img)}
                    className={cn(
                      "w-24 h-24 rounded-xl border-2 flex-shrink-0 transition-all duration-300 relative overflow-hidden p-2",
                      activeImage === img ? "border-primary shadow-[0_0_15px_rgba(91,141,238,0.3)]" : "border-border hover:border-primary/50"
                    )}
                    style={{ background: `${character?.color || '#333'}10` }}
                  >
                    <Image src={img} alt={`${product.name} gallery ${i}`} fill className="object-contain p-2" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <div className="mb-8">
              {character && (
                <NextLink
                  href={`/characters/${character.slug}`}
                  className="inline-block px-4 py-1.5 bg-surface/50 backdrop-blur-sm border border-border rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-4 hover:border-primary transition-all hover:shadow-[0_0_15px_rgba(var(--primary),0.2)]"
                  style={{ color: character.glowColor }}
                >
                  {character.name} Artifact
                </NextLink>
              )}

              <h1 className="font-cinzel text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight tracking-wider">
                {product.name}
              </h1>

              <div className="flex items-center gap-6 mb-8">
                <div className="flex items-center gap-1.5">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} className={i < Math.floor(product.rating) ? "fill-primary text-primary" : "text-muted-foreground/30"} />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-foreground ml-1">{product.rating}</span>
                </div>
                <div className="h-4 w-px bg-border" />
                <span className="text-xs font-black tracking-widest text-muted-foreground uppercase">{product.reviews} SORCERER REVIEWS</span>
              </div>

              <p className="font-cinzel text-4xl font-bold text-foreground tracking-wide border-b border-border pb-8 flex items-baseline gap-2">
                {product.price.toLocaleString()} <span className="text-xs text-muted-foreground font-black tracking-[0.2em]">{product.currency || 'DZD'}</span>
              </p>
              
              <p className="py-8 text-muted-foreground leading-relaxed text-sm tracking-wide italic border-b border-border">
                {product.description}
              </p>
            </div>

            <div className="space-y-8 mb-10 border-b border-border pb-10">
              {product.colors && product.colors.length > 0 && (
                <div>
                  <h3 className="text-[11px] font-black tracking-[0.3em] uppercase mb-4 flex justify-between">
                    <span>Artifact Variant</span>
                    <span className="text-primary font-black">{selectedColor}</span>
                  </h3>
                  <div className="flex gap-3 flex-wrap">
                    {product.colors.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={cn(
                          "px-5 py-2.5 rounded-lg border text-xs font-black tracking-widest transition-all uppercase",
                          selectedColor === color
                            ? "border-primary bg-primary text-white shadow-lg shadow-primary/20"
                            : "border-border hover:border-primary text-muted-foreground bg-surface"
                        )}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <h3 className="text-[11px] font-black tracking-[0.3em] uppercase mb-4 flex justify-between items-end">
                    <span>Rank / Size</span>
                    <button className="text-[10px] text-muted-foreground underline hover:text-primary transition-colors font-bold">SIZE GUIDE</button>
                  </h3>
                  <div className="grid grid-cols-5 gap-3">
                    {product.sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={cn(
                          "py-3.5 rounded-lg border text-xs font-black transition-all text-center uppercase tracking-tighter",
                          selectedSize === size
                            ? "border-primary bg-primary text-white shadow-lg shadow-primary/20"
                            : "border-border hover:border-primary text-muted-foreground bg-surface"
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-8">
                <div className="flex-1">
                  <h3 className="text-[11px] font-black tracking-[0.3em] uppercase mb-4">Quantity</h3>
                  <div className="flex items-center w-full max-w-[160px] border border-border rounded-lg overflow-hidden bg-surface group focus-within:border-primary transition-colors">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 flex items-center justify-center text-foreground hover:bg-primary/10 transition-colors text-xl font-black"
                    >−</button>
                    <div className="flex-1 text-center font-black text-foreground">{quantity}</div>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-12 h-12 flex items-center justify-center text-foreground hover:bg-primary/10 transition-colors text-xl font-black"
                    >+</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mb-10">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-[3] py-5 bg-primary text-white font-black tracking-[0.3em] uppercase rounded-xl hover:bg-accent transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed shadow-[0_10px_20px_rgba(var(--primary),0.2)] flex items-center justify-center gap-3"
              >
                <ShoppingCart size={20} />
                {product.stock > 0 ? "MANIFEST ARTIFACT" : "DOMAIN EXHAUSTED"}
              </button>
              
              <FavoriteButton 
                productId={product.id} 
                size={24} 
                className="flex-1 border rounded-xl hover:scale-[1.02] active:scale-[0.98] h-full" 
              />
              
              <button className="flex-1 flex items-center justify-center border border-border rounded-xl text-foreground hover:border-primary hover:text-primary transition-all hover:scale-[1.02] active:scale-[0.98] bg-surface">
                <Share2 size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-4 bg-surface/30 p-5 rounded-xl border border-border/50">
                <Truck className="text-primary shrink-0" size={24} />
                <div className="flex flex-col">
                  <span className="text-[10px] font-black tracking-widest text-muted-foreground uppercase mb-0.5">Shipping</span>
                  <span className="text-xs font-bold text-foreground">Free Domain Delivery</span>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-surface/30 p-5 rounded-xl border border-border/50">
                <ShieldCheck className="text-primary shrink-0" size={24} />
                <div className="flex flex-col">
                  <span className="text-[10px] font-black tracking-widest text-muted-foreground uppercase mb-0.5">Authentication</span>
                  <span className="text-xs font-bold text-foreground">Anti-Curse Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
