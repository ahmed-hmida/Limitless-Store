"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/ui/ProductCard";
import { cn } from "@/lib/utils";
import { useThemeStore } from "@/store";
import { ShopAmbientBackground } from "@/components/shop/ShopAmbientBackground";
import { motion } from "framer-motion";
import { useRef } from "react";

function useSpotlight(containerRef: React.RefObject<HTMLDivElement | null>) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      setIsActive(true);
    };
    const onLeave = () => setIsActive(false);

    container.addEventListener('mousemove', onMove);
    container.addEventListener('mouseleave', onLeave);
    return () => {
      container.removeEventListener('mousemove', onMove);
      container.removeEventListener('mouseleave', onLeave);
    };
  }, [containerRef]);

  return { position, isActive };
}

import { CHARACTERS } from "@/lib/mockData";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  category: string;
  subcategory: string;
  image_url: string;
  images: string[];
  rating: number;
  reviews: number;
  character_slug: string;
  stock: number;
  currency: string;
  tags: string[];
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeCharacter, setActiveCharacter] = useState("All");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);
  const categories = ["All", "Clothing", "Figurines", "Manga", "Wall Art", "Accessories"];
  const PHYSICAL_PROWESS_CHARS = ['toji', 'maki'];
  const { theme } = useThemeStore();
  const gridRef = useRef<HTMLDivElement>(null);
  const spotlight = useSpotlight(gridRef);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*');
      
      if (!error && data) {
        const mappedData: Product[] = data.map(p => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          price: Number(p.price),
          category: p.category,
          subcategory: p.subcategory || p.category,
          image_url: p.image_url,
          images: p.images || [p.image_url],
          rating: p.rating || 4.8,
          reviews: p.reviews || 0,
          character_slug: p.character_slug || 'universal',
          stock: p.stock || 0,
          currency: "DZD",
          tags: [p.category, p.character_slug].filter(Boolean) as string[]
        }));
        setProducts(mappedData);
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  const uniqueCharacters = ["All", ...Array.from(new Set(products.map(p => {
    if (PHYSICAL_PROWESS_CHARS.includes(p.character_slug)) return "Physical Prowess";
    return p.character_slug;
  }).filter(Boolean)))];

  const filteredProducts = products.filter(p => {
    const categoryMatch = activeCategory === "All" || p.category.toLowerCase() === activeCategory.toLowerCase();
    
    let characterMatch = false;
    if (activeCharacter === "All") {
      characterMatch = true;
    } else if (activeCharacter === "Physical Prowess") {
      characterMatch = PHYSICAL_PROWESS_CHARS.includes(p.character_slug);
    } else {
      characterMatch = p.character_slug.toLowerCase() === activeCharacter.toLowerCase();
    }

    const price = Number(p.price);
    const priceMatch = price >= priceRange[0] && price <= priceRange[1];

    return categoryMatch && characterMatch && priceMatch;
  });

  const getProductVariants = (themeMode: string) => ({
    hidden: themeMode === 'light'
      ? { opacity: 0, filter: 'blur(20px)', scale: 0.95 }
      : { opacity: 0, y: -60, scale: 0.9 },

    visible: (i: number) => ({
      opacity: 1,
      filter: 'blur(0px)',
      scale: 1,
      y: 0,
      transition: {
        delay: i * 0.06,
        duration: themeMode === 'light' ? 0.6 : 0.4,
        ease: (themeMode === 'light'
          ? [0.16, 1, 0.3, 1]
          : [0.68, -0.55, 0.27, 1.55]) as any,
      }
    })
  });

  return (
    <div className="pt-24 min-h-screen bg-background relative overflow-hidden">
      <ShopAmbientBackground theme={theme} />
      
      <div className="bg-surface/60 backdrop-blur-md border-b border-border relative z-10">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
            <h1 className="font-cinzel text-4xl md:text-6xl font-black tracking-widest text-foreground mb-4 drop-shadow-lg">
              THE ARSENAL
            </h1>
            <p className="text-muted-foreground tracking-wider max-w-2xl mx-auto font-medium">
              Equip yourself with the finest cursed artifacts and merchandise.
            </p>
            
            {/* Category Pills (Ofuda Talisman Style) */}
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "filter-tag text-muted-foreground hover:text-foreground",
                    activeCategory === cat && "active"
                  )}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>
         </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0 space-y-8 sticky top-28 h-fit hidden lg:block">
            <div className="p-6 bg-surface rounded-xl border border-border">
              <h3 className="font-cinzel font-bold text-lg mb-4 pb-2 border-b border-border/50">Characters</h3>
              <div className="space-y-3">
                 {uniqueCharacters.map(c => (
                    <label 
                      key={c} 
                      className="flex items-center gap-3 text-sm text-foreground cursor-pointer group"
                      onClick={() => setActiveCharacter(c)}
                    >
                      <div className={cn(
                        "w-4 h-4 border rounded-[3px] flex items-center justify-center transition-all",
                        activeCharacter === c ? "border-primary bg-primary/20" : "border-border group-hover:border-primary"
                      )}>
                        <div className={cn(
                          "w-2 h-2 rounded-[1px] bg-primary transition-transform",
                          activeCharacter === c ? "scale-100" : "scale-0"
                        )}/>
                      </div>
                      <span className={cn(
                        "transition-colors capitalize",
                        activeCharacter === c ? "text-primary font-bold" : "group-hover:text-primary text-muted-foreground"
                      )}>{c}</span>
                    </label>
                 ))}
              </div>
            </div>

            <div className="p-6 bg-surface rounded-xl border border-border">
              <h3 className="font-cinzel font-bold text-lg mb-4 pb-2 border-b border-border/50">Price Range</h3>
              <input 
                type="range" 
                className="w-full accent-primary" 
                min="0" 
                max="20000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, Number(e.target.value)])}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2 font-bold tracking-wider">
                <span>0 DZD</span>
                <span>{priceRange[1].toLocaleString()}+ DZD</span>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
             <div className="flex justify-between items-end mb-6">
                <div>
                  <h2 className="text-sm text-muted-foreground font-bold tracking-widest uppercase mb-1">
                    {activeCategory} Artifacts
                  </h2>
                  <p className="text-xs text-muted-foreground">{filteredProducts.length} Results</p>
                </div>

                <select className="bg-surface border border-border text-sm font-bold text-foreground py-2 px-4 rounded hover:border-primary transition-colors cursor-pointer outline-none">
                  <option>Sort by: Featured</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest Arrivals</option>
                </select>
             </div>
             
             {filteredProducts.length > 0 ? (
               <div 
                  ref={gridRef}
                  className="products-grid grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
                  style={{
                    '--spotlight-x': `${spotlight.position.x}px`,
                    '--spotlight-y': `${spotlight.position.y}px`,
                    '--spotlight-opacity': spotlight.isActive ? '1' : '0',
                  } as React.CSSProperties}
               >
                  {filteredProducts.map((product, i) => (
                     <motion.div
                        key={product.id}
                        variants={getProductVariants(theme)}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-50px' }}
                        custom={i % 8}
                        className={theme === 'dark' ? "products-row-enter" : ""}
                     >
                        <ProductCard product={product} />
                     </motion.div>
                  ))}
               </div>
             ) : (
               <div className="py-32 text-center border border-dashed border-border rounded-2xl flex flex-col items-center">
                 <p className="text-xl font-cinzel text-muted-foreground/50 tracking-widest mb-4">No artifacts detected.</p>
                 <button onClick={() => setActiveCategory("All")} className="text-primary hover:text-accent font-bold tracking-wider text-sm">Clear Filters</button>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
