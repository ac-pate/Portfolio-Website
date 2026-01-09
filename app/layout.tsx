/**
 * Root Layout Component
 * 
 * The main layout wrapper for all pages in the Next.js app.
 * Sets up fonts, theme provider, global navigation, and grain overlay.
 * 
 * This is the top-level component that wraps every page.
 * - Fonts: Inter (sans), JetBrains Mono (mono), Space Grotesk (display)
 * - Theme: Dark mode by default, system preference detection
 * - Global Components: Navbar, Footer, GrainOverlay
 */
import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { SoundProvider } from '@/components/providers/SoundProvider';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { GrainOverlay } from '@/components/ui/GrainOverlay';
import { siteConfig } from '@/lib/config';
import { inter, jetbrainsMono, spaceGrotesk } from '@/lib/fonts';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} | Portfolio`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'Computer Engineering',
    'Robotics',
    'Embedded Systems',
    'Software Development',
    'Portfolio',
    'Concordia University',
    'ROS2',
    'Autonomous Systems',
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: `${siteConfig.name} | Portfolio`,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} | Portfolio`,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${spaceGrotesk.variable} font-sans`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          forcedTheme="dark"
          disableTransitionOnChange
        >
          <SoundProvider>
            <div className="relative min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </SoundProvider>
        </ThemeProvider>
        {/* Film grain overlay - MUST be last element and outside ThemeProvider for highest z-index */}
        <GrainOverlay opacity={0.12} zIndex={99999} />
      </body>
    </html>
  );
}
