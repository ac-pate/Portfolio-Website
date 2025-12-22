'use client';

import { motion } from 'framer-motion';
import { ExperienceCard } from '@/components/ui/ExperienceCard';
import type { ContentItem, JobFrontmatter } from '@/lib/mdx';

interface ExperienceListProps {
  jobs: ContentItem<JobFrontmatter>[];
}

export function ExperienceList({ jobs }: ExperienceListProps) {
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
            Experience<span className="text-accent">.</span>
          </h1>
          <p className="text-lg text-foreground-secondary max-w-2xl">
            Professional experience in robotics research, semiconductor validation, and engineering education.
          </p>
        </motion.div>

        {jobs.length === 0 ? (
          <p className="text-foreground-secondary">Experience details coming soon.</p>
        ) : (
          <div className="max-w-3xl space-y-4">
            {jobs.map((job, index) => (
              <ExperienceCard
                key={job.slug}
                slug={job.slug}
                frontmatter={job.frontmatter}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

