/**
 * TermIndicator Component
 * 
 * Minimal sidebar showing current term during timeline scroll.
 * Only visible when scrolling within the timeline section.
 */
'use client';

import { useEffect, useState, useRef } from 'react';

interface TermIndicatorProps {
  termKeys: string[];
}

export function TermIndicator({ termKeys }: TermIndicatorProps) {
  // Sort termKeys in descending order (newest first) using proper date/season logic
  const sortedTermKeys = [...termKeys].sort((a, b) => {
    const [aYear, aSeason] = a.split(' ');
    const [bYear, bSeason] = b.split(' ');

    // Compare years first (descending - newer years first)
    const yearA = parseInt(aYear);
    const yearB = parseInt(bYear);
    if (yearA !== yearB) {
      return yearB - yearA; // Descending order
    }

    // Then compare seasons (descending: Summer > Winter > Fall)
    const seasonOrder: Record<string, number> = { Fall: 1, Winter: 2, Summer: 3 };
    return seasonOrder[bSeason] - seasonOrder[aSeason]; // Descending order
  });
  
  const [activeTerm, setActiveTerm] = useState<string>(sortedTermKeys[0] || '');
  const [isInTimeline, setIsInTimeline] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || typeof window === 'undefined') return;

    const setupScrollTriggers = async () => {
      try {
        const { default: gsap } = await import('gsap');
        const { default: ScrollTrigger } = await import('gsap/ScrollTrigger');

        gsap.registerPlugin(ScrollTrigger);

        // Show/hide based on timeline section visibility
        ScrollTrigger.create({
          trigger: '#timeline',
          start: 'top 80%',
          end: 'bottom 20%',
          onEnter: () => setIsInTimeline(true),
          onLeave: () => setIsInTimeline(false),
          onEnterBack: () => setIsInTimeline(true),
          onLeaveBack: () => setIsInTimeline(false),
        });

        // Track active term
        const termSections = document.querySelectorAll('[data-term-key]');
        termSections.forEach((section) => {
          const termKey = section.getAttribute('data-term-key');
          if (!termKey) return;

          ScrollTrigger.create({
            trigger: section as HTMLElement,
            start: 'top center',
            end: 'bottom center',
            onEnter: () => setActiveTerm(termKey),
            onEnterBack: () => setActiveTerm(termKey),
          });
        });

        return () => {
          ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
      } catch (error) {
        console.warn('TermIndicator setup error:', error);
      }
    };

    const timer = setTimeout(setupScrollTriggers, 100);
    return () => clearTimeout(timer);
  }, [isMounted, termKeys]);

  if (!isMounted || termKeys.length === 0) return null;

  return (
    <div
      className={`
        fixed right-8 top-1/2 -translate-y-1/2 z-40 
        hidden lg:flex flex-col items-end gap-2
        transition-all duration-500
        ${isInTimeline ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 pointer-events-none'}
      `}
    >
      {sortedTermKeys.map((termKey) => {
        const isActive = activeTerm === termKey;

        return (
          <button
            key={termKey}
            onClick={() => {
              const section = document.querySelector(`[data-term-key="${termKey}"]`);
              if (section) {
                section.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }}
            className={`
              flex items-center gap-3 transition-all duration-300 group
              ${isActive ? 'opacity-100' : 'opacity-40 hover:opacity-70'}
            `}
          >
            <span
              className={`
                text-[11px] font-medium uppercase tracking-widest transition-all duration-300
                ${isActive ? 'text-accent' : 'text-muted group-hover:text-foreground-secondary'}
              `}
            >
              {termKey}
            </span>
            <div
              className={`
                w-2 h-2 rounded-full transition-all duration-300
                ${isActive ? 'bg-accent scale-150' : 'bg-muted/50 group-hover:bg-muted'}
              `}
            />
          </button>
        );
      })}
    </div>
  );
}
