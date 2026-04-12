"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Moon, Sun, Search, Heart, ShoppingCart, User, Menu, X, Layers } from "lucide-react";
import { useAuthStore, useCartStore, useThemeStore, useWishlistStore } from "@/store";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import SearchModal from "@/components/ui/SearchModal";
import ThemeToggle from "@/components/ui/ThemeToggle";

const NAV_LINKS = [
  { name: "Characters", href: "/characters" },
  { name: "Shop", href: "/shop" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { theme, toggleTheme, setShowCurtain } = useThemeStore();
  const { user, logout, checkSession } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const cartItemsCount = useCartStore((state) => state.totalItems());
  const wishlistCount = useWishlistStore((state) => state.items.length);

  useEffect(() => {
    setMounted(true);
    checkSession();

    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [checkSession]);

  // Handle Supabase Auth Events and Recovery
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        useThemeStore.getState().setShowCurtain(false);
        router.push('/update-password');
        return;
      }
      
      if (!session && pathname === '/update-password') {
        // do not redirect, allow them to set a new password
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [pathname, router]);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const handleLogout = async () => {
    try {
      await logout();
      setMobileMenuOpen(false);
      window.location.href = "/";
    } catch (err) {
      console.error("Navbar Logout Redirect Error:", err);
      window.location.href = "/";
    }
  };

  const handleThemeToggle = async () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    await new Promise(r => setTimeout(r, 400));
    toggleTheme();
    await new Promise(r => setTimeout(r, 400));
    setIsTransitioning(false);
  };

  if (!mounted) return null;

  return (
    <>
      <div 
        className={cn("domain-transition-overlay", isTransitioning && "active")} 
        data-transitioning-to={theme === 'dark' ? 'light' : 'dark'} 
      />
      
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      <header
        className={cn(
          "navbar fixed top-0 w-full z-50 transition-all duration-300 border-b shadow-sm",
          theme === "light" 
            ? "border-blue-200/50" 
            : "border-red-900/10",
          isScrolled
            ? "scrolled bg-white/95 backdrop-blur-md"
            : (theme === "light" ? "bg-blue-50/50" : "bg-red-50/50")
        )}
      >
        <div className="navbar-energy">
          {Array.from({ length: 8 }).map((_, i) => (
            <div 
              key={i} 
              className="navbar-energy-particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                '--d': `${2 + Math.random() * 3}s`,
                '--delay': `${Math.random() * 2}s`,
                '--tx': `${(Math.random() - 0.5) * 50}px`
              } as React.CSSProperties}
            />
          ))}
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center justify-between h-20">

            {/* Logo — STORE [eye] LIMITLESS layout */}
            <Link href="/" className="flex-shrink-0 flex items-center gap-1 group" aria-label="Limitless Store Home">
              <div className="hidden sm:flex flex-col items-center leading-none text-glow-none">
                <span className={cn(
                  "font-cinzel font-black text-[11px] tracking-[0.25em]",
                  theme === "light" ? "text-blue-950" : "text-red-950"
                )}>
                  STORE
                </span>
                <span className={cn("text-[7px] tracking-[0.2em] font-bold", theme === "light" ? "text-blue-700" : "text-red-700")}>天上天下</span>
              </div>

              <div className="relative w-10 h-10 navbar-logo-img">
                <Image
                  src="/images/logo.png"
                  alt="Limitless Store Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              <div className="flex flex-col items-center leading-none">
                <span className={cn(
                  "font-cinzel font-black text-[13px] tracking-[0.25em]",
                  theme === "light" ? "text-blue-950" : "text-red-950"
                )}>LIMITLESS</span>
                <span className={cn("hidden sm:block text-[7px] tracking-[0.2em] font-bold", theme === "light" ? "text-blue-700/60" : "text-red-700/60")}>唯我独尊</span>
              </div>
            </Link>

            <nav className="hidden md:block">
              <ul className="flex space-x-8">
                {NAV_LINKS.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className={cn(
                        "text-sm font-black uppercase tracking-widest transition-all duration-300 relative group",
                        theme === "light"
                          ? (pathname === link.href ? "text-blue-950" : "text-blue-950/70 hover:text-blue-700")
                          : (pathname === link.href ? "text-red-950" : "text-red-950/70 hover:text-red-700")
                      )}
                    >
                      {link.name}
                      <span
                        className={cn(
                          "absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300",
                          theme === "light" ? "bg-blue-950 group-hover:w-full" : "bg-red-950 group-hover:w-full",
                          pathname === link.href && "w-full"
                        )}
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="hidden md:flex items-center space-x-5">
              <button
                onClick={() => setSearchOpen(true)}
                className={cn("transition-colors", theme === "light" ? "text-blue-950 hover:text-blue-700" : "text-red-950 hover:text-red-700")}
                aria-label="Search"
              >
                <Search size={20} />
              </button>
              <Link href="/wishlist" className={cn("relative transition-colors", theme === "light" ? "text-blue-950 hover:text-blue-700" : "text-red-950 hover:text-red-700")} aria-label="Wishlist">
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className={cn("absolute -top-2 -right-2 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-md", theme === "light" ? "bg-blue-950" : "bg-red-950")}>
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <Link href="/cart" className={cn("relative transition-colors", theme === "light" ? "text-blue-950 hover:text-blue-700" : "text-red-950 hover:text-red-700")} aria-label="Cart">
                <ShoppingCart size={20} />
                {cartItemsCount > 0 && (
                  <span className={cn("absolute -top-2 -right-2 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md", theme === "light" ? "bg-blue-950" : "bg-red-950")}>
                    {cartItemsCount}
                  </span>
                )}
              </Link>
              <Link href="/profile" className={cn("transition-colors", theme === "light" ? "text-blue-950 hover:text-blue-700" : "text-red-950 hover:text-red-700")} aria-label="Profile">
                <User size={20} />
              </Link>
              <ThemeToggle />

              <button
                onClick={() => setShowCurtain(true)}
                className="group relative px-4 py-2 border border-white/20 hover:border-primary/50 rounded-lg transition-all duration-300 overflow-hidden bg-white/5 backdrop-blur-sm"
                aria-label="Re-align Domains"
              >
                <span className="relative z-10 text-[10px] font-bold tracking-[0.2em] uppercase text-white group-hover:text-primary transition-colors">
                  Re-align Domains
                </span>
                <motion.div 
                  className="absolute inset-0 bg-primary/5 -translate-x-full group-hover:translate-x-0 transition-transform duration-300" 
                />
              </button>
            </div>

            <div className="flex items-center md:hidden space-x-4">
              <Link href="/wishlist" className={cn("relative transition-colors", theme === "light" ? "text-blue-950 hover:text-blue-700" : "text-red-950 hover:text-red-700")}>
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className={cn("absolute -top-2 -right-2 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-md", theme === "light" ? "bg-blue-950" : "bg-red-950")}>
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <Link href="/cart" className={cn("relative transition-colors", theme === "light" ? "text-blue-950 hover:text-blue-700" : "text-red-950 hover:text-red-700")}>
                <ShoppingCart size={20} />
                {cartItemsCount > 0 && (
                  <span className={cn("absolute -top-2 -right-2 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md", theme === "light" ? "bg-blue-950" : "bg-red-950")}>
                    {cartItemsCount}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={cn("focus:outline-none transition-colors", theme === "light" ? "text-blue-950 hover:text-blue-700" : "text-red-950 hover:text-red-700")}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className={cn(
            "md:hidden absolute top-20 left-0 w-full border-b shadow-xl z-40 animate-in slide-in-from-top duration-300",
            theme === "light" ? "bg-white border-blue-100" : "bg-red-50 border-red-100"
          )}>
            <div className="px-4 pt-2 pb-6 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "block px-3 py-4 text-base font-black uppercase tracking-widest border-b transition-colors",
                    theme === "light" 
                      ? "text-blue-950 hover:bg-blue-50 hover:text-blue-700 border-blue-50" 
                      : "text-red-950 hover:bg-red-50 hover:text-red-700 border-red-50"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <div className={cn("flex items-center justify-between px-3 py-4 border-b", theme === "light" ? "border-blue-50" : "border-red-50")}>
                <span className={cn("text-base font-bold uppercase tracking-widest", theme === "light" ? "text-blue-800" : "text-red-800")}>Domain</span>
                <button 
                  onClick={() => { setShowCurtain(true); setMobileMenuOpen(false); }} 
                  className={cn(
                    "px-4 py-2 text-[10px] font-black tracking-widest uppercase rounded border transition-all",
                    theme === "light"
                      ? "bg-blue-950 text-white border-blue-950"
                      : "bg-red-950 text-white border-red-950"
                  )}
                >
                  Re-align
                </button>
              </div>
              <div className={cn("flex items-center justify-between px-3 py-4 border-b", theme === "light" ? "border-blue-50" : "border-red-50")}>
                <span className={cn("text-base font-bold uppercase tracking-widest", theme === "light" ? "text-blue-950" : "text-red-950")}>Aura</span>
                <ThemeToggle />
              </div>
              <div className="flex items-center gap-6 pt-6 px-3 justify-center">
                <Link href="/wishlist" onClick={() => setMobileMenuOpen(false)} className={cn("relative flex flex-col items-center gap-1 transition-colors", theme === "light" ? "text-blue-950 hover:text-blue-700" : "text-red-950 hover:text-red-700")}>
                  <Heart size={24} />
                  {wishlistCount > 0 && (
                    <span className={cn("absolute -top-1 -right-1 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center", theme === "light" ? "bg-blue-950" : "bg-red-950")}>
                      {wishlistCount}
                    </span>
                  )}
                  <span className="text-xs">Saved</span>
                </Link>
                <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className={cn("flex flex-col items-center gap-1 transition-colors", theme === "light" ? "text-blue-950 hover:text-blue-700" : "text-red-950 hover:text-red-700")}>
                  <User size={24} />
                  <span className="text-xs">Profile</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
