'use client';

import { motion } from 'framer-motion';
import { ExtracurricularCard } from '@/components/ui/ExtracurricularCard';
import type { ContentItem, ExtracurricularFrontmatter, VolunteerFrontmatter } from '@/lib/mdx';
import { groupByAcademicTerm, formatAcademicTermDateRangeFromLabel } from '@/lib/utils';

interface ExtracurricularListProps {
  extracurricular: ContentItem<ExtracurricularFrontmatter>[];
  volunteer: ContentItem<VolunteerFrontmatter>[];
}

// Extended type to include basePath for routing
interface ExtracurricularWithBasePath extends ContentItem<ExtracurricularFrontmatter> {
  basePath?: string;
}

export function ExtracurricularList({ extracurricular, volunteer }: ExtracurricularListProps) {
  // Convert volunteer items to extracurricular format so they use the same cards
  const volunteerAsExtracurricular: ExtracurricularWithBasePath[] = volunteer.map((vol) => ({
    slug: vol.slug,
    content: vol.content,
    basePath: '/volunteer', // Route to /volunteer/[slug]
    frontmatter: {
      title: vol.frontmatter.title,
      term: vol.frontmatter.term,
      description: vol.frontmatter.description,
      startDate: vol.frontmatter.startDate,
      endDate: vol.frontmatter.endDate,
      type: 'volunteer' as const,
      location: undefined,
      tags: [vol.frontmatter.organization],
      image: vol.frontmatter.image,
      coverImage: vol.frontmatter.coverImage,
      link: undefined,
      award: undefined,
      featured: vol.frontmatter.featured,
      galleryImages: vol.frontmatter.galleryImages,
    },
  }));

  // Add basePath to regular extracurricular items
  const extracurricularWithBasePath: ExtracurricularWithBasePath[] = extracurricular.map((item) => ({
    ...item,
    basePath: '/extracurricular',
  }));

  // Combine both lists
  const allActivities = [...extracurricularWithBasePath, ...volunteerAsExtracurricular];
  
  // Group all activities by academic term
  const groupedActivities = groupByAcademicTerm(allActivities as ContentItem<ExtracurricularFrontmatter>[]);

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
            Extracurricular<span className="text-accent">.</span>
          </h1>
          <p className="text-lg text-foreground-secondary max-w-2xl">
            Competitions, Events, Workshops, Leadership roles, and Volunteer Activities beyond academics and jobs.
          </p>
        </motion.div>

        {groupedActivities.size > 0 ? (
          Array.from(groupedActivities.entries()).map(([termLabel, termActivities]) => {
            // Get term date range for display based on the term label itself
            const termDateRange = formatAcademicTermDateRangeFromLabel(termLabel);
            
            return (
              <section key={termLabel} className="mb-16">
                <div className="mb-6 relative z-10">
                  <h2 className="text-4xl font-display font-bold text-foreground mb-1">
                    {termLabel}{termDateRange ? ` (${termDateRange})` : ''}
                  </h2>
                  <p className="text-sm text-foreground-secondary">
                    {termActivities.length} {termActivities.length === 1 ? 'Activity' : 'Activities'}
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {termActivities.map((activity, index) => {
                    // Cast to access basePath if present
                    const activityWithPath = activity as ExtracurricularWithBasePath;
                    return (
                      <ExtracurricularCard
                        key={`${activityWithPath.basePath || ''}-${activity.slug}`}
                        slug={activity.slug}
                        frontmatter={activity.frontmatter}
                        index={index}
                        basePath={activityWithPath.basePath}
                      />
                    );
                  })}
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

