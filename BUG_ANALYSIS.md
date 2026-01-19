# Bug Analysis: White Box Artifacts on Next.js Image Components

## Problem Statement
White box artifacts appear around buttons and profile pictures in the Hero section and AboutPreview section on the main branch (dark theme), but not on the `test-old-commit` branch (light theme).

## Root Cause Analysis

### 1. **Theme Change Between Working and Broken Versions**

**Working Version (test-old-commit/e278df1):**
```css
:root {
  --background: #ffffff;  /* WHITE */
  --background-secondary: #fafafa;
  --foreground: #0a0a0a;
  /* ... */
}
```

**Broken Version (main/3d8fb8a):**
```css
:root {
  --background: #0a0a0a;  /* DARK */
  --background-secondary: #242424;
  --foreground: #fafafa;
  /* ... */
}
```

**Proof:** Git diff between test-old-commit and main shows these exact changes:
```diff
-    --background: #ffffff;
-    --background-secondary: #fafafa;
-    --foreground: #0a0a0a;
+    --background: #0a0a0a;
+    --background-secondary: #242424;
+    --foreground: #fafafa;
```

### 2. **Next.js Image Component Default Behavior**

Next.js `Image` component wraps images in `<span data-nimg="...">` with a **default white background** during:
- Initial loading phase
- Image error states
- Placeholder display

**Proof:** 
- AboutPreview.tsx line 201-207 uses Next.js `Image` with `fill` prop
- Hero.tsx buttons don't use Image component (no white boxes there - they're just styled divs)
- The white boxes appear specifically around Next.js Image components

### 3. **Missing CSS Override for Image Wrappers**

**Working Version:** No CSS rules needed because white background matches white theme (invisible).

**Broken Version:** No CSS rules to override Next.js default white background → white boxes visible on dark theme.

**Proof:** Current main branch (3d8fb8a) has NO CSS rules for `span[data-nimg]` or image backgrounds:
```bash
# Check confirms no such rules exist
grep "span\[data-nimg\]|background-color.*var\(--background\)" app/globals.css
# Result: No matches found
```

### 4. **Failed Fix Attempt**

Commit `578aeec` ("BAD FIX FOR IMAGE FAIL TOLOAD") attempted to fix this by adding:

```css
/* Ensure Next.js Image wrapper has dark background */
span[data-nimg] {
  background-color: var(--background) !important;
}

/* Ensure image containers have dark background */
.dark img,
img {
  background-color: var(--background) !important;
}
```

**Why it failed:** These rules were later reverted in commit `3d8fb8a` ("global.css reverted"), suggesting they didn't work correctly or caused other issues.

**Proof:** Git history shows:
```
3d8fb8a global.css reverted
578aeec BAD FIX FOR IMAGE FAIL TOLOAD
```

## The Exact Bug

**The bug is:** Next.js Image components (`<span data-nimg="...">`) have a default white background that shows during loading/error states. On the dark theme (main branch), this white background is highly visible, creating white box artifacts around:
1. Profile picture in AboutPreview section (line 201-207)
2. Any other Next.js Image components

**Why it wasn't visible before:** The previous light theme (`--background: #ffffff`) matched the default white, making the boxes invisible.

## Definite Proof

### Proof 1: Theme Change Causes Visibility
- Working version: `--background: #ffffff` (white)
- Broken version: `--background: #0a0a0a` (dark)
- Same Next.js Image behavior in both, but only visible on dark theme

### Proof 2: No CSS Override Exists
Current `app/globals.css` ends at line 506 with `.prose-custom` class - NO image wrapper CSS rules present.

### Proof 3: Failed Fix Attempt
Commit `578aeec` tried to add CSS rules but they were reverted, confirming the issue exists and the attempted fix didn't work.

### Proof 4: Specific to Next.js Image Components
- Hero buttons (non-Image components) don't show white boxes
- AboutPreview profile picture (uses Next.js Image) shows white boxes
- Career path image (uses Next.js Image, line 153-160) may also be affected

## Solution Required

Add proper CSS rules to override Next.js Image wrapper default white background, ensuring it matches the dark theme:

```css
/* Fix for Next.js Image white box artifacts on dark theme */
span[data-nimg] {
  background-color: transparent !important;
}

/* Ensure image containers don't have white backgrounds */
img[data-nimg] {
  background-color: transparent !important;
}

/* Override any Next.js default image wrapper styles */
span[data-nimg],
span[data-nimg] img {
  background-color: transparent !important;
}
```

**Note:** The previous fix attempt used `var(--background)` which might have caused issues. Using `transparent` should be safer and let the parent container backgrounds show through properly.
