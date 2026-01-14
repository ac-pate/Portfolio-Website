'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Github, ExternalLink, Calendar, Tag, FileText } from 'lucide-react';
import type { ContentItem, ProjectFrontmatter } from '@/lib/mdx';
import { formatDateRange } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import GlowWrapper from '@/components/ui/GlowWrapper';
import { HorizontalGallery } from '@/components/ui/HorizontalGallery';

interface ProjectDetailProps {
  project: ContentItem<ProjectFrontmatter>;
}

export function ProjectDetail({ project }: ProjectDetailProps) {
  const { frontmatter, content } = project;

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
              href="/projects"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 text-foreground-secondary hover:text-white font-medium rounded-lg transition-all duration-200 hover:shadow-glow-sm border border-white/10 hover:border-white/20"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Projects
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
            {/* Project thumbnail/icon */}
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
                  <FileText className="w-8 h-8 text-accent" />
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
          <div className="flex flex-wrap items-center gap-6 text-sm text-foreground-secondary mb-6 mt-4">
            {frontmatter.startDate && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDateRange(frontmatter.startDate, frontmatter.endDate)}</span>
              </div>
            )}
            {frontmatter.projectType && frontmatter.projectType.length > 0 && (
              <span className="text-foreground-secondary">
                {frontmatter.projectType.join(' • ')}
              </span>
            )}
            {frontmatter.status && (
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    frontmatter.status === 'completed'
                      ? 'bg-emerald-500'
                      : frontmatter.status === 'in-progress'
                      ? 'bg-accent'
                      : 'bg-muted'
                  }`}
                />
                <span className="capitalize">{frontmatter.status.replace('-', ' ')}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {frontmatter.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-background-secondary border border-border text-sm"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-4">
            {frontmatter.github && (
              <GlowWrapper preset="button" className="rounded-lg">
                <a
                  href={frontmatter.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary rounded-lg"
                >
                  <Github className="w-4 h-4" />
                  View Source
                </a>
              </GlowWrapper>
            )}
            {frontmatter.report && (
              <GlowWrapper preset="button" className="rounded-lg">
                <a
                  href={frontmatter.report}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary rounded-lg"
                >
                  <FileText className="w-4 h-4" />
                  View Report
                </a>
              </GlowWrapper>
            )}
            {frontmatter.demo && (
              <GlowWrapper preset="button" className="rounded-lg">
                <a
                  href={frontmatter.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary rounded-lg"
                >
                  <ExternalLink className="w-4 h-4" />
                  Live Demo
                </a>
              </GlowWrapper>
            )}
          </div>
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
                h1: ({ children }) => (
                  <h1 className="text-display-sm font-display font-bold text-foreground mt-12 mb-6 first:mt-0">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-3xl font-display font-bold text-foreground mt-10 mb-4">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-2xl font-display font-semibold text-foreground mt-8 mb-3">
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
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside text-foreground-secondary space-y-2 mb-4 ml-4">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="text-foreground-secondary">{children}</li>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    {children}
                  </a>
                ),
                code: ({ children, className }) => {
                  const isBlock = className?.includes('language-');
                  if (isBlock) {
                    return (
                      <code className="block text-sm font-mono">{children}</code>
                    );
                  }
                  return (
                    <code className="px-1.5 py-0.5 rounded bg-accent/10 text-accent text-sm font-mono">
                      {children}
                    </code>
                  );
                },
                pre: ({ children }) => (
                  <pre className="p-4 rounded-xl bg-background-secondary border border-border overflow-x-auto mb-4 text-foreground-secondary">
                    {children}
                  </pre>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-accent pl-4 italic text-foreground-secondary my-4">
                    {children}
                  </blockquote>
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto mb-4">
                    <table className="min-w-full border-collapse border border-border">
                      {children}
                    </table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="border border-border px-4 py-2 bg-background-secondary text-foreground font-semibold text-left">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="border border-border px-4 py-2 text-foreground-secondary">
                    {children}
                  </td>
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </motion.div>

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
