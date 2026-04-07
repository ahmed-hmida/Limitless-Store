"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import HeroSection from "@/components/ui/HeroSection";
import CharacterCard from "@/components/ui/CharacterCard";
import ProductCard from "@/components/ui/ProductCard";
import { CHARACTERS } from "@/lib/mockData";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useThemeStore } from "@/store";

const FEATURED_CHARACTERS = CHARACTERS.slice(0, 6);

export default function Home() {
  const { theme, showCurtain } = useThemeStore();
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);

  // Fetch Featured Products from Supabase
  useEffect(() => {
    async function fetchFeatured() {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('is_featured', true)
        .limit(10);
      
      if (data) {
        setFeaturedProducts(data.map(p => ({
          ...p,
          character: p.character_slug,
          inStock: p.stock > 0
        })));
      }
    }
    fetchFeatured();
  }, []);

  // Custom Cursor
  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) return;

    let mouseX = 0, mouseY = 0;
    let curX = 0, curY = 0;

    const move = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX - 3}px, ${mouseY - 3}px)`;
    };

    const animate = () => {
      curX += (mouseX - curX) * 0.12;
      curY += (mouseY - curY) * 0.12;
      cursor.style.transform = `translate(${curX - 14}px, ${curY - 14}px)`;
      requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", move);
    animate();
    return () => window.removeEventListener("mousemove", move);
  }, []);

  // Scroll reveal
  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]");
    if (!els.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Custom cursor (desktop only) */}
      <div ref={cursorRef} className="custom-cursor hidden md:block" aria-hidden="true" />
      <div ref={dotRef} className="custom-cursor-dot hidden md:block" aria-hidden="true" />

      <div className="flex flex-col min-h-screen">
        <HeroSection />

        {/* ── Characters Showcase ──────────────────────────────────────────── */}
        <section className="py-24 bg-surface/40 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section header */}
            <div data-reveal className="flex justify-between items-end mb-14 border-b border-border pb-5">
              <div>
                <p className="text-primary text-xs font-bold tracking-[0.35em] uppercase mb-3">
                  Jujutsu High Roster
                </p>
                <h2 className="font-cinzel text-3xl md:text-5xl font-bold tracking-widest text-foreground">
                  CHOOSE YOUR FIGHTER
                </h2>
                <p className="text-muted-foreground mt-2 tracking-wider uppercase text-sm">
                  12 Sorcerers · Exclusive Collections
                </p>
              </div>
              <Link
                href="/characters"
                className="group hidden sm:flex items-center gap-2 text-sm font-bold tracking-widest uppercase text-primary hover:text-accent transition-colors"
              >
                View All{" "}
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
              {FEATURED_CHARACTERS.map((char, index) => (
                <CharacterCard key={char.slug} character={char} index={index} />
              ))}
            </div>

            {/* Mobile view all */}
            <div className="mt-10 sm:hidden flex justify-center" data-reveal>
              <Link
                href="/characters"
                className="px-6 py-3 border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all text-sm font-bold tracking-widest uppercase rounded-sm"
              >
                View All 12 Sorcerers
              </Link>
            </div>

            {/* Desktop teaser of remaining */}
            <div className="mt-10 hidden sm:flex justify-center" data-reveal>
              <Link
                href="/characters"
                className="group flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
              >
                <div className="flex -space-x-2">
                  {CHARACTERS.slice(6, 10).map((c) => (
                    <div
                      key={c.slug}
                      className="w-8 h-8 rounded-full border-2 border-background flex items-center justify-center font-cinzel font-bold text-xs text-white shrink-0"
                      style={{ backgroundColor: c.color }}
                    >
                      {c.name.charAt(0)}
                    </div>
                  ))}
                </div>
                <span>+6 more sorcerers waiting</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Featured Artifacts ───────────────────────────────────────────── */}
        <section className="py-24 bg-background">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section header */}
            <div data-reveal className="flex flex-col items-center mb-16 text-center">
              <p className="text-primary text-xs font-bold tracking-[0.35em] uppercase mb-3">
                Exclusive Merchandise
              </p>
              <h2 className="font-cinzel text-3xl md:text-5xl font-bold tracking-widest text-foreground">
                FEATURED ARTIFACTS
              </h2>
              <div className="h-0.5 w-20 bg-primary mt-5 mb-8 rounded-full" />
              {/* Quick filters */}
              <div className="flex gap-3 flex-wrap justify-center">
                {["All", "Gojo", "Sukuna", "Yuji", "Clothing", "Figurines", "Manga"].map((filter) => (
                  <button
                    key={filter}
                    className="px-4 py-1.5 rounded-full border border-border text-sm font-medium hover:border-primary hover:text-primary transition-colors"
                    data-active={filter === "All"}
                    style={filter === "All" ? { background: "var(--primary)", color: "#fff", borderColor: "var(--primary)" } : {}}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* CTA */}
            <div className="mt-16 flex justify-center" data-reveal>
              <Link
                href="/shop"
                className="group relative px-10 py-4 bg-transparent text-foreground font-bold tracking-[0.2em] uppercase overflow-hidden border-2 border-primary hover:text-background transition-colors duration-300 rounded-sm"
              >
                <span className="relative z-10">Browse Full Catalog</span>
                <div className="absolute inset-0 bg-primary translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Parallax Call to Action ─────────────────────────────────────────── */}
        <section className="relative h-[50vh] md:h-[65vh] w-full overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 z-0">
            <Image
              src={theme === 'dark' ? '/images/hero-sukuna-bottom.jpg' : '/images/hero-gojo-bottom.jpg'}
              alt="Cursed Showcase"
              fill
              className="object-cover scale-110 grayscale-[20%] brightness-[0.7] dark:brightness-[0.4]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background z-10" />
            <div className="absolute inset-0 bg-primary/10 dark:bg-primary/5 z-[5]" />
          </div>

          <div data-reveal="scale" className="relative z-20 text-center px-4 max-w-4xl">
            <h2 className="font-cinzel text-3xl md:text-5xl lg:text-6xl font-bold tracking-[0.25em] text-white drop-shadow-2xl mb-8">
              UNLEASH YOUR <span className="text-primary">TECHNIQUE</span>
            </h2>
            <p className="text-white/80 font-nunito text-lg md:text-xl tracking-widest uppercase mb-10 max-w-2xl mx-auto drop-shadow-md">
              Limited Edition Artifacts Manifested from the Golden Age of Sorcery.
            </p>
            <Link
              href="/shop"
              className="inline-block px-12 py-4 bg-white text-black font-bold tracking-[0.3em] uppercase hover:bg-primary hover:text-white transition-all duration-500 rounded-sm shadow-xl shadow-black/40"
            >
              Shop All Artifacts
            </Link>
          </div>
        </section>

        {/* ── Brand Promise Section ────────────────────────────────────────── */}
        <section
          className="py-20 border-t border-border"
          style={{ background: "linear-gradient(180deg, var(--surface) 0%, var(--background) 100%)" }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
              {[
                { emoji: "⚡", title: "Cursed Quality", desc: "Every artifact is crafted with obsessive attention to detail and premium materials." },
                { emoji: "🚚", title: "Fast Delivery", desc: "Free shipping across Algeria on orders over 15,000 DZD. Delivered like a Domain Expansion." },
                { emoji: "🛡️", title: "Sorcerer's Guarantee", desc: "Not satisfied? Return within 14 days. No cursed energy required." },
              ].map((item, i) => (
                <div key={i} data-reveal className="flex flex-col items-center gap-3 p-8 rounded-xl border border-border bg-surface/50">
                  <span className="text-4xl">{item.emoji}</span>
                  <h3 className="font-cinzel font-bold text-lg tracking-wide text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
