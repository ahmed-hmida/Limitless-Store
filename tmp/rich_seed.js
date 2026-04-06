const fs = require('fs');

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
    { 
      id: `${char.slug}-tshirt-01`, 
      name: `${char.name} Technique T-Shirt`, 
      category: "clothing", 
      subcategory: "t-shirt",
      price: 2500, 
      inStock: true,
      images: [charImage, charImage, charImage],
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: ["Black", "White"],
      rating: 4.8,
      reviews: 124
    },
    { 
      id: `${char.slug}-hoodie-01`, 
      name: `${char.name} Signature Hoodie`, 
      category: "clothing", 
      subcategory: "hoodie",
      price: 4800, 
      inStock: true,
      images: [charImage, charImage],
      sizes: ["S", "M", "L", "XL"],
      colors: ["Black", "Navy", "Gray"],
      rating: 4.9,
      reviews: 256
    },
    { 
      id: `${char.slug}-pants-01`, 
      name: `${char.name} Training Pants`, 
      category: "clothing", 
      subcategory: "pants",
      price: 3200, 
      inStock: true,
      images: [charImage],
      sizes: ["M", "L", "XL"],
      colors: ["Black"],
      rating: 4.5,
      reviews: 64
    },
    { 
      id: `${char.slug}-manga-01`, 
      name: `JJK Vol. 1 — ${char.name.split(" ")[0]} Edition`, 
      category: "manga", 
      subcategory: "volume",
      price: 1200, 
      inStock: true,
      images: [charImage],
      rating: 5.0,
      reviews: 512
    },
    { 
      id: `${char.slug}-artbook-01`, 
      name: `JJK Art Book — ${char.name.split(" ")[0]} Chapter`, 
      category: "manga", 
      subcategory: "artbook",
      price: 2800, 
      inStock: true,
      images: [charImage],
      rating: 4.9,
      reviews: 89
    },
    { 
      id: `${char.slug}-poster-01`, 
      name: `${char.name} Technique Art Print`, 
      category: "wallart", 
      subcategory: "poster",
      price: 1800, 
      inStock: true,
      images: [charImage],
      rating: 4.7,
      reviews: 42
    },
    { 
      id: `${char.slug}-canvas-01`, 
      name: `${char.name} Canvas 50×70cm`, 
      category: "wallart", 
      subcategory: "canvas",
      price: 3500, 
      inStock: true,
      images: [charImage],
      rating: 4.8,
      reviews: 31
    },
    { 
      id: `${char.slug}-figure-01`, 
      name: `${char.name} PVC Figure 25cm`, 
      category: "figurines", 
      subcategory: "pvc",
      price: 6500, 
      inStock: true,
      images: [charImage, charImage],
      rating: 4.9,
      reviews: 144
    },
    { 
      id: `${char.slug}-nendo-01`, 
      name: `${char.name} Nendoroid`, 
      category: "figurines", 
      subcategory: "nendoroid",
      price: 8900, 
      inStock: char.slug !== "toji" && char.slug !== "kenjaku",
      images: [charImage],
      rating: 5.0,
      reviews: 201
    },
    { 
      id: `${char.slug}-keychain-01`, 
      name: `${char.name} Keychain`, 
      category: "accessories", 
      subcategory: "keychain",
      price: 800, 
      inStock: true,
      images: [charImage],
      rating: 4.4,
      reviews: 88
    }
  ].map(p => ({
    ...p,
    character: char.slug,
    image_url: charImage,
    description: `${p.name} - High-quality official merchandise inspired by ${char.name}. Featured Artifact.`
  }));
}

const allProducts = CHARACTERS.flatMap(generateProductsForCharacter);

let sql = "TRUNCATE TABLE products CASCADE;\n\nINSERT INTO products (id, name, slug, description, price, category, subcategory, image_url, images, sizes, colors, rating, reviews, character_slug, is_featured, stock)\nVALUES\n";

const toSqlArray = (arr) => {
  if (!arr || arr.length === 0) return "'{}'";
  return "ARRAY[" + arr.map(v => `'${v.replace(/'/g, "''")}'`).join(", ") + "]";
};

const values = allProducts.map(p => {
  const name = p.name.replace(/'/g, "''");
  const slug = p.id;
  const desc = p.description.replace(/'/g, "''");
  const stock = p.inStock ? 20 : 0;
  const images = toSqlArray(p.images);
  const sizes = toSqlArray(p.sizes);
  const colors = toSqlArray(p.colors);
  
  return `('${p.id}', '${name}', '${slug}', '${desc}', ${p.price}, '${p.category}', '${p.subcategory}', '${p.image_url}', ${images}, ${sizes}, ${colors}, ${p.rating}, ${p.reviews}, '${p.character}', false, ${stock})`;
});

sql += values.join(",\n") + ";";

fs.writeFileSync('rich_seed.sql', sql);
console.log("Rich SQL seed generated at rich_seed.sql");
