"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useThemeStore } from "@/store";

export default function HeroSection() {
  const { theme, showCurtain } = useThemeStore();
  const [gojoPhase, setGojoPhase] = useState<'video' | 'void'>('video');
  const [mounted, setMounted] = useState(false);
  const gojoVideoRef = useRef<HTMLVideoElement>(null);
  const sukunaVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // When theme changes back to light, reset Gojo phase so video plays again
  useEffect(() => {
    if (theme === 'light') {
      setGojoPhase('video');
    }
  }, [theme]);

  const handleGojoVideoEnd = () => {
    setGojoPhase('void');
  };

  // Reset video when curtain is removed (Domain selection confirmed)
  useEffect(() => {
    if (!showCurtain && mounted) {
      if (theme === 'light') {
        setGojoPhase('video');
        setTimeout(() => {
          if (gojoVideoRef.current) {
            gojoVideoRef.current.currentTime = 0;
            gojoVideoRef.current.play().catch(e => console.log("Video play interrupted", e));
          }
        }, 100);
      } else if (theme === 'dark') {
        if (sukunaVideoRef.current) {
          sukunaVideoRef.current.currentTime = 0;
          sukunaVideoRef.current.play().catch(e => console.log("Video play interrupted", e));
        }
      }
    }
  }, [showCurtain, theme, mounted]);

  if (!mounted) return null;

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black flex items-center justify-center">
      {/* ── Light Mode (Gojo: Infinite Void) ── */}
      {theme === 'light' && (
        <>
          {gojoPhase === 'video' && (
            <video
              ref={gojoVideoRef}
              src="/videos/gojo-domain.mp4"
              autoPlay
              muted
              playsInline
              onEnded={handleGojoVideoEnd}
              className="hero-video absolute inset-0 z-0"
            />
          )}

          {gojoPhase === 'void' && (
            <div
              className="infinite-void-bg absolute inset-0 z-0 void-transition-enter"
              style={{ backgroundImage: "url('/gojo-void-bg.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
              {/* Dark Overlay for Readability */}
              <div className="absolute inset-0 bg-black/40 z-[1]" />

              {/* Void Particles */}
              {Array.from({ length: 40 }).map((_, i) => (
                <div
                  key={i}
                  className="void-particle"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    zIndex: 2,
                    '--duration': `${4 + Math.random() * 6}s`,
                    '--delay': `${Math.random() * 4}s`,
                    '--opacity': `${0.4 + Math.random() * 0.4}`,
                    '--tx': `${(Math.random() - 0.5) * 200}px`,
                    '--ty': `${(Math.random() - 0.5) * 200}px`
                  } as React.CSSProperties}
                />
              ))}

              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
                <span className="font-cinzel text-white jp-text text-6xl md:text-8xl glow-blue mb-4 tracking-[0.2em] drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" style={{ color: "white" }}>無量空処</span>
                <span className="font-cinzel text-white en-text text-xl md:text-3xl glow-blue tracking-[0.4em] uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]" style={{ color: "white" }}>Infinite Void</span>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Dark Mode (Sukuna: Malevolent Shrine) ── */}
      {theme === 'dark' && (
        <div className="absolute inset-0 z-0 bg-black">
          <video
            ref={sukunaVideoRef}
            src="/videos/sukuna-domain.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="hero-video absolute inset-0"
          />
          <div className="red-glitch-overlay z-10" />

          <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
            <span className="font-cinzel text-red-600 jp-text text-6xl md:text-8xl slash-reveal mb-4 tracking-[0.2em] font-black drop-shadow-2xl">伏魔御廚子</span>
            <span className="font-cinzel text-red-600 en-text text-xl md:text-3xl slash-reveal tracking-[0.4em] uppercase font-bold drop-shadow-lg">Malevolent Shrine</span>
          </div>
        </div>
      )}

      {/* ── Call To Action overlay (Displays in both modes, only in Void phase for Gojo) ── */}
      {(theme === 'dark' || (theme === 'light' && gojoPhase === 'void')) && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: theme === 'dark' ? 1.5 : 2.0, duration: 1 }}
          className="absolute bottom-32 z-30 flex flex-col sm:flex-row gap-6 w-full sm:w-auto px-4"
        >
          <Link
            href="/shop"
            className={`group relative px-8 py-4 font-bold tracking-[0.2em] uppercase overflow-hidden min-w-[240px] text-center rounded-sm transition-all duration-300 ${theme === 'light'
              ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.5)] hover:shadow-[0_0_40px_rgba(37,99,235,0.8)]'
              : 'bg-red-700 text-white shadow-[0_0_20px_rgba(185,28,28,0.5)] hover:shadow-[0_0_40px_rgba(185,28,28,0.8)]'
              }`}
          >
            <span className="relative z-10 block">Enter Domain</span>
            <div className={`absolute inset-0 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-in-out ${theme === 'light' ? 'bg-blue-800' : 'bg-red-900'}`} />
          </Link>

          <Link
            href="/characters"
            className={`group relative px-8 py-4 font-bold tracking-[0.2em] uppercase overflow-hidden min-w-[240px] text-center border-2 rounded-sm transition-colors duration-300 ${theme === 'light'
              ? 'text-blue-200 border-blue-500 hover:bg-blue-500/20 hover:text-white'
              : 'text-red-200 border-red-800 hover:bg-red-800/30 hover:text-white'
              }`}
          >
            <span className="relative z-10 transition-colors duration-300">
              The Sorcerers
            </span>
          </Link>
        </motion.div>
      )}
    </section>
  );
}
