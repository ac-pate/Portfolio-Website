/**
 * ExtracurricularCard Component
 * 
 * Displays an extracurricular activity card with image, title, description, and tags.
 * Uses the shared ContentCard component for common functionality.
 * Supports external links or no link.
 * 
 * Props:
 * - slug: URL slug for the extracurricular detail page
 * - frontmatter: Extracurricular metadata from MDX frontmatter
 * - index: Animation delay index for staggered entrance
 */
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import React from 'react';
import { ExternalLink, Trophy, ArrowUpRight } from 'lucide-react';
import type { ExtracurricularFrontmatter } from '@/lib/mdx';
import { formatDateRange } from '@/lib/utils';
import { ContentCard } from '@/components/ui/ContentCard';

interface ExtracurricularCardProps {
  slug: string;
  frontmatter: ExtracurricularFrontmatter;
  index?: number;
}

export function ExtracurricularCard({ slug, frontmatter, index = 0 }: ExtracurricularCardProps) {
  const { title, description, startDate, endDate, tags, image, link, award, type } = frontmatter;

  // Determine link wrapper based on whether external link exists
  // If external link exists, use it; otherwise link to detail page
  const linkWrapper = link
    ? (children: React.ReactNode) => (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="block h-full"
        >
          {children}
        </a>
      )
    : (children: React.ReactNode) => (
        <Link href={`/extracurricular/${slug}`} className="block h-full">
          {children}
        </Link>
      );

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
          alt: title,
          placeholderIcon: Trophy,
          placeholderBgColor: 'bg-yellow-500/10',
          placeholderIconColor: 'text-yellow-500',
        }}
        linkWrapper={linkWrapper}
      >
        <div>
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <h3 className="text-xl font-display font-semibold text-foreground group-hover:text-accent transition-colors">
                {title}
              </h3>
              {type && <p className="text-accent text-sm mt-1 capitalize">{type}</p>}
            </div>
            {link ? (
              <ExternalLink className="w-5 h-5 text-muted transition-all duration-300 group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 flex-shrink-0" />
            ) : (
              <ArrowUpRight className="w-5 h-5 text-muted transition-all duration-300 group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 flex-shrink-0" />
            )}
          </div>

          {startDate && (
            <p className="text-xs text-muted mb-3">
              {formatDateRange(startDate, endDate)}
            </p>
          )}

          {description && (
            <p className="text-sm text-foreground-secondary leading-relaxed mb-4 line-clamp-3">
              {description}
            </p>
          )}

          {award && <p className="text-sm font-medium text-accent mb-3">🏆 {award}</p>}

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 text-xs font-medium rounded-md bg-background border border-border text-foreground-secondary"
                >
                  {tag}
                </span>
              ))}
              {tags.length > 4 && (
                <span className="px-2.5 py-1 text-xs font-medium rounded-md bg-background border border-border text-muted">
                  +{tags.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
      </ContentCard>
    </motion.article>
  );
}

