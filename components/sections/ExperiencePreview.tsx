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
    if (!sectionRef.current || !stickyRef.current || !contentRef.current) return;

    // Pin for 100vh. While pinned, the next section (Timeline) will wipe over.
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
      id="experience" 
      className="relative h-screen bg-background z-30"
    >
      <div 
        ref={stickyRef} 
        className="h-screen w-full flex items-center justify-center overflow-hidden"
      >
        <div ref={contentRef} className="section-container w-full">
          <SectionHeading
            title="Experience"
            subtitle="Professional experience in robotics, embedded systems, and engineering."
          />

          {recentJobs.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-foreground-secondary">
                Experience details coming soon.
              </p>
            </div>
          ) : (
            <>
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

              <div className="mt-10 text-center">
                <Link
                  href="/experience"
                  className="inline-flex items-center gap-2 text-accent font-medium hover:underline"
                >
                  View all experience
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

