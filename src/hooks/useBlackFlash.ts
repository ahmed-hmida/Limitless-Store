"use client";

import { useThemeStore } from "@/store";

export function useBlackFlash() {
  const { theme } = useThemeStore();

  const triggerBlackFlash = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const flash = document.createElement('div');
    flash.className = `black-flash ${theme === 'dark' ? 'red' : 'blue'}`;
    
    // Position relative to the button boundaries
    flash.style.left = `${e.clientX - rect.left}px`;
    flash.style.top  = `${e.clientY - rect.top}px`;
    
    target.style.position = 'relative'; 
    target.style.overflow = 'hidden';
    target.appendChild(flash);
    
    setTimeout(() => {
      if (flash.parentNode) {
        flash.parentNode.removeChild(flash);
      }
    }, 600);
  };

  return { triggerBlackFlash };
}
