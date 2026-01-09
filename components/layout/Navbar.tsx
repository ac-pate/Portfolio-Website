/**
 * Navbar Component
 * 
 * Main navigation bar with scroll-based active section highlighting.
 * Includes mobile menu, theme toggle, and smooth scroll to sections.
 * Uses glass-strong class for frosted glass effect.
 * 
 * Features:
 * - Sticky navbar that becomes glass on scroll
 * - Active section highlighting based on scroll position
 * - Mobile responsive menu
 * - Theme toggle integration
 */
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { SoundToggle } from '@/components/ui/SoundToggle';
import { useSound } from '@/components/providers/SoundProvider';
import { siteConfig } from '@/lib/config';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { playHoverSound, playClickSound } = useSound();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <motion.header
        data-navbar="main"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'py-3 glass-strong shadow-glass'
            : 'py-5 bg-transparent'
        )}
      >
        <nav className="section-container flex items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="relative group"
            onMouseEnter={playHoverSound}
            onClick={playClickSound}
          >
            <motion.span
              className="text-xl font-display font-bold tracking-tight"
              whileHover={{ scale: 1.02 }}
            >
              <span className="text-foreground">{siteConfig.name.split(' ')[0]}</span>
              <span className="text-accent">.</span>
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {siteConfig.navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onMouseEnter={playHoverSound}
                onClick={playClickSound}
                className={cn(
                  'relative px-4 py-2 text-sm font-medium transition-colors',
                  isActive(item.href)
                    ? 'text-accent'
                    : 'text-foreground-secondary hover:text-foreground'
                )}
              >
                {item.label}
                {isActive(item.href) && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-accent rounded-full shadow-glow-sm"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
            <div className="ml-4 pl-4 border-l border-border flex items-center gap-2">
              <SoundToggle />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-3">
            <SoundToggle />
            <motion.button
              whileTap={{ scale: 0.95 }}
              onHoverStart={playHoverSound}
              onClick={() => {
                playClickSound();
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
              className="p-2 rounded-lg hover:bg-background-secondary transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </motion.button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 md:hidden"
          >
            <div className="section-container py-4">
              <div className="glass-strong rounded-2xl p-4 shadow-glass-lg">
                <nav className="flex flex-col gap-1">
                  {siteConfig.navItems.map((item, index) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        onMouseEnter={playHoverSound}
                        onClick={() => {
                          playClickSound();
                          setIsMobileMenuOpen(false);
                        }}
                        className={cn(
                          'block px-4 py-3 rounded-lg transition-colors',
                          isActive(item.href)
                            ? 'text-accent bg-accent/10'
                            : 'text-foreground-secondary hover:text-foreground hover:bg-background-secondary'
                        )}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                </nav>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
