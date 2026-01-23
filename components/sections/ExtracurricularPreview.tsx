'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ExtracurricularCardWithThumbnail } from '@/components/ui/ExtracurricularCardWithThumbnail';
import type { ContentItem, ExtracurricularFrontmatter } from '@/lib/mdx';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Ensure ScrollTrigger is registered
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ExtracurricularPreviewContent {
  subtitle: string;
}

interface ExtracurricularPreviewProps {
  extracurricular: ContentItem<ExtracurricularFrontmatter>[];
  content: ExtracurricularPreviewContent;
}

export function ExtracurricularPreview({ extracurricular, content }: ExtracurricularPreviewProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Show only featured extracurricular (max 6)
  // Sort: by start date (newest first)
  const featuredExtracurricular = extracurricular
    .filter(ec => ec.frontmatter.featured)
    .sort((a, b) => {
      // Sort by start date (newest first)
      const aDate = a.frontmatter.startDate ? new Date(a.frontmatter.startDate).getTime() : 0;
      const bDate = b.frontmatter.startDate ? new Date(b.frontmatter.startDate).getTime() : 0;
      return bDate - aDate; // Descending order (newest first)
    })
    .slice(0, 6);

  useEffect(() => {
    // Optional: Add simple fade-in or other non-pinning animations here if desired
  }, []);

  return (
    <section 
      ref={sectionRef} 
      id="extracurricular" 
      className="sticky top-0 min-h-screen bg-background z-20 pb-20 mb-[60vh]"
    >
      {/* <div className="section-container w-full pt-24 md:pt-24"> */}
      <div className="section-container w-full relative z-10 pt-12 lg:px-4">
        {/* Sticky Header */}
        <div className="sticky top-16 z-10 py-1.5 bg-background/80 backdrop-blur-md -mx-2 px-2 mb-6 border-b border-white/5">
          <SectionHeading
            title="Featured Extracurricular"
            subtitle={content.subtitle}
            className="!mb-0"
          />
        </div>

        {featuredExtracurricular.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-foreground-secondary">
              Extracurricular activities coming soon.
            </p>
          </div>
        ) : (
          <div ref={contentRef}>
            <div className="grid md:grid-cols-2 gap-4 md:gap-8">
              {featuredExtracurricular.map((item, index) => (
                <ExtracurricularCardWithThumbnail
                  key={item.slug}
                  slug={item.slug}
                  frontmatter={item.frontmatter}
                  index={index}
                />
              ))}
            </div>

            <div className="mt-16 text-center">
              <Link
                href="/extracurricular"
                className="inline-flex items-center gap-2 text-accent font-medium hover:underline"
              >
                View all extracurricular activities
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
