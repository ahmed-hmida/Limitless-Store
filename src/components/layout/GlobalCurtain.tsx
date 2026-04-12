"use client";

import { AnimatePresence } from "framer-motion";
import { useThemeStore } from "@/store";
import SplitHero from "@/components/home/SplitHero";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function GlobalCurtain() {
  const { showCurtain, setShowCurtain } = useThemeStore();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    
    // Check for password recovery flow
    const isRecovery = window.location.hash.includes('type=recovery') || 
                       pathname === '/update-password';
    
    if (isRecovery && showCurtain) {
      setShowCurtain(false);
    }
  }, [pathname, showCurtain, setShowCurtain]);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {showCurtain && <SplitHero />}
    </AnimatePresence>
  );
}
