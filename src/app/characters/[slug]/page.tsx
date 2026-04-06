import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import CharacterDetailClient from "@/components/character/CharacterDetailClient";
import { CHARACTERS } from "@/lib/mockData";

// Generate static params for all 12 character slugs
export async function generateStaticParams() {
  return CHARACTERS.map((char) => ({ slug: char.slug }));
}

export default async function CharacterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const character = CHARACTERS.find((c) => c.slug === resolvedParams.slug);

  if (!character) {
    notFound();
  }

  // Fetch real products from Supabase for this character
  const { data: dbProducts } = await supabase
    .from('products')
    .select('*')
    .eq('character_slug', character.slug);
  
  // Map to the format expected by ProductCard
  const mappedProducts = (dbProducts || []).map(p => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: Number(p.price),
    category: p.category,
    image_url: p.image_url,
    images: p.images || [p.image_url],
    rating: p.rating || 4.8,
    reviews: p.reviews || 0,
    character_slug: p.character_slug,
    stock: p.stock || 0,
    currency: "DZD",
    tags: [p.category, p.character_slug].filter(Boolean) as string[]
  }));

  return (
    <CharacterDetailClient 
      character={character} 
      products={mappedProducts} 
    />
  );
}
