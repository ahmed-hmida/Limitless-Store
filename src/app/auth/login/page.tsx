"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Mail, Lock, X } from "lucide-react";
import { useAuthStore } from "@/store";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.toLowerCase().includes("confirm") || error.message.toLowerCase().includes("verify")) {
          setError("Please check your email to verify your account before logging in.");
        } else {
          setError(error.message);
        }
        setLoading(false);
        return;
      }

      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email!,
          name: data.user.user_metadata.full_name || 'Sorcerer',
          avatar: data.user.user_metadata.avatar_url,
          joinDate: data.user.created_at
        });
        router.push("/profile");
      }
    } catch (err) {
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
          <h1 className="font-cinzel font-bold text-3xl tracking-widest text-glow-primary">
            LIMITLESS
          </h1>
        </Link>
        
        <div className="bg-surface/80 backdrop-blur-xl border border-border rounded-2xl p-8 shadow-2xl">
          <h2 className="font-cinzel text-2xl font-bold tracking-widest text-foreground text-center mb-2">
            WELCOME BACK
          </h2>
          <p className="text-muted-foreground text-sm text-center mb-6">
            Access your domain expansion.
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
              <label className="text-xs font-bold tracking-widest uppercase text-muted-foreground ml-1">Email</label>
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

            <div className="space-y-1">
              <label className="text-xs font-bold tracking-widest uppercase text-muted-foreground ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg py-3 pl-10 pr-4 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-muted-foreground cursor-pointer">
                <input type="checkbox" className="mr-2 accent-primary" />
                Remember me
              </label>
              <Link href="/forgot-password" className="text-primary hover:text-accent font-medium transition-colors">
                Forgot password?
              </Link>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary text-white font-bold tracking-[0.2em] uppercase rounded-lg hover:bg-accent transition-colors flex items-center justify-center gap-2 mt-4 disabled:opacity-70 shadow-lg shadow-primary/20"
            >
              {loading ? "Manifesting..." : (
                <>Sign In <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-muted-foreground border-t border-border pt-6">
            Don't have an account?{" "}
            <Link href="/auth/register" className="text-primary font-bold hover:text-accent transition-colors">
              Enroll Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
