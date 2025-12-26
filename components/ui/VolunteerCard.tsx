/**
 * VolunteerCard Component
 * 
 * Displays a volunteer work card with image, title, organization, and description.
 * Uses the shared ContentCard component for common functionality.
 * 
 * Props:
 * - slug: URL slug for the volunteer detail page
 * - frontmatter: Volunteer metadata from MDX frontmatter
 * - index: Animation delay index for staggered entrance
 */
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight, Heart } from 'lucide-react';
import type { VolunteerFrontmatter } from '@/lib/mdx';
import { formatDateRange } from '@/lib/utils';
import { ContentCard } from '@/components/ui/ContentCard';

interface VolunteerCardProps {
  slug: string;
  frontmatter: VolunteerFrontmatter;
  index?: number;
}

export function VolunteerCard({ slug, frontmatter, index = 0 }: VolunteerCardProps) {
  const { title, organization, startDate, endDate, description, image } = frontmatter;

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
          placeholderIcon: Heart,
          placeholderBgColor: 'bg-red-500/10',
          placeholderIconColor: 'text-red-500',
        }}
        linkWrapper={(children) => (
          <Link href={`/volunteer/${slug}`} className="block h-full">
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
              <p className="text-accent text-base mt-1">{organization}</p>
            </div>
            <ArrowUpRight className="w-5 h-5 text-muted transition-all duration-300 group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 flex-shrink-0" />
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
        </div>
      </ContentCard>
    </motion.article>
  );
}

