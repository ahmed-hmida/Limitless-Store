"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { LogOut, Package, MapPin, User as UserIcon, Heart, Settings, Camera } from "lucide-react";
import { useAuthStore } from "@/store";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, updateUser } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("orders");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Protect route
  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [mounted, isAuthenticated, router]);

  if (!mounted || !isAuthenticated || !user) return null;

  const handleLogout = async () => {
    await logout();
    router.push("/");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-24 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Profile Header */}
        <div className="bg-surface border border-border p-8 rounded-2xl mb-8 flex flex-col md:flex-row items-center md:items-start gap-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
          
          <div className="relative group/avatar">
            <div className="w-32 h-32 rounded-full border-4 border-surface overflow-hidden shadow-xl shadow-primary/20 bg-muted/20 flex-shrink-0 relative">
              <Image 
                src={user.avatar || "/images/logo.png"} 
                alt={user.name} 
                fill 
                className="object-cover"
              />
              {uploading && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            <label className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity rounded-full z-10 text-[10px] font-bold text-white tracking-widest uppercase">
              <Camera size={20} className="mb-1" />
              Change Photo
              <input 
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setUploading(true);
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      updateUser({ avatar: reader.result as string });
                      setUploading(false);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </label>
          </div>
          
          <div className="flex-1 text-center md:text-left z-10">
            <h1 className="font-cinzel text-3xl font-bold text-foreground mb-2 shadow-sm">
              {user.name.toUpperCase()}
            </h1>
            <p className="text-muted-foreground mb-6 font-medium tracking-wide">
              {user.email} <span className="mx-2">•</span> Enrolled: {user.joinDate}
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <span className="px-4 py-1.5 bg-primary/10 border border-primary text-primary rounded-full text-xs font-bold tracking-widest uppercase">
                Grade: Special
              </span>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="md:absolute top-8 right-8 flex items-center gap-2 text-sm font-bold tracking-widest uppercase text-muted hover:text-primary transition-colors hover:bg-surface px-4 py-2 rounded-lg"
          >
            <LogOut size={16} /> Seal (Logout)
          </button>
        </div>

        {/* Dashboard Grid */}
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Menu */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-surface rounded-xl border border-border p-4 sticky top-28 space-y-2">
              <button 
                onClick={() => setActiveTab("orders")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold tracking-widest transition-colors ${activeTab === "orders" ? "bg-primary text-white border border-primary shadow-sm" : "text-foreground hover:bg-muted/10 border border-transparent"}`}
              >
                <Package size={18} /> Orders
              </button>
              <button 
                onClick={() => setActiveTab("wishlist")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold tracking-widest transition-colors ${activeTab === "wishlist" ? "bg-primary text-white border border-primary shadow-sm" : "text-foreground hover:bg-muted/10 border border-transparent"}`}
              >
                <Heart size={18} /> Wishlist
              </button>
              <button 
                onClick={() => setActiveTab("settings")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold tracking-widest transition-colors ${activeTab === "settings" ? "bg-primary text-white border border-primary shadow-sm" : "text-foreground hover:bg-muted/10 border border-transparent"}`}
              >
                <Settings size={18} /> Settings
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 bg-surface rounded-xl border border-border p-6 md:p-10 min-h-[500px]">
             
             {activeTab === "orders" && (
               <div>
                  <h2 className="font-cinzel text-2xl font-bold tracking-widest text-foreground mb-8 pb-4 border-b border-border">
                    ORDER HISTORY
                  </h2>
                  <div className="text-center py-20 border border-dashed border-border rounded-xl">
                    <Package size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
                    <h3 className="text-lg font-bold text-foreground mb-2">No Contracts Forged Yet</h3>
                    <p className="text-muted-foreground mb-6">You haven't made any purchases.</p>
                    <Link href="/shop" className="text-primary font-bold tracking-widest uppercase hover:underline text-sm">
                      Browse Artifacts
                    </Link>
                  </div>
               </div>
             )}

             {activeTab === "wishlist" && (
               <div>
                  <h2 className="font-cinzel text-2xl font-bold tracking-widest text-foreground mb-8 pb-4 border-b border-border flex justify-between items-center">
                    SAVED ARTIFACTS
                    <Link href="/wishlist" className="text-xs font-sans text-primary hover:underline">View Full Page →</Link>
                  </h2>
                  <div className="text-center py-20 border border-dashed border-border rounded-xl">
                    <Heart size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
                    <p className="text-muted-foreground mb-6">Your saved collection is managed centrally.</p>
                    <Link href="/wishlist" className="px-6 py-3 border border-border rounded hover:border-primary hover:text-primary transition-colors text-sm font-bold uppercase tracking-widest">
                      Go to Wishlist
                    </Link>
                  </div>
               </div>
             )}

             {activeTab === "settings" && (
               <div>
                  <h2 className="font-cinzel text-2xl font-bold tracking-widest text-foreground mb-8 pb-4 border-b border-border">
                    ACCOUNT SETTINGS
                  </h2>
                  
                  <div className="max-w-md space-y-6">
                    <div>
                      <label className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-2 block">Full Name</label>
                      <input id="profile-name" type="text" defaultValue={user.name} className="w-full bg-background border border-border rounded-lg py-3 px-4 text-foreground focus:outline-none focus:border-primary" />
                    </div>
                    <div>
                      <label className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-2 block">Email</label>
                      <input id="profile-email" type="email" defaultValue={user.email} className="w-full bg-background border border-border rounded-lg py-3 px-4 text-foreground focus:outline-none focus:border-primary" />
                    </div>
                    <button 
                      onClick={() => {
                        const nameInput = document.getElementById("profile-name") as HTMLInputElement;
                        const emailInput = document.getElementById("profile-email") as HTMLInputElement;
                        updateUser({ name: nameInput.value, email: emailInput.value });
                        alert("Domain Resonance Updated Successfully!");
                      }}
                      className="px-6 py-3 bg-primary text-white font-bold tracking-widest uppercase rounded-lg hover:bg-accent transition-colors text-sm"
                    >
                      Update Profile
                    </button>
                  </div>
               </div>
             )}

          </div>
        </div>
      </div>
    </div>
  );
}
