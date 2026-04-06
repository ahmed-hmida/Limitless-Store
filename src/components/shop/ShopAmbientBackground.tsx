"use client";

import { useEffect, useRef } from "react";

export function ShopAmbientBackground({ theme }: { theme: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    if (theme === 'dark') {
      // سوكونا: رماد وجمر يتصاعد
      animId = startEmbersAnimation(canvas, ctx);
    } else {
      // غوجو: معادلات رياضية بهتة
      animId = startInfinityAnimation(canvas, ctx);
    }

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [theme]);

  // Dark Mode: Embers & Ash
  function startEmbersAnimation(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    const embers = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: canvas.height + Math.random() * 200,
      size: Math.random() * 3 + 1,
      speedY: -(Math.random() * 0.8 + 0.3),  // بطيء جداً
      speedX: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.6 + 0.2,
      color: Math.random() > 0.5 ? '#dc2626' : '#f97316',
      wobble: Math.random() * Math.PI * 2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      embers.forEach(e => {
        e.y += e.speedY;
        e.x += Math.sin(e.wobble) * 0.3;   // تأرجح طبيعي
        e.wobble += 0.02;
        if (e.y < -10) {                   // إعادة من الأسفل
          e.y = canvas.height + 10;
          e.x = Math.random() * canvas.width;
        }
        ctx.save();
        ctx.globalAlpha = e.opacity;
        ctx.shadowBlur = 8;
        ctx.shadowColor = e.color;
        ctx.fillStyle = e.color;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      return requestAnimationFrame(draw);
    };
    return draw();
  }

  // Light Mode: حسابات اللانهاية
  function startInfinityAnimation(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    const symbols = ['∞', '∫', 'Σ', '∂', '∇', '◯', '⬡'];
    const particles = Array.from({ length: 25 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      size: Math.random() * 14 + 12,
      opacity: Math.random() * 0.12 + 0.03,  // بهتة جداً
      speedY: -(Math.random() * 0.3 + 0.1),
      speedX: (Math.random() - 0.5) * 0.1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX;
        if (p.y < -30) { p.y = canvas.height + 30; }
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = '#3b82f6';
        ctx.font = `${p.size}px serif`;
        ctx.fillText(p.symbol, p.x, p.y);
        ctx.restore();
      });
      return requestAnimationFrame(draw);
    };
    return draw();
  }

  return (
    <canvas
      ref={canvasRef}
      className="shop-ambient-canvas"
    />
  );
}
