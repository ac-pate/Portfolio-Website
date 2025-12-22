'use client';

import { motion } from 'framer-motion';
import { ProjectCardWithThumbnail } from '@/components/ui/ProjectCardWithThumbnail';
import type { ContentItem, ProjectFrontmatter } from '@/lib/mdx';

interface ProjectsListPageProps {
  projects: ContentItem<ProjectFrontmatter>[];
}

export function ProjectsListPage({ projects }: ProjectsListPageProps) {
  const featuredProjects = projects.filter(p => p.frontmatter.featured);
  const otherProjects = projects.filter(p => !p.frontmatter.featured);

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
            Projects<span className="text-accent">.</span>
          </h1>
          <p className="text-lg text-foreground-secondary max-w-2xl">
            A collection of my work in robotics, embedded systems, and software engineering.
          </p>
        </motion.div>

        {/* Featured Projects */}
        {featuredProjects.length > 0 && (
          <section className="mb-16">
            <h2 className="text-xl font-display font-semibold text-foreground mb-6">Featured</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {featuredProjects.map((project, index) => (
                <ProjectCardWithThumbnail
                  key={project.slug}
                  slug={project.slug}
                  frontmatter={project.frontmatter}
                  index={index}
                />
              ))}
            </div>
          </section>
        )}

        {/* Other Projects */}
        {otherProjects.length > 0 && (
          <section>
            <h2 className="text-xl font-display font-semibold text-foreground mb-6">Other Projects</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {otherProjects.map((project, index) => (
                <ProjectCardWithThumbnail
                  key={project.slug}
                  slug={project.slug}
                  frontmatter={project.frontmatter}
                  index={index}
                />
              ))}
            </div>
          </section>
        )}

        {projects.length === 0 && (
          <p className="text-foreground-secondary">Projects coming soon.</p>
        )}
      </div>
    </div>
  );
}

