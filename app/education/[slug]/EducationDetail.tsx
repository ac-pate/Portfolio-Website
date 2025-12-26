'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, GraduationCap, MapPin, Calendar, Award, BookOpen } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { ContentItem, EducationFrontmatter } from '@/lib/mdx';
import { formatDateRange } from '@/lib/utils';
import { HorizontalGallery } from '@/components/ui/HorizontalGallery';

interface EducationDetailProps {
  education: ContentItem<EducationFrontmatter>;
}

export function EducationDetail({ education }: EducationDetailProps) {
  const { frontmatter, content } = education;

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
          <Link
            href="/education"
            className="inline-flex items-center gap-2 text-foreground-secondary hover:text-accent transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Education
          </Link>
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
                alt={frontmatter.institution}
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
                alt={frontmatter.institution}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <div className="flex items-start gap-6 mb-6">
            {/* Icon */}
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-blue-500/10 flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-8 h-8 text-blue-500" />
            </div>

            <div>
              <h1 className="text-display-sm md:text-display-md font-display font-bold text-foreground mb-2">
                {frontmatter.degree}
              </h1>
              <p className="text-xl text-accent mb-2">{frontmatter.institution}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-foreground-secondary">
                {frontmatter.startDate && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDateRange(frontmatter.startDate, frontmatter.endDate)}
                  </span>
                )}
                {frontmatter.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {frontmatter.location}
                  </span>
                )}
                {frontmatter.gpa && (
                  <span className="px-2 py-0.5 rounded bg-accent/10 text-accent text-xs">
                    GPA: {frontmatter.gpa}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Field of Study */}
          {frontmatter.field && (
            <p className="text-lg text-foreground-secondary max-w-3xl mb-6">
              {frontmatter.field}
            </p>
          )}

          {/* Honors & Awards */}
          {frontmatter.honors && frontmatter.honors.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-muted mb-3 flex items-center gap-2">
                <Award className="w-4 h-4" />
                Honors & Awards
              </h3>
              <div className="flex flex-wrap gap-2">
                {frontmatter.honors.map((honor) => (
                  <span
                    key={honor}
                    className="px-3 py-1 rounded-full bg-accent/10 text-accent text-sm"
                  >
                    {honor}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Coursework */}
          {frontmatter.coursework && frontmatter.coursework.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-muted mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Relevant Coursework
              </h3>
              <div className="flex flex-wrap gap-2">
                {frontmatter.coursework.map((course) => (
                  <span
                    key={course}
                    className="px-3 py-1 rounded-full bg-background-secondary border border-border text-sm"
                  >
                    {course}
                  </span>
                ))}
              </div>
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
                  strong: ({ children }) => (
                    <strong className="text-foreground font-semibold">{children}</strong>
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
              altPrefix={`${frontmatter.institution} gallery`}
              heading="Gallery"
            />
          </div>
        )}
      </article>
    </div>
  );
}

