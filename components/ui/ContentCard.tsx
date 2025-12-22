/**
 * ContentCard - Shared Base Component
 * 
 * A reusable card component that handles the common layout structure,
 * GIF support, image placeholders, and flex container for all content types.
 * 
 * Type-specific cards should use this component and pass appropriate props.
 */
'use client';

import { ReactNode } from 'react';
import Image from 'next/image';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import GlowWrapper from '@/components/ui/GlowWrapper';

// Helper to check if image is a GIF
const isGif = (src?: string) => src?.toLowerCase().endsWith('.gif') ?? false;

export interface ContentCardImageConfig {
  src?: string;
  alt: string;
  placeholderIcon?: LucideIcon;
  placeholderIconColor?: string;
  placeholderBgColor?: string;
  placeholderText?: string; // For text-based placeholders (e.g., first letter)
}

export interface ContentCardOverlayConfig {
  node: ReactNode;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export interface ContentCardProps {
  /** Main content area (title, description, tags, etc.) */
  children: ReactNode;
  /** Image configuration */
  image?: ContentCardImageConfig;
  /** Optional overlay nodes (e.g., status badges) */
  overlays?: ContentCardOverlayConfig[];
  /** Optional action buttons area (rendered outside the card container) */
  actionButtons?: ReactNode;
  /** Link wrapper - can be Next.js Link, external <a>, or div */
  linkWrapper: (children: ReactNode) => ReactNode;
  /** Additional className for the card container */
  className?: string;
}

export function ContentCard({
  children,
  image,
  overlays = [],
  actionButtons,
  linkWrapper,
  className,
}: ContentCardProps) {
  const imageIsGif = image?.src ? isGif(image.src) : false;

  return (
    <div className={cn('group relative h-full', className)}>
      {linkWrapper(
        <GlowWrapper className="rounded-2xl h-full" preset="card">
          <div className="relative h-full rounded-2xl border border-transparent bg-background-secondary/50 transition-all duration-300 glass overflow-hidden flex">
            {/* Image - Left side (2/5 = 40%) */}
            {image && (
              <div className="relative w-2/5 flex-shrink-0 overflow-hidden bg-gradient-to-br from-background-secondary to-background">
                {image.src ? (
                  imageIsGif ? (
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    {image.placeholderText ? (
                      // Text-based placeholder (e.g., first letter)
                      <div
                        className={cn(
                          'w-16 h-16 rounded-2xl flex items-center justify-center',
                          image.placeholderBgColor || 'bg-accent/10'
                        )}
                      >
                        <span
                          className={cn(
                            'text-2xl font-display font-bold',
                            image.placeholderIconColor || 'text-accent'
                          )}
                        >
                          {image.placeholderText}
                        </span>
                      </div>
                    ) : image.placeholderIcon ? (
                      // Icon-based placeholder
                      <div
                        className={cn(
                          'w-full h-full flex items-center justify-center',
                          image.placeholderBgColor || 'bg-background-secondary/80'
                        )}
                      >
                        <image.placeholderIcon
                          className={cn(
                            'w-12 h-12',
                            image.placeholderIconColor || 'text-foreground-secondary'
                          )}
                        />
                      </div>
                    ) : null}
                  </div>
                )}

                {/* Render overlays positioned on the image */}
                {overlays.map((overlay, index) => {
                  const positionClasses: Record<string, string> = {
                    'top-left': 'top-4 left-4',
                    'top-right': 'top-4 right-4',
                    'bottom-left': 'bottom-4 left-4',
                    'bottom-right': 'bottom-4 right-4',
                  };
                  const position = overlay.position || 'top-right';
                  return (
                    <div
                      key={index}
                      className={cn('absolute z-10', positionClasses[position])}
                    >
                      {overlay.node}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Content - Right side (3/5 = 60%) */}
            <div className="flex-1 flex flex-col justify-between p-6 bg-background/95">
              {children}
            </div>
          </div>
        </GlowWrapper>
      )}

      {/* Action buttons (rendered outside the card, e.g., GitHub/Demo buttons) */}
      {actionButtons}
    </div>
  );
}

