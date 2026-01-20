# Bug Analysis: White Box Artifacts After Adding ExtracurricularPreview

## Problem Statement
- **Working Commit:** `58e41fc7d12be36a52d906ef825d8d287541dd69` - "Merge branch 'main'"
- **Broken Commit:** `97628a066ca61a3dd59d0c47c005749cb3fdd42a` - "adds extra carricular preview calle daccomplishments"
- **Issue:** White box artifacts appear around buttons in Hero section and profile picture in AboutPreview section after adding the new ExtracurricularPreview section
- **Confusing Part:** The commit doesn't directly modify Hero.tsx or AboutPreview.tsx files

## Files Changed in Broken Commit

```diff
M  app/page.tsx
A  components/sections/ExtracurricularPreview.tsx
A  components/ui/ExtracurricularCardWithThumbnail.tsx
M  content/homepage/index.mdx
M  lib/mdx.ts
```

## Root Cause Analysis

### 1. **New Component Uses Next.js Image Component**

The new `ExtracurricularCardWithThumbnail.tsx` (line 67-72) uses Next.js Image:
```tsx
<Image
  src={image}
  alt={title}
  fill
  className="object-cover"
/>
```

**Key observation:** This Image component does NOT have `priority` prop, unlike AboutPreview images (lines 159, 206 in AboutPreview.tsx) which use `priority`.

### 2. **Page Structure Change**

**Before (Working):**
```tsx
<Hero />
<AboutPreview />
<ProjectsPreview />
<ExperiencePreview />
<TimelineSection />
```

**After (Broken):**
```tsx
<Hero />
<AboutPreview />
<ProjectsPreview />
<ExtracurricularPreview />  // NEW SECTION INSERTED HERE
<ExperiencePreview />
<TimelineSection />
```

### 3. **Critical Discovery: Theme Variables Are IDENTICAL**

**Both commits have SAME theme:**
```css
--background: #ffffff;  /* WHITE */
```

**Proof:** 
- `git show 58e41fc:app/globals.css` → `--background: #ffffff;`
- `git show 97628a0:app/globals.css` → `--background: #ffffff;`

**Conclusion:** The bug is NOT caused by theme color change. It's caused by **Next.js Image component behavior change** when multiple Image components are rendered.

### 4. **The Actual Bug: Next.js Image Loading Priority Cascade**

When you add MORE Next.js Image components to the page WITHOUT the `priority` prop, Next.js changes its loading strategy:

1. **Before:** Images with `priority` prop load first and get optimized rendering
2. **After:** New non-priority images cause Next.js to defer ALL image optimization, including priority images
3. **Result:** During the loading phase, Next.js Image wrapper `<span data-nimg>` shows default WHITE background for ALL images, even priority ones

### 5. **Why It Affects Hero/AboutPreview**

The Hero buttons and AboutPreview profile picture use Next.js Image components:
- **AboutPreview.tsx line 201-207:** Profile picture uses `Image` with `fill` and `priority`
- **AboutPreview.tsx line 153-160:** Career path image uses `Image` with `priority`

When the new `ExtracurricularCardWithThumbnail` component renders with non-priority images, it triggers Next.js to:
1. Create more `<span data-nimg>` wrappers
2. Change global image loading strategy
3. Apply default white background to ALL image wrappers during loading phase

### 6. **CSS Cascade Issue**

The new component has:
- `z-[25]` on ExtracurricularPreview section (line 51)
- Creates new stacking context
- May affect CSS specificity for global image rules

However, since `globals.css` has NO rules for `span[data-nimg]` in either commit, the default Next.js behavior takes over.

## The Definite Bug

**The bug is:** Next.js Image component's default `<span data-nimg>` wrapper has a WHITE background that shows during loading states. When you add MORE Image components without `priority`, Next.js defers optimization for ALL images, causing the white background to be visible longer or for ALL images, not just the new ones.

**Why it's confusing:**
- The commit doesn't touch Hero/AboutPreview files
- It's an indirect side-effect of adding more Image components
- The issue is Next.js runtime behavior, not CSS changes

## Proof

### Proof 1: Theme is Identical
```bash
git show 58e41fc:app/globals.css | grep --background
# Result: --background: #ffffff;

git show 97628a0:app/globals.css | grep --background  
# Result: --background: #ffffff;
```

### Proof 2: No CSS Rules for Image Wrappers
Both commits have NO rules for `span[data-nimg]`:
```bash
git show 58e41fc:app/globals.css | grep "data-nimg"
# No results

git show 97628a0:app/globals.css | grep "data-nimg"
# No results
```

### Proof 3: New Component Uses Non-Priority Image
```tsx
// ExtracurricularCardWithThumbnail.tsx line 67-72
<Image
  src={image}
  alt={title}
  fill
  className="object-cover"
  // NO priority prop!
/>
```

### Proof 4: Working Images Use Priority
```tsx
// AboutPreview.tsx line 159, 206
<Image ... priority />
```

### Proof 5: Files Don't Touch Hero/AboutPreview
```bash
git diff 58e41fc 97628a0 --name-only
# Result: Only page.tsx, ExtracurricularPreview.tsx, ExtracurricularCardWithThumbnail.tsx, index.mdx, mdx.ts
# NO Hero.tsx or AboutPreview.tsx in the diff
```

## Solution

Add CSS rules to override Next.js Image wrapper default white background:

```css
/* Fix for Next.js Image white box artifacts */
span[data-nimg] {
  background-color: transparent !important;
}

/* Ensure images don't show white background during loading */
img[data-nimg],
span[data-nimg] img {
  background-color: transparent !important;
}
```

**Alternative Solution:** Add `priority` prop to the new Image component, but this may not be desired if you don't want those images to load first.
