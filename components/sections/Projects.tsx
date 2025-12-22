'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProjectCard } from '@/components/ui/ProjectCard';
import type { ContentItem, ProjectFrontmatter } from '@/lib/mdx';

interface ProjectsProps {
  projects: ContentItem<ProjectFrontmatter>[];
  showAll?: boolean;
}

export function Projects({ projects, showAll = false }: ProjectsProps) {
  const displayProjects = showAll ? projects : projects.slice(0, 6);

  return (
    <section id="projects" className="py-24 md:py-32 bg-background-secondary/30">
      <div className="section-container">
        <SectionHeading
          title="Featured Work"
          subtitle="A selection of projects that showcase my skills and interests."
        />

        {projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center py-16"
          >
            <p className="text-foreground-secondary">
              Projects coming soon. Check back later!
            </p>
          </motion.div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayProjects.map((project, index) => (
                <ProjectCard
                  key={project.slug}
                  slug={project.slug}
                  frontmatter={project.frontmatter}
                  index={index}
                />
              ))}
            </div>

            {!showAll && projects.length > 6 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-12 text-center"
              >
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 text-accent font-medium hover:underline"
                >
                  View all projects
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

