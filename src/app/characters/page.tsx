"use client";

import { useState, useEffect, useRef } from "react";
import { CHARACTERS } from "@/lib/mockData";
import CharacterCard from "@/components/ui/CharacterCard";
import { motion } from "framer-motion";

const RANKS = ["All", "Special Grade", "Grade 1", "Grade 3", "Non-Sorcerer (Heavenly Restriction)", "Grade 4 → Special Grade"];
const RANK_LABELS: Record<string, string> = {
  "All": "All",
  "Special Grade": "Special Grade",
  "Grade 1": "Grade 1",
  "Grade 3": "Grade 3",
  "Non-Sorcerer (Heavenly Restriction)": "Heavenly Restriction",
  "Grade 4 → Special Grade": "Rising",
};

export default function CharactersPage() {
  const [activeRank, setActiveRank] = useState("All");
  const headerRef = useRef<HTMLDivElement>(null);

  const filtered = activeRank === "All"
    ? CHARACTERS
    : CHARACTERS.filter((c) => c.rank === activeRank || c.rank.includes(activeRank.replace("Special Grade", "Special Grade")));

  // Scroll reveal
  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]");
    if (!els.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      className="min-h-screen relative"
      style={{ 
        backgroundImage: "url('/images/characters-page-bg.jpg')", 
        backgroundSize: 'cover', 
        backgroundAttachment: 'fixed', 
        backgroundPosition: 'center' 
      }}
    >
      {/* Cinematic Header */}
      <div
        ref={headerRef}
        className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
        style={{
          background: "linear-gradient(180deg, var(--surface) 0%, var(--background) 100%)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        {/* Decorative lines */}
        <div className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: "repeating-linear-gradient(90deg, var(--primary) 0px, transparent 1px, transparent 80px)",
          }}
        />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-primary font-bold tracking-[0.35em] uppercase text-xs mb-4">
              Jujutsu High — Class Roster
            </p>
            <h1 className="font-cinzel text-5xl sm:text-7xl font-bold tracking-widest text-foreground mb-4">
              THE SORCERERS
            </h1>
            <div className="h-0.5 w-24 bg-primary mt-2 mb-6" />
            <p className="text-muted-foreground max-w-2xl text-lg font-light leading-relaxed">
              Explore the most powerful sorcerers and cursed spirits from Jujutsu Kaisen.
              Each warrior has their own collection of exclusive merchandise.
            </p>
          </motion.div>

          {/* Rank Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-10 flex flex-wrap gap-3"
          >
            {Object.entries(RANK_LABELS).map(([rank, label]) => (
              <button
                key={rank}
                onClick={() => setActiveRank(rank)}
                className="px-4 py-2 rounded-full border text-sm font-bold tracking-wide transition-all duration-200"
                style={
                  activeRank === rank
                    ? { borderColor: "var(--primary)", backgroundColor: "var(--primary)", color: "#fff" }
                    : { borderColor: "var(--border)", color: "var(--muted-foreground)", backgroundColor: "transparent" }
                }
              >
                {label}
              </button>
            ))}
            <span className="ml-auto text-xs text-muted-foreground self-center font-medium">
              {filtered.length} / {CHARACTERS.length} Sorcerers
            </span>
          </motion.div>
        </div>
      </div>

      {/* Character Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {filtered.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-muted-foreground font-cinzel text-xl">No sorcerers found for this rank.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
            {filtered.map((char, index) => (
              <CharacterCard key={char.slug} character={char} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
