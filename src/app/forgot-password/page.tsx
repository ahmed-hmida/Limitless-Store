"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight, ArrowLeft, CheckCircle, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/update-password`,
      });

      if (resetError) {
        setError(resetError.message);
        setLoading(false);
        return;
      }

      setSuccess(true);
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center relative overflow-hidden p-4">
      {/* Background glow — mirrors the Login page */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 flex items-center justify-center">
        <div className="w-[150vw] h-[150vw] md:w-[80vw] md:h-[80vw] bg-primary/20 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Brand */}
        <Link href="/" className="flex justify-center mb-8">
          <h1 className="font-cinzel font-bold text-3xl tracking-widest text-glow-primary">
            LIMITLESS
          </h1>
        </Link>

        <div className="bg-surface/80 backdrop-blur-xl border border-border rounded-2xl p-8 shadow-2xl">
          {success ? (
            /* ── Success State ───────────────────────────────────────── */
            <div className="flex flex-col items-center text-center gap-4 py-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="bg-primary/10 border border-primary/30 rounded-full p-4">
                <CheckCircle size={36} className="text-primary" />
              </div>
              <h2 className="font-cinzel text-2xl font-bold tracking-widest text-foreground">
                LINK SENT
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                A password reset link has been dispatched to{" "}
                <span className="text-primary font-semibold">{email}</span>.
                Check your inbox — and your cursed email folder.
              </p>
              <Link
                href="/auth/login"
                className="mt-4 flex items-center gap-2 text-sm text-primary font-bold tracking-widest uppercase hover:text-accent transition-colors"
              >
                <ArrowLeft size={14} /> Back to Login
              </Link>
            </div>
          ) : (
            /* ── Form State ──────────────────────────────────────────── */
            <>
              <h2 className="font-cinzel text-2xl font-bold tracking-widest text-foreground text-center mb-2">
                RESET ACCESS
              </h2>
              <p className="text-muted-foreground text-sm text-center mb-6">
                Enter your email and we'll send you a reset link.
              </p>

              {/* Error banner */}
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
                  <label className="text-xs font-bold tracking-widest uppercase text-muted-foreground ml-1">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-background border border-border rounded-lg py-3 pl-10 pr-4 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      placeholder="sorcerer@jujutsu.edu"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-primary text-white font-bold tracking-[0.2em] uppercase rounded-lg hover:bg-accent transition-colors flex items-center justify-center gap-2 mt-4 disabled:opacity-70 shadow-lg shadow-primary/20"
                >
                  {loading ? (
                    "Channeling..."
                  ) : (
                    <>
                      Send Reset Link <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 text-center text-sm text-muted-foreground border-t border-border pt-6">
                Remembered your technique?{" "}
                <Link
                  href="/auth/login"
                  className="text-primary font-bold hover:text-accent transition-colors"
                >
                  Sign In
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
