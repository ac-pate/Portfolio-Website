'use client';

import { motion } from 'framer-motion';
import { ExtracurricularCard } from '@/components/ui/ExtracurricularCard';
import type { ContentItem, ExtracurricularFrontmatter } from '@/lib/mdx';
import { groupByAcademicTerm, getAcademicTerm, formatAcademicTermDateRange } from '@/lib/utils';

interface ExtracurricularListProps {
  extracurricular: ContentItem<ExtracurricularFrontmatter>[];
}

export function ExtracurricularList({ extracurricular }: ExtracurricularListProps) {
  // Group extracurricular activities by academic term
  const groupedActivities = groupByAcademicTerm(
    extracurricular,
    (ec) => ec.frontmatter.startDate
  );

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
            Extracurricular<span className="text-accent">.</span>
          </h1>
          <p className="text-lg text-foreground-secondary max-w-2xl">
            Competitions, workshops, events, and other activities beyond academics.
          </p>
        </motion.div>

        {groupedActivities.size > 0 ? (
          Array.from(groupedActivities.entries()).map(([termLabel, termActivities]) => {
            // Get term date range for display
            const firstActivity = termActivities[0];
            const termInfo = getAcademicTerm(firstActivity.frontmatter.startDate);
            const termDateRange = formatAcademicTermDateRange(termInfo);
            
            return (
              <section key={termLabel} className="mb-16">
                <div className="mb-6">
                  <h2 className="text-xl font-display font-semibold text-foreground mb-1">
                    {termLabel} ({termDateRange})
                  </h2>
                  <p className="text-sm text-foreground-secondary">
                    {termActivities.length} {termActivities.length === 1 ? 'Activity' : 'Activities'}
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {termActivities.map((activity, index) => (
                    <ExtracurricularCard
                      key={activity.slug}
                      slug={activity.slug}
                      frontmatter={activity.frontmatter}
                      index={index}
                    />
                  ))}
                </div>
              </section>
            );
          })
        ) : (
          <p className="text-foreground-secondary">Extracurricular activities coming soon.</p>
        )}
      </div>
    </div>
  );
}

