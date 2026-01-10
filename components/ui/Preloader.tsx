'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [isReadyToEnter, setIsReadyToEnter] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleVideoReady = () => {
      setIsReadyToEnter(true);
    };

    window.addEventListener('hero-video-ready', handleVideoReady);

    // Progress counter simulation
    const interval = setInterval(() => {
      setProgress(prev => {
        if (isReadyToEnter) return 100;
        if (prev >= 98) return prev;
        // Fast at first, slows down
        const diff = (100 - prev) / 20;
        return Math.min(prev + diff, 98);
      });
    }, 100);

    const fallback = setTimeout(() => {
      setIsReadyToEnter(true);
    }, 5000);

    return () => {
      window.removeEventListener('hero-video-ready', handleVideoReady);
      clearTimeout(fallback);
      clearInterval(interval);
    };
  }, [isReadyToEnter]);

  useEffect(() => {
    if (isReadyToEnter) {
      setProgress(100);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isReadyToEnter]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-48 h-[1px]">
              <div className="absolute inset-0 bg-accent/10" />
              <motion.div
                className="absolute inset-0 bg-accent"
                style={{ 
                  scaleX: progress / 100,
                  transformOrigin: "center",
                  boxShadow: '0 0 16px rgba(var(--accent-rgb), 0.7), 0 0 32px rgba(var(--accent-rgb), 0.4)'
                }}
              />
            </div>
            
            <div className="w-12 text-center">
              <span 
                className="text-[16px] font-poppins font-extrabold italic text-accent/90"
                style={{ textShadow: '0 0 16px rgba(var(--accent-rgb), 0.7), 0 0 32px rgba(var(--accent-rgb), 0.4)' }}
              >
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
