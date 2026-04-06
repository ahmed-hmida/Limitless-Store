"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { CharacterMock } from "@/lib/mockData";
import ProductCard from "@/components/ui/ProductCard";
import AnimatedBackground from "@/components/ui/AnimatedBackground";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";

interface CharacterDomain {
  bgShader: string;
  floatingIcons: string[];
  colors: { primary: string; glow: string; bg: string; };
  entryText: string;
  particleColor: string;
  particleCount: number;
}

const CHARACTER_DOMAINS: Record<string, CharacterDomain> = {
  gojo: { bgShader: 'infinity-void', floatingIcons: ['∞', '◯', '·'], colors: { primary: '#3b82f6', glow: '#93c5fd', bg: '#020215' }, entryText: '無量空処 — Infinite Void', particleColor: 'rgba(147, 197, 253, 0.6)', particleCount: 120, },
  sukuna: { bgShader: 'malevolent-shrine', floatingIcons: ['✕', '†', '⚔'], colors: { primary: '#dc2626', glow: '#f87171', bg: '#0a0000' }, entryText: '伏魔御廚子 — Malevolent Shrine', particleColor: 'rgba(220, 38, 38, 0.5)', particleCount: 80, },
  yuji: { bgShader: 'divergent-fist', floatingIcons: ['⚡', '◈', '⬡'], colors: { primary: '#ec4899', glow: '#f9a8d4', bg: '#0f0008' }, entryText: '黒閃 — Black Flash', particleColor: 'rgba(236, 72, 153, 0.5)', particleCount: 100, },
  megumi: { bgShader: 'ten-shadows', floatingIcons: ['⬡', '◈', '⬢'], colors: { primary: '#1e40af', glow: '#60a5fa', bg: '#000510' }, entryText: '十種影法術 — Ten Shadows', particleColor: 'rgba(30, 64, 175, 0.6)', particleCount: 60, },
  toji: { bgShader: 'heavenly-restriction', floatingIcons: ['⚔', '◆', '▪'], colors: { primary: '#6b7280', glow: '#d1d5db', bg: '#050505' }, entryText: '天与呪縛 — Heavenly Restriction', particleColor: 'rgba(156, 163, 175, 0.4)', particleCount: 40, },
  maki: { bgShader: 'heavenly-restriction', floatingIcons: ['⚔', '◆', '▸'], colors: { primary: '#16a34a', glow: '#4ade80', bg: '#000a02' }, entryText: '天与呪縛 — Heavenly Restriction', particleColor: 'rgba(74, 222, 128, 0.5)', particleCount: 50, },
  yuta: { bgShader: 'rika-domain', floatingIcons: ['❄', '◯', '✦'], colors: { primary: '#e2e8f0', glow: '#ffffff', bg: '#050510' }, entryText: '理花 — Rika', particleColor: 'rgba(226, 232, 240, 0.7)', particleCount: 150, },
  geto: { bgShader: 'cursed-spirit-manipulation', floatingIcons: ['◉', '⊗', '⊕'], colors: { primary: '#7c3aed', glow: '#a78bfa', bg: '#05000f' }, entryText: '呪霊操術 — Cursed Spirit Manipulation', particleColor: 'rgba(124, 58, 237, 0.5)', particleCount: 90, },
  choso: { bgShader: 'blood-manipulation', floatingIcons: ['◈', '✦', '⬡'], colors: { primary: '#991b1b', glow: '#f87171', bg: '#080000' }, entryText: '赤血操術 — Blood Manipulation', particleColor: 'rgba(153, 27, 27, 0.7)', particleCount: 70, },
  nanami: { bgShader: 'ratio-technique', floatingIcons: ['⬜', '▬', '═'], colors: { primary: '#d97706', glow: '#fbbf24', bg: '#080500' }, entryText: '十劃呪法 — Ratio Technique', particleColor: 'rgba(217, 119, 6, 0.5)', particleCount: 50, },
  kenjaku: { bgShader: 'teal-chaos', floatingIcons: ['⊗', '◉', '⊘'], colors: { primary: '#0d9488', glow: '#2dd4bf', bg: '#000a08' }, entryText: '呪霊操術 — Ancient Manipulation', particleColor: 'rgba(13, 148, 136, 0.5)', particleCount: 80, },
  nobara: { bgShader: 'straw-doll', floatingIcons: ['✦', '◈', '⬡'], colors: { primary: '#db2777', glow: '#f472b6', bg: '#0a0005' }, entryText: '芻霊呪法 — Straw Doll Technique', particleColor: 'rgba(219, 39, 119, 0.5)', particleCount: 90, },
};

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

interface CharacterDetailClientProps {
  character: CharacterMock;
  products: Product[];
}

export default function CharacterDetailClient({ character, products }: CharacterDetailClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const backgroundScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.05]);
  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 0.45, 0.45, 0]);

  const domain = CHARACTER_DOMAINS[character.slug];
  const [mounted, setMounted] = useState(false);
  const [stage, setStage] = useState(2); // Start explicitly at 2 to avoid delay injection lag

  useEffect(() => {
    setMounted(true);
    if (domain) {
      document.documentElement.style.setProperty('--char-glow', domain.colors.glow);
      document.documentElement.style.setProperty('--char-bg', domain.colors.bg);
      document.documentElement.style.setProperty('--char-primary', domain.colors.primary);
      document.documentElement.style.setProperty('--char-rgb', domain.colors.primary.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16)).join(',') || '0,0,0');
    }

    const timers = [
      setTimeout(() => setStage(3), 400), // Trigger text technique seamlessly
      setTimeout(() => setStage(4), 1900), // Resolve to content
    ];
    return () => timers.forEach(clearTimeout);
  }, [character.slug, domain]);

  return (
    <motion.div
      className="min-h-screen relative flex flex-col"
      style={{ backgroundColor: domain ? domain.colors.bg : "var(--background)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Stage 2: Radial Reveal */}
      {stage >= 2 && domain && (
        <motion.div
          className="fixed inset-0 z-[200] bg-background pointer-events-none"
          initial={{ clipPath: 'circle(0% at 50% 50%)', opacity: 1 }}
          animate={{ clipPath: 'circle(150% at 50% 50%)', opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
      )}

      {/* Stage 3: Technique Text Reveal */}
      {stage === 3 && domain && (
        <motion.div
          className="technique-reveal-text"
          initial={{ opacity: 0, scale: 1.5, filter: 'blur(20px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.4 }}
        >
          <span className="technique-jp">{(character as any).techniqueJP || domain.entryText.split('—')[0]}</span>
          <span className="technique-en">{(character as any).technique || domain.entryText.split('—')[1]}</span>
        </motion.div>
      )}

      {/* Animated Gradient خلف الصفحة */}
      <div className="character-page-gradient" />

      {domain && (
        <div className="character-bg-particles font-black overflow-hidden">
           {mounted && Array.from({ length: window.innerWidth > 768 ? 25 : 10 }).map((_, i) => (
              <span 
                key={i} 
                className="floating-icon"
                style={{
                   left: `${Math.random() * 100}%`,
                   top: `${Math.random() * 100}%`,
                   color: domain.colors.glow,
                   '--size': `${20 + Math.random() * 30}px`,
                   '--duration': `${15 + Math.random() * 10}s`,
                   '--delay': `${Math.random() * 5}s`,
                   '--tx1': `${(Math.random() - 0.5) * 100}px`,
                   '--ty1': `${(Math.random() - 0.5) * 100}px`,
                   '--tx2': `${(Math.random() - 0.5) * 100}px`,
                   '--ty2': `${(Math.random() - 0.5) * 100}px`,
                } as React.CSSProperties}
              >
                 {domain.floatingIcons[Math.floor(Math.random() * domain.floatingIcons.length)]}
              </span>
           ))}
        </div>
      )}
      {/* Dynamic animated background */}
      <div className="fixed inset-0 z-0 h-screen w-full overflow-hidden">
        <div className="absolute inset-0 z-[1] bg-background/40 dark:bg-black/40 backdrop-blur-[2px]" />
        <Image
          src={`/images/${character.slug}-bg.jpg`}
          alt=""
          fill
          className="object-cover opacity-[0.15] dark:opacity-[0.25] grayscale mix-blend-overlay"
          priority
        />
        <AnimatedBackground type={character.bgAnimation} color={character.color} />
      </div>

      <div className="relative z-10 flex-grow pb-24">
        {/* Back navigation */}
        <div className="pt-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-10 text-glow-none">
          <Link
            href="/characters"
            className="inline-flex items-center text-sm font-black tracking-[0.25em] uppercase text-muted-foreground hover:text-primary transition-all duration-300 group"
          >
            <ChevronLeft size={16} className="mr-2 transition-transform group-hover:-translate-x-1" />
            Back to Roster
          </Link>
        </div>

        {/* Character hero section */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-24">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-10 md:gap-20">

            {/* Character portrait */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full md:w-[360px] shrink-0 aspect-[3/4] relative rounded-3xl overflow-hidden border-2 group shadow-2xl"
              style={{
                borderColor: `${character.color}40`,
                boxShadow: `0 32px 80px ${character.color}20, 0 0 50px ${character.color}10`,
              }}
            >
              <div
                className="absolute inset-0 z-0 scale-105"
                style={{
                  background: `linear-gradient(165deg, ${character.color}30, ${character.color}05, transparent)`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent z-10" />

              <Image
                src={`/images/${character.slug}-card.jpg`}
                alt={character.name}
                fill
                sizes="(max-width: 768px) 100vw, 360px"
                className="object-contain z-20 transition-transform duration-1000 group-hover:scale-110"
                priority
              />
            </motion.div>

            {/* Character info */}
            <motion.div 
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, ease: "easeOut" }}
               className="flex-1 w-full text-center md:text-left"
            >
              {/* Rank + technique badge */}
              <div
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full border mb-8 backdrop-blur-md shadow-lg"
                style={{
                  borderColor: `${character.color}50`,
                  backgroundColor: `${character.color}15`,
                  color: character.glowColor,
                }}
              >
                <span className="text-[10px] sm:text-xs font-black tracking-[0.3em] uppercase">{character.rank}</span>
                <span className="opacity-40">/</span>
                <span className="text-[10px] sm:text-xs font-black tracking-[0.3em] uppercase">{character.techniqueJP}</span>
              </div>

              {/* English name */}
              <h1
                className="font-cinzel text-5xl sm:text-7xl lg:text-9xl font-black tracking-tighter text-foreground mb-4 leading-[0.85] select-none"
                style={{ textShadow: `0 0 80px ${character.color}25` }}
              >
                {character.name.toUpperCase()}
              </h1>

              {/* Japanese name */}
              <h2 className="font-cinzel text-2xl sm:text-4xl font-light text-muted-foreground tracking-[0.5em] mb-10 opacity-70">
                {character.nameJP}
              </h2>

              {/* Bio */}
              <p
                className="text-base sm:text-xl text-foreground font-light max-w-2xl leading-relaxed border-l-4 pl-8 mb-10 italic"
                style={{ borderColor: character.color }}
              >
                {character.bio}
              </p>

              {/* Shop CTA */}
              <Link
                href={`/shop?character=${character.slug}`}
                className="inline-flex items-center gap-4 px-10 py-5 font-black tracking-[0.3em] uppercase text-sm rounded-sm text-white transition-all duration-500 hover:scale-105 active:scale-95 shadow-2xl"
                style={{
                  backgroundColor: character.color,
                  boxShadow: `0 10px 40px ${character.color}30`,
                }}
              >
                Enter Domain
                <span className="text-xl">→</span>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Products section with Legendary Animations */}
        <section ref={containerRef} className="relative px-4 sm:px-6 lg:px-8 max-w-screen-2xl mx-auto rounded-3xl py-24 mb-16 border border-border/10 overflow-hidden group/collection shadow-inner">
          {/* Section Background Image Layer */}
          <motion.div
            style={{ scale: backgroundScale, opacity: backgroundOpacity }}
            className="absolute inset-0 z-0 pointer-events-none grayscale"
          >
            <Image
              src={`/images/${character.slug}-bg.jpg`}
              alt=""
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background dark:via-black/80" />
          </motion.div>

          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-20 gap-6">
              <div>
                <h2 className="font-cinzel text-3xl sm:text-5xl lg:text-6xl font-black tracking-widest text-foreground">
                  <span style={{ color: character.color }} className="drop-shadow-sm">
                    {character.name.split(" ")[0].toUpperCase()}&apos;S
                  </span>{" "}
                  ARTIFACTS
                </h2>
                <div className="h-2 w-32 rounded-full mt-4" style={{ backgroundColor: character.color }} />
              </div>
              <div className="flex flex-col items-end border-r-4 pr-6" style={{ borderColor: character.color }}>
                <span className="text-muted-foreground text-xs font-black tracking-[0.3em] uppercase mb-1">Cursed Grade</span>
                <span className="text-foreground text-xl font-black tracking-widest uppercase">
                  {products.length} Items
                </span>
              </div>
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-10">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="py-32 text-center border-2 border-dashed border-border/20 rounded-2xl bg-surface/10 backdrop-blur-xl">
                <p className="text-muted-foreground font-cinzel tracking-[0.5em] uppercase text-2xl font-black opacity-30 animate-pulse">
                  Collection Manifesting...
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </motion.div>
  );
}
