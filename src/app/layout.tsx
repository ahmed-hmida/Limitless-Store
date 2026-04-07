import type { Metadata } from "next";
import { Cinzel, Nunito } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CursedCursor from "@/components/ui/CursedCursor";
import GlobalCurtain from "@/components/layout/GlobalCurtain";
import Toast from "@/components/ui/Toast";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LIMITLESS STORE | The Strongest Shop",
  description: "Beyond the Veil. Beyond the Limit. Official Jujutsu Kaisen merchandise — clothing, figurines, manga, wall art, and more.",
  keywords: ["Jujutsu Kaisen", "JJK", "Gojo", "Sukuna", "anime merchandise", "limitless store"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Theme initializer — runs before paint to prevent flash */}
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var t = localStorage.getItem('theme-storage');
                var theme = t ? JSON.parse(t).state?.theme : null;
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch(_) {
                document.documentElement.classList.add('dark');
              }
            `,
          }}
        />
      </head>
      <body
        className={`${cinzel.variable} ${nunito.variable} min-h-screen flex flex-col font-sans transition-colors duration-300`}
      >
        <GlobalCurtain />
        <CursedCursor />
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Toast />
        <Footer />
      </body>
    </html>
  );
}
