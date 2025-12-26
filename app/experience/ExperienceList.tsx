'use client';

import { motion } from 'framer-motion';
import { ExperienceCard } from '@/components/ui/ExperienceCard';
import type { ContentItem, JobFrontmatter } from '@/lib/mdx';
import { groupByAcademicTerm, formatAcademicTermDateRangeFromLabel } from '@/lib/utils';

interface ExperienceListProps {
  jobs: ContentItem<JobFrontmatter>[];
}

export function ExperienceList({ jobs }: ExperienceListProps) {
  // Group jobs by academic term (uses term property from frontmatter, not dates)
  const groupedJobs = groupByAcademicTerm(jobs);

  return (
    <div className="pt-24 pb-16">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-display-md md:text-display-lg font-display font-bold text-foreground mb-4 uppercase">
            Experience<span className="text-accent">.</span>
          </h1>
          <p className="text-lg text-foreground-secondary max-w-2xl">
            Professional experience in robotics research, semiconductor validation, and engineering education.
          </p>
        </motion.div>

        {groupedJobs.size > 0 ? (
          Array.from(groupedJobs.entries()).map(([termLabel, termJobs]) => {
            // Get term date range for display based on the term label itself
            const termDateRange = formatAcademicTermDateRangeFromLabel(termLabel);
            
            return (
              <section key={termLabel} className="mb-16">
                <div className="mb-6">
                  <h2 className="text-4xl font-display font-bold text-foreground mb-1">
                    {termLabel}{termDateRange ? ` (${termDateRange})` : ''}
                  </h2>
                  <p className="text-sm text-foreground-secondary">
                    {termJobs.length} {termJobs.length === 1 ? 'Position' : 'Positions'}
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {termJobs.map((job, index) => (
                    <ExperienceCard
                      key={job.slug}
                      slug={job.slug}
                      frontmatter={job.frontmatter}
                      index={index}
                    />
                  ))}
                </div>
              </section>
            );
          })
        ) : (
          <p className="text-foreground-secondary">Experience details coming soon.</p>
        )}
      </div>
    </div>
  );
}

