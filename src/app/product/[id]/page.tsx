import { supabase } from "@/lib/supabase";
import ProductDetailClient from "@/components/product/ProductDetailClient";
import NextLink from "next/link";
import { Metadata } from "next";

// This is required in Next.js 15+ for dynamic metadata or just params handling
interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { data: product } = await supabase
    .from('products')
    .select('name, description')
    .eq('id', id)
    .single();

  return {
    title: product ? `${product.name} | Limitless Store` : "Artifact Not Found",
    description: product?.description || "Technical data for this cursed object is unavailable.",
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;

  try {
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !product) {
      return (
        <div className="min-h-screen bg-background pt-24 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-cinzel text-4xl font-bold text-foreground mb-4">Artifact Lost</h1>
            <p className="text-muted-foreground mb-8">This cursed object has not been detected in this domain.</p>
            <NextLink href="/shop" className="px-6 py-3 bg-primary text-white font-bold tracking-widest uppercase rounded">
              Return to Arsenal
            </NextLink>
          </div>
        </div>
      );
    }

    return <ProductDetailClient product={product} />;
  } catch (err) {
    console.error("[Limitless Store] Server-side fetch failed:", err);
    return (
      <div className="min-h-screen bg-background pt-24 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
            <span className="text-red-400 text-3xl">!</span>
          </div>
          <h1 className="font-cinzel text-3xl font-bold text-foreground mb-3">Domain Disrupted</h1>
          <p className="text-muted-foreground text-sm mb-8">A technical barrier is preventing us from manifesting this artifact. Please try again later.</p>
          <NextLink href="/shop" className="px-6 py-3 border border-border text-foreground font-bold tracking-widest uppercase rounded-lg hover:border-primary transition-colors">
            Back to Shop
          </NextLink>
        </div>
      </div>
    );
  }
}
