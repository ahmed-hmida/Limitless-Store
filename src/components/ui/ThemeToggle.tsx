"use client";

import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useThemeStore } from "@/store";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      className="group relative w-[72px] h-9 bg-black/30 dark:bg-white/10 backdrop-blur-md rounded-full border border-white/10 p-1 flex items-center transition-all duration-300 hover:border-primary/40 focus:outline-none"
      aria-label="Toggle Theme"
    >
      {/* Track Icons */}
      <div className="absolute inset-0 flex justify-between items-center px-2.5 pointer-events-none">
        <Sun size={14} className={cn("transition-opacity duration-300", theme === 'light' ? 'text-white opacity-100' : 'text-white/30 opacity-40')} />
        <Moon size={14} className={cn("transition-opacity duration-300", theme === 'dark' ? 'text-white opacity-100' : 'text-white/30 opacity-40')} />
      </div>

      {/* Sliding Thumb */}
      <motion.div
        animate={{ 
          x: theme === "light" ? 0 : 36,
          backgroundColor: theme === "light" ? "#5b8dee" : "#c0392b"
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="w-7 h-7 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.3)] z-10 flex items-center justify-center relative"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_white]" />
      </motion.div>

      {/* Hover Highlight */}
      <div className="absolute inset-0 rounded-full bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </button>
  );
}
