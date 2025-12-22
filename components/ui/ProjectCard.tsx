/**
 * ProjectCard Component
 * 
 * Displays a project card with image, title, description, and tags.
 * Uses unified glow-card effect (defined in globals.css) for hover animations.
 * This component is used in project listing pages.
 * 
 * Props:
 * - slug: URL slug for the project detail page
 * - frontmatter: Project metadata from MDX frontmatter
 * - index: Animation delay index for staggered entrance
 */
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Github, ExternalLink } from 'lucide-react';
import type { ProjectFrontmatter } from '@/lib/mdx';
import { cn } from '@/lib/utils';
import GlowWrapper from '@/components/ui/GlowWrapper';

interface ProjectCardProps {
  slug: string;
  frontmatter: ProjectFrontmatter;
  index?: number;
}

export function ProjectCard({ slug, frontmatter, index = 0 }: ProjectCardProps) {
  const { title, description, tags, image, github, demo, status } = frontmatter;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative h-full"
    >
      <Link href={`/projects/${slug}`} className="block h-full">
        <GlowWrapper className="rounded-2xl h-full" preset="card">
          <div className="relative h-full rounded-2xl border border-transparent bg-background-secondary/50 transition-all duration-300 glass">
            {/* Image */}
            <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-background-secondary to-background rounded-t-2xl">
              {image ? (
                <Image
                  src={image}
                  alt={title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center">
                    <span className="text-2xl font-display font-bold text-accent">
                      {title.charAt(0)}
                    </span>
                  </div>
                </div>
              )}
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
              
              {/* Status badge */}
              {status && status !== 'completed' && (
                <div className="absolute top-4 right-4">
                  <span className={cn(
                    'px-3 py-1 text-xs font-medium rounded-full',
                    status === 'in-progress' 
                      ? 'bg-accent/20 text-accent' 
                      : 'bg-muted/20 text-muted'
                  )}>
                    {status === 'in-progress' ? 'In Progress' : 'Archived'}
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <h3 className="text-xl font-display font-semibold text-foreground group-hover:text-accent transition-colors">
                  {title}
                </h3>
                <ArrowUpRight className="w-5 h-5 text-muted transition-all duration-300 group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
              
              <p className="text-foreground-secondary text-sm leading-relaxed mb-4 line-clamp-2">
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
          </div>
        </GlowWrapper>
      </Link>

      {/* Quick action buttons */}
      {(github || demo) && (
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
      )}
    </motion.article>
  );
}
