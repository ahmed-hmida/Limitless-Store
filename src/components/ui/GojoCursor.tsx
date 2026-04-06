"use client";

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

export function GojoCursor() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovering, setIsHovering] = useState(false);

  // Single High-Performance Spring for the main dot
  const dotX = useSpring(mouseX, { stiffness: 900, damping: 50 });
  const dotY = useSpring(mouseY, { stiffness: 900, damping: 50 });

  // Minimal trail segment (just ONE)
  const trailX = useSpring(mouseX, { stiffness: 150, damping: 30 });
  const trailY = useSpring(mouseY, { stiffness: 150, damping: 30 });

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleHoverIn = () => setIsHovering(true);
    const handleHoverOut = () => setIsHovering(false);

    window.addEventListener('mousemove', moveCursor);
    document.querySelectorAll('button, a, .product-card, input, [role="button"]')
      .forEach(el => {
        el.addEventListener('mouseenter', handleHoverIn);
        el.addEventListener('mouseleave', handleHoverOut);
      });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.querySelectorAll('button, a, .product-card, input, [role="button"]')
        .forEach(el => {
          el.removeEventListener('mouseenter', handleHoverIn);
          el.removeEventListener('mouseleave', handleHoverOut);
        });
    };
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {/* Minimal Trail (Faint and smaller) */}
      <motion.div
        className="absolute w-2 h-2 bg-blue-500/10 rounded-full blur-[1px]"
        style={{ x: trailX, y: trailY, translateX: '-50%', translateY: '-50%' }}
      />

      {/* Main Sleek "Infinity" Dot */}
      <motion.div
        className="absolute rounded-full bg-white shadow-[0_0_15px_#5b8dee,0_0_30px_rgba(91,141,238,0.5)]"
        style={{ 
          x: dotX, 
          y: dotY, 
          width: isHovering ? 32 : 8, 
          height: isHovering ? 32 : 8,
          translateX: '-50%',
          translateY: '-50%',
          backgroundColor: isHovering ? 'transparent' : 'white',
          border: isHovering ? '1.5px solid #5b8dee' : 'none'
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
      >
        {/* Core Glow */}
        <div className="absolute inset-0 bg-[#5b8dee]/20 rounded-full blur-[2px]" />
      </motion.div>
    </div>
  );
}
