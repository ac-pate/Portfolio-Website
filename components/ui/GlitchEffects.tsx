/**
 * GlitchText Component
 * 
 * Creates a Studio Lumio-inspired glitch/distortion hover effect on text.
 * Uses chromatic aberration with red/cyan color channels that animate on hover.
 * 
 * Props:
 * - children: The text content to display
 * - as: HTML element to render (default: 'span')
 * - className: Additional CSS classes
 * - enableGlitch: Whether to enable the glitch effect (default: true)
 * 
 * Uses the .glitch-hover CSS class defined in globals.css
 */
'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

type ElementType = 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'div';

interface GlitchTextProps {
  children: string;
  as?: ElementType;
  className?: string;
  enableGlitch?: boolean;
  intensity?: 'low' | 'medium' | 'high';
}

export function GlitchText({
  children,
  as: Element = 'span',
  className,
  enableGlitch = true,
  intensity = 'medium',
}: GlitchTextProps) {
  const textRef = useRef<HTMLElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!enableGlitch || !isHovered || typeof window === 'undefined') return;

    // Optional: Add GSAP-powered advanced glitch effect
    const setupGlitchAnimation = async () => {
      try {
        const { default: gsap } = await import('gsap');
        const element = textRef.current;
        if (!element) return;

        // Create a subtle shake/distort animation
        const timeline = gsap.timeline({ repeat: -1, yoyo: true });
        
        const shakeAmount = intensity === 'high' ? 2 : intensity === 'medium' ? 1 : 0.5;
        
        timeline
          .to(element, {
            x: shakeAmount,
            duration: 0.05,
            ease: 'steps(1)',
          })
          .to(element, {
            x: -shakeAmount,
            duration: 0.05,
            ease: 'steps(1)',
          })
          .to(element, {
            x: 0,
            duration: 0.05,
            ease: 'steps(1)',
          });

        return () => {
          timeline.kill();
          gsap.set(element, { x: 0 });
        };
      } catch (error) {
        console.warn('GlitchText GSAP animation error:', error);
      }
    };

    setupGlitchAnimation();
  }, [isHovered, enableGlitch, intensity]);

  if (!enableGlitch) {
    return (
      <Element className={className}>
        {children}
      </Element>
    );
  }

  return (
    <Element
      ref={textRef as any}
      className={cn('glitch-hover', className)}
      data-text={children}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </Element>
  );
}

/**
 * GlitchImage Component
 * 
 * Applies distortion/glitch effect to images on hover.
 * Creates a chromatic aberration and shake effect.
 */
interface GlitchImageProps {
  src: string;
  alt: string;
  className?: string;
  enableGlitch?: boolean;
}

export function GlitchImage({
  src,
  alt,
  className,
  enableGlitch = true,
}: GlitchImageProps) {
  const imageRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!enableGlitch || !isHovered || typeof window === 'undefined') return;

    const setupImageGlitch = async () => {
      try {
        const { default: gsap } = await import('gsap');
        const element = imageRef.current;
        if (!element) return;

        // RGB split effect simulation
        const timeline = gsap.timeline({ repeat: -1, yoyo: true });
        
        timeline
          .to(element, {
            filter: 'hue-rotate(5deg) saturate(1.2)',
            x: 1,
            duration: 0.08,
            ease: 'steps(1)',
          })
          .to(element, {
            filter: 'hue-rotate(-5deg) saturate(0.9)',
            x: -1,
            duration: 0.08,
            ease: 'steps(1)',
          })
          .to(element, {
            filter: 'hue-rotate(0deg) saturate(1)',
            x: 0,
            duration: 0.08,
            ease: 'steps(1)',
          });

        return () => {
          timeline.kill();
          gsap.set(element, { filter: 'none', x: 0 });
        };
      } catch (error) {
        console.warn('GlitchImage GSAP animation error:', error);
      }
    };

    setupImageGlitch();
  }, [isHovered, enableGlitch]);

  return (
    <div
      ref={imageRef}
      className={cn('distort-hover relative overflow-hidden', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img 
        src={src} 
        alt={alt} 
        className="w-full h-full object-cover"
      />
      
      {/* Noise overlay on hover */}
      {isHovered && (
        <div 
          className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay"
          style={{
            backgroundImage: 'url(/noise.png)',
            backgroundSize: '128px 128px',
            animation: 'grainAnimation 0.3s steps(4) infinite',
          }}
        />
      )}
    </div>
  );
}
