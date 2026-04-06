const fs = require('fs');

// Simple mock of the data since I can't import TS easily
const CHARACTERS = [
  { slug: "gojo", name: "Gojo Satoru", technique: "Infinity / Six Eyes" },
  { slug: "sukuna", name: "Ryomen Sukuna", technique: "Malevolent Shrine / Cleave & Dismantle" },
  { slug: "yuji", name: "Yuji Itadori", technique: "Divergent Fist / Black Flash" },
  { slug: "megumi", name: "Megumi Fushiguro", technique: "Ten Shadows Technique" },
  { slug: "toji", name: "Toji Fushiguro", technique: "Zero Cursed Energy / Heavenly Restriction" },
  { slug: "yuta", name: "Yuta Okkotsu", technique: "Rika / Copy" },
  { slug: "maki", name: "Maki Zenin", technique: "Cursed Tools Expert / Heavenly Restriction" },
  { slug: "geto", name: "Suguru Geto", technique: "Cursed Spirit Manipulation" },
  { slug: "choso", name: "Choso", technique: "Blood Manipulation" },
  { slug: "nanami", name: "Nanami Kento", technique: "Ratio Technique" },
  { slug: "kenjaku", name: "Kenjaku", technique: "Brain Transplant / Cursed Spirit Manipulation" },
  { slug: "nobara", name: "Nobara Kugisaki", technique: "Straw Doll Technique" }
];

function generateProductsForCharacter(char) {
  const charImage = `/images/${char.slug}-card.jpg`;
  return [
    { id: `${char.slug}-tshirt-01`, name: `${char.name} Technique T-Shirt`, category: "clothing", price: 2500, inStock: true },
    { id: `${char.slug}-hoodie-01`, name: `${char.name} Signature Hoodie`, category: "clothing", price: 4800, inStock: true },
    { id: `${char.slug}-pants-01`, name: `${char.name} Training Pants`, category: "clothing", price: 3200, inStock: true },
    { id: `${char.slug}-manga-01`, name: `JJK Vol. 1 — ${char.name.split(" ")[0]} Edition`, category: "manga", price: 1200, inStock: true },
    { id: `${char.slug}-artbook-01`, name: `JJK Art Book — ${char.name.split(" ")[0]} Chapter`, category: "manga", price: 2800, inStock: true },
    { id: `${char.slug}-poster-01`, name: `${char.name} Technique Art Print`, category: "wallart", price: 1800, inStock: true },
    { id: `${char.slug}-canvas-01`, name: `${char.name} Canvas 50×70cm`, category: "wallart", price: 3500, inStock: true },
    { id: `${char.slug}-figure-01`, name: `${char.name} PVC Figure 25cm`, category: "figurines", price: 6500, inStock: true },
    { id: `${char.slug}-nendo-01`, name: `${char.name} Nendoroid`, category: "figurines", price: 8900, inStock: char.slug !== "toji" && char.slug !== "kenjaku" },
    { id: `${char.slug}-keychain-01`, name: `${char.name} Keychain`, category: "accessories", price: 800, inStock: true }
  ].map(p => ({
    ...p,
    character: char.slug,
    image_url: charImage,
    description: `${p.name} - High-quality official merchandise inspired by ${char.name}.`
  }));
}

const allProducts = CHARACTERS.flatMap(generateProductsForCharacter);

let sql = "INSERT INTO products (name, slug, description, price, category, image_url, character_slug, is_featured, stock)\nVALUES\n";

const values = allProducts.map(p => {
  const name = p.name.replace(/'/g, "''");
  const slug = p.id;
  const desc = p.description.replace(/'/g, "''");
  const stock = p.inStock ? 20 : 0;
  return `('${name}', '${slug}', '${desc}', ${p.price}, '${p.category}', '${p.image_url}', '${p.character}', false, ${stock})`;
});

sql += values.join(",\n") + ";";

const outPath = 'seed_products.sql';
fs.writeFileSync(outPath, sql);
console.log(`SQL generated at ${outPath}`);
