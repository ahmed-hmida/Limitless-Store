"use client";

import { AnimatePresence } from "framer-motion";
import { useThemeStore } from "@/store";
import SplitHero from "@/components/home/SplitHero";
import { useEffect, useState } from "react";

export default function GlobalCurtain() {
  const { showCurtain } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {showCurtain && <SplitHero />}
    </AnimatePresence>
  );
}
