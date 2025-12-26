'use client';

import { motion } from 'framer-motion';
import { ProjectCard } from '@/components/ui/ProjectCard';
import type { ContentItem, ProjectFrontmatter } from '@/lib/mdx';
import { groupByAcademicTerm, formatAcademicTermDateRangeFromLabel } from '@/lib/utils';

interface ProjectsListPageProps {
  projects: ContentItem<ProjectFrontmatter>[];
}

export function ProjectsListPage({ projects }: ProjectsListPageProps) {
  // Group projects by academic term (uses term property from frontmatter, not dates)
  const groupedProjects = groupByAcademicTerm(projects);

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
            Projects<span className="text-accent">.</span>
          </h1>
          <p className="text-lg text-foreground-secondary max-w-2xl">
            A collection of my work in robotics, embedded systems, and software engineering.
          </p>
        </motion.div>

        {/* Projects grouped by academic term */}
        {groupedProjects.size > 0 ? (
          Array.from(groupedProjects.entries()).map(([termLabel, termProjects]) => {
            // Get term date range for display based on the term label itself
            const termDateRange = formatAcademicTermDateRangeFromLabel(termLabel);
            
            return (
              <section key={termLabel} className="mb-16">
                <div className="mb-6">
                  <h2 className="text-4xl font-display font-bold text-foreground mb-1">
                    {termLabel}{termDateRange ? ` (${termDateRange})` : ''}
                  </h2>
                  <p className="text-sm text-foreground-secondary">
                    {termProjects.length} {termProjects.length === 1 ? 'Project' : 'Projects'}
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {termProjects.map((project, index) => (
                    <ProjectCard
                      key={project.slug}
                      slug={project.slug}
                      frontmatter={project.frontmatter}
                      index={index}
                    />
                  ))}
                </div>
              </section>
            );
          })
        ) : (
          <p className="text-foreground-secondary">Projects coming soon.</p>
        )}
      </div>
    </div>
  );
}

