"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ChevronLeft, Package, MapPin, CreditCard, 
  Calendar, Hash, User, Phone, Mail, 
  Download, Printer, ArrowLeft
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store";
import { cn } from "@/lib/utils";

interface Order {
  id: string;
  created_at: string;
  total_amount: number;
  items: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  wilayas: string; // Wait, from previous turns I saw 'wilaya'
  wilaya: string;
  address: string;
  delivery_type: string;
  status: string;
}

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      if (!user || !id) return;

      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        
        // Security check: Ensure order belongs to user
        if (data.user_id !== user.id) {
          router.push("/profile");
          return;
        }

        setOrder(data);
      } catch (err) {
        console.error("Error fetching order:", err);
        router.push("/profile");
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [id, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="min-h-screen bg-background pt-32 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <Link 
          href="/profile" 
          className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground hover:text-primary transition-colors mb-8 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Archives
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface/40 backdrop-blur-xl border border-border rounded-3xl overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="p-8 md:p-12 border-b border-border bg-gradient-to-br from-surface/60 to-transparent">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h1 className="font-cinzel text-3xl md:text-4xl font-black tracking-widest text-foreground uppercase mb-2">
                  ORDER DECREE
                </h1>
                <p className="text-primary font-bold tracking-[0.3em] uppercase text-[10px]">
                  Artifact Manifested in the Records
                </p>
              </div>
              <div className="text-left md:text-right">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-3">
                  {order.status}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                  <Calendar size={14} />
                  <span>{new Date(order.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
              {/* Manifest Metadata */}
              <div>
                <h2 className="font-cinzel text-lg font-bold tracking-widest text-foreground uppercase mb-6 flex items-center gap-2">
                  <Hash size={18} className="text-primary" /> Manifest Metadata
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Inscribed ID</span>
                    <span className="text-sm font-mono font-bold text-foreground">{order.id}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Caster</span>
                    <span className="text-sm font-bold text-foreground">{order.contact_name}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Comm Device</span>
                    <span className="text-sm font-bold text-foreground">{order.contact_phone}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Signal</span>
                    <span className="text-sm font-bold text-foreground truncate max-w-[150px]">{order.contact_email}</span>
                  </div>
                </div>
              </div>

              {/* Deployment Zone */}
              <div>
                <h2 className="font-cinzel text-lg font-bold tracking-widest text-foreground uppercase mb-6 flex items-center gap-2">
                  <MapPin size={18} className="text-primary" /> Deployment Zone
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Wilaya Domain</span>
                    <span className="text-sm font-bold text-foreground">{order.wilaya}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Precise Coords</span>
                    <span className="text-sm font-bold text-foreground">{order.address}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Transit Method</span>
                    <span className="text-sm font-bold text-foreground uppercase tracking-tighter">{order.delivery_type}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Artifacts List */}
            <div className="mb-12">
              <h2 className="font-cinzel text-lg font-bold tracking-widest text-foreground uppercase mb-6 flex items-center gap-2">
                <Package size={18} className="text-primary" /> Summoned Artifacts
              </h2>
              <div className="bg-background/50 rounded-2xl border border-border p-6 space-y-4">
                {order.items.split(", ").map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-3 border-b border-border/30 last:border-0">
                    <span className="text-sm font-medium text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Balance */}
            <div className="flex flex-col items-end pt-8 border-t border-border">
              <div className="space-y-2 text-right">
                <p className="text-xs text-muted-foreground uppercase tracking-[0.2em] font-bold">Total Cursed Energy Exchange</p>
                <p className="font-cinzel text-4xl md:text-5xl font-black text-primary">
                  {order.total_amount.toLocaleString()} DZD
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 mt-12 pt-8 border-t border-border/50">
              <button 
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-surface border border-border text-[10px] font-bold tracking-widest uppercase rounded-xl hover:border-primary hover:text-primary transition-all"
              >
                <Printer size={14} /> Print Decree
              </button>
              <Link 
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white text-[10px] font-bold tracking-widest uppercase rounded-xl hover:bg-accent transition-all shadow-lg shadow-primary/20"
              >
                Summon More Artifacts
              </Link>
            </div>
          </div>
        </motion.div>

        <p className="mt-12 text-center text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-medium leading-relaxed max-w-lg mx-auto">
          This decree is a binding vow between Limitless Store and the recipient. Unauthorized alteration of this document may lead to severe cursed energy repercussions.
        </p>
      </div>
    </div>
  );
}
