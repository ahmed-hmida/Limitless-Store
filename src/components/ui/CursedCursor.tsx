"use client";

import { useThemeStore } from "@/store";
import { GojoCursor } from "./GojoCursor";
import { SukunaCursor } from "./SukunaCursor";
import { useEffect, useState } from "react";

export default function CursedCursor() {
  const { theme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return theme === 'light' ? <GojoCursor /> : <SukunaCursor />;
}
