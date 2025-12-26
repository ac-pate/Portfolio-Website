/**
 * HorizontalGallery Component
 * 
 * A scroll-driven horizontal gallery that uses GSAP ScrollTrigger.
 * Vertical scroll controls horizontal movement through a gallery of images.
 * 
 * Features:
 * - Pins the gallery section during horizontal scrolling
 * - Maps vertical scroll distance to horizontal translation
 * - Smooth, inertial motion with no snapping
 * - Bounded (not infinite)
 * - No UI controls (no arrows, dots, buttons)
 */
'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface HorizontalGalleryProps {
  /** Array of image URLs to display in the gallery */
  images: string[] | Array<{ image: string }>;
  /** Optional alt text prefix for images (will append index) */
  altPrefix?: string;
  /** Optional heading text to display at the top center */
  heading?: string;
}

export function HorizontalGallery({ images, altPrefix = 'Gallery image', heading = 'Gallery' }: HorizontalGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [imageDimensions, setImageDimensions] = useState<Array<{ width: number; height: number }>>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Normalize images array - handle both string[] and Array<{image: string}>
  const normalizedImages = images.map((img) => (typeof img === 'string' ? img : img.image));

  // Load image dimensions to preserve aspect ratios
  useEffect(() => {
    if (normalizedImages.length === 0) return;

    const loadImageDimensions = async () => {
      const dimensions: Array<{ width: number; height: number }> = [];
      
      // Load all image dimensions
      const promises = normalizedImages.map((imageSrc) => {
        return new Promise<{ width: number; height: number }>((resolve) => {
          const img = new window.Image();
          img.onload = () => {
            resolve({ width: img.naturalWidth, height: img.naturalHeight });
          };
          img.onerror = () => {
            // Fallback dimensions if image fails to load
            resolve({ width: 600, height: 450 });
          };
          img.src = imageSrc;
        });
      });

      const loadedDimensions = await Promise.all(promises);
      setImageDimensions(loadedDimensions);
      setIsLoaded(true);
    };

    loadImageDimensions();
  }, [normalizedImages]);

  useEffect(() => {
    if (!containerRef.current || !galleryRef.current || normalizedImages.length === 0 || !isLoaded) return;

    const container = containerRef.current;
    const gallery = galleryRef.current;

    const setupScrollTrigger = () => {
      // Wait for next frame to ensure DOM is fully rendered
      requestAnimationFrame(() => {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const gap = 6;
        
        // Use consistent height for all cards (70% of viewport height, max 500px) - slightly smaller
        const cardHeight = Math.min(viewportHeight * 0.7, 500);
        
        // Calculate actual widths based on image aspect ratios
        let totalWidth = 0;
        const cardWidths: number[] = [];
        
        imageDimensions.forEach((dim) => {
          const aspectRatio = dim.width / dim.height;
          const width = cardHeight * aspectRatio;
          // Constrain max width to prevent extremely wide images
          const constrainedWidth = Math.min(width, viewportWidth * 0.85);
          cardWidths.push(constrainedWidth);
          totalWidth += constrainedWidth;
        });
        
        // Add gaps between images
        totalWidth += (normalizedImages.length - 1) * gap;
        
        // Set gallery width
        gallery.style.width = `${totalWidth}px`;

        // Wait one more frame for width to be applied
        requestAnimationFrame(() => {
          // Get actual rendered width (might differ slightly due to rounding)
          const actualTotalWidth = gallery.scrollWidth;
          
          // FIX 2: Calculate scroll distance so last image centers correctly
          const lastImageWidth = cardWidths[cardWidths.length - 1];
          
          // Position of last image's center in the gallery coordinate system
          const lastImageCenter = actualTotalWidth - lastImageWidth / 2;
          const viewportCenter = viewportWidth / 2;
          
          // The maximum translation needed to center the last image
          const maxTranslate = Math.max(0, lastImageCenter - viewportCenter);
          
          // Scroll distance should match the translation distance
          const scrollDistance = Math.max(maxTranslate, 1000);

          // Kill existing ScrollTrigger if any
          if (scrollTriggerRef.current) {
            scrollTriggerRef.current.kill();
          }

          // Create ScrollTrigger that pins the container and animates horizontal movement
          scrollTriggerRef.current = ScrollTrigger.create({
            trigger: container,
            start: 'top top',
            end: `+=${scrollDistance}px`,
            pin: true,
            scrub: 1, // Smooth scrubbing
            anticipatePin: 1,
            onUpdate: (self) => {
              // Map scroll progress (0-1) to horizontal translation
              const progress = self.progress;
              const translateX = -progress * maxTranslate;
              gsap.set(gallery, { x: translateX });
            },
          });

          // Refresh ScrollTrigger after setup
          ScrollTrigger.refresh();
        });
      });
    };

    setupScrollTrigger();

    // Handle window resize
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (scrollTriggerRef.current) {
          scrollTriggerRef.current.kill();
        }
        // Re-run setup after resize
        setupScrollTrigger();
      }, 150);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
        scrollTriggerRef.current = null;
      }
    };
  }, [normalizedImages.length, isLoaded]);

  // Don't render if no images
  if (!normalizedImages || normalizedImages.length === 0) {
    return null;
  }

  // Calculate consistent height for all cards (slightly smaller)
  const getCardHeight = () => {
    if (typeof window === 'undefined') return 500;
    const viewportHeight = window.innerHeight;
    return Math.min(viewportHeight * 0.7, 500);
  };

  const cardHeight = getCardHeight();

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen flex items-center overflow-hidden bg-background"
    >
      {/* Heading - stays visible at top center during horizontal scroll */}
      {heading && (
        <div className="absolute top-24 left-0 right-0 z-10 flex justify-center pointer-events-none">
          <h2 className="text-4xl font-display font-bold text-foreground uppercase">{heading}</h2>
        </div>
      )}
      <div
        ref={galleryRef}
        className="flex items-center gap-6 px-4"
        style={{ willChange: 'transform' }}
      >
        {normalizedImages.map((image, index) => {
          // Calculate width based on image aspect ratio
          const dim = imageDimensions[index] || { width: 600, height: 450 };
          const aspectRatio = dim.width / dim.height;
          let cardWidth = cardHeight * aspectRatio;
          
          // Constrain max width
          if (typeof window !== 'undefined') {
            cardWidth = Math.min(cardWidth, window.innerWidth * 0.85);
          }

          return (
            <div
              key={index}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              className="flex-shrink-0 relative rounded-2xl overflow-hidden flex items-center justify-center"
              style={{
                width: `${cardWidth}px`,
                height: `${cardHeight}px`,
              }}
            >
              <Image
                src={image}
                alt={`${altPrefix} ${index + 1}`}
                width={dim.width}
                height={dim.height}
                className="object-contain"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  width: 'auto',
                  height: 'auto',
                }}
                sizes="(max-width: 768px) 85vw, 800px"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

