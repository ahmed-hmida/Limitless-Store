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
          "navbar fixed top-0 w-full z-50 transition-all duration-300 border-b border-transparent",
          isScrolled
            ? "scrolled bg-background/85 backdrop-blur-md border-border shadow-sm shadow-primary/10"
            : "bg-transparent"
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
              {/* Left: STORE */}
              <div className="hidden sm:flex flex-col items-center leading-none">
                <span className="font-cinzel font-black text-[11px] tracking-[0.25em] bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                  STORE
                </span>
                <span className="text-[7px] tracking-[0.2em] text-primary opacity-70">天上天下</span>
              </div>

              {/* Center: Eye logo */}
              <div className="relative w-10 h-10 navbar-logo-img">
                <Image
                  src="/images/logo.png"
                  alt="Limitless Store Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* Right: LIMITLESS */}
              <div className="flex flex-col items-center leading-none">
                <span className="font-cinzel font-black text-[13px] tracking-[0.25em] bg-gradient-to-r from-primary to-foreground bg-clip-text text-transparent">LIMITLESS</span>
                <span className="hidden sm:block text-[7px] tracking-[0.2em] text-primary/60">唯我独尊</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:block">
              <ul className="flex space-x-8">
                {NAV_LINKS.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className={cn(
                        "text-sm font-medium uppercase tracking-wider transition-colors hover:text-primary relative group",
                        pathname === link.href ? "text-primary px-1" : "text-white"
                      )}
                    >
                      {link.name}
                      <span
                        className={cn(
                          "absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full",
                          pathname === link.href && "w-full"
                        )}
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Icons */}
            <div className="hidden md:flex items-center space-x-5">
              <button
                onClick={() => setSearchOpen(true)}
                className="text-white hover:text-primary transition-colors"
                aria-label="Search"
              >
                <Search size={20} />
              </button>
              <Link href="/wishlist" className="relative text-white hover:text-primary transition-colors" aria-label="Wishlist">
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <Link href="/cart" className="relative text-white hover:text-primary transition-colors" aria-label="Cart">
                <ShoppingCart size={20} />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
              <Link href="/profile" className="text-white hover:text-primary transition-colors" aria-label="Profile">
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

            {/* Mobile actions */}
            <div className="flex items-center md:hidden space-x-4">
              <Link href="/wishlist" className="relative text-white hover:text-primary transition-colors">
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <Link href="/cart" className="relative text-white hover:text-primary transition-colors">
                <ShoppingCart size={20} />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-white hover:text-primary focus:outline-none"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-background/95 backdrop-blur-md border-b border-border shadow-lg z-40">
            <div className="px-4 pt-2 pb-6 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-4 text-base font-medium text-foreground hover:bg-surface hover:text-primary transition-colors uppercase tracking-widest border-b border-border/50"
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex items-center justify-between px-3 py-4 border-b border-border/50">
                <span className="text-base font-medium uppercase tracking-widest text-primary">Domain</span>
                <button 
                  onClick={() => { setShowCurtain(true); setMobileMenuOpen(false); }} 
                  className="px-4 py-2 bg-primary/10 text-primary text-[10px] font-black tracking-widest uppercase rounded border border-primary/30"
                >
                  Re-align
                </button>
              </div>
              <div className="flex items-center justify-between px-3 py-4 border-b border-border/50">
                <span className="text-base font-medium uppercase tracking-widest">Aura</span>
                <ThemeToggle />
              </div>
              <div className="flex items-center gap-6 pt-6 px-3 justify-center">
                <Link href="/wishlist" onClick={() => setMobileMenuOpen(false)} className="relative text-foreground hover:text-primary flex flex-col items-center gap-1">
                  <Heart size={24} />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                  <span className="text-xs">Saved</span>
                </Link>
                <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="text-foreground hover:text-primary flex flex-col items-center gap-1">
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
