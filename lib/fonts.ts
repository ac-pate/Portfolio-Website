/**
 * Font Configuration
 * 
 * Centralized font setup for the entire application.
 * 
 * TO SWITCH FONTS: Change the FONT_SET constant below to one of:
 * - 'default' (Inter for headings, Poppins for body text)
 * - 'poppins' (Poppins for both headings and body)
 * - 'barlow' (Barlow Condensed - Bold, Condensed, Italic, Perfect for all caps and hollow effects)
 * 
 * All fonts use the same CSS variable names, so no other changes needed.
 * 
 * NOTE: All fonts are loaded at module scope (required by Next.js),
 * but only the selected font set is exported.
 */

import { 
  Inter, 
  JetBrains_Mono,
  Barlow_Condensed,
  Poppins,
} from 'next/font/google';

// ============================================
// FONT SELECTION - Change this value to switch fonts
// ============================================
type FontSet = 'default' | 'poppins' | 'barlow';
const FONT_SET: FontSet = 'default';

// ============================================
// All Font Loaders (must be called at module scope)
// ============================================

// Inter for headings (display font)
const interDisplay = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

// Poppins for body text (sans font)
const poppinsBody = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-geist-sans',
  display: 'swap',
});

// Poppins for headings (when using poppins option)
const poppinsDisplay = Poppins({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

// Barlow Condensed fonts (Perfect for all caps and hollow effects)
const barlowBody = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-geist-sans',
  display: 'swap',
});

const barlowDisplay = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

// Mono font (shared across all sets)
const jetbrainsMonoFont = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});

// ============================================
// Select and Export Active Fonts
// ============================================
export const jetbrainsMono = jetbrainsMonoFont;

// Conditionally export based on FONT_SET
export const inter = FONT_SET === 'default' ? poppinsBody
  : FONT_SET === 'poppins' ? poppinsBody
  : barlowBody;

export const spaceGrotesk = FONT_SET === 'default' ? interDisplay
  : FONT_SET === 'poppins' ? poppinsDisplay
  : barlowDisplay;
