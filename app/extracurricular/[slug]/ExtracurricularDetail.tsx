'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Trophy, Calendar, MapPin, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { ContentItem, ExtracurricularFrontmatter } from '@/lib/mdx';
import { formatDateRange } from '@/lib/utils';
import GlowWrapper from '@/components/ui/GlowWrapper';

interface ExtracurricularDetailProps {
  extracurricular: ContentItem<ExtracurricularFrontmatter>;
}

export function ExtracurricularDetail({ extracurricular }: ExtracurricularDetailProps) {
  const { frontmatter, content } = extracurricular;

  return (
    <div className="pt-24 pb-16">
      <article className="section-container">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <GlowWrapper preset="badge" className="rounded-lg">
            <Link
              href="/extracurricular"
              className="inline-flex items-center gap-2 px-3 py-1.5 text-foreground-secondary hover:text-accent transition-colors rounded-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Extracurricular
            </Link>
          </GlowWrapper>
        </motion.div>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          {/* Cover Image - Use coverImage if provided, otherwise fallback to image */}
          {frontmatter.coverImage && (
            <div className="relative aspect-[21/9] rounded-2xl overflow-hidden mb-8 bg-background-secondary">
              <Image
                src={frontmatter.coverImage}
                alt={frontmatter.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
          {!frontmatter.coverImage && frontmatter.image && (
            <div className="relative aspect-[21/9] rounded-2xl overflow-hidden mb-8 bg-background-secondary">
              <Image
                src={frontmatter.image}
                alt={frontmatter.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Title */}
          <h1 className="text-display-md md:text-display-lg font-display font-bold text-foreground mb-4">
            {frontmatter.title}
          </h1>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-foreground-secondary mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDateRange(frontmatter.startDate, frontmatter.endDate)}</span>
            </div>
            {frontmatter.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{frontmatter.location}</span>
              </div>
            )}
            {frontmatter.type && (
              <span className="px-2 py-0.5 rounded bg-accent/10 text-accent text-xs capitalize">
                {frontmatter.type}
              </span>
            )}
          </div>

          {/* Description */}
          {frontmatter.description && (
            <p className="text-xl text-foreground-secondary mb-6 max-w-3xl">
              {frontmatter.description}
            </p>
          )}

          {/* Award */}
          {frontmatter.award && (
            <div className="mb-6">
              <p className="text-lg font-medium text-accent">🏆 {frontmatter.award}</p>
            </div>
          )}

          {/* Tags */}
          {frontmatter.tags && frontmatter.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {frontmatter.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-background-secondary border border-border text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* External Link */}
          {frontmatter.link && (
            <div className="flex flex-wrap gap-4">
              <GlowWrapper preset="button" className="rounded-lg">
                <a
                  href={frontmatter.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary rounded-lg"
                >
                  <ExternalLink className="w-4 h-4" />
                  View More
                </a>
              </GlowWrapper>
            </div>
          )}
        </motion.header>

        {/* Content */}
        {content && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-3xl"
          >
            <div className="prose-custom">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h2: ({ children }) => (
                    <h2 className="text-2xl font-display font-bold text-foreground mt-10 mb-4">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl font-display font-semibold text-foreground mt-8 mb-3">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-foreground-secondary leading-relaxed mb-4">{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside text-foreground-secondary space-y-2 mb-4 ml-4">
                      {children}
                    </ul>
                  ),
                  li: ({ children }) => (
                    <li className="text-foreground-secondary">{children}</li>
                  ),
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          </motion.div>
        )}
      </article>
    </div>
  );
}

