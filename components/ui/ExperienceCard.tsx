/**
 * ExperienceCard Component
 * 
 * Displays a job/experience card with company logo, title, dates, and technologies.
 * Uses unified glow-card effect (defined in globals.css) for hover animations.
 * This component is used in experience listing pages.
 * 
 * Props:
 * - slug: URL slug for the experience detail page
 * - frontmatter: Job metadata from MDX frontmatter
 * - index: Animation delay index for staggered entrance
 * - compact: If true, shows condensed version with smaller thumbnail
 */
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Briefcase } from 'lucide-react';
import type { JobFrontmatter } from '@/lib/mdx';
import { formatDateRange } from '@/lib/utils';
import { cn } from '@/lib/utils';
import GlowWrapper from '@/components/ui/GlowWrapper';

interface ExperienceCardProps {
  slug: string;
  frontmatter: JobFrontmatter;
  index?: number;
  compact?: boolean;
}

export function ExperienceCard({ 
  slug, 
  frontmatter, 
  index = 0,
  compact = false 
}: ExperienceCardProps) {
  const { title, company, location, startDate, endDate, description, technologies, image, type } = frontmatter;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <Link href={`/experience/${slug}`} className="block">
        <GlowWrapper className="rounded-xl" preset="card">
          <div className={cn(
            "relative flex gap-4 p-4 rounded-xl border border-transparent",
            "transition-all duration-300",
            "glass"
          )}>
            {/* Thumbnail/Icon */}
            <div className={cn(
              "relative flex-shrink-0 rounded-lg overflow-hidden bg-background-secondary",
              "transition-transform duration-300 group-hover:scale-105",
              compact ? "w-12 h-12" : "w-16 h-16"
            )}>
              {image ? (
                <Image
                  src={image}
                  alt={company}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-emerald-500/10">
                  <Briefcase className="w-6 h-6 text-emerald-500" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pr-8">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div>
                  <h3 className={cn(
                    "font-display font-semibold text-foreground group-hover:text-accent transition-colors",
                    compact ? "text-base" : "text-lg"
                  )}>
                    {title}
                  </h3>
                  <p className="text-accent text-sm">{company}</p>
                </div>
              </div>
              
              <p className="text-xs text-muted mb-2">
                {formatDateRange(startDate, endDate)} • {location}
                {type && ` • ${type}`}
              </p>

              {!compact && description && (
                <p className="text-sm text-foreground-secondary line-clamp-2 mb-2">
                  {description}
                </p>
              )}

              {/* Technologies */}
              {technologies && technologies.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {technologies.slice(0, compact ? 2 : 4).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 text-xs rounded bg-background border border-border text-foreground-secondary"
                    >
                      {tech}
                    </span>
                  ))}
                  {technologies.length > (compact ? 2 : 4) && (
                    <span className="px-2 py-0.5 text-xs rounded bg-background border border-border text-muted">
                      +{technologies.length - (compact ? 2 : 4)}
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
