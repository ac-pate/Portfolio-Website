'use client';

import { useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSound } from '@/components/providers/SoundProvider';

export function SoundToggle() {
  const { soundsEnabled, toggleSounds, playClickSound, playHoverSound } = useSound();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-lg bg-background-secondary" />
    );
  }

  const handleClick = () => {
    playClickSound();
    toggleSounds();
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onMouseEnter={playHoverSound}
      onClick={handleClick}
      className="relative w-9 h-9 rounded-lg bg-background-secondary border border-border flex items-center justify-center transition-colors hover:border-accent/50 focus-ring"
      aria-label="Toggle sounds"
    >
      {soundsEnabled ? (
        <Volume2 className="h-4 w-4" />
      ) : (
        <VolumeX className="h-4 w-4" />
      )}
    </motion.button>
  );
}
