'use client';

import { useState, useRef, useEffect } from 'react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Timeline3D } from '@/components/ui/Timeline3D';
import { TimelineStatic } from '@/components/ui/TimelineStatic';
import type { TimelineItem } from '@/lib/mdx';

interface TimelineSectionProps {
  items: TimelineItem[];
}

/**
 * TimelineSection Component
 * 
 * Portfolio timeline with two modes:
 * 
 * DYNAMIC (default): 3D camera-movement experience using Three.js
 *   - Camera moves through space toward stationary cards
 *   - Three lanes: Projects, Experience, Activities
 *   - Parallax scrolling effect
 * 
 * STATIC: Traditional three-column list grouped by academic term
 *   - Projects | Experience | Activities columns
 *   - Grouped by: Fall 2024, Winter 2025, Summer 2025, etc.
 */
export function TimelineSection({ items }: TimelineSectionProps) {
  const [isDynamic, setIsDynamic] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const setupScrollObserver = async () => {
      const { default: gsap } = await import('gsap');
      const { default: ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      if (sectionRef.current && stickyRef.current && contentRef.current) {
        // Observer for the toggle button visibility
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top 60%', 
          end: 'bottom 20%',
          onEnter: () => setIsVisible(true),
          onLeave: () => setIsVisible(false),
          onEnterBack: () => setIsVisible(true),
          onLeaveBack: () => setIsVisible(false),
        });

        // Pinning and Wipe logic
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

        // Animate content exit (for the next section, if any, or just to fade out)
        tl.to(contentRef.current, {
          opacity: 0,
          y: -50,
          duration: 1,
          ease: 'power1.in',
        });
      }
    };

    setupScrollObserver();
  }, []);

  if (items.length === 0) {
    return (
      <section id="timeline" className="py-24 md:py-32 bg-background">
        <div className="section-container">
          <SectionHeading
            title="Journey"
            subtitle="My path through education, work, and projects."
          />
          <div className="text-center py-16">
            <p className="text-foreground-secondary">
              Timeline items coming soon. Check back later!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} id="timeline" className="relative h-screen bg-background z-40">
      <div 
        ref={stickyRef} 
        className="h-screen w-full flex items-center justify-center overflow-hidden"
      >
        <div ref={contentRef} className="w-full h-full">
          {/* View Toggle Button - Minimal text button with glow */}
          <ViewToggle 
            isDynamic={isDynamic} 
            isVisible={isVisible} 
            onToggle={() => setIsDynamic(!isDynamic)} 
          />

          {/* Dynamic 3D View */}
          {isDynamic ? (
            <Timeline3D items={items} />
          ) : (
            <TimelineStatic items={items} />
          )}
        </div>
      </div>
    </section>
  );
}

/**
 * ViewToggle - Minimal reactive text button
 * Positioned on the right side above the scroll indicator
 */
interface ViewToggleProps {
  isDynamic: boolean;
  isVisible: boolean;
  onToggle: () => void;
}

function ViewToggle({ isDynamic, isVisible, onToggle }: ViewToggleProps) {
  return (
    <div 
      className={`
        fixed right-8 top-[40%] z-[100] transition-all duration-500 transform
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0 pointer-events-none'}
      `}
    >
      <button
        onClick={onToggle}
        className="
          flex items-center gap-2 px-4 py-2
          text-[10px] font-bold uppercase tracking-widest
          bg-background/80 backdrop-blur-md
          border border-border/50 rounded-lg
          transition-all duration-300
          hover:border-accent hover:text-accent
          hover:shadow-[0_0_20px_rgba(var(--accent-rgb),0.5)]
          group
        "
        aria-label={`Switch to ${isDynamic ? 'list' : '3D'} view`}
      >
        <span>{isDynamic ? 'List View' : '3D View'}</span>
        
        {/* Simple icon that changes */}
        <span className="text-accent group-hover:scale-110 transition-transform">
          {isDynamic ? (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          ) : (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
            </svg>
          )}
        </span>
      </button>
    </div>
  );
}
