"use client";

import { useThemeStore } from "@/store";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function SplitHero() {
  const { setTheme, theme, setShowCurtain, showCurtain } = useThemeStore();

  useEffect(() => {
    if (showCurtain) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showCurtain]);

  const handleChoice = (choice: 'light' | 'dark') => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTheme(choice);
    setShowCurtain(false);
  };

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ y: "-100%", opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 w-full h-screen flex overflow-hidden group/main z-[100]"
    >
      {/* ── GOJO SIDE (Left / Light) ─────────────────────────────────── */}
      <div 
        onClick={() => handleChoice('light')}
        className={cn(
          "relative flex-1 flex flex-col items-center justify-center cursor-pointer transition-all duration-700 ease-out border-r border-white/10 group/gojo hover:flex-[1.8] overflow-hidden",
          theme === 'light' ? "z-20 shadow-[20px_0_50px_rgba(91,141,238,0.3)]" : "z-10"
        )}
      >
        {/* Dynamic Background Image */}
        <motion.div 
          className="absolute inset-0 z-0 transition-transform duration-1000 ease-out group-hover/gojo:scale-110"
          style={{ 
            backgroundImage: "url('/images/gojo-split.jpg')", 
            backgroundSize: 'cover', 
            backgroundPosition: 'center',
            filter: 'brightness(0.8) contrast(1.1)'
          }}
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-blue-600/20 mix-blend-overlay z-[1]" />

        <div className="relative z-10 text-center px-6">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="block text-[#0ea5e9] font-cinzel text-xs tracking-[0.5em] mb-4 uppercase font-bold"
          >
            Infinity & Void
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-cinzel text-4xl md:text-7xl font-black tracking-widest leading-none"
            style={{ 
              color: '#0ea5e9',
              textShadow: '2px 2px 0px rgba(0,0,0,0.3), -1px -1px 0px rgba(14, 165, 233, 0.5), 1px -1px 0px rgba(14, 165, 233, 0.5), -1px 1px 0px rgba(14, 165, 233, 0.5), 1px 1px 0px rgba(14, 165, 233, 0.5)' 
            }}
          >
            THE HONORED <br /> <span>ONE</span>
          </motion.h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-10 px-8 py-3 border-2 border-[#0ea5e9]/30 text-[#0ea5e9] rounded-full font-bold tracking-[0.2em] uppercase hover:bg-[#0ea5e9] hover:text-white transition-all duration-300 backdrop-blur-sm"
          >
            Aura of Light
          </motion.button>
        </div>

        {/* Ambient Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-transparent opacity-0 group-hover/gojo:opacity-100 transition-opacity duration-700" />
      </div>

      {/* ── SUKUNA SIDE (Right / Dark) ────────────────────────────────── */}
      <div 
        onClick={() => handleChoice('dark')}
        className={cn(
          "relative flex-1 flex flex-col items-center justify-center cursor-pointer transition-all duration-700 ease-out group/sukuna hover:flex-[1.8] overflow-hidden",
          theme === 'dark' ? "z-20 shadow-[-20px_0_50px_rgba(192,57,43,0.3)]" : "z-10"
        )}
      >
        {/* Dynamic Background Image */}
        <motion.div 
          className="absolute inset-0 z-0 transition-transform duration-1000 ease-out group-hover/sukuna:scale-110"
          style={{ 
            backgroundImage: "url('/images/sukuna-split.jpg')", 
            backgroundSize: 'cover', 
            backgroundPosition: 'center',
            filter: 'brightness(0.7) contrast(1.2)'
          }}
        />

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-red-950/40 mix-blend-multiply z-[1]" />

        <div className="relative z-10 text-center px-6">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="block text-[#b91c1c] font-cinzel text-xs tracking-[0.5em] mb-4 uppercase font-bold"
          >
            Malevolent Shrine
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-cinzel text-4xl md:text-7xl font-black tracking-widest leading-none font-bold"
            style={{ 
              color: '#b91c1c',
              textShadow: '2px 2px 0px rgba(0,0,0,0.3), -1px -1px 0px rgba(185, 28, 28, 0.5), 1px -1px 0px rgba(185, 28, 28, 0.5), -1px 1px 0px rgba(185, 28, 28, 0.5), 1px 1px 0px rgba(185, 28, 28, 0.5)' 
            }}
          >
            KING OF <br /> <span style={{ color: '#991b1b' }}>CURSES</span>
          </motion.h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-10 px-8 py-3 border-2 border-[#b91c1c]/30 text-[#b91c1c] rounded-full font-bold tracking-[0.2em] uppercase hover:bg-[#b91c1c] hover:text-white transition-all duration-300 backdrop-blur-sm"
          >
            Domain of Blood
          </motion.button>
        </div>

        {/* Ambient Glow */}
        <div className="absolute inset-0 bg-gradient-to-l from-red-900/20 to-transparent opacity-0 group-hover/sukuna:opacity-100 transition-opacity duration-700" />
      </div>

      {/* ── Center Divider / Text ────────────────────────────────────── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none text-center">
        <div className="w-[1px] h-32 bg-white/20 mx-auto mb-6" />
        <span className="font-cinzel text-white/50 text-[10px] tracking-[1em] uppercase">Choose Domain</span>
      </div>
    </motion.section>
  );
}
