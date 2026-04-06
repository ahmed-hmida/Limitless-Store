"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImageZoomProps {
  src: string;
  alt: string;
  zoomScale?: number;
  className?: string;
}

export default function ImageZoom({ src, alt, zoomScale = 2.5, className }: ImageZoomProps) {
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [[x, y], setXY] = useState([0, 0]);
  const [[imgWidth, imgHeight], setSize] = useState([0, 0]);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleMouseEnter = (e: React.MouseEvent) => {
    const el = e.currentTarget;
    const { width, height } = el.getBoundingClientRect();
    setSize([width, height]);
    setShowMagnifier(true);
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = e.currentTarget;
    const { top, left } = el.getBoundingClientRect();

    // calculate cursor position on the image
    const x = e.pageX - left - window.pageXOffset;
    const y = e.pageY - top - window.pageYOffset;
    setXY([x, y]);
  };

  return (
    <div
      className={cn("relative overflow-hidden cursor-crosshair h-full w-full flex items-center justify-center bg-surface/20", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <Image
        ref={imgRef}
        src={src}
        alt={alt}
        fill
        className="object-contain p-8 transition-transform duration-700 ease-out"
        priority
      />

      {showMagnifier && (
        <div
          style={{
            position: "absolute",
            pointerEvents: "none",
            height: `200px`,
            width: `200px`,
            top: `${y - 100}px`,
            left: `${x - 100}px`,
            border: "1px solid rgba(255, 255, 255, 0.4)",
            backgroundImage: `url('${src}')`,
            backgroundRepeat: "no-repeat",
            backgroundSize: `${imgWidth * zoomScale}px ${imgHeight * zoomScale}px`,
            backgroundPosition: `${-x * zoomScale + 100}px ${-y * zoomScale + 100}px`,
            borderRadius: "50%",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 0 40px rgba(255, 255, 255, 0.2)",
            zIndex: 50,
          }}
          className="glass-magnifier backdrop-blur-[2px]"
        >
          {/* Subtle refraction sheen */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/10 to-transparent opacity-50" />
        </div>
      )}
    </div>
  );
}
