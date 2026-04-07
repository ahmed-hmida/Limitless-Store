# Project Structure & Technical Handover: Limitless Store 🌌

This document serves as the source of truth for the "Limitless Store" e-commerce platform.

## 1. Core Architecture
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + Framer Motion (Animations)
- **Database/Auth**: Supabase (Postgres)
- **State Management**: Zustand (Cart, Wishlist, Theme, Auth)
- **Canvas**: HTML5 Canvas for the "Cursed Particle" system.

## 2. Database Schema (Supabase)

### Products Table
- `id` (TEXT, PK): Standardized as slug-based IDs (e.g., `gojo-tshirt-01`).
- `name` (TEXT)
- `slug` (TEXT)
- `description` (TEXT)
- `price` (NUMERIC)
- `category` (TEXT)
- `subcategory` (TEXT)
- `image_url` (TEXT)
- `images` (TEXT[]): Array of primary gallery images.
- `gallery_images` (TEXT[]): Extended gallery images.
- `sizes` (TEXT[]): Available artifact sizes.
- `colors` (TEXT[]): Available artifact colors.
- `character_slug` (TEXT): FK to character context.
- `is_featured` (BOOLEAN): Controls homepage visibility.
- `stock` (INTEGER)

### User Favorites Table
- `user_id` (UUID, FK): References `auth.users`.
- `product_id` (TEXT, FK): References `products.id`.
- **Policy**: Row Level Security (RLS) is enabled. Users can only `SELECT`, `INSERT`, and `DELETE` their own favorites.

## 3. UI State & Features

### Cursed Particle System
- **HeroSection.tsx**: Uses a theme-adaptive (Red/Blue) particle system on HTML5 Canvas.
- **AnimatedBackground.tsx**: Character-specific background animations (Infinity Void, Fire Embers, etc.).

### Premium Artifact Inspection
- **ImageZoom.tsx**: A high-end magnifying tool with backdrop-blur and a "glass lens" refraction effect.
- **Product Details**: Uses `gallery_images` for a dynamic carousel and character-themed accents.

### Arsenal (Wishlist) Sync
- **Navbar**: Displays a real-time counter badge for favorited items.
- **Persistence**: Favorites are optimistically updated in Zustand and synced with Supabase when the user is logged in.

## 4. Completed & Cleaned
- [x] **120 Products**: Full catalog synced to Supabase (12 characters, 10 items each).
- [x] **Legacy Removal**: All hardcoded `PRODUCTS` arrays and generation logic have been removed.
- [x] **ID Standardization**: Switched from UUID to `TEXT` for easier slug-based lookups.
- [x] **Dynamic Landing**: The Homepage now fetches featured artifacts directly from the database.

## 5. Next Steps
- **Production Deployment**: Configure Supabase Environment Variables on host.
- **Dynamic SEO**: Generate `sitemap.xml` based on the 120 products in the DB.
- **Order Management**: Implement the backend for "Manifesting" (checkout) logic.

## 6. Latest Updates (Memory Log) 🧠

### Refined Gojo Aesthetic
- **Color Correction**: Updated all Gojo-themed text to a consistent "Icy Blue" (`#b9e2ff`).
- **Shadow Elimination**: Replaced the previous Sukuna-styled red/pink `text-shadow` artifacts with a dedicated `.slash-reveal-blue` CSS class in `phase3.css`.
- **Hero Section**: Applied these changes to both Japanese (`無量空処`) and English (`Infinite Void`) text in `HeroSection.tsx`.

### Advanced Theme Toggle
- **Sliding Switch**: Replaced the simple button with a custom `ThemeToggle.tsx` component.
- **Interactions**: Uses a standard click-to-slide mechanism (powered by `framer-motion`) with a thumb that transitions between Sun and Moon positions smoothly using a spring animation.

### Global Domain Logic (Curtain)
- **Architecture**: Moved the `SplitHero` (curtain) from the Home page index to a global `GlobalCurtain.tsx` in `layout.tsx`.
- **UX**: This ensures users are greeted with the Gojo/Sukuna choice on their first visit regardless of the landing page.
- **Domain Reset**: The "Re-align Domains" button in the Navbar is now globally functional, allowing users to return to the selection screen from any page.

### Toast Notification System
- **Global Toast**: Implemented a `Toast.tsx` system managed via `useThemeStore`.
- **Checkout Feedback**: After a successful order in `CartPage.tsx`, a high-visibility, glassmorphic toast slides in from the top-center to confirm the action.
- **Aesthetics**: Features specialized icons for success/error/info and a visual progress bar indicating the 4-second timeout.

