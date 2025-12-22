'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Briefcase, MapPin, Calendar } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { ContentItem, JobFrontmatter } from '@/lib/mdx';
import { formatDateRange } from '@/lib/utils';
import GlowWrapper from '@/components/ui/GlowWrapper';

interface ExperienceDetailProps {
  job: ContentItem<JobFrontmatter>;
}

export function ExperienceDetail({ job }: ExperienceDetailProps) {
  const { frontmatter, content } = job;

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
              href="/experience"
              className="inline-flex items-center gap-2 px-3 py-1.5 text-foreground-secondary hover:text-accent transition-colors rounded-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Experience
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
                alt={frontmatter.company}
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
                alt={frontmatter.company}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <div className="flex items-start gap-6 mb-6">
            {/* Company logo/icon */}
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-background-secondary flex-shrink-0">
              {frontmatter.image ? (
                <Image
                  src={frontmatter.image}
                  alt={frontmatter.company}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-emerald-500/10">
                  <Briefcase className="w-8 h-8 text-emerald-500" />
                </div>
              )}
            </div>

            <div>
              <h1 className="text-display-sm md:text-display-md font-display font-bold text-foreground mb-2">
                {frontmatter.title}
              </h1>
              <p className="text-xl text-accent mb-2">{frontmatter.company}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-foreground-secondary">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDateRange(frontmatter.startDate, frontmatter.endDate)}
                </span>
                {frontmatter.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {frontmatter.location}
                  </span>
                )}
                {frontmatter.type && (
                  <span className="px-2 py-0.5 rounded bg-accent/10 text-accent text-xs capitalize">
                    {frontmatter.type}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          {frontmatter.description && (
            <p className="text-lg text-foreground-secondary max-w-3xl">
              {frontmatter.description}
            </p>
          )}

          {/* Technologies */}
          {frontmatter.technologies && frontmatter.technologies.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {frontmatter.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 rounded-full bg-background-secondary border border-border text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </motion.header>

        {/* Content */}
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
      </article>
    </div>
  );
}
