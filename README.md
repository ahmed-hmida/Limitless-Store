# Limitless Store 🌌

A premium, high-end e-commerce experience for Jujutsu Kaisen artifacts, built with Next.js, Tailwind CSS, and Supabase.

> [!IMPORTANT]
> **HANDOVER COMPLETE**: For the new session, please start by reading [PROJECT_STRUCTURE.md](file:///f:/Limitless-Store/PROJECT_STRUCTURE.md) for a full technical breakdown, including the SQL schema and animation logic.

## 🚀 Key Features

- **Cursed Particle Engine**: Custom HTML5 Canvas background with theme-adaptive (Red/Blue) sparks.
- **Glass-Magnifier Zoom**: A premium product inspection tool with a magnifying glass effect.
- **Character Domains**: Dynamic, character-themed product pages (Gojo, Sukuna, etc.).
- **Supabase Integration**: Real-time Auth, DB, and Wishlist syncing.
- **Zustand State**: persistent Cart, Wishlist, and Theme management.

## 🛠️ Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Setup Supabase**:
   - Create a project on [Supabase](https://supabase.com).
   - Run the SQL schema found in [PROJECT_STRUCTURE.md](file:///f:/Limitless-Store/PROJECT_STRUCTURE.md).
   - Add your environment variables to `.env.local`:
     ```env
     NEXT_PUBLIC_SUPABASE_URL=your_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
     ```

3. **Run Dev Server**:
   ```bash
   npm run dev
   ```

---

*Project by ahmed (USER) and Antigravity (AI).*
