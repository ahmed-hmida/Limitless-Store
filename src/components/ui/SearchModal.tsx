"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { Search, X, ArrowRight, User } from "lucide-react";
import { CHARACTERS } from "@/lib/mockData";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  character: string;
  category: string;
  subcategory: string;
  price: number;
  currency: string;
  images: string[];
  rating: number;
  reviews: number;
  inStock: boolean;
  tags: string[];
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const [allProducts, setAllProducts] = useState<Product[]>([]);

  // Fetch all products for searching when modal opens
  useEffect(() => {
    async function fetchAll() {
      if (isOpen && allProducts.length === 0) {
        const { data } = await supabase.from('products').select('*');
        if (data) {
          setAllProducts(data.map(p => ({
            id: p.id,
            name: p.name,
            character: p.character_slug || 'universal',
            category: p.category,
            subcategory: p.subcategory || p.category,
            price: Number(p.price),
            currency: "DZD",
            images: p.images || [p.image_url],
            rating: p.rating || 4.8,
            reviews: p.reviews || 0,
            inStock: p.stock > 0,
            tags: [p.category, p.character_slug, ...(p.tags || [])].filter(Boolean) as string[]
          })));
        }
      }
    }
    fetchAll();

    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isOpen, allProducts.length]);

  // Escape key to close
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const { matchedCharacters, matchedProducts } = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return { matchedCharacters: [], matchedProducts: [] };

    const matchedCharacters = CHARACTERS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.nameJP.includes(q) ||
        c.technique.toLowerCase().includes(q) ||
        c.techniqueJP.includes(q) ||
        c.slug.includes(q) ||
        c.rank.toLowerCase().includes(q)
    );

    const matchedProducts = allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.character.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.subcategory.toLowerCase().includes(q) ||
        p.tags.some((tag) => tag.toLowerCase().includes(q))
    ).slice(0, 12);

    return { matchedCharacters, matchedProducts };
  }, [query]);

  const hasResults = matchedCharacters.length > 0 || matchedProducts.length > 0;
  const showEmpty = query.trim().length >= 2 && !hasResults;

  if (!isOpen) return null;

  return (
    <div
      className="search-modal-overlay search-modal fixed inset-0 z-[100] flex flex-col"
      style={{ background: "rgba(0,0,0,0.85)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Search bar */}
      <div className="pt-20 px-4 sm:px-8 pb-4 max-w-4xl mx-auto w-full">
        <div className="relative flex items-center border-b-2 border-primary pb-2 mt-4">
          <span className="search-label absolute -top-5 text-xs text-primary/70 left-10">Searching the Domain...</span>
          <Search size={24} className="text-primary mr-4 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder=""
            className="flex-1 bg-transparent text-foreground text-2xl sm:text-3xl font-light outline-none"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground transition-colors ml-3">
              <X size={22} />
            </button>
          )}
          <button onClick={onClose} className="ml-4 text-muted-foreground hover:text-foreground transition-colors">
            <span className="text-xs font-bold tracking-widest uppercase border border-border px-2 py-1 rounded">ESC</span>
          </button>
        </div>

        {/* Quick tags */}
        {!query && (
          <div className="mt-6 flex flex-wrap gap-2">
            {["gojo", "sukuna", "hoodie", "figurine", "manga", "yuji", "nanami"].map((tag) => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="px-3 py-1.5 border border-border rounded-full text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors capitalize"
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 max-w-4xl mx-auto w-full pb-16">
        {showEmpty && (
          <div className="py-16 text-center">
            <p className="text-muted-foreground font-cinzel text-xl">No results for &ldquo;{query}&rdquo;</p>
            <p className="text-muted-foreground/60 text-sm mt-2">Try another name, technique, or product type</p>
          </div>
        )}

        {/* Character results */}
        {matchedCharacters.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-3 flex items-center gap-2">
              <User size={13} /> Sorcerers
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {matchedCharacters.map((char) => (
                <Link
                  key={char.slug}
                  href={`/characters/${char.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary bg-surface/40 hover:bg-surface/80 transition-all group"
                >
                  {/* Color swatch */}
                  <div
                    className="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center text-white font-cinzel font-bold text-sm"
                    style={{ backgroundColor: char.color }}
                  >
                    {char.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-cinzel font-bold text-foreground truncate">{char.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{char.nameJP} · {char.rank}</p>
                  </div>
                  <ArrowRight size={16} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Product results */}
        {matchedProducts.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-3">
              Artifacts ({matchedProducts.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {matchedProducts.map((product) => {
                const char = CHARACTERS.find(c => c.slug === product.character);
                return (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    onClick={onClose}
                    className="flex items-center gap-4 p-3 rounded-lg border border-border/60 hover:border-primary bg-surface/20 hover:bg-surface/60 transition-all group"
                  >
                    <div
                      className="w-9 h-9 rounded-md shrink-0 flex items-center justify-center"
                      style={{ backgroundColor: char ? char.color + "30" : "#ffffff10" }}
                    >
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: char?.color || "#888" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{product.category} · {product.price.toLocaleString()} DZD</p>
                    </div>
                    <ArrowRight size={14} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
