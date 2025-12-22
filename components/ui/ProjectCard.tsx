/**
 * ProjectCard Component
 * 
 * Displays a project card with image, title, description, and tags.
 * Uses the shared ContentCard component for common functionality.
 * 
 * Props:
 * - slug: URL slug for the project detail page
 * - frontmatter: Project metadata from MDX frontmatter
 * - index: Animation delay index for staggered entrance
 */
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight, Github, ExternalLink } from 'lucide-react';
import type { ProjectFrontmatter } from '@/lib/mdx';
import { cn } from '@/lib/utils';
import { ContentCard } from '@/components/ui/ContentCard';

interface ProjectCardProps {
  slug: string;
  frontmatter: ProjectFrontmatter;
  index?: number;
}

export function ProjectCard({ slug, frontmatter, index = 0 }: ProjectCardProps) {
  const { title, description, tags, image, github, demo, status, projectType } = frontmatter;

  // Status badge overlay
  const statusOverlay =
    status && status !== 'completed' ? (
      <span
        className={cn(
          'px-3 py-1 text-xs font-medium rounded-full backdrop-blur-sm',
          status === 'in-progress'
            ? 'bg-accent/20 text-accent'
            : 'bg-muted/20 text-muted'
        )}
      >
        {status === 'in-progress' ? 'In Progress' : 'Archived'}
      </span>
    ) : null;

  // Action buttons (GitHub/Demo)
  const actionButtons =
    github || demo ? (
      <div className="absolute bottom-6 right-6 flex items-center gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-20">
        {github && (
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border hover:border-accent hover:text-accent transition-colors block"
            aria-label="View on GitHub"
          >
            <Github className="w-4 h-4" />
          </a>
        )}
        {demo && (
          <a
            href={demo}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border hover:border-accent hover:text-accent transition-colors block"
            aria-label="View Demo"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    ) : null;

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
          placeholderText: title.charAt(0),
          placeholderBgColor: 'bg-accent/10',
          placeholderIconColor: 'text-accent',
        }}
        overlays={
          statusOverlay
            ? [
                {
                  node: statusOverlay,
                  position: 'top-right' as const,
                },
              ]
            : []
        }
        actionButtons={actionButtons}
        linkWrapper={(children) => (
          <Link href={`/projects/${slug}`} className="block h-full">
            {children}
          </Link>
        )}
      >
        <div>
          <div className="flex items-start justify-between gap-4 mb-3">
            <h3 className="text-xl font-display font-semibold text-foreground group-hover:text-accent transition-colors">
              {title}
            </h3>
            <ArrowUpRight className="w-5 h-5 text-muted transition-all duration-300 group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 flex-shrink-0" />
          </div>

          {/* Project Type - Hidden by default, appears on hover */}
          {projectType && projectType.length > 0 && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 mb-2">
              <span className="text-xs text-foreground-secondary font-normal">
                {projectType.join(' • ')}
              </span>
            </div>
          )}

          <p className="text-foreground-secondary text-sm leading-relaxed mb-4 line-clamp-3">
            {description}
          </p>

          {/* Tags */}
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
        </div>
      </ContentCard>
    </motion.article>
  );
}
