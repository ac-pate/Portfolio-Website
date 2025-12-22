'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Heart, Calendar, MapPin } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { ContentItem, VolunteerFrontmatter } from '@/lib/mdx';
import { formatDateRange } from '@/lib/utils';
import GlowWrapper from '@/components/ui/GlowWrapper';

interface VolunteerDetailProps {
  volunteer: ContentItem<VolunteerFrontmatter>;
}

export function VolunteerDetail({ volunteer }: VolunteerDetailProps) {
  const { frontmatter, content } = volunteer;

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
              href="/volunteer"
              className="inline-flex items-center gap-2 px-3 py-1.5 text-foreground-secondary hover:text-accent transition-colors rounded-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Volunteer Work
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
            {/* Icon */}
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-red-500/10 flex items-center justify-center flex-shrink-0">
              {frontmatter.image && !frontmatter.coverImage ? (
                <Image
                  src={frontmatter.image}
                  alt={frontmatter.organization}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
              ) : (
                <Heart className="w-8 h-8 text-red-500" />
              )}
            </div>

            <div>
              <h1 className="text-display-sm md:text-display-md font-display font-bold text-foreground mb-2">
                {frontmatter.title}
              </h1>
              <p className="text-xl text-accent mb-2">{frontmatter.organization}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-foreground-secondary">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDateRange(frontmatter.startDate, frontmatter.endDate)}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          {frontmatter.description && (
            <p className="text-lg text-foreground-secondary max-w-3xl">
              {frontmatter.description}
            </p>
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

