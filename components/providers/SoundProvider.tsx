'use client';

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';

interface SoundContextType {
  soundsEnabled: boolean;
  toggleSounds: () => void;
  playHoverSound: () => void;
  stopHoverSound: () => void;
  playClickSound: () => void;
  playFlickerSound: () => void;
  stopFlickerSound: () => void;
  fadeBackgroundAudio: (targetVolume: number, duration?: number) => void;
  getBackgroundAudio: () => HTMLAudioElement | null;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export function useSound() {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within SoundProvider');
  }
  return context;
}

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [soundsEnabled, setSoundsEnabled] = useState(false); // Default to OFF
  const bgAudioRef = useRef<HTMLAudioElement | null>(null);
  const hoverAudioRef = useRef<HTMLAudioElement | null>(null);
  const clickAudioRef = useRef<HTMLAudioElement | null>(null);
  const flickerAudioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentHoverAudioRef = useRef<HTMLAudioElement | null>(null);
  const hasBeenEnabledRef = useRef<boolean>(false); // Track if sounds have ever been enabled
  const soundsEnabledRef = useRef<boolean>(soundsEnabled);

  // Sync ref with state
  useEffect(() => {
    soundsEnabledRef.current = soundsEnabled;
  }, [soundsEnabled]);

  // Initialize audio elements
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Background music
      const bgAudio = new Audio('/sounds/bg-music.mp3');
      bgAudio.loop = true;
      bgAudio.volume = 0.1; // Lower volume for background
      bgAudio.preload = 'auto';
      bgAudioRef.current = bgAudio;

      // Hover sound effect
      const hoverAudio = new Audio('/sounds/hover-sound.mp3');
      hoverAudio.volume = 0.8;
      hoverAudio.preload = 'auto';
      hoverAudioRef.current = hoverAudio;

      // Click sound effect
      const clickAudio = new Audio('/sounds/click-sound.mp3');
      clickAudio.volume = 0.5;
      clickAudio.preload = 'auto';
      clickAudioRef.current = clickAudio;

      // Flicker sound effect
      const flickerAudio = new Audio('/sounds/camera-flicker.mp3');
      flickerAudio.volume = 0.15;
      flickerAudio.preload = 'auto';
      flickerAudio.loop = true;
      flickerAudioRef.current = flickerAudio;

      return () => {
        // Cleanup fade interval
        if (fadeIntervalRef.current) {
          clearInterval(fadeIntervalRef.current);
          fadeIntervalRef.current = null;
        }
        // Cleanup audio elements
        if (bgAudioRef.current) {
          bgAudioRef.current.pause();
          bgAudioRef.current.src = '';
          bgAudioRef.current = null;
        }
        if (hoverAudioRef.current) {
          hoverAudioRef.current.pause();
          hoverAudioRef.current.src = '';
          hoverAudioRef.current = null;
        }
        if (clickAudioRef.current) {
          clickAudioRef.current.pause();
          clickAudioRef.current.src = '';
          clickAudioRef.current = null;
        }
        if (flickerAudioRef.current) {
          flickerAudioRef.current.pause();
          flickerAudioRef.current.src = '';
          flickerAudioRef.current = null;
        }
      };
    }
  }, []); // Only run once on mount

  // Ensure background music respects the soundsEnabled state
  useEffect(() => {
    if (!bgAudioRef.current) return;
    
    // If sounds are disabled and audio is playing, pause it
    if (!soundsEnabled && !bgAudioRef.current.paused) {
      bgAudioRef.current.pause();
      bgAudioRef.current.volume = 0;
      
      // Clear any active fade intervals
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
        fadeIntervalRef.current = null;
      }
    }
  }, [soundsEnabled]);

  // Note: Removed auto-start effect since sounds are now OFF by default
  // Background music will only start when user clicks the toggle button

  // Toggle sounds
  const toggleSounds = useCallback(() => {
    setSoundsEnabled((prev) => {
      const newValue = !prev;
      
      if (!bgAudioRef.current) return newValue;

      // Clear any existing fade interval
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
        fadeIntervalRef.current = null;
      }

      if (newValue) {
        // Start background music with fade in
        try {
          if (bgAudioRef.current) {
            // Only restart from beginning on first enable
            if (!hasBeenEnabledRef.current) {
              bgAudioRef.current.currentTime = 0; // Start from beginning on first enable
              hasBeenEnabledRef.current = true;
            }
            
            bgAudioRef.current.volume = 0;
            bgAudioRef.current.play().catch((e) => {
              // Silently handle play errors (file might not exist)
            });
            
            // Fade in to 0.1 volume (matching the initialized volume)
            fadeIntervalRef.current = setInterval(() => {
              if (bgAudioRef.current && bgAudioRef.current.volume < 0.1) {
                bgAudioRef.current.volume = Math.min(bgAudioRef.current.volume + 0.05, 0.1);
              } else {
                if (fadeIntervalRef.current) {
                  clearInterval(fadeIntervalRef.current);
                  fadeIntervalRef.current = null;
                }
              }
            }, 100);
          }
        } catch (e) {
          // Silently handle errors
        }
      } else {
        // Immediately stop background music when toggling off
        if (bgAudioRef.current) {
          const audio = bgAudioRef.current;
          
          // Quick fade out for smoother audio stop
          const startVolume = audio.volume;
          let step = 0;
          const totalSteps = 10;
          
          fadeIntervalRef.current = setInterval(() => {
            step++;
            if (audio) {
              audio.volume = Math.max(startVolume * (1 - step / totalSteps), 0);
              
              if (step >= totalSteps || audio.volume === 0) {
                audio.pause();
                audio.volume = 0; // Ensure volume is at 0
                if (fadeIntervalRef.current) {
                  clearInterval(fadeIntervalRef.current);
                  fadeIntervalRef.current = null;
                }
              }
            }
          }, 30); // Faster fade out (300ms total)
        }
      }
      
      return newValue;
    });
  }, []);

  // Play hover sound
  const playHoverSound = useCallback(() => {
    if (!soundsEnabledRef.current) return;
    
    try {
      // Stop any currently playing hover sound
      if (currentHoverAudioRef.current) {
        currentHoverAudioRef.current.pause();
        currentHoverAudioRef.current.currentTime = 0;
        currentHoverAudioRef.current = null;
      }
      
      // Create a new Audio instance and play
      const hoverAudio = new Audio('/sounds/hover-sound.mp3');
      hoverAudio.volume = 0.8; // Lower volume to prevent overpowering
      hoverAudio.loop = false; // Ensure it doesn't loop
      currentHoverAudioRef.current = hoverAudio;
      
      // Auto-cleanup when sound ends
      hoverAudio.addEventListener('ended', () => {
        if (currentHoverAudioRef.current === hoverAudio) {
          currentHoverAudioRef.current = null;
        }
      });
      
      // Try to play immediately
      hoverAudio.play().catch((error) => {
        // Silently handle errors (autoplay blocked, file missing, etc.)
        currentHoverAudioRef.current = null;
      });
    } catch (e) {
      // Ignore audio errors
      currentHoverAudioRef.current = null;
    }
  }, []); // Stabilized

  // Stop hover sound
  const stopHoverSound = useCallback(() => {
    if (currentHoverAudioRef.current) {
      currentHoverAudioRef.current.pause();
      currentHoverAudioRef.current.currentTime = 0;
      currentHoverAudioRef.current = null;
    }
  }, []);

  // Play click sound
  const playClickSound = useCallback(() => {
    if (!soundsEnabledRef.current || !clickAudioRef.current) return;
    
    try {
      // Clone the audio to allow overlapping plays
      const clickClone = clickAudioRef.current.cloneNode() as HTMLAudioElement;
      clickClone.volume = clickAudioRef.current.volume;
      clickClone.currentTime = 0;
      clickClone.play().catch((e) => {
        // Silently handle play errors
      });
      // Clean up after playback
      clickClone.addEventListener('ended', () => {
        clickClone.remove();
      });
    } catch (e) {
      // Fallback to regular play if clone fails
      try {
        clickAudioRef.current.currentTime = 0;
        clickAudioRef.current.play().catch(() => {});
      } catch (err) {
        // Ignore audio errors
      }
    }
  }, []); // Stabilized

  // Play flicker sound (loops while hovering)
  const playFlickerSound = useCallback(() => {
    if (!soundsEnabledRef.current || !flickerAudioRef.current) return;
    
    try {
      flickerAudioRef.current.currentTime = 0;
      flickerAudioRef.current.play().catch((e) => {
        // Silently handle play errors
      });
    } catch (e) {
      // Ignore audio errors
    }
  }, []); // Stabilized

  // Stop flicker sound
  const stopFlickerSound = useCallback(() => {
    if (flickerAudioRef.current) {
      flickerAudioRef.current.pause();
      flickerAudioRef.current.currentTime = 0;
    }
  }, []);

  // Fade background audio to target volume
  const fadeBackgroundAudio = useCallback((targetVolume: number, duration: number = 1000) => {
    if (!bgAudioRef.current) return;
    
    const audio = bgAudioRef.current;
    const startVolume = audio.volume;
    const volumeDiff = targetVolume - startVolume;
    const startTime = Date.now();
    
    // Clear any existing fade interval
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }
    
    const fadeInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease in-out
      const easedProgress = progress < 0.5
        ? 2 * progress * progress
        : -1 + (4 - 2 * progress) * progress;
      
      audio.volume = startVolume + volumeDiff * easedProgress;
      
      if (progress >= 1) {
        audio.volume = targetVolume;
        clearInterval(fadeInterval);
        fadeIntervalRef.current = null;
        
        // If volume is 0, pause the audio
        if (targetVolume === 0) {
          audio.pause();
        } else if (audio.paused && soundsEnabledRef.current) {
          // If fading in and sounds are enabled, ensure it's playing
          audio.play().catch(() => {});
        }
      }
    }, 16); // ~60fps
    
    fadeIntervalRef.current = fadeInterval;
  }, []); // Stabilized

  // Get background audio element reference
  const getBackgroundAudio = useCallback(() => {
    return bgAudioRef.current;
  }, []);

  return (
    <SoundContext.Provider
      value={{
        soundsEnabled,
        toggleSounds,
        playHoverSound,
        stopHoverSound,
        playClickSound,
        playFlickerSound,
        stopFlickerSound,
        fadeBackgroundAudio,
        getBackgroundAudio,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
}
