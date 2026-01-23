/**
 * ExtracurricularCardWithThumbnail Component
 * 
 * Displays an extracurricular card with thumbnail image on the left side.
 * Uses unified glow-card effect (defined in globals.css) for hover animations.
 * This component is used in compact extracurricular listings (e.g., homepage preview).
 * 
 * Props:
 * - slug: URL slug for the extracurricular detail page
 * - frontmatter: Extracurricular metadata from MDX frontmatter
 * - index: Animation delay index for staggered entrance
 * - compact: If true, shows condensed version with smaller thumbnail
 */
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Trophy } from 'lucide-react';
import type { ExtracurricularFrontmatter } from '@/lib/mdx';
import { cn, formatDateRange } from '@/lib/utils';
import GlowWrapper from '@/components/ui/GlowWrapper';
import { useSound } from '@/components/providers/SoundProvider';

interface ExtracurricularCardWithThumbnailProps {
  slug: string;
  frontmatter: ExtracurricularFrontmatter;
  index?: number;
  compact?: boolean;
}

export function ExtracurricularCardWithThumbnail({ 
  slug, 
  frontmatter, 
  index = 0,
  compact = false 
}: ExtracurricularCardWithThumbnailProps) {
  const { title, description, tags, image, award, startDate, endDate } = frontmatter;
  const { playHoverSound, stopHoverSound } = useSound();

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <Link 
        href={`/extracurricular/${slug}`} 
        className="block"
      >
        <GlowWrapper className="rounded-xl" preset="card">
          <div className={cn(
            "relative flex gap-4 p-4 rounded-xl border border-transparent",
            "transition-all duration-300",
            "glass",
            compact ? "items-center" : "items-start"
          )}>
            {/* Thumbnail */}
            <div className={cn(
              "relative flex-shrink-0 rounded-lg overflow-hidden bg-background-secondary/80",
              "transition-transform duration-300 group-hover:scale-105",
              compact ? "w-16 h-16" : "w-24 h-24 md:w-32 md:h-24"
            )}>
              {image && image.trim() !== '' ? (
                <Image
                  src={image}
                  alt={title}
                  fill
                  className="object-cover"
                  
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-yellow-500/10">
                  <Trophy className="w-6 h-6 text-yellow-500" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pr-8">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className={cn(
                  "font-display font-semibold text-foreground group-hover:text-accent transition-colors",
                  compact ? "text-base" : "text-lg"
                )}>
                  {title}
                </h3>
              </div>
              
              {/* Date Range */}
              {startDate && (
                <p className="text-xs text-muted mb-1">
                  {formatDateRange(startDate, endDate)}
                </p>
              )}
              
              {!compact && description && (
                <p className="text-sm text-foreground-secondary line-clamp-1 md:line-clamp-2 mb-2">
                  {description}
                </p>
              )}

              {/* Tags */}
              {tags && tags.length > 0 && (
                <div className="hidden md:flex flex-wrap gap-1.5">
                  {tags.slice(0, compact ? 2 : 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-xs rounded bg-background-secondary/50 border border-border text-foreground-secondary"
                    >
                      {tag}
                    </span>
                  ))}
                  {tags.length > (compact ? 2 : 3) && (
                    <span className="px-2 py-0.5 text-xs rounded bg-background-secondary/50 border border-border text-muted">
                      +{tags.length - (compact ? 2 : 3)}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Arrow indicator */}
            <ArrowUpRight className="absolute top-4 right-4 w-4 h-4 text-muted transition-all duration-300 group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </GlowWrapper>
      </Link>
    </motion.article>
  );
}
