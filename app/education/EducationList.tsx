'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { GraduationCap, ArrowUpRight, Calendar, MapPin } from 'lucide-react';
import type { ContentItem, EducationFrontmatter } from '@/lib/mdx';
import { formatDateRange } from '@/lib/utils';

interface EducationListProps {
  education: ContentItem<EducationFrontmatter>[];
}

export function EducationList({ education }: EducationListProps) {
  return (
    <div className="pt-24 pb-16">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-display-md md:text-display-lg font-display font-bold text-foreground mb-4">
            Education<span className="text-accent">.</span>
          </h1>
          <p className="text-lg text-foreground-secondary max-w-2xl">
            Academic background in computer engineering with focus on robotics and embedded systems.
          </p>
        </motion.div>

        {education.length === 0 ? (
          <p className="text-foreground-secondary">Education details coming soon.</p>
        ) : (
          <div className="max-w-3xl space-y-6">
            {education.map((edu, index) => (
              <motion.article
                key={edu.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <Link href={`/education/${edu.slug}`} className="block">
                  <div className="flex gap-4 p-6 rounded-xl border border-border bg-background-secondary/30 transition-all duration-300 hover:border-accent/30 hover:shadow-glow-sm">
                    {/* Icon */}
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-7 h-7 text-blue-500" />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                          <h3 className="text-xl font-display font-semibold text-foreground group-hover:text-accent transition-colors">
                            {edu.frontmatter.degree}
                          </h3>
                          <p className="text-accent">{edu.frontmatter.institution}</p>
                        </div>
                        <ArrowUpRight className="w-5 h-5 text-muted flex-shrink-0 transition-all duration-300 group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted mt-2 mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDateRange(edu.frontmatter.startDate, edu.frontmatter.endDate)}
                        </span>
                        {edu.frontmatter.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {edu.frontmatter.location}
                          </span>
                        )}
                        {edu.frontmatter.gpa && (
                          <span className="px-2 py-0.5 rounded bg-accent/10 text-accent text-xs">
                            GPA: {edu.frontmatter.gpa}
                          </span>
                        )}
                      </div>

                      <p className="text-foreground-secondary mb-3">
                        {edu.frontmatter.field}
                      </p>

                      {/* Honors */}
                      {edu.frontmatter.honors && edu.frontmatter.honors.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {edu.frontmatter.honors.slice(0, 3).map((honor) => (
                            <span
                              key={honor}
                              className="px-2 py-0.5 text-xs rounded bg-accent/10 text-accent"
                            >
                              {honor}
                            </span>
                          ))}
                          {edu.frontmatter.honors.length > 3 && (
                            <span className="px-2 py-0.5 text-xs rounded bg-background border border-border text-muted">
                              +{edu.frontmatter.honors.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

