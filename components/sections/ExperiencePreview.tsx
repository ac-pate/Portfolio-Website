'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ExperienceCard } from '@/components/ui/ExperienceCard';
import type { ContentItem, JobFrontmatter } from '@/lib/mdx';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Ensure ScrollTrigger is registered
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ExperiencePreviewProps {
  jobs: ContentItem<JobFrontmatter>[];
}

export function ExperiencePreview({ jobs }: ExperiencePreviewProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Show only the latest 3 jobs
  const recentJobs = jobs.slice(0, 3);

  useEffect(() => {
    // Optional: Add simple fade-in or other non-pinning animations here if desired
  }, []);

  return (
    <section 
      ref={sectionRef} 
      id="experience" 
      className="relative min-h-screen bg-background z-30 pb-[40vh]"
    >
      <div className="section-container w-full pt-24 md:pt-32">
        {/* Sticky Header - Z-20 to stay on top */}
        <div className="sticky top-20 z-20 py-4 bg-background/80 backdrop-blur-md -mx-4 px-4 mb-8 border-b border-white/5">
          <SectionHeading
            title="Experience"
            subtitle="Professional experience in robotics, embedded systems, and engineering."
          />
        </div>

        {recentJobs.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-foreground-secondary">
              Experience details coming soon.
            </p>
          </div>
        ) : (
          <div ref={contentRef}>
            <div className="max-w-3xl mx-auto space-y-4">
              {recentJobs.map((job, index) => (
                <ExperienceCard
                  key={job.slug}
                  slug={job.slug}
                  frontmatter={job.frontmatter}
                  index={index}
                />
              ))}
            </div>

            <div className="mt-16 text-center">
              <Link
                href="/experience"
                className="inline-flex items-center gap-2 text-accent font-medium hover:underline"
              >
                View all experience
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
