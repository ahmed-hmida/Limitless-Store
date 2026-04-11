"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle2, Package, ArrowRight, Home, ShoppingBag } from "lucide-react";

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-24 relative overflow-hidden flex flex-col items-center justify-center px-4">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-2xl w-full bg-surface/40 backdrop-blur-xl border border-border p-8 md:p-12 rounded-3xl shadow-2xl text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
          className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-primary/30"
        >
          <CheckCircle2 size={48} className="text-primary" />
        </motion.div>

        <h1 className="font-cinzel text-4xl md:text-5xl font-black tracking-widest text-foreground mb-4 uppercase">
          BINDING VOW COMPLETE
        </h1>
        <p className="text-primary font-bold tracking-[0.3em] uppercase text-xs mb-8">
          Order Manifested Successfully
        </p>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent mb-10" />

        <div className="space-y-6 mb-12">
          <p className="text-muted-foreground text-lg leading-relaxed">
            Your artifact acquisition has been recorded in the archives of Jujutsu High. 
            We are currently channeling cursed energy to prepare your shipment.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-foreground/80 font-medium">
            <Package size={18} className="text-primary" />
            <span>You will receive a confirmation scroll (email) shortly.</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/" 
            className="group flex items-center justify-center gap-2 px-8 py-4 bg-background border border-border text-xs font-bold tracking-[0.2em] uppercase transition-all hover:border-primary hover:text-primary rounded-xl"
          >
            <Home size={16} /> Return Home
          </Link>
          <Link 
            href="/profile" 
            className="group flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white text-xs font-bold tracking-[0.2em] uppercase transition-all hover:bg-accent rounded-xl shadow-xl shadow-primary/20"
          >
            <ShoppingBag size={16} /> View Orders <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </motion.div>

      {/* Decorative text */}
      <div className="mt-12 opacity-5 font-cinzel text-8xl md:text-[12rem] font-black select-none pointer-events-none whitespace-nowrap overflow-hidden w-full text-center">
        LIMITLESS STORE LIMITLESS STORE
      </div>
    </div>
  );
}
