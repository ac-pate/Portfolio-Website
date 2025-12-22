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
    if (!sectionRef.current || !stickyRef.current || !contentRef.current) return;

    // Pin for 100vh. While pinned, the next section (Experience) will wipe over.
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=100%',
        pin: stickyRef.current,
        pinSpacing: false, 
        scrub: true,
        invalidateOnRefresh: true,
      },
    });

    // Animate content exit synchronized with the incoming wipe
    tl.to(contentRef.current, {
      opacity: 0,
      y: -50,
      duration: 1,
      ease: 'power1.in',
    });

    return () => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    };
  }, []);

  return (
    <section 
      ref={sectionRef} 
      id="projects" 
      className="relative h-screen bg-background z-20"
    >
      <div 
        ref={stickyRef} 
        className="h-screen w-full flex items-center justify-center overflow-hidden"
      >
        <div ref={contentRef} className="section-container w-full">
          <SectionHeading
            title="Featured Projects"
            subtitle="Selected work in robotics, embedded systems, and software."
          />

          {featuredProjects.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-foreground-secondary">
                Projects coming soon.
              </p>
            </div>
          ) : (
            <>
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

              <div className="mt-10 text-center">
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 text-accent font-medium hover:underline"
                >
                  View all projects
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

