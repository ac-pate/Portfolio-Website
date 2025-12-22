# Portfolio Site - Complete Customization Guide

## 📁 Folder Structure Overview

```
portfolio_site/
├── app/                    # Next.js pages & routes
│   ├── page.tsx           # Homepage (Hero + sections)
│   ├── layout.tsx         # Root layout (Navbar, Footer, Theme)
│   ├── globals.css        # ⚙️ ALL STYLING SETTINGS (glow, opacity, colors, grain)
│   ├── admin/             # Decap CMS admin interface
│   ├── projects/          # Project listing & detail pages
│   ├── experience/        # Job/experience pages
│   ├── extracurricular/   # Extracurricular listing & detail pages
│   ├── education/         # Education pages
│   └── about/             # About page
│
├── components/            # React components
│   ├── sections/          # Page sections (Hero, About, Projects, etc.)
│   ├── layout/            # Navbar, Footer
│   └── ui/                # Reusable UI components
│       ├── AnimatedBackground.tsx  # ⚙️ Homepage background (video/canvas)
│       ├── GrainOverlay.tsx        # Mouse tracking for glow effects
│       ├── ProjectCard.tsx          # Project card (uses unified glow-card)
│       ├── ExperienceCard.tsx       # Experience card (uses unified glow-card)
│       └── ProjectCardWithThumbnail.tsx  # Compact project card (uses unified glow-card)
│
├── content/               # 📝 ALL CONTENT (MDX files)
│   ├── projects/          # Project descriptions (.mdx files)
│   ├── jobs/              # Job/experience descriptions
│   ├── education/         # Education entries
│   ├── extracurricular/  # Competitions, workshops, photo shoots, etc.
│   └── volunteer/         # Volunteer work
│
├── public/                # 🖼️ ALL STATIC ASSETS
│   ├── admin/            # Decap CMS config (config.yml)
│   ├── projects/          # All project media (images, gifs, videos)
│   ├── jobs/              # All job/experience media (logos, photos, videos)
│   ├── education/         # All education media (logos, certificates)
│   ├── extracurricular/   # All extracurricular media
│   ├── volunteer/          # All volunteer work media
│   ├── hero/              # Hero section backgrounds (images/videos)
│   └── noise.svg          # Grain texture SVG
│
└── lib/
    ├── config.ts          # ⚙️ Site config (name, social links, nav items)
    └── mdx.ts             # Content management functions
```

---

## 🎨 UNIFIED CARD SYSTEM

**All cards use the same glow effect!** The `.glow-card` class in `app/globals.css` is the single source of truth.

### Card Components:
- `ProjectCard.tsx` - Full project cards with large images
- `ExperienceCard.tsx` - Job/experience cards with thumbnails
- `ProjectCardWithThumbnail.tsx` - Compact project cards

**All use:** `className="glow-card glass"` for unified hover effects.

**To change glow effect:** Edit `.glow-card::before` in `app/globals.css` (see below).

---

## ⚙️ ALL TWEAKABLE SETTINGS

### 1. **Grainy Glow Effect** (Card Hover)
**File**: `app/globals.css`  
**Section**: `.glow-card::before` (lines ~98-140)

```css
.glow-card::before {
  /* TWEAKABLE: Grain texture intensity */
  baseFrequency="0.65"  /* ← Change to 0.5 (less grain) or 0.8 (more grain) */
  numOctaves="6"        /* ← Change to 4 (less detail) or 8 (more detail) */
  
  /* TWEAKABLE: Glow intensity */
  filter: contrast(560%) brightness(100%);  /* ← Adjust contrast/brightness */
  
  /* TWEAKABLE: Glow spread size */
  width: calc(100% + 80px);  /* ← Change +80px to +120px (larger) or +40px (smaller) */
  height: calc(100% + 80px);
  
  /* TWEAKABLE: Animation speed */
  animation: tvStatic 0.15s steps(4) infinite;  /* ← Change 0.15s (faster) or 0.25s (slower) */
}

.glow-card:hover {
  /* TWEAKABLE: Border glow intensity */
  box-shadow: 
    0 0 40px rgba(var(--accent-rgb), 0.7),  /* ← Change 0.7 (0-1) for intensity */
    inset 0 0 0 1px rgba(var(--accent-rgb), 0.15);  /* ← Change 0.15 for inner glow */
}
```

**What it does:** Creates a grainy, CRT-style glow effect on card hover with animated grain texture.

---

### 2. **Film Grain Background** (Static, Non-Animated)
**File**: `app/globals.css`  
**Section**: `body::before` (lines ~223-235)

```css
body::before {
  background: url('/noise.svg');
  /* TWEAKABLE: Grain visibility */
  opacity: 0.03;  /* ← Change to 0.05 (more visible) or 0.01 (barely visible) */
  
  /* TWEAKABLE: Blend mode */
  mix-blend-mode: overlay;  /* ← Options: overlay, multiply, screen, soft-light */
}
```

**What it does:** Adds a subtle film grain texture to the entire page background (not animated).

---

### 3. **Film Aesthetic Background Color** (Dark Mode)
**File**: `app/globals.css`  
**Section**: `.dark` (lines ~19-26)

```css
.dark {
  /* TWEAKABLE: Background color (film static black) */
  --background: #1C1C1C;  /* ← Change to #0a0a0a (pitch black) or #242424 (lighter) */
  --background-secondary: #242424;  /* ← Adjust secondary background */
}
```

**What it does:** Sets the dark mode background to a film aesthetic static black (not pure black).

---

### 4. **Accent Color** (Burgundy Glow)
**File**: `app/globals.css`  
**Section**: `:root` (lines ~6-17)

```css
:root {
  /* TWEAKABLE: Main accent color */
  --accent: #800020;  /* ← Deep Burgundy - change to any color */
  --accent-light: #a3002a;  /* ← Lighter variant */
  --accent-dark: #5c0017;  /* ← Darker variant */
  --accent-rgb: 128, 0, 32;  /* ← RGB values for rgba() - update if accent changes */
}
```

**Also update:** `tailwind.config.ts` accent colors if changed.

---

### 5. **Glass Morphism** (Navbar & Cards)
**File**: `app/globals.css`  
**Section**: `.glass` and `.glass-strong` (lines ~50-84)

```css
/* Dark mode glass cards */
.dark .glass {
  background: rgba(15, 15, 15, 0.3) !important;  /* ← Change 0.3 (0-1) for transparency */
  border-color: rgba(255, 255, 255, 0.1) !important;
}

/* Dark mode navbar glass */
.dark .glass-strong {
  background: rgba(10, 10, 10, 0.7) !important;  /* ← Change 0.7 (0-1) for transparency */
}
```

**What it does:** Creates frosted glass effect on cards and navbar.

---

### 6. **Button Hover Effects**
**File**: `app/globals.css`  
**Section**: `.btn-primary` and `.btn-secondary` (lines ~159-180)

```css
.btn-primary:hover {
  box-shadow: 0 0 30px rgba(var(--accent-rgb), 0.5);  /* ← Change 0.5 for glow intensity */
}

.btn-secondary:hover {
  box-shadow: 0 0 25px rgba(var(--accent-rgb), 0.25);  /* ← Change 0.25 for glow intensity */
}
```

---

### 7. **Homepage Background** (Video/Canvas)
**File**: `components/sections/Hero.tsx`  
**File**: `components/ui/AnimatedBackground.tsx`

```tsx
// In Hero.tsx
<AnimatedBackground 
  showVideo={false}  // ← Set to true to enable video
  videoSrc="/hero/hero-bg.mp4"  // ← Path to video (in public/hero/)
/>

// In AnimatedBackground.tsx
// TWEAKABLE: Video opacity
className="... opacity-30"  // ← Change 30 (0-100)

// TWEAKABLE: Gradient overlay strength
<div className="... bg-gradient-to-b from-transparent via-background/50 to-background" />
// ← Change /50 to /30 (lighter) or /70 (darker)
```

---

### 8. **Site Configuration**
**File**: `lib/config.ts`

```typescript
export const siteConfig: SiteConfig = {
  name: 'Achal Patel',  // ← Your name
  title: '...',  // ← SEO title
  email: '...',  // ← Contact email
  social: {
    github: '...',  // ← GitHub URL
    linkedin: '...',  // ← LinkedIn URL
  },
  navItems: [  // ← Navigation menu items
    { label: 'About', href: '/about' },
    // Add/remove/reorder items here
  ],
};
```

---

## 📝 CONTENT MANAGEMENT

### Option 1: Decap CMS (Visual Editor) - RECOMMENDED

**Access:** Navigate to `/admin` on your deployed site

**Setup:**
1. Deploy to Vercel/Netlify
2. Enable Git Gateway (for GitHub authentication)
3. Access `/admin` to login and manage content

**Features:**
- Visual editor for all content types
- Drag-and-drop image uploads
- No code editing required
- Changes commit to GitHub automatically

**Config:** `public/admin/config.yml` defines all content types and fields.

---

### Option 2: Manual MDX Files

**Location:** `content/{type}/{slug}.mdx`

**Structure:**
```mdx
---
title: "Project Name"
description: "Short description"
date: "2024-01-01"
tags: ["Tag1", "Tag2"]
image: "/projects/image.jpg"
---

Full markdown content here...
```

**To add new content:**
1. Create new `.mdx` file in appropriate folder
2. Add frontmatter (YAML at top)
3. Write markdown content
4. Add images to `public/{type}/` folder
5. Reference images in frontmatter: `image: "/projects/your-image.jpg"`

---

## 🖼️ MEDIA ORGANIZATION

**All media organized by content type:**

- **Projects**: `public/projects/` (images, gifs, videos)
- **Jobs**: `public/jobs/` (logos, photos, videos)
- **Education**: `public/education/` (logos, certificates)
- **Extracurricular**: `public/extracurricular/` (all media types)
- **Volunteer**: `public/volunteer/` (all media types)
- **Hero**: `public/hero/` (background images/videos)

**Naming:** Use lowercase with hyphens (e.g., `project-name-hero.jpg`)

---

## 🚀 QUICK REFERENCE TABLE

| What to Change | File Location | Section/Line |
|---------------|---------------|--------------|
| **Card glow effect** | `app/globals.css` | `.glow-card::before` (~98-140) |
| **Film grain background** | `app/globals.css` | `body::before` (~223-235) |
| **Background color (dark)** | `app/globals.css` | `.dark` (~19-26) |
| **Accent color** | `app/globals.css` | `:root` (~6-17) |
| **Glass opacity** | `app/globals.css` | `.glass` (~50-84) |
| **Button glow** | `app/globals.css` | `.btn-primary` (~159-180) |
| **Homepage background** | `components/ui/AnimatedBackground.tsx` | Video/canvas settings |
| **Site name/nav** | `lib/config.ts` | `siteConfig` object |
| **Project content** | `content/projects/*.mdx` | MDX files |
| **Job content** | `content/jobs/*.mdx` | MDX files |
| **Education content** | `content/education/*.mdx` | MDX files |

---

## 🎯 UNIFIED EFFECTS SYSTEM

**All cards, buttons, and interactive elements use the same effect system:**

1. **Cards:** Use `glow-card` class → grainy glow on hover
2. **Buttons:** Use `btn-primary` or `btn-secondary` → accent glow on hover
3. **Glass effects:** Use `glass` or `glass-strong` → frosted glass appearance

**To change effects globally:**
- Edit CSS classes in `app/globals.css`
- All components using these classes will update automatically

**No need to edit individual components!**

---

## 📚 ADDITIONAL RESOURCES

- **Content guide**: See `public/CONTENT_GUIDE.md` for detailed MDX formatting
- **Decap CMS docs**: https://decapcms.org/docs/
- **Testing**: Run `npm run dev` to see changes locally
- **Deployment**: Push to GitHub → Auto-deploys on Vercel/Netlify

---

## 🔧 TROUBLESHOOTING

**Glow effect not showing:**
- Check that cards have `glow-card` class
- Verify `GrainOverlay` component is in `app/layout.tsx`
- Check browser console for CSS errors

**Grain too visible/not visible:**
- Adjust `opacity` in `body::before` (line ~233)
- Try different `mix-blend-mode` values

**Background not film aesthetic:**
- Verify `.dark` background is `#1C1C1C` (not `#0a0a0a`)
- Check that dark mode is enabled

**Decap CMS not working:**
- Ensure site is deployed (not just local)
- Enable Git Gateway in Vercel/Netlify settings
- Check `public/admin/config.yml` exists

---

**Last Updated:** 2024-12-20  
**Version:** 2.0 (Unified Effects System + Decap CMS)

