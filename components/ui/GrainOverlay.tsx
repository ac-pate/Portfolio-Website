/**
 * GrainOverlay Component
 * 
 * PRONOUNCED, visible animated film grain overlay using GSAP.
 * This is NOT subtle - it's heavy analog film grain that's clearly visible.
 * 
 * Uses noise.png as a repeating background with animated position.
 * Sits on top of all content with z-index, pointer-events disabled.
 */
'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

interface GrainOverlayProps {
  /** Opacity of the grain overlay (0-1). Default 0.3 for pronounced grain. */
  opacity?: number;
  /** Z-index for layering. Default 9999 to sit on top of everything. */
  zIndex?: number;
  /** Size of the grain texture in pixels. Larger = more pronounced. Default 300. */
  grainSize?: number;
}

export function GrainOverlay({ 
  opacity = 0.55, 
  zIndex = 9999,
  grainSize = 1000,
}: GrainOverlayProps) {
  const grainRef = useRef<HTMLDivElement>(null);
  const { theme, resolvedTheme } = useTheme();
  
  // Determine if we're in light mode
  const isLightMode = resolvedTheme === 'light' || theme === 'light';

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let cleanup: (() => void) | undefined;

    const initGrainAnimation = async () => {
      try {
        const { default: gsap } = await import('gsap');
        const grain = grainRef.current;
        if (!grain) return;

        // Create infinite grain animation using GSAP
        // Fast stepping animation for film-like flicker
        const tl = gsap.timeline({ repeat: -1 });

        // Random position jumps for pronounced grain movement
        tl.to(grain, { backgroundPosition: '0% 0%', duration: 0.05, ease: 'none' })
          .to(grain, { backgroundPosition: '20% -15%', duration: 0.05, ease: 'none' })
          .to(grain, { backgroundPosition: '-10% 25%', duration: 0.05, ease: 'none' })
          .to(grain, { backgroundPosition: '30% -5%', duration: 0.05, ease: 'none' })
          .to(grain, { backgroundPosition: '-20% 10%', duration: 0.05, ease: 'none' })
          .to(grain, { backgroundPosition: '15% -25%', duration: 0.05, ease: 'none' })
          .to(grain, { backgroundPosition: '-5% 20%', duration: 0.05, ease: 'none' })
          .to(grain, { backgroundPosition: '25% 5%', duration: 0.05, ease: 'none' });

        cleanup = () => {
          tl.kill();
          gsap.killTweensOf(grain);
        };
      } catch (error) {
        console.warn('GrainOverlay GSAP error:', error);
      }
    };

    initGrainAnimation();

    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  return (
    <div
      ref={grainRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: '-50%',
        left: '-50%',
        width: '200vw',
        height: '200vh',
        backgroundImage: isLightMode ? 'url(/noise_light.png)' : 'url(/noise.png)',
        backgroundRepeat: 'repeat',
        backgroundSize: `${grainSize}px ${grainSize}px`,
        opacity: opacity,
        zIndex: zIndex,
        pointerEvents: 'none',
        // Using multiply for light mode, screen for dark mode
        mixBlendMode: isLightMode ? 'multiply' : 'screen',
        // Add contrast to make grain more pronounced
        filter: isLightMode ? 'contrast(600%) brightness(100%)' : 'contrast(110%) brightness(300%)',
        // filter: 'contrast(100%) brightness(300%)', // medium grain
      }}
    />
  );
}
