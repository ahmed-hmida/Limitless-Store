// ─── Character Type ───────────────────────────────────────────────────────────
export interface CharacterMock {
  slug: string;
  name: string;
  nameJP: string;
  technique: string;
  techniqueJP: string;
  bio: string;
  color: string;
  glowColor: string;
  bgAnimation: string;
  image: string;
  rank: string;
  gradientDark: string;
  gradientLight: string;
}

// ─── Product Type ─────────────────────────────────────────────────────────────
export interface ProductMock {
  id: string;
  name: string;
  character: string;
  category: string;
  subcategory: string;
  price: number;
  currency: string;
  images: string[];
  sizes?: string[];
  colors?: string[];
  rating: number;
  reviews: number;
  inStock: boolean;
  tags: string[];
}

// ─── 12 Characters ────────────────────────────────────────────────────────────
export const CHARACTERS: CharacterMock[] = [
  {
    slug: "gojo",
    name: "Gojo Satoru",
    nameJP: "五条悟",
    technique: "Infinity / Six Eyes",
    techniqueJP: "無量空処",
    bio: "The strongest jujutsu sorcerer. Special Grade. Teacher at Tokyo Jujutsu High. His Infinity technique creates an impenetrable barrier, and his Six Eyes grant him unparalleled perception of cursed energy.",
    color: "#5b8dee",
    glowColor: "#a0c4ff",
    bgAnimation: "infinity-void",
    image: "/images/gojo-card.jpg",
    rank: "Special Grade",
    gradientDark: "from-blue-950 via-indigo-900 to-black",
    gradientLight: "from-blue-50 via-indigo-100 to-white",
  },
  {
    slug: "sukuna",
    name: "Ryomen Sukuna",
    nameJP: "両面宿儺",
    technique: "Malevolent Shrine / Cleave & Dismantle",
    techniqueJP: "伏魔御廚子",
    bio: "The King of Curses. The most powerful cursed spirit in history. A four-armed demon from the golden age of jujutsu who resides within Yuji Itadori's body.",
    color: "#dc2626",
    glowColor: "#ff6b6b",
    bgAnimation: "fire-embers",
    image: "/images/sukuna-card.jpg",
    rank: "Special Grade (Cursed Spirit)",
    gradientDark: "from-red-950 via-rose-900 to-black",
    gradientLight: "from-red-50 via-rose-100 to-white",
  },
  {
    slug: "yuji",
    name: "Yuji Itadori",
    nameJP: "虎杖悠仁",
    technique: "Divergent Fist / Black Flash",
    techniqueJP: "黒閃",
    bio: "Sukuna's vessel. Extraordinary physical strength far beyond human limits. A Grade 1 sorcerer who fights to give people a proper death.",
    color: "#ec4899",
    glowColor: "#f9a8d4",
    bgAnimation: "pink-pulse",
    image: "/images/yuji-card.jpg",
    rank: "Grade 1",
    gradientDark: "from-pink-950 via-rose-900 to-black",
    gradientLight: "from-pink-50 via-rose-100 to-white",
  },
  {
    slug: "megumi",
    name: "Megumi Fushiguro",
    nameJP: "伏黒恵",
    technique: "Ten Shadows Technique",
    techniqueJP: "十種影法術",
    bio: "Ten Shadows Technique user. Fushiguro clan scion. A Grade 1 sorcerer who summons powerful shikigami from shadows to overwhelm his enemies.",
    color: "#1e3a5f",
    glowColor: "#4a90d9",
    bgAnimation: "shadow-ripple",
    image: "/images/megumi-card.jpg",
    rank: "Grade 1",
    gradientDark: "from-slate-950 via-blue-950 to-black",
    gradientLight: "from-slate-50 via-blue-100 to-white",
  },
  {
    slug: "toji",
    name: "Toji Fushiguro",
    nameJP: "伏黒甚爾",
    technique: "Zero Cursed Energy / Heavenly Restriction",
    techniqueJP: "天与呪縛",
    bio: "The Sorcerer Killer. Possesses zero cursed energy due to Heavenly Restriction, granting him a peak human physique that surpasses any sorcerer.",
    color: "#374151",
    glowColor: "#9ca3af",
    bgAnimation: "silver-sparks",
    image: "/images/toji-card.jpg",
    rank: "Non-Sorcerer (Heavenly Restriction)",
    gradientDark: "from-gray-950 via-zinc-900 to-black",
    gradientLight: "from-gray-50 via-zinc-100 to-white",
  },
  {
    slug: "yuta",
    name: "Yuta Okkotsu",
    nameJP: "乙骨憂太",
    technique: "Rika / Copy",
    techniqueJP: "理花",
    bio: "Special Grade sorcerer and one of four Special Grade sorcerers active today. Rika Orimoto dwells within him, granting him immense cursed energy output.",
    color: "#e2e8f0",
    glowColor: "#ffffff",
    bgAnimation: "white-snow",
    image: "/images/yuta-card.jpg",
    rank: "Special Grade",
    gradientDark: "from-slate-900 via-gray-800 to-black",
    gradientLight: "from-white via-slate-50 to-gray-100",
  },
  {
    slug: "maki",
    name: "Maki Zenin",
    nameJP: "禪院真希",
    technique: "Cursed Tools Expert / Heavenly Restriction",
    techniqueJP: "天与呪縛",
    bio: "Zenin clan rebel who fought against the corrupt sorcerer establishment. Heavenly Restriction made her unable to see curses without special glasses, but gave her a superhuman body.",
    color: "#16a34a",
    glowColor: "#4ade80",
    bgAnimation: "green-slashes",
    image: "/images/maki-card.jpg",
    rank: "Grade 4 → Special Grade",
    gradientDark: "from-green-950 via-emerald-900 to-black",
    gradientLight: "from-green-50 via-emerald-100 to-white",
  },
  {
    slug: "geto",
    name: "Suguru Geto",
    nameJP: "夏油傑",
    technique: "Cursed Spirit Manipulation",
    techniqueJP: "呪霊操術",
    bio: "Former Special Grade sorcerer turned curse user. Can absorb and command cursed spirits. Once Gojo's best friend, now his greatest enemy.",
    color: "#7c3aed",
    glowColor: "#a78bfa",
    bgAnimation: "purple-smoke",
    image: "/images/geto-card.jpg",
    rank: "Special Grade (Former)",
    gradientDark: "from-violet-950 via-purple-900 to-black",
    gradientLight: "from-violet-50 via-purple-100 to-white",
  },
  {
    slug: "choso",
    name: "Choso",
    nameJP: "血塗",
    technique: "Blood Manipulation",
    techniqueJP: "赤血操術",
    bio: "Death Painting womb — half-human, half-cursed spirit. Master of blood manipulation techniques including Piercing Blood. Considers Yuji his brother.",
    color: "#991b1b",
    glowColor: "#f87171",
    bgAnimation: "blood-drip",
    image: "/images/choso-card.jpg",
    rank: "Special Grade (Cursed Womb)",
    gradientDark: "from-red-950 via-red-900 to-black",
    gradientLight: "from-red-50 via-red-100 to-white",
  },
  {
    slug: "nanami",
    name: "Nanami Kento",
    nameJP: "七海建人",
    technique: "Ratio Technique",
    techniqueJP: "十劃呪法",
    bio: "Grade 1 sorcerer and former salaryman. His Ratio Technique divides an object into a 7:3 ratio and strikes the weak point. A man of unmatched composure.",
    color: "#d97706",
    glowColor: "#fbbf24",
    bgAnimation: "golden-lines",
    image: "/images/nanami-card.jpg",
    rank: "Grade 1",
    gradientDark: "from-amber-950 via-yellow-900 to-black",
    gradientLight: "from-amber-50 via-yellow-100 to-white",
  },
  {
    slug: "kenjaku",
    name: "Kenjaku",
    nameJP: "羂索",
    technique: "Brain Transplant / Cursed Spirit Manipulation",
    techniqueJP: "呪霊操術",
    bio: "An ancient sorcerer over a thousand years old who transplants his brain into other bodies. The true architect behind all of Jujutsu Kaisen's major conflicts.",
    color: "#0d9488",
    glowColor: "#2dd4bf",
    bgAnimation: "teal-static",
    image: "/images/kenjaku-card.jpg",
    rank: "Special Grade",
    gradientDark: "from-teal-950 via-cyan-900 to-black",
    gradientLight: "from-teal-50 via-cyan-100 to-white",
  },
  {
    slug: "nobara",
    name: "Nobara Kugisaki",
    nameJP: "釘崎野薔薇",
    technique: "Straw Doll Technique",
    techniqueJP: "芻霊呪法",
    bio: "Straw Doll Technique user who hammers nails and straw dolls with cursed energy. Fierce, resilient, and unflinchingly herself. Grade 3 sorcerer.",
    color: "#db2777",
    glowColor: "#f472b6",
    bgAnimation: "pink-blossoms",
    image: "/images/nobara-card.jpg",
    rank: "Grade 3",
    gradientDark: "from-pink-950 via-fuchsia-900 to-black",
    gradientLight: "from-pink-50 via-fuchsia-100 to-white",
  },
];

// ─── Export all 120 products (DEPRECATED: Now fetched from Supabase) ────────
// export const PRODUCTS: ProductMock[] = CHARACTERS.flatMap(generateProductsForCharacter);
