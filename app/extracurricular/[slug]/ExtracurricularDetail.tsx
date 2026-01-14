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
import { HorizontalGallery } from '@/components/ui/HorizontalGallery';

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
          <GlowWrapper preset="button" className="rounded-lg" showHighlight={false}>
            <Link
              href="/extracurricular"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 text-foreground-secondary hover:text-white font-medium rounded-lg transition-all duration-200 hover:shadow-glow-sm border border-white/10 hover:border-white/20"
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

          <div className="flex items-start gap-6 mb-6">
            {/* Activity thumbnail/icon */}
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-background-secondary flex-shrink-0">
              {frontmatter.image ? (
                <Image
                  src={frontmatter.image}
                  alt={frontmatter.title}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-accent/10">
                  <Trophy className="w-8 h-8 text-accent" />
                </div>
              )}
            </div>

            <div className="flex-1">
              {/* Title */}
              <h1 className="text-display-md md:text-display-lg font-display font-bold text-foreground mb-2">
                {frontmatter.title}
              </h1>
              {/* Description */}
              {frontmatter.description && (
                <p className="text-lg text-foreground-secondary max-w-3xl">
                  {frontmatter.description}
                </p>
              )}
            </div>
          </div>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-foreground-secondary mb-6">
            {frontmatter.startDate && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDateRange(frontmatter.startDate, frontmatter.endDate)}</span>
              </div>
            )}
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

        {/* Horizontal Gallery */}
        {frontmatter.galleryImages && frontmatter.galleryImages.length > 0 && (
          <div className="mt-16">
            <HorizontalGallery
              images={frontmatter.galleryImages}
              altPrefix={`${frontmatter.title} gallery`}
              heading="Gallery"
            />
          </div>
        )}
      </article>
    </div>
  );
}

