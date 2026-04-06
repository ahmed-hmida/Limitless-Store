import Image from "next/image";
import Link from "next/link";
import { Camera, Send, MessageCircle } from "lucide-react";
import { CHARACTERS } from "@/lib/mockData";

export default function Footer() {
  // Split 12 characters into two columns of 6
  const col1 = CHARACTERS.slice(0, 6);
  const col2 = CHARACTERS.slice(6, 12);

  return (
    <footer className="bg-surface border-t border-border mt-auto">
      {/* Support banner */}
      <div className="bg-black text-white text-center py-3 px-4 border-b border-primary/30">
        <p className="text-sm md:text-base font-medium tracking-wide">
          <span className="text-primary italic">&ldquo;We support Jujutsu Kaisen manga translators.&rdquo;</span>{" "}
          Designs may be inspired by official manga panels.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">

          {/* Brand */}
          <div className="md:col-span-3">
            {/* Logo — same layout as Navbar */}
            <Link href="/" aria-label="Limitless Store Home" className="flex items-center gap-2 mb-5 group w-fit">
              <div className="hidden sm:flex flex-col items-center leading-none">
                <span className="font-cinzel font-black text-[11px] tracking-[0.25em] bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">STORE</span>
                <span className="text-[7px] tracking-[0.2em] text-primary/60">天上天下</span>
              </div>

              <div className="relative w-[50px] h-[50px] navbar-logo-img">
                <Image
                  src="/images/logo.png"
                  alt="Limitless Store Logo"
                  fill
                  className="object-contain"
                />
              </div>

              <div className="flex flex-col items-center leading-none">
                <span className="font-cinzel font-black text-[13px] tracking-[0.25em] bg-gradient-to-r from-primary to-foreground bg-clip-text text-transparent">LIMITLESS</span>
                <span className="hidden sm:block text-[7px] tracking-[0.2em] text-primary/60">唯我独尊</span>
              </div>
            </Link>

            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Beyond the Veil. Beyond the Limit. The Strongest Shop for Jujutsu Kaisen anime merchandise in Bordj El Kiffan, Algiers, Algeria.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Instagram">
                <Camera size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Telegram">
                <Send size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Discord">
                <MessageCircle size={20} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div className="md:col-span-2">
            <h3 className="font-cinzel font-semibold text-base mb-4 text-foreground tracking-wide">Shop</h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {["clothing", "manga", "figurines", "wallart", "accessories"].map((cat) => (
                <li key={cat}>
                  <Link href={`/shop?category=${cat}`} className="hover:text-primary transition-colors capitalize">
                    {cat === "wallart" ? "Wall Art" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Characters col 1 */}
          <div className="md:col-span-3">
            <h3 className="font-cinzel font-semibold text-base mb-4 text-foreground tracking-wide">Sorcerers</h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {col1.map((c) => (
                <li key={c.slug}>
                  <Link href={`/characters/${c.slug}`} className="hover:text-primary transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Characters col 2 */}
          <div className="md:col-span-2 md:pt-[2.25rem]">
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {col2.map((c) => (
                <li key={c.slug}>
                  <Link href={`/characters/${c.slug}`} className="hover:text-primary transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="md:col-span-2">
            <h3 className="font-cinzel font-semibold text-base mb-4 text-foreground tracking-wide">Help</h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">About Limitless</Link></li>
              <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="/shipping" className="hover:text-primary transition-colors">Shipping Policy</Link></li>
              <li><Link href="/returns" className="hover:text-primary transition-colors">Returns &amp; Exchanges</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Limitless Store — Ahmed. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
