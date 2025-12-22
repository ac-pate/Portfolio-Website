/**
 * ProjectCardWithThumbnail Component
 * 
 * Displays a project card with thumbnail image on the left side.
 * Uses unified glow-card effect (defined in globals.css) for hover animations.
 * This component is used in compact project listings (e.g., homepage preview).
 * 
 * Props:
 * - slug: URL slug for the project detail page
 * - frontmatter: Project metadata from MDX frontmatter
 * - index: Animation delay index for staggered entrance
 * - compact: If true, shows condensed version with smaller thumbnail
 */
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import type { ProjectFrontmatter } from '@/lib/mdx';
import { cn } from '@/lib/utils';
import GlowWrapper from '@/components/ui/GlowWrapper';

interface ProjectCardWithThumbnailProps {
  slug: string;
  frontmatter: ProjectFrontmatter;
  index?: number;
  compact?: boolean;
}

export function ProjectCardWithThumbnail({ 
  slug, 
  frontmatter, 
  index = 0,
  compact = false 
}: ProjectCardWithThumbnailProps) {
  const { title, description, tags, image, status } = frontmatter;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <Link href={`/projects/${slug}`} className="block">
        <GlowWrapper className="rounded-xl" preset="card">
          <div className={cn(
            "relative flex gap-4 p-4 rounded-xl border border-transparent",
            "transition-all duration-300",
            "glass",
            compact ? "items-center" : "items-start"
          )}>
            {/* Status indicator */}
            {status && status !== 'completed' && (
              <div className={cn(
                "absolute top-3 right-3 px-2 py-0.5 text-xs font-medium rounded-full z-10",
                status === 'in-progress' 
                  ? "bg-accent/20 text-accent shadow-glow-sm" 
                  : "bg-muted/20 text-muted"
              )}>
                {status === 'in-progress' ? 'In Progress' : 'Archived'}
              </div>
            )}

            {/* Thumbnail */}
            <div className={cn(
              "relative flex-shrink-0 rounded-lg overflow-hidden bg-background-secondary/80",
              "transition-transform duration-300 group-hover:scale-105",
              compact ? "w-16 h-16" : "w-24 h-24 md:w-32 md:h-24"
            )}>
              {image ? (
                <Image
                  src={image}
                  alt={title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-accent/10">
                  <span className="text-xl font-display font-bold text-accent">
                    {title.charAt(0)}
                  </span>
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
              
              {!compact && description && (
                <p className="text-sm text-foreground-secondary line-clamp-2 mb-2">
                  {description}
                </p>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
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
            </div>

            {/* Arrow indicator */}
            <ArrowUpRight className="absolute top-4 right-4 w-4 h-4 text-muted transition-all duration-300 group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </GlowWrapper>
      </Link>
    </motion.article>
  );
}
