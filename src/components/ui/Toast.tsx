"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";
import { useThemeStore } from "@/store";
import { cn } from "@/lib/utils";

export default function Toast() {
  const { toast, hideToast } = useThemeStore();

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        hideToast();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, hideToast]);

  return (
    <AnimatePresence>
      {toast && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-4 pointer-events-none">
          <motion.div
            initial={{ y: -100, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -50, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className={cn(
              "pointer-events-auto bg-surface-bg/95 backdrop-blur-xl border-2 border-primary/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden",
              toast.type === 'success' ? "border-green-500/30" : "border-primary/30"
            )}
          >
            <div className="shrink-0 w-10 h-10 rounded-full bg-background/50 flex items-center justify-center border border-white/10 shadow-inner">
              {toast.type === 'success' && <CheckCircle className="text-green-500" size={24} />}
              {toast.type === 'error' && <AlertCircle className="text-red-500" size={24} />}
              {toast.type === 'info' && <Info className="text-blue-500" size={24} />}
            </div>
            
            <p className="flex-1 text-base font-bold text-foreground tracking-wide leading-tight px-1">
              {toast.message}
            </p>
            
            <button 
              onClick={hideToast}
              className="shrink-0 text-muted-foreground hover:text-foreground transition-colors p-1"
            >
              <X size={20} />
            </button>
            
            {/* Countdown Progress Bar */}
            <motion.div 
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 4, ease: "linear" }}
              className={cn(
                "absolute bottom-0 left-0 right-0 h-1 origin-left",
                toast.type === 'success' ? "bg-green-500" : "bg-primary"
              )}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
