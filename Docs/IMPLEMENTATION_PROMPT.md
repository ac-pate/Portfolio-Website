# Implementation Prompt for AI Agent

## CONTEXT

You are implementing changes to an existing Next.js 14 portfolio website. The codebase uses:
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Content:** MDX files in `content/` directory
- **Current Glow Effect:** Simple box-shadow (`0 0 40px rgba(...)`) in `app/globals.css` lines 123-136

**Current Project Structure:**
- `app/globals.css` - All styling, including `.glow-card` hover effect
- `components/ui/Timeline.tsx` - Current timeline component (vertical line with alternating left/right cards)
- `components/sections/TimelineSection.tsx` - Timeline section wrapper
- `lib/mdx.ts` - Content management functions, includes `getTimeline()` which returns `TimelineItem[]`

**Timeline Data Structure:**
```typescript
interface TimelineItem {
  type: 'project' | 'job' | 'education';
  date: string;
  endDate?: string;
  title: string;
  subtitle: string;
  description: string;
  tags?: string[];
  slug?: string;
  link?: string;
  image?: string;
}
```

---

## TASK 1: Apply Grainy Gradient Glow Effect

### Objective
Replace the current simple box-shadow glow with a grainy gradient glow effect based on the CSS-Tricks tutorial: https://css-tricks.com/grainy-gradients/

### Current Implementation (to be replaced)
**File:** `app/globals.css` (lines 119-136)

```css
.glow-card {
  @apply relative;
  isolation: isolate;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.glow-card:hover {
  border-color: rgba(var(--accent-rgb), 0.6) !important;
  box-shadow: 
    0 0 40px rgba(var(--accent-rgb), 0.7),
    inset 0 0 0 1px rgba(var(--accent-rgb), 0.2);
}
```

### Requirements

1. **Keep the box-shadow spread:** The glow should extend `40px` beyond the card (matching current `0 0 40px`)

2. **Use CSS-Tricks technique:**
   - SVG noise filter with `feTurbulence` (fractalNoise)
   - Combine gradient + SVG noise in CSS `background`
   - Apply `filter: contrast(170%) brightness(1000%)` to boost grain
   - Use `inset: -40px` on pseudo-element to match box-shadow spread

3. **Gradient fade:**
   - Smooth radial gradient from burgundy to transparent
   - Should fade smoothly, not hard rectangle edge
   - Gradient should match the glow spread (40px)

4. **Grain settings:**
   - Coarse grain (like the second image reference)
   - `baseFrequency` around 1.5-2.5 for coarse grain
   - `numOctaves` around 2-3 for more separated grains
   - Grains should spread out more as they fade

5. **Implementation approach:**
   - Use `::after` pseudo-element (not `::before`)
   - Position with `inset: -40px` to match box-shadow spread
   - Layer: gradient FIRST, then SVG noise (order matters per CSS-Tricks)
   - Apply filter to boost contrast/brightness
   - Animate grain movement (non-static)

6. **Keep existing features:**
   - Thin burgundy border on hover (`border-color: rgba(var(--accent-rgb), 0.6)`)
   - Inner shadow (`inset 0 0 0 1px`)
   - Smooth transitions

### Reference Implementation Pattern (from CSS-Tricks)

```css
.element::after {
  content: '';
  position: absolute;
  inset: -40px; /* Matches box-shadow spread */
  background: 
    radial-gradient(ellipse at 50% 50%, 
      rgba(var(--accent-rgb), 0.6) 0%, 
      rgba(var(--accent-rgb), 0.3) 40%, 
      transparent 80%),
    url('data:image/svg+xml;utf8,<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="1.5" numOctaves="2" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noiseFilter)"/></svg>');
  background-size: 100% 100%, 350px 350px;
  filter: contrast(170%) brightness(1000%);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.element:hover::after {
  opacity: 1;
}
```

### Color the Grain
- Use `feColorMatrix` to convert white noise to burgundy color
- Matrix values: `0.5 0 0 0 0.125  0 0 0 0 0  0 0 0 0 0.125  0 0 0 1 0`

### Animation
- Animate grain movement with `background-position` keyframes
- Use `steps()` for choppy TV static effect
- Duration: 0.15-0.2s, infinite loop

### Expected Result
- Smooth radial gradient fade (not hard rectangle)
- Coarse, animated grain texture
- Glow extends 40px beyond card (matching box-shadow)
- Grain is colored burgundy, not white
- No white residue or artifacts

---

## TASK 2: Set Up Vercel Deployment

### Objective
Configure automatic deployment to Vercel with custom domain `achalpatel.xyz`. User has Vercel account but needs full setup.

### Requirements

1. **Create `vercel.json` configuration file** (if needed for Next.js 14)

2. **Set up Git integration:**
   - Instructions for connecting GitHub repo to Vercel
   - Enable automatic deployments on push

3. **Configure custom domain:**
   - Domain: `achalpatel.xyz`
   - Step-by-step instructions for adding domain in Vercel dashboard
   - DNS configuration instructions (what records to add at domain registrar)

4. **Environment variables (if any needed):**
   - Document any required env vars
   - How to add them in Vercel dashboard

5. **Build settings:**
   - Framework: Next.js
   - Build command: `npm run build` (already in package.json)
   - Output directory: `.next` (default for Next.js)
   - Install command: `npm install`

6. **Post-deployment:**
   - Verify site is live
   - Test custom domain
   - Verify automatic deployments work

### Deliverables
- `vercel.json` file (if needed)
- Step-by-step deployment guide
- DNS configuration instructions
- Troubleshooting common issues

---

## TASK 3: Timeline Redesign with GSAP Scroll-Based Animation

### Current Problem
- Current timeline is cliché vertical line with alternating left/right cards
- Too sparse - can't show concurrent activities
- Doesn't visualize overlapping projects/jobs
- Single column doesn't show multiple things happening simultaneously

### Requirements

1. **GSAP Scroll-Based Animation (Primary Mode):**
   - Use **GreenSock Animation Platform (GSAP)** with **ScrollTrigger** plugin
   - Organize timeline by **academic terms**: Fall, Winter, Summer, Fall (cyclical)
   - Each term occupies **full viewport height** (100vh) - user scrolls through terms sequentially
   - **Scroll snapping:** Each term "pins" to viewport until scroll completes, then advances to next term
   - Terms progress chronologically: Fall 2022 → Winter 2023 → Summer 2023 → Fall 2023, etc.
   - Visual representation: As user scrolls, they move through time periods term-by-term

2. **Multi-Column Layout:**
   - **Column 1:** Projects (`type === 'project'`)
   - **Column 2:** Jobs/Experience (`type === 'job'`)
   - **Column 3:** Extracurricular/Competitions (`type === 'extracurricular'` or custom type)
   - Each column displays cards that occurred during the current term
   - Cards appear in appropriate column based on `TimelineItem.type`

3. **Toggle Switch Feature:**
   - **Location:** Timeline section heading (in `TimelineSection.tsx` or `SectionHeading.tsx`)
   - **Two modes:**
     - **GSAP Mode (default):** Scroll-based term-by-term progression (full-screen sections)
     - **Static Mode:** Traditional scroll behavior - cards appear as user scrolls normally
   - **Toggle implementation:** React state management (`useState`) to switch between modes
   - **UI:** Toggle switch component (styled to match film aesthetic)
   - **Behavior:** When toggled, timeline re-renders with appropriate layout/animation

4. **New Timeline Card Design:**
   - **CRITICAL: DO NOT reuse existing card components** (`ProjectCard`, `ExperienceCard`, `ProjectCardWithThumbnail`, etc.)
   - **Create NEW dedicated timeline card component:** `components/ui/TimelineCard.tsx`
   - **Purpose:** Cards specifically designed for timeline display (different from project/experience detail pages)
   - **Design requirements:**
     - Compact, information-dense layout
     - Optimized for multi-column grid display
     - Should show: title, subtitle, date range, thumbnail (if available), tags (first 2-3)
     - Maintain glassmorphism (`glass` class) and glow-card effects (`glow-card` class) for consistency
     - Responsive: Adapts to column width (may be narrower than full-page cards)
   - **Props interface:**
     ```typescript
     interface TimelineCardProps {
       item: TimelineItem;
       // Optional: variant for different card sizes if needed
     }
     ```
   - **Styling:** Use Tailwind classes, maintain film aesthetic (dark background, burgundy accents)

### Current Timeline Data
- `getTimeline()` returns array of `TimelineItem[]`
- **Location:** `lib/mdx.ts` lines 195-240
- **Current types included:** `'project'`, `'job'`, `'education'`
- **Note:** Extracurricular items exist (`getExtracurricular()`) but are NOT currently included in timeline
- Items have: `type`, `date`, `endDate`, `title`, `subtitle`, `description`, `tags`, `image`, `link`
- Items are sorted by date (newest first currently) - **may need to reverse for timeline visualization**
- **Date field mapping:**
  - Projects: `date` and `endDate` from frontmatter
  - Jobs: `startDate` → `date`, `endDate` from frontmatter
  - Education: `startDate` → `date`, `endDate` from frontmatter
- **To include Extracurricular:** Modify `getTimeline()` to also include `getExtracurricular()` items with `type: 'extracurricular'` (or add new type)

### Design Constraints
- Must work on mobile (responsive)
- **DO NOT reuse existing card components** - create new timeline-specific cards
- Should maintain film aesthetic (dark background, burgundy accents)
- Should be visually modern and elegant
- GSAP animations must be performant and smooth

### Implementation Approach: GSAP Scroll-Based Timeline

**Layout Structure (GSAP Mode):**
```
┌─────────────────────────────────────────────────┐
│  [Toggle: GSAP ↔ Static]                       │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │  FALL 2022                                 │ │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────────┐ │ │
│  │  │Projects │ │  Jobs   │ │Extracurricular│ │ │
│  │  │ ┌─────┐ │ │ ┌─────┐ │ │ ┌─────────┐ │ │ │
│  │  │ │Card │ │ │ │Card │ │ │ │  Card  │ │ │ │
│  │  │ └─────┘ │ │ └─────┘ │ │ │ └─────────┘ │ │ │
│  │  └─────────┘ └─────────┘ └─────────────┘ │ │
│  └───────────────────────────────────────────┘ │
│  [Scroll down → Next term pins to viewport]    │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │  WINTER 2023                              │ │
│  │  [Same column structure]                  │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  [Continues for each term...]                  │
└─────────────────────────────────────────────────┘
```

**GSAP Mode Implementation Details:**
- **Term Detection:** Parse dates to determine academic term (Fall: Sep-Dec, Winter: Jan-Apr, Summer: May-Aug)
- **Full-Screen Sections:** Each term section is `100vh` (full viewport height)
- **ScrollTrigger Pin:** Use `gsap.ScrollTrigger.create()` with `pin: true` to pin each term section
- **Scroll Snapping:** Use `ScrollTrigger.snap()` or CSS `scroll-snap-type` for smooth term transitions
- **Column Layout:** 3 columns side-by-side (Projects | Jobs | Extracurricular)
- **Card Display:** Only show cards that fall within the current term's date range
- **Term Header:** Display term name and year (e.g., "Fall 2022") prominently at top of each section
- **Animation:** Cards fade in/out as terms change (GSAP `to()` or `from()` animations)

**Static Mode Implementation Details:**
- **Traditional Scroll:** Normal page scroll behavior (no pinning, no snapping)
- **Same Layout:** Multi-column grid layout (Projects | Jobs | Extracurricular)
- **Card Positioning:** Cards positioned vertically based on date (chronological order)
- **Scroll Reveal:** Cards fade in as they enter viewport (Framer Motion `whileInView`)
- **No Term Sections:** Continuous scroll, no full-screen term sections

**Visual Features:**
- **Term Headers:** Large, prominent term labels (e.g., "Fall 2022", "Winter 2023")
- **Column Headers:** Subtle column labels ("Projects", "Jobs", "Extracurricular")
- **Timeline Cards:** New compact card design optimized for timeline display
- **Glassmorphism:** Maintain existing glass effect on cards
- **Glow Effects:** Cards use `glow-card` class for hover effects
- **Smooth Transitions:** GSAP animations for term changes, Framer Motion for static mode

**Responsive Behavior:**
- **Desktop:** 3 columns side-by-side, full GSAP scroll experience
- **Tablet:** 2 columns, GSAP mode may be simplified or disabled
- **Mobile:** Single column stack, consider disabling GSAP mode (default to static)

### Implementation Requirements

1. **Install GSAP Dependencies:**
   - Install `gsap` package: `npm install gsap`
   - Import `gsap` and `ScrollTrigger` in timeline component
   - Register ScrollTrigger plugin: `gsap.registerPlugin(ScrollTrigger)`

2. **Term Detection & Grouping Logic:**
   - **Create utility function** `lib/timeline.ts` or add to `lib/utils.ts`:
     ```typescript
     // Term detection function
     function getAcademicTerm(date: string): { term: 'Fall' | 'Winter' | 'Summer', year: number } {
       const d = new Date(date);
       const month = d.getMonth() + 1; // 1-12
       const year = d.getFullYear();
       
       // Academic calendar:
       // Fall: September (9) - December (12)
       // Winter: January (1) - April (4)
       // Summer: May (5) - August (8)
       if (month >= 9 || month <= 12) {
         return { term: 'Fall', year: month >= 9 ? year : year - 1 };
       } else if (month >= 1 && month <= 4) {
         return { term: 'Winter', year };
       } else {
         return { term: 'Summer', year };
       }
     }
     
     // Grouping function
     function groupItemsByTerm(items: TimelineItem[]): Map<string, TimelineItem[]> {
       const grouped = new Map<string, TimelineItem[]>();
       
       items.forEach(item => {
         const { term, year } = getAcademicTerm(item.date);
         const termKey = `${term} ${year}`; // e.g., "Fall 2022"
         
         if (!grouped.has(termKey)) {
           grouped.set(termKey, []);
         }
         grouped.get(termKey)!.push(item);
       });
       
       return grouped;
     }
     ```
   - **Sort terms chronologically:** Convert term keys to sortable format, sort oldest → newest
   - **Include Extracurricular:** Modify `getTimeline()` in `lib/mdx.ts` to include `getExtracurricular()` items with `type: 'extracurricular'`
   - **Handle Date Ranges:** For items with `endDate`, check if item spans multiple terms (if so, include in all relevant terms)

3. **Create New Timeline Card Component:**
   - **File:** `components/ui/TimelineCard.tsx` (NEW - do not reuse existing cards)
   - **Props:** Accept `TimelineItem` data
   - **Design:** Compact, information-dense card optimized for timeline
   - **Display:**
     - Thumbnail image (if available) - small, square
     - Title (prominent)
     - Subtitle (secondary)
     - Date range (e.g., "Sep 2022 - Dec 2022")
     - Tags (first 2-3 tags, small chips)
   - **Styling:** Use `glass` and `glow-card` classes for consistency
   - **Responsive:** Adapts to column width

4. **GSAP Scroll-Based Implementation:**
   - **Component:** `components/ui/Timeline.tsx` (replace existing)
   - **Structure:**
     - Map over grouped terms to create term sections
     - Each section: `min-height: 100vh`, contains 3-column grid
     - Term header at top of each section
   - **ScrollTrigger Setup:**
     ```typescript
     // Example structure (use 'use client' directive)
     'use client';
     import { useEffect, useRef } from 'react';
     import gsap from 'gsap';
     import { ScrollTrigger } from 'gsap/ScrollTrigger';
     
     gsap.registerPlugin(ScrollTrigger);
     
     // In component:
     const termSectionsRef = useRef<HTMLDivElement[]>([]);
     
     useEffect(() => {
       termSectionsRef.current.forEach((section, index) => {
         ScrollTrigger.create({
           trigger: section,
           start: "top top",
           end: "+=100vh", // Each section is 100vh
           pin: true,
           pinSpacing: true,
           scrub: 1, // Smooth scrubbing
           // Optional: Add onEnter/onLeave callbacks for card animations
         });
       });
       
       return () => {
         // Cleanup: kill all ScrollTriggers
         ScrollTrigger.getAll().forEach(trigger => trigger.kill());
       };
     }, [isGSAPMode, terms]);
     ```
   - **Card Filtering:** For each term section, filter cards by date range (check if card's date falls within term's date range)
   - **Column Assignment:** Map cards to appropriate column based on `type` property
   - **Animations:** Cards fade in when term section becomes active (use GSAP `from()` or `to()` with opacity)
   - **Scroll Snapping:** Use CSS `scroll-snap-type: y mandatory` on container and `scroll-snap-align: start` on sections

5. **Static Mode Implementation:**
   - **Same component:** `components/ui/Timeline.tsx` with conditional rendering
   - **Layout:** Multi-column grid (Projects | Jobs | Extracurricular)
   - **Card Positioning:** Sort all items chronologically, display in columns
   - **Scroll Reveal:** Use Framer Motion `whileInView` for card entrance animations
   - **No Pinning:** Normal scroll behavior, no GSAP ScrollTrigger

6. **Toggle Switch Component:**
   - **Location:** `components/sections/TimelineSection.tsx` (add toggle near heading)
   - **State Management:** 
     ```typescript
     const [isGSAPMode, setIsGSAPMode] = useState(true);
     ```
   - **UI Component:** Styled toggle switch (match film aesthetic)
     - Use Tailwind classes for styling
     - Active state: Burgundy accent color (`bg-accent`)
     - Inactive state: Muted gray
     - Smooth transition animation
   - **Labels:** "Scroll-Based" (GSAP) / "Static" (traditional)
   - **Behavior:** 
     - Pass `isGSAPMode` prop to `Timeline` component
     - When toggling from GSAP → Static: Kill all ScrollTrigger instances, re-render with static layout
     - When toggling from Static → GSAP: Re-initialize ScrollTrigger instances
   - **Cleanup:** 
     ```typescript
     useEffect(() => {
       if (!isGSAPMode) {
         // Kill all ScrollTriggers when switching to static mode
         ScrollTrigger.getAll().forEach(trigger => trigger.kill());
       }
     }, [isGSAPMode]);
     ```
   - **Mobile Consideration:** On mobile, default to `isGSAPMode = false` (static mode) due to viewport constraints

7. **Column Structure:**
   - **Column 1:** Projects (`type === 'project'`)
   - **Column 2:** Jobs/Experience (`type === 'job'`)
   - **Column 3:** Extracurricular/Competitions (`type === 'extracurricular'` or custom)
   - **Note:** Education items can be included in Jobs column or separate column (user preference)

8. **Styling:**
   - Maintain film aesthetic (dark background, burgundy accents)
   - Term headers: Large, bold, prominent (e.g., `text-4xl font-display`)
   - Column headers: Subtle labels above each column
   - Timeline cards: New compact design with glassmorphism
   - Toggle switch: Styled to match site aesthetic (burgundy accent when active)
   - Responsive: Mobile defaults to static mode or single column

9. **Performance Considerations:**
   - **GSAP Cleanup:** Use `useEffect` cleanup to kill ScrollTrigger instances on unmount
   - **Lazy Loading:** Consider lazy loading GSAP only when GSAP mode is active
   - **Mobile Optimization:** Disable GSAP on mobile devices (use `window.innerWidth` check)
   - **Smooth Animations:** Use `will-change` CSS property for animated elements

### Deliverables
- **GSAP Installation:** Add `gsap` to `package.json` dependencies
- **New Timeline Card Component:** `components/ui/TimelineCard.tsx` (dedicated timeline card design)
- **Redesigned Timeline Component:** `components/ui/Timeline.tsx` with GSAP ScrollTrigger implementation
- **Toggle Switch:** Added to `components/sections/TimelineSection.tsx` for mode switching
- **Helper Functions:** 
  - `getAcademicTerm()` - Determines term from date
  - `groupItemsByTerm()` - Groups timeline items by academic term
  - Add to `lib/utils.ts` or create `lib/timeline.ts`
- **Timeline Data Update:** Modify `getTimeline()` in `lib/mdx.ts` to include extracurricular items
- **GSAP Mode:** Full-screen term sections with scroll pinning and snapping
- **Static Mode:** Traditional multi-column scroll layout
- **Responsive Layout:** 
  - Desktop: 3 columns, full GSAP experience
  - Tablet: 2 columns, simplified GSAP or static
  - Mobile: Single column, static mode (GSAP disabled)
- **Documentation:** Comments explaining GSAP setup, term detection logic, and toggle implementation

---

## EXECUTION INSTRUCTIONS

1. **Start with Task 1:** Implement grainy gradient glow first
   - Test that it works and looks correct
   - Ensure no white residue
   - Verify smooth gradient fade

2. **Then Task 2:** Set up Vercel deployment
   - Create configuration files
   - Provide step-by-step instructions
   - Test deployment process

3. **Finally Task 3:** Redesign timeline
   - Analyze current timeline data structure
   - Propose design approach
   - Implement new timeline component
   - Ensure it's responsive and performant

## CRITICAL NOTES

- **Do not remove existing functionality** unless explicitly replacing it
- **Test all changes** - especially the glow effect on actual cards
- **Maintain code comments** - all files should have file-level comments
- **Follow existing patterns** - use same naming conventions, component structure
- **Keep it simple** - don't over-engineer solutions

## FILES TO MODIFY

1. `app/globals.css` - Update `.glow-card` styles (Task 1)
2. `vercel.json` - Create if needed (Task 2)
3. `package.json` - Add `gsap` dependency (Task 3)
4. `components/ui/TimelineCard.tsx` - **CREATE NEW** timeline-specific card component (Task 3)
5. `components/ui/Timeline.tsx` - **REDESIGN** with GSAP ScrollTrigger and toggle support (Task 3)
6. `components/sections/TimelineSection.tsx` - Add toggle switch UI (Task 3)
7. `lib/mdx.ts` - Update `getTimeline()` to include extracurricular items (Task 3)
8. `lib/utils.ts` or `lib/timeline.ts` - Add term detection and grouping utilities (Task 3)

## REFERENCE LINKS

- CSS-Tricks Grainy Gradients: https://css-tricks.com/grainy-gradients/
- Vercel Next.js Deployment: https://vercel.com/docs/frameworks/nextjs
- Vercel Custom Domains: https://vercel.com/docs/concepts/projects/domains
- GSAP Documentation: https://greensock.com/docs/
- GSAP ScrollTrigger: https://greensock.com/docs/v3/Plugins/ScrollTrigger
- GSAP ScrollTrigger Pin: https://greensock.com/docs/v3/Plugins/ScrollTrigger/pin

---

**END OF PROMPT**

