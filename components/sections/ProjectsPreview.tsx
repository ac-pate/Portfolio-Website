'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProjectCardWithThumbnail } from '@/components/ui/ProjectCardWithThumbnail';
import type { ContentItem, ProjectFrontmatter } from '@/lib/mdx';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Ensure ScrollTrigger is registered
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ProjectsPreviewProps {
  projects: ContentItem<ProjectFrontmatter>[];
}

export function ProjectsPreview({ projects }: ProjectsPreviewProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Show only featured projects (max 4)
  const featuredProjects = projects
    .filter(p => p.frontmatter.featured)
    .slice(0, 4);

  useEffect(() => {
    // Optional: Add simple fade-in or other non-pinning animations here if desired
  }, []);

  return (
    <section 
      ref={sectionRef} 
      id="projects" 
      className="sticky top-0 min-h-screen bg-background z-20 pb-20 mb-[60vh]"
    >
      <div className="section-container w-full pt-24 md:pt-24">
        {/* Sticky Header */}
        <div className="sticky top-16 z-10 py-2 bg-background/80 backdrop-blur-md -mx-4 px-4 mb-8 border-b border-white/5">
          <SectionHeading
            title="Featured Projects"
            subtitle="Selected work in robotics, embedded systems, and software."
            className="mb-0 md:mb-0"
          />
        </div>

        {featuredProjects.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-foreground-secondary">
              Projects coming soon.
            </p>
          </div>
        ) : (
          <div ref={contentRef}>
            <div className="grid md:grid-cols-2 gap-4 md:gap-8">
              {featuredProjects.map((project, index) => (
                <ProjectCardWithThumbnail
                  key={project.slug}
                  slug={project.slug}
                  frontmatter={project.frontmatter}
                  index={index}
                />
              ))}
            </div>

            <div className="mt-16 text-center">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 text-accent font-medium hover:underline"
              >
                View all projects
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

