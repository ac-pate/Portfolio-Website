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
import { ContentCard } from '@/components/ui/ContentCard';

interface ExperienceCardProps {
  slug: string;
  frontmatter: JobFrontmatter;
  index?: number;
  compact?: boolean;
}

// Helper to check if image is a GIF
const isGif = (src?: string) => src?.toLowerCase().endsWith('.gif') ?? false;

export function ExperienceCard({ 
  slug, 
  frontmatter, 
  index = 0,
  compact = false 
}: ExperienceCardProps) {
  const { title, company, location, startDate, endDate, description, technologies, image, type } = frontmatter;
  const imageIsGif = isGif(image);

  // If compact, use the old layout
  if (compact) {
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
                "w-12 h-12"
              )}>
                {image ? (
                  imageIsGif ? (
                    <img
                      src={image}
                      alt={company}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image
                      src={image}
                      alt={company}
                      fill
                      className="object-cover"
                    />
                  )
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
                    <h3 className="text-base font-display font-semibold text-foreground group-hover:text-accent transition-colors">
                      {title}
                    </h3>
                    <p className="text-accent text-sm">{company}</p>
                  </div>
                </div>
                
                {startDate && (
                  <p className="text-xs text-muted mb-2">
                    {formatDateRange(startDate, endDate)} • {location}
                    {type && ` • ${type}`}
                  </p>
                )}

                {/* Technologies */}
                {technologies && technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {technologies.slice(0, 2).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 text-xs rounded bg-background border border-border text-foreground-secondary"
                      >
                        {tech}
                      </span>
                    ))}
                    {technologies.length > 2 && (
                      <span className="px-2 py-0.5 text-xs rounded bg-background border border-border text-muted">
                        +{technologies.length - 2}
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

  // Full-width card with 2/5-3/5 split using ContentCard
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative h-full"
    >
      <ContentCard
        image={{
          src: image,
          alt: company,
          placeholderIcon: Briefcase,
          placeholderBgColor: 'bg-emerald-500/10',
          placeholderIconColor: 'text-emerald-500',
        }}
        linkWrapper={(children) => (
          <Link href={`/experience/${slug}`} className="block h-full">
            {children}
          </Link>
        )}
      >
        <div>
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <h3 className="text-xl font-display font-semibold text-foreground group-hover:text-accent transition-colors">
                {title}
              </h3>
              <p className="text-accent text-base mt-1">{company}</p>
            </div>
            <ArrowUpRight className="w-5 h-5 text-muted transition-all duration-300 group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 flex-shrink-0" />
          </div>

          {startDate && (
            <p className="text-xs text-muted mb-3">
              {formatDateRange(startDate, endDate)} • {location}
              {type && ` • ${type}`}
            </p>
          )}

          {description && (
            <p className="text-sm text-foreground-secondary leading-relaxed mb-4 line-clamp-3">
              {description}
            </p>
          )}

          {/* Technologies */}
          {technologies && technologies.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {technologies.slice(0, 4).map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 text-xs font-medium rounded-md bg-background border border-border text-foreground-secondary"
                >
                  {tech}
                </span>
              ))}
              {technologies.length > 4 && (
                <span className="px-2.5 py-1 text-xs font-medium rounded-md bg-background border border-border text-muted">
                  +{technologies.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
      </ContentCard>
    </motion.article>
  );
}
