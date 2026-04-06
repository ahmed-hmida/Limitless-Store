"use client";

import { useEffect, useRef } from "react";

interface Props {
  type: string;
  color: string;
}

// ─── Particle factory per animation type ─────────────────────────────────────
function createParticles(type: string, canvas: HTMLCanvasElement, color: string) {
  const W = canvas.width;
  const H = canvas.height;
  const cx = W / 2;
  const cy = H / 2;

  if (type === "infinity-void") {
    // Orbiting particles — Gojo Infinity
    return Array.from({ length: 220 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * Math.min(W, H) * 0.42 + 40;
      return {
        angle,
        radius,
        speed: (Math.random() * 0.004 + 0.001) * (Math.random() > 0.5 ? 1 : -1),
        size: Math.random() * 2.5 + 0.5,
        opacity: Math.random() * 0.8 + 0.2,
        x: cx,
        y: cy,
      };
    });
  }

  if (type === "fire-embers") {
    return Array.from({ length: 160 }, () => ({
      x: Math.random() * W,
      y: H + Math.random() * H * 0.3,
      size: Math.random() * 4 + 1,
      speedY: -(Math.random() * 3 + 1),
      speedX: (Math.random() - 0.5) * 1.5,
      opacity: Math.random() * 0.9 + 0.1,
      life: Math.random(),
      decay: Math.random() * 0.006 + 0.002,
    }));
  }

  if (type === "pink-pulse") {
    return Array.from({ length: 5 }, (_, i) => ({
      radius: (i + 1) * (Math.min(W, H) / 12),
      maxRadius: Math.min(W, H) * 0.55,
      opacity: 0.6 - i * 0.1,
      speed: 0.6 + i * 0.15,
    }));
  }

  if (type === "shadow-ripple") {
    return Array.from({ length: 6 }, (_, i) => ({
      radius: i * 60,
      maxRadius: Math.min(W, H) * 0.6,
      opacity: 0.5,
      speed: 0.8,
    }));
  }

  if (type === "silver-sparks") {
    return Array.from({ length: 120 }, () => ({
      x: Math.random() * W,
      y: -Math.random() * H,
      size: Math.random() * 2 + 0.5,
      speedY: Math.random() * 4 + 2,
      speedX: (Math.random() - 0.5) * 0.8,
      opacity: Math.random() * 0.8 + 0.2,
      length: Math.random() * 18 + 6,
    }));
  }

  if (type === "white-snow") {
    return Array.from({ length: 100 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      size: Math.random() * 3 + 1,
      speedY: Math.random() * 1.2 + 0.4,
      speedX: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.7 + 0.3,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.03 + 0.01,
    }));
  }

  if (type === "green-slashes") {
    return Array.from({ length: 18 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      length: Math.random() * 120 + 60,
      angle: -Math.PI / 4 + (Math.random() - 0.5) * 0.5,
      opacity: 0,
      life: 0,
      maxLife: Math.random() * 40 + 20,
      delay: Math.random() * 120,
    }));
  }

  if (type === "purple-smoke") {
    return Array.from({ length: 30 }, () => ({
      x: Math.random() * W,
      y: H + Math.random() * 80,
      size: Math.random() * 60 + 30,
      speedY: -(Math.random() * 0.8 + 0.3),
      speedX: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.25 + 0.05,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.01,
    }));
  }

  if (type === "blood-drip") {
    return Array.from({ length: 24 }, () => ({
      x: Math.random() * W,
      y: -Math.random() * 40,
      size: Math.random() * 5 + 2,
      speedY: Math.random() * 2 + 1,
      opacity: 0,
      tail: Math.random() * 30 + 10,
      delay: Math.random() * 150,
    }));
  }

  if (type === "golden-lines") {
    // Grid lines at 7:3 ratio marks
    const lines: object[] = [];
    for (let i = 1; i <= 9; i++) {
      lines.push({ x1: W * i * 0.1, y1: 0, x2: W * i * 0.1, y2: H, opacity: 0, phase: Math.random() * Math.PI * 2 });
      lines.push({ x1: 0, y1: H * i * 0.1, x2: W, y2: H * i * 0.1, opacity: 0, phase: Math.random() * Math.PI * 2 });
    }
    return lines;
  }

  if (type === "teal-static") {
    return Array.from({ length: 300 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      size: Math.random() * 3 + 1,
      opacity: Math.random(),
      flickerSpeed: Math.random() * 0.15 + 0.05,
    }));
  }

  if (type === "pink-blossoms") {
    return Array.from({ length: 60 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      size: Math.random() * 6 + 3,
      speedY: Math.random() * 0.8 + 0.3,
      speedX: (Math.random() - 0.5) * 1.2,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.03,
      opacity: Math.random() * 0.7 + 0.3,
    }));
  }

  // Fallback generic particles
  return Array.from({ length: 80 }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    size: Math.random() * 3 + 1,
    speedX: (Math.random() - 0.5) * 1.5,
    speedY: (Math.random() - 0.5) * 1.5,
    opacity: Math.random(),
    pulseDir: Math.random() > 0.5 ? 1 : -1,
  }));
}

// ─── Draw loop per animation type ────────────────────────────────────────────
function drawFrame(
  type: string,
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  particles: any[],
  color: string,
  frame: number
) {
  const W = canvas.width;
  const H = canvas.height;
  const cx = W / 2;
  const cy = H / 2;
  ctx.clearRect(0, 0, W, H);

  if (type === "infinity-void") {
    particles.forEach((p) => {
      p.angle += p.speed;
      p.x = cx + Math.cos(p.angle) * p.radius;
      p.y = cy + Math.sin(p.angle) * p.radius;
      p.opacity = 0.4 + Math.sin(p.angle * 3) * 0.4;
      ctx.save();
      ctx.shadowBlur = 14;
      ctx.shadowColor = color;
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    // Central glow
    const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 120);
    grd.addColorStop(0, color + "22");
    grd.addColorStop(1, "transparent");
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(cx, cy, 120, 0, Math.PI * 2);
    ctx.fill();
  }

  else if (type === "fire-embers") {
    particles.forEach((p) => {
      p.y += p.speedY;
      p.x += p.speedX + Math.sin(frame * 0.05 + p.x) * 0.3;
      p.life += p.decay;
      if (p.life >= 1 || p.y < -20) {
        p.y = H + 10;
        p.x = Math.random() * W;
        p.life = 0;
        p.opacity = Math.random() * 0.9 + 0.1;
      }
      const alpha = p.opacity * (1 - p.life);
      ctx.save();
      ctx.shadowBlur = 16;
      ctx.shadowColor = color;
      ctx.globalAlpha = Math.max(0, alpha);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * (1 - p.life * 0.5), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  else if (type === "pink-pulse") {
    particles.forEach((p) => {
      p.radius += p.speed;
      if (p.radius > p.maxRadius) p.radius = 20;
      const alpha = (1 - p.radius / p.maxRadius) * p.opacity;
      ctx.save();
      ctx.globalAlpha = Math.max(0, alpha);
      ctx.strokeStyle = color;
      ctx.shadowBlur = 20;
      ctx.shadowColor = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, p.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    });
  }

  else if (type === "shadow-ripple") {
    particles.forEach((p) => {
      p.radius += p.speed;
      if (p.radius > p.maxRadius) p.radius = 0;
      const alpha = (1 - p.radius / p.maxRadius) * p.opacity;
      ctx.save();
      ctx.globalAlpha = Math.max(0, alpha);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, p.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    });
  }

  else if (type === "silver-sparks") {
    particles.forEach((p) => {
      p.y += p.speedY;
      p.x += p.speedX;
      if (p.y > H + 20) {
        p.y = -20;
        p.x = Math.random() * W;
      }
      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.strokeStyle = color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = color;
      ctx.lineWidth = p.size;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x - p.speedX * 3, p.y - p.length);
      ctx.stroke();
      ctx.restore();
    });
  }

  else if (type === "white-snow") {
    particles.forEach((p) => {
      p.wobble += p.wobbleSpeed;
      p.y += p.speedY;
      p.x += p.speedX + Math.sin(p.wobble) * 0.5;
      if (p.y > H + 10) { p.y = -10; p.x = Math.random() * W; }
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = color;
      ctx.shadowBlur = 6;
      ctx.shadowColor = color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  else if (type === "green-slashes") {
    particles.forEach((p) => {
      if (p.delay > 0) { p.delay--; return; }
      p.life++;
      const half = p.maxLife / 2;
      p.opacity = p.life < half ? p.life / half : 1 - (p.life - half) / half;
      if (p.life > p.maxLife) {
        p.x = Math.random() * W;
        p.y = Math.random() * H;
        p.length = Math.random() * 120 + 60;
        p.life = 0;
        p.delay = Math.random() * 80;
        p.maxLife = Math.random() * 40 + 20;
      }
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.opacity) * 0.8;
      ctx.strokeStyle = color;
      ctx.shadowBlur = 18;
      ctx.shadowColor = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      const dx = Math.cos(p.angle) * p.length;
      const dy = Math.sin(p.angle) * p.length;
      ctx.moveTo(p.x - dx / 2, p.y - dy / 2);
      ctx.lineTo(p.x + dx / 2, p.y + dy / 2);
      ctx.stroke();
      ctx.restore();
    });
  }

  else if (type === "purple-smoke") {
    particles.forEach((p) => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.rotation += p.rotSpeed;
      p.opacity -= 0.0004;
      if (p.y < -p.size || p.opacity <= 0) {
        p.y = H + Math.random() * 80;
        p.x = Math.random() * W;
        p.opacity = Math.random() * 0.25 + 0.05;
      }
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = Math.max(0, p.opacity);
      const grd = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
      grd.addColorStop(0, color + "60");
      grd.addColorStop(1, "transparent");
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  else if (type === "blood-drip") {
    particles.forEach((p) => {
      if (p.delay > 0) { p.delay--; return; }
      p.y += p.speedY;
      p.opacity = Math.min(1, p.opacity + 0.05);
      if (p.y > H + 40) {
        p.y = -10;
        p.x = Math.random() * W;
        p.opacity = 0;
        p.delay = Math.random() * 120;
      }
      ctx.save();
      ctx.globalAlpha = p.opacity * 0.85;
      ctx.fillStyle = color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = color;
      // drop body
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      // tail
      ctx.beginPath();
      ctx.moveTo(p.x - p.size * 0.5, p.y);
      ctx.lineTo(p.x + p.size * 0.5, p.y);
      ctx.lineTo(p.x, p.y - p.tail);
      ctx.fillStyle = color + "88";
      ctx.fill();
      ctx.restore();
    });
  }

  else if (type === "golden-lines") {
    particles.forEach((p: any) => {
      p.phase += 0.02;
      p.opacity = (Math.sin(p.phase) + 1) / 2 * 0.35;
      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.strokeStyle = color;
      ctx.lineWidth = 0.8;
      ctx.shadowBlur = 6;
      ctx.shadowColor = color;
      ctx.beginPath();
      ctx.moveTo(p.x1, p.y1);
      ctx.lineTo(p.x2, p.y2);
      ctx.stroke();
      ctx.restore();
    });
  }

  else if (type === "teal-static") {
    particles.forEach((p) => {
      p.opacity = Math.abs(Math.sin(frame * p.flickerSpeed + p.x));
      if (p.opacity < 0.1) return;
      ctx.save();
      ctx.globalAlpha = p.opacity * 0.6;
      ctx.fillStyle = color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
      ctx.restore();
    });
  }

  else if (type === "pink-blossoms") {
    particles.forEach((p) => {
      p.y -= p.speedY;
      p.x += p.speedX + Math.sin(frame * 0.02 + p.y * 0.01) * 0.4;
      p.rotation += p.rotSpeed;
      if (p.y < -20) { p.y = H + 20; p.x = Math.random() * W; }
      if (p.x < -20) p.x = W + 20;
      if (p.x > W + 20) p.x = -20;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = color;
      // Draw simple petal shape
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.ellipse(0, p.size, p.size * 0.4, p.size, (Math.PI / 2) * i, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });
  }

  else {
    // Generic fallback
    particles.forEach((p: any) => {
      p.opacity += 0.02 * p.pulseDir;
      if (p.opacity >= 1) p.pulseDir = -1;
      if (p.opacity <= 0.1) p.pulseDir = 1;
      p.y += p.speedY;
      p.x += p.speedX;
      if (p.y < -10 || p.y > H + 10 || p.x < -10 || p.x > W + 10) {
        p.y = Math.random() * H;
        p.x = Math.random() * W;
      }
      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function AnimatedBackground({ type, color }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrameId: number;
    let frame = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    let particles = createParticles(type, canvas, color);

    const loop = () => {
      drawFrame(type, ctx, canvas, particles, color, frame);
      frame++;
      animFrameId = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animFrameId);
    };
  }, [type, color]);

  return (
    <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-background">
      {/* Character bg image — picks up automatically when placed in /public/images/ */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-luminosity"
        style={{ backgroundImage: `url('/images/${type.split("-")[0]}-bg.jpg')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/70 to-background z-10" />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-20 pointer-events-none opacity-60 mix-blend-screen anim-bg-canvas"
      />
    </div>
  );
}
