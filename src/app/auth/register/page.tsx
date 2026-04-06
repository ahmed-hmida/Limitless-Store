"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, User, Mail, Lock } from "lucide-react";
import { useAuthStore } from "@/store";
import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            username: formData.username,
          }
        }
      });

      if (error) {
        alert(error.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email!,
          name: data.user.user_metadata.full_name || 'New Sorcerer',
          avatar: '/images/logo.png',
          joinDate: data.user.created_at
        });
        router.push("/profile");
      }
    } catch (err) {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center relative overflow-hidden p-4 pt-24 pb-12">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 flex items-center justify-center">
        <div className="w-[150vw] h-[150vw] md:w-[80vw] md:h-[80vw] bg-accent/20 rounded-full blur-[120px]" />
      </div>
      
      <div className="relative z-10 w-full max-w-md">
        <Link href="/" className="flex justify-center mb-6">
          <h1 className="font-cinzel font-bold text-3xl tracking-widest text-glow-primary">
            LIMITLESS
          </h1>
        </Link>
        
        <div className="bg-surface/80 backdrop-blur-xl border border-border rounded-2xl p-8 shadow-2xl">
          <h2 className="font-cinzel text-2xl font-bold tracking-widest text-foreground text-center mb-2">
            ENROLLMENT
          </h2>
          <p className="text-muted-foreground text-sm text-center mb-8">
            Join Tokyo Jujutsu High's premium exchange.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold tracking-widest uppercase text-muted-foreground ml-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                  <User size={18} />
                </div>
                <input 
                  type="text" 
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-background border border-border rounded-lg py-3 pl-10 pr-4 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder="Yuji Itadori"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold tracking-widest uppercase text-muted-foreground ml-1">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                  <span className="font-bold text-lg">@</span>
                </div>
                <input 
                  type="text" 
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full bg-background border border-border rounded-lg py-3 pl-10 pr-4 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder="tiger_of_west_high"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold tracking-widest uppercase text-muted-foreground ml-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
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
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-background border border-border rounded-lg py-3 pl-10 pr-4 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <label className="flex items-start text-muted-foreground cursor-pointer text-xs leading-relaxed mt-4">
              <input type="checkbox" required className="mr-2 mt-1 accent-primary flex-shrink-0" />
              <span>I accept the binding vow (Terms of Service) and acknowledge the risks of cursed energy manipulation.</span>
            </label>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary text-white font-bold tracking-[0.2em] uppercase rounded-lg hover:bg-accent transition-colors flex items-center justify-center gap-2 mt-6 disabled:opacity-70 shadow-lg shadow-primary/20"
            >
              {loading ? "Forging Binding Vow..." : (
                <>Register <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground border-t border-border pt-6">
            Already enrolled?{" "}
            <Link href="/auth/login" className="text-primary font-bold hover:text-accent transition-colors">
              Sign In Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
