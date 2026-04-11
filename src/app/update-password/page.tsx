"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight, Eye, EyeOff, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useThemeStore } from "@/store";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const { showToast } = useThemeStore();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        setError(updateError.message);
        setLoading(false);
        return;
      }

      showToast("Technique restored! Password updated successfully.", "success");
      router.push("/auth/login");
    } catch {
      setError("An unexpected error occurred during manifestation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center relative overflow-hidden p-4">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 flex items-center justify-center">
        <div className="w-[150vw] h-[150vw] md:w-[80vw] md:h-[80vw] bg-primary/20 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Link href="/" className="flex justify-center mb-8">
          <h1 className="font-cinzel font-bold text-3xl tracking-widest text-glow-primary text-foreground">
            LIMITLESS
          </h1>
        </Link>

        <div className="bg-surface/80 backdrop-blur-xl border border-border rounded-2xl p-8 shadow-2xl">
          <h2 className="font-cinzel text-2xl font-bold tracking-widest text-foreground text-center mb-2">
            RECLAIM POWER
          </h2>
          <p className="text-muted-foreground text-sm text-center mb-6 uppercase tracking-wider font-medium">
            Reset your cursed energy key.
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="bg-red-500/20 p-1 rounded-full mt-0.5">
                <X size={14} className="text-red-500" />
              </div>
              <p className="text-sm text-red-200/80 leading-relaxed italic">
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-bold tracking-widest uppercase text-muted-foreground ml-1">New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg py-3 pl-10 pr-10 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-sans"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold tracking-widest uppercase text-muted-foreground ml-1">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg py-3 pl-10 pr-10 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-sans"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary text-white font-bold tracking-[0.2em] uppercase rounded-lg hover:bg-accent transition-colors flex items-center justify-center gap-2 mt-4 disabled:opacity-70 shadow-lg shadow-primary/20"
            >
              {loading ? "Restoring..." : (
                <>Manifest New Password <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-muted-foreground border-t border-border pt-6 uppercase tracking-tighter">
            <Link href="/auth/login" className="text-primary font-bold hover:text-accent transition-colors">
              Return to Domain
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
