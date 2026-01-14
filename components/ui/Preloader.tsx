'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export function Preloader() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isReadyToEnter, setIsReadyToEnter] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showCurtain, setShowCurtain] = useState(false);

  // Check if we should show preloader (only on home page)
  const isHomePage = pathname === '/';

  useEffect(() => {
    // Skip all logic if not on home page
    if (!isHomePage) return;
    const handleVideoReady = () => {
      setIsReadyToEnter(true);
    };

    window.addEventListener('hero-video-ready', handleVideoReady);

    // Progress counter simulation - MUCH FASTER
    const interval = setInterval(() => {
      setProgress(prev => {
        if (isReadyToEnter) return 100;
        if (prev >= 95) return prev;
        // Faster progression
        const speed = prev < 40 ? 8 : prev < 70 ? 5 : prev < 85 ? 3 : 2;
        return Math.min(prev + speed, 95);
      });
    }, 40);

    const fallback = setTimeout(() => {
      setIsReadyToEnter(true);
    }, 5000);

    return () => {
      window.removeEventListener('hero-video-ready', handleVideoReady);
      clearTimeout(fallback);
      clearInterval(interval);
    };
  }, [isReadyToEnter, isHomePage]);

  useEffect(() => {
    // Skip if not on home page
    if (!isHomePage) return;
    
    if (isReadyToEnter) {
      setProgress(100);
      // Delay before curtain reveal - FASTER
      const curtainTimer = setTimeout(() => {
        setShowCurtain(true);
        // Dispatch event when curtain starts opening so hero can begin animations
        window.dispatchEvent(new CustomEvent('preloader-done'));
      }, 150);
      // Delay before fully hiding preloader - FASTER
      const hideTimer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      return () => {
        clearTimeout(curtainTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [isReadyToEnter, isHomePage]);

  // Only show preloader on home page - moved AFTER all hooks
  if (!isHomePage) return null;
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {/* Top curtain */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: showCurtain ? '-100%' : 0 }}
        transition={{ 
          duration: 0.8, 
          ease: [0.76, 0, 0.24, 1],
        }}
        className="absolute top-0 left-0 right-0 h-1/2 bg-black"
        style={{ willChange: 'transform' }}
      />
      
      {/* Bottom curtain */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: showCurtain ? '100%' : 0 }}
        transition={{ 
          duration: 0.8, 
          ease: [0.76, 0, 0.24, 1],
        }}
        className="absolute bottom-0 left-0 right-0 h-1/2 bg-black"
        style={{ willChange: 'transform' }}
      />

      {/* Loading content - centered, fades out before curtains split */}
      <AnimatePresence>
        {!showCurtain && (
          <motion.div
            key="loading-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-[101] flex flex-col items-center justify-center"
          >
            {/* Percentage counter with neon glow effect */}
            <motion.div 
              className="relative mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <span 
                className="text-3xl md:text-3xl lg:text-4xl font-['Poppins'] font-bold italic text-accent tabular-nums"
                style={{ 
                  textShadow: '0 0 20px rgba(var(--accent-rgb), 1), 0 0 40px rgba(var(--accent-rgb), 0.6)',
                  letterSpacing: '-0.02em'
                }}
              >
                {Math.round(progress)}%
              </span>
            </motion.div>
            
            {/* Full-width horizontal loading bar */}
            <div className="w-full px-8 md:px-16 lg:px-24">
              <motion.div 
                className="relative w-full h-[2px] overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                
                
                {/* Progress bar with glow */}
                <motion.div
                  className="absolute inset-y-0 left-0 bg-accent"
                  style={{ 
                    width: `${progress}%`,
                    boxShadow: `
                      0 0 8px rgba(var(--accent-rgb), 1),
                      0 0 16px rgba(var(--accent-rgb), 0.8),
                      0 0 24px rgba(var(--accent-rgb), 0.5)
                    `,
                    transition: 'width 0.15s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                />
                
                {/* Glow pulse at progress head */}
                <motion.div
                  className="absolute top-1/2 -translate-y-1/2 w-2 h-3 rounded-full bg-accent"
                  style={{ 
                    left: `calc(${progress}% - 4px)`,
                    boxShadow: `
                      0 0 12px rgba(var(--accent-rgb), 1),
                      0 0 20px rgba(var(--accent-rgb), 0.9),
                      0 0 30px rgba(var(--accent-rgb), 0.7)
                    `,
                    transition: 'left 0.15s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
