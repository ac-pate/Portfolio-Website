'use client';

import { motion } from 'framer-motion';
import { VolunteerCard } from '@/components/ui/VolunteerCard';
import type { ContentItem, VolunteerFrontmatter } from '@/lib/mdx';
import { groupByAcademicTerm, formatAcademicTermDateRangeFromLabel } from '@/lib/utils';

interface VolunteerListProps {
  volunteer: ContentItem<VolunteerFrontmatter>[];
}

export function VolunteerList({ volunteer }: VolunteerListProps) {
  // Group volunteer work by academic term (uses term property from frontmatter, not dates)
  const groupedVolunteer = groupByAcademicTerm(volunteer);

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
            Volunteer Work<span className="text-accent">.</span>
          </h1>
          <p className="text-lg text-foreground-secondary max-w-2xl">
            Leadership roles, community service, and volunteer activities.
          </p>
        </motion.div>

        {groupedVolunteer.size > 0 ? (
          Array.from(groupedVolunteer.entries()).map(([termLabel, termVolunteer]) => {
            // Get term date range for display based on the term label itself
            const termDateRange = formatAcademicTermDateRangeFromLabel(termLabel);
            
            return (
              <section key={termLabel} className="mb-16">
                <div className="mb-6">
                  <h2 className="text-4xl font-display font-bold text-foreground mb-1">
                    {termLabel}{termDateRange ? ` (${termDateRange})` : ''}
                  </h2>
                  <p className="text-sm text-foreground-secondary">
                    {termVolunteer.length} {termVolunteer.length === 1 ? 'Position' : 'Positions'}
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {termVolunteer.map((vol, index) => (
                    <VolunteerCard
                      key={vol.slug}
                      slug={vol.slug}
                      frontmatter={vol.frontmatter}
                      index={index}
                    />
                  ))}
                </div>
              </section>
            );
          })
        ) : (
          <p className="text-foreground-secondary">Volunteer work coming soon.</p>
        )}
      </div>
    </div>
  );
}

