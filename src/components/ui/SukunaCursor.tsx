"use client";

import { useEffect, useRef, useState } from 'react';

export function SukunaCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const trailPoints = useRef<{x: number, y: number, age: number}[]>([]);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // رسم الـ Trail — خط أحمر متذبذب كالشرارة
      if (trailPoints.current.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = 2;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#dc2626';
        ctx.lineCap = 'round';

        trailPoints.current.forEach((point, i) => {
          const opacity = 1 - (point.age / 20);
          if (opacity <= 0) return;
          ctx.globalAlpha = opacity;

          if (i === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            // تذبذب عشوائي للخط (شرارة كهربائية)
            const jitter = (Math.random() - 0.5) * 4;
            ctx.lineTo(point.x + jitter, point.y + jitter);
          }
          point.age++;
        });
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // حذف النقاط القديمة
      trailPoints.current = trailPoints.current.filter(p => p.age < 20);

      // رسم Disintegration عند الكليك
      if (isClicking) {
        drawDisintegration(ctx, mousePos.current.x, mousePos.current.y);
      }

      requestAnimationFrame(animate);
    };

    let animId = requestAnimationFrame(animate);

    const onMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      trailPoints.current.push({ x: e.clientX, y: e.clientY, age: 0 });
      
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    const handleHoverIn = () => setIsHovering(true);
    const handleHoverOut = () => setIsHovering(false);

    document.querySelectorAll('button, a, .product-card, input, [role="button"]')
      .forEach(el => {
        el.addEventListener('mouseenter', handleHoverIn);
        el.addEventListener('mouseleave', handleHoverOut);
      });

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', handleResize);
      document.querySelectorAll('button, a, .product-card, input, [role="button"]')
        .forEach(el => {
          el.removeEventListener('mouseenter', handleHoverIn);
          el.removeEventListener('mouseleave', handleHoverOut);
        });
    };
  }, [isClicking]);

  // Disintegration Effect عند الكليك
  function drawDisintegration(
    ctx: CanvasRenderingContext2D,
    x: number, y: number
  ) {
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 / 12) * i;
      const length = Math.random() * 30 + 10;
      ctx.beginPath();
      ctx.strokeStyle = `rgba(220, 38, 38, ${Math.random() * 0.8 + 0.2})`;
      ctx.lineWidth = Math.random() * 2 + 0.5;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#dc2626';
      ctx.moveTo(x, y);
      ctx.lineTo(
        x + Math.cos(angle) * length,
        y + Math.sin(angle) * length
      );
      ctx.stroke();
    }
  }

  return (
    <>
      <canvas
        ref={canvasRef}
        className="sukuna-trail-canvas"
      />
      {/* المؤشر الأساسي — سهم حاد بشكل وشم سوكونا */}
      <div
        ref={cursorRef}
        className={`sukuna-cursor ${isHovering ? 'hovering' : ''} ${isClicking ? 'clicking' : ''}`}
        id="sukuna-cursor-el"
      />
    </>
  );
}
