'use client';

import { useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSound } from '@/components/providers/SoundProvider';

export function SoundToggle() {
  const { soundsEnabled, toggleSounds, playClickSound, playHoverSound, stopHoverSound } = useSound();
  const [mounted, setMounted] = useState(false);
  const [showAttention, setShowAttention] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Show attention-grabbing animation for 5 seconds on first load
    const timer = setTimeout(() => {
      setShowAttention(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-lg bg-background-secondary" />
    );
  }

  const handleClick = () => {
    playClickSound();
    toggleSounds();
    setHasInteracted(true);
    setShowAttention(false);
  };

  const handleMouseEnter = () => {
    playHoverSound();
    setShowAttention(false);
    if (!soundsEnabled) {
      setShowTooltip(true);
    }
  };

  const handleMouseLeave = () => {
    stopHoverSound();
    setShowTooltip(false);
  };

  return (
    <div 
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        className="relative w-9 h-9 rounded-lg bg-background-secondary border border-border flex items-center justify-center transition-colors hover:border-accent/50 focus-ring overflow-visible"
        aria-label="Toggle sounds"
        initial={false}
        animate={{
          boxShadow: showAttention && !hasInteracted
            ? [
                '0 0 0 0 rgba(128, 0, 32, 0.4)',
                '0 0 0 8px rgba(128, 0, 32, 0)',
                '0 0 0 0 rgba(128, 0, 32, 0)',
              ]
            : '0 0 0 0 rgba(128, 0, 32, 0)',
        }}
        transition={{
          boxShadow: {
            duration: 2,
            repeat: showAttention && !hasInteracted ? Infinity : 0,
            ease: 'easeInOut',
          },
        }}
      >
        {/* Pulsing glow effect on first load */}
        {showAttention && !hasInteracted && (
          <motion.div
            className="absolute inset-0 rounded-lg bg-accent/20"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 0.2, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}

        {/* Icon */}
        <motion.div
          animate={{
            scale: showAttention && !hasInteracted ? [1, 1.1, 1] : 1,
          }}
          transition={{
            duration: 1.5,
            repeat: showAttention && !hasInteracted ? Infinity : 0,
            ease: 'easeInOut',
          }}
        >
          {soundsEnabled ? (
            <Volume2 className="h-4 w-4 text-accent" />
          ) : (
            <VolumeX className="h-4 w-4" />
          )}
        </motion.div>

        {/* Attention badge - shows on first load */}
        <AnimatePresence>
          {showAttention && !hasInteracted && (
            <motion.div
              initial={{ opacity: 0, scale: 0, x: -10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0, x: -10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="absolute -right-2 -top-2 z-10"
            >
              <div className="relative">
                {/* Pulsing dot indicator */}
                <motion.div
                  className="w-3 h-3 rounded-full bg-accent shadow-glow-sm"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [1, 0.7, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
                {/* Outer pulse ring */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-accent"
                  animate={{
                    scale: [1, 1.8, 1],
                    opacity: [0.8, 0, 0.8],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Tooltip on hover - shows audio hint */}
      <AnimatePresence>
        {showTooltip && !soundsEnabled && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 hidden md:block pointer-events-none z-50"
          >
            <div className="bg-background-secondary border border-border rounded-lg px-3 py-1.5 text-xs text-foreground-secondary whitespace-nowrap shadow-lg">
              Enable audio
              <div className="absolute -top-1 right-4 w-2 h-2 bg-background-secondary border-l border-b border-border rotate-45" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
