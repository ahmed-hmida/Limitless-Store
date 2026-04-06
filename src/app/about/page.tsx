"use client";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Globe, Lightbulb, Target } from "lucide-react";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-24 relative overflow-hidden">
      {/* Abstract Background */}
      <div className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-30 select-none hidden md:block">
        <div className="absolute top-1/4 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[100px] -translate-x-1/2" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Hero Section */}
        <div className="text-center md:text-left flex flex-col md:flex-row gap-12 items-center mb-32">
          <div className="w-full md:w-1/2">
            <h1 className="font-cinzel text-5xl md:text-7xl font-bold tracking-widest text-foreground leading-tight mb-6">
              THE STORY <br />
              <span className="text-primary glow-text">BEHIND</span> THE VEIL
            </h1>
            <p className="text-lg text-muted-foreground font-light leading-relaxed mb-8 border-l-2 border-primary pl-4">
              Limitless Store was born out of a lifelong passion for anime. Founded by Ahmed, a true otaku since childhood, the project started with a profound love for Jujutsu Kaisen and the philosophy of Satoru Gojo: <span className="italic">Pushing beyond all boundaries.</span>
            </p>
            <div className="inline-flex py-1 px-4 bg-surface border border-border rounded-full text-xs font-bold tracking-widest uppercase items-center gap-2">
              <Globe size={14} className="text-primary" /> Established 2025
            </div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full md:w-1/2 aspect-square md:aspect-[4/3] rounded-3xl bg-surface border border-border flex items-center justify-center relative overflow-hidden shadow-2xl group"
          >
             <Image 
               src="/images/landing-bg-1.jpg" 
               alt="Limitless Origins" 
               fill 
               className="object-cover transition-transform duration-700 group-hover:scale-110"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent z-10" />
             <div className="absolute inset-0 bg-primary/10 mix-blend-overlay z-[5]" />
             <div className="relative z-20 font-cinzel text-4xl md:text-6xl text-white opacity-40 select-none tracking-[0.3em] font-black">LIMITLESS</div>
          </motion.div>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          <div className="bg-surface/50 border border-border p-8 rounded-2xl hover:border-primary transition-colors group">
            <Target className="text-primary mb-6 group-hover:scale-110 transition-transform" size={40} />
            <h3 className="font-cinzel font-bold text-2xl text-foreground mb-4 tracking-wider">The Mission</h3>
            <p className="text-muted-foreground leading-relaxed">
              To bring high-quality, authentic anime merchandise to passionate fans everywhere. We craft artifacts that let you wear your cursed energy with pride, refusing generic designs for true stylistic elevation.
            </p>
          </div>
          
          <div className="bg-surface/50 border border-border p-8 rounded-2xl hover:border-primary transition-colors group">
            <Lightbulb className="text-primary mb-6 group-hover:scale-110 transition-transform" size={40} />
            <h3 className="font-cinzel font-bold text-2xl text-foreground mb-4 tracking-wider">The Brand</h3>
            <p className="text-muted-foreground leading-relaxed">
              Limitless represents the concept of infinity. It means pushing past your normal capabilities. We treat every garment and physical artifact as a high-grade tool designed for the strongest.
            </p>
          </div>

          <div className="bg-surface/50 border border-border p-8 rounded-2xl hover:border-primary transition-colors group">
            <BookOpen className="text-primary mb-6 group-hover:scale-110 transition-transform" size={40} />
            <h3 className="font-cinzel font-bold text-2xl text-foreground mb-4 tracking-wider">Manga Support</h3>
            <p className="text-muted-foreground leading-relaxed">
              We stand with creators. We strongly support Jujutsu Kaisen manga translators and artists. Many of our design motifs are heavily inspired by the raw impact of official manga panels.
            </p>
          </div>
        </div>

        {/* Future Layout with domain expansion image */}
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="bg-black text-white rounded-3xl p-10 md:p-16 border border-border relative overflow-hidden flex flex-col md:flex-row items-center justify-between"
        >
          {/* Background image for domain expansion */}
          <div className="absolute inset-0 z-0">
            <Image 
              src="/images/landing-bg-2.jpg" 
              alt="Domain Expansion" 
              fill 
              className="object-cover opacity-40 grayscale brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent z-10" />
          </div>
          
          <div className="w-full md:w-2/3 mb-8 md:mb-0 relative z-10">
            <h2 className="font-cinzel text-3xl md:text-5xl font-bold tracking-widest mb-4">
              DOMAIN EXPANSION:<br/>
              <span className="text-accent glow-text">FUTURE PLANS</span>
            </h2>
            <p className="text-gray-300 text-lg md:text-xl font-light leading-relaxed">
              Jujutsu Kaisen is just the origin. The veil will soon expand.
              Prepare for legendary drops from <span className="text-white font-black tracking-wider uppercase underline underline-offset-8 decoration-primary">Tokyo Ghoul</span>, <span className="text-white font-black tracking-wider uppercase underline underline-offset-8 decoration-primary">Death Note</span>, and <span className="text-white font-black tracking-wider uppercase underline underline-offset-8 decoration-primary">Naruto</span>.
            </p>
          </div>
          
          <div className="w-full md:w-auto flex-shrink-0 relative z-10">
            <Link href="/shop" className="px-10 py-5 bg-white text-black font-black tracking-[0.2em] uppercase hover:bg-primary hover:text-white transition-all duration-500 block text-center shadow-2xl shadow-primary/20">
              Explore Our Origins
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
