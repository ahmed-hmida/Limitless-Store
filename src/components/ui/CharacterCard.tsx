"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CharacterMock } from "@/lib/mockData";

interface CharacterCardProps {
  character: CharacterMock;
  index: number;
}

export default function CharacterCard({ character, index }: CharacterCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={`/characters/${character.slug}`} className="block group">
        <div
          className="relative overflow-hidden rounded-xl border border-border bg-surface transition-all duration-400 group-hover:-translate-y-3 group-hover:scale-[1.02]"
          style={{ boxShadow: "0 0 0 rgba(0,0,0,0)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = `0 16px 48px ${character.color}50, 0 0 20px ${character.glowColor}40`;
            e.currentTarget.style.borderColor = character.color;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "0 0 0 rgba(0,0,0,0)";
            e.currentTarget.style.borderColor = "var(--border)";
          }}
        >
          {/* Top accent bar */}
          <div className="h-1.5 w-full" style={{ backgroundColor: character.color }} />

          {/* Card image area */}
          <div className="relative aspect-[3/4] w-full overflow-hidden">
            {/* Character background image decoration */}
            <div className="absolute inset-0 z-0">
              <Image
                src={`/images/${character.slug}-bg.jpg`}
                alt=""
                fill
                className="object-cover opacity-[0.08] dark:opacity-[0.12] grayscale transition-transform duration-1000 group-hover:scale-110"
              />
            </div>

            {/* Gradient background using character theme color */}
            <div
              className="absolute inset-0 z-[1] transition-transform duration-700 ease-out group-hover:scale-110"
              style={{
                background: `linear-gradient(160deg, ${character.color}18 0%, ${character.color}05 40%, transparent 100%)`,
              }}
            />

            {/* Character Image */}
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <div className="relative w-full h-full">
                <Image
                  src={character.image}
                  alt={character.name}
                  fill
                  className="object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              </div>
            </div>

            {/* Bottom gradient overlay */}
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-surface via-surface/80 to-transparent z-10" />

            {/* Content overlay */}
            <div className="absolute inset-x-0 bottom-0 z-20 p-4 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
              {/* Rank badge */}
              <span
                className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase mb-2 border"
                style={{
                  color: character.glowColor,
                  borderColor: `${character.color}60`,
                  background: `${character.color}12`,
                }}
              >
                {character.rank}
              </span>

              {/* Japanese technique */}
              <p className="text-[11px] font-bold tracking-widest uppercase mb-1 opacity-75" style={{ color: character.glowColor }}>
                {character.techniqueJP}
              </p>

              {/* Name */}
              <h3 className="font-cinzel text-lg font-bold text-foreground truncate leading-tight">
                {character.name}
              </h3>

              {/* Technique */}
              <p className="text-xs text-muted-foreground truncate mt-0.5 mb-3">
                {character.technique}
              </p>

              {/* View CTA */}
              <div
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
                style={{ color: character.glowColor }}
              >
                <span>View Collection</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
