/**
 * TimelineStatic Component
 * 
 * Static three-column timeline view grouped by academic term.
 * 
 * Layout:
 * - Column 1: Projects
 * - Column 2: Experience (Jobs + Education)
 * - Column 3: Extracurriculars
 * 
 * Grouped by term: Summer 2025, Winter 2025, Fall 2024, etc.
 * Newest terms at top, scroll down for older content.
 */
'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { TimelineItem } from '@/lib/mdx';
import { 
  sortTimelineItems, 
  groupItemsByTerm, 
  filterItemsByType,
  formatDateRange 
} from '@/lib/timeline';
import { SectionHeading } from '@/components/ui/SectionHeading';
import GlowWrapper from '@/components/ui/GlowWrapper';

interface TimelineStaticProps {
  items: TimelineItem[];
  onToggleView: () => void;
}

export function TimelineStatic({ items, onToggleView }: TimelineStaticProps) {
  // Sort items newest first
  const sortedItems = useMemo(() => sortTimelineItems(items, false), [items]);
  
  // Group by term (only in starting term - no duplicates)
  const termGroups = useMemo(() => groupItemsByTerm(sortedItems, false), [sortedItems]);
  
  // Get terms in descending order (newest first) using term property
  // Example term format: "Fall 2024", "Winter 2025", "Summer 2024"
  const termKeys = useMemo(() => {
    const keys = Array.from(termGroups.keys());
    // Sort in descending order (newest first)
    return keys.sort((a, b) => {
      // Parse term: "Fall 2024" -> season="Fall", year=2024
      const partsA = a.split(' ');
      const partsB = b.split(' ');
      const seasonA = partsA[0]; // "Fall", "Winter", "Summer"
      const seasonB = partsB[0];
      const yearA = parseInt(partsA[1] || '0', 10);
      const yearB = parseInt(partsB[1] || '0', 10);

      // Compare years first (descending - newer years first)
      if (yearA !== yearB) {
        return yearB - yearA; // Descending: 2025 before 2024
      }

      // Within same year, compare seasons (descending: Fall > Summer > Winter)
      // Academic year: Fall (start) -> Winter -> Summer (end)
      // Chronologically for display: Fall is later in calendar year
      const seasonOrder: Record<string, number> = { Winter: 1, Summer: 2, Fall: 3 };
      return (seasonOrder[seasonB] || 0) - (seasonOrder[seasonA] || 0); // Descending
    });
  }, [termGroups]);

  return (
    <div className="pb-20">
      <div className="section-container">
        {/* Sticky Header Group */}
        <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md -mx-4 px-4 pt-4 md:pt-16 pb-4 border-b border-white/5">
          {/* Header Title & Button */}
          <div className="mb-0 relative">
            <SectionHeading
              title="Journey"
              subtitle="My path through education, work, and projects."
              className="mb-0"
            />
            
            {/* View Toggle Button */}
            <div className="absolute top-0 right-0 hidden md:block overflow-visible">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <GlowWrapper preset="button" className="rounded-full">
                  <button
                    onClick={onToggleView}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-medium uppercase tracking-wider text-muted hover:text-accent bg-background-secondary/50 border border-border rounded-full transition-all"
                  >
                    <span>3D View</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                      <polyline points="2 17 12 22 22 17"></polyline>
                      <polyline points="2 12 12 17 22 12"></polyline>
                    </svg>
                  </button>
                </GlowWrapper>
              </motion.div>
            </div>
          </div>

          {/* Column Headers */}
          <div className="flex justify-center gap-24 md:gap-36 lg:gap-48 -mt-8">
            <span className="relative text-sm font-medium text-muted uppercase tracking-[0.15em] pb-1">
              Projects
              <span className="absolute bottom-0 left-0 right-0 h-px bg-blue-500 shadow-[0_0_10px_2px_rgba(59,130,246,0.8)]" />
            </span>
            <span className="relative text-sm font-medium text-muted uppercase tracking-[0.15em] pb-1">
              Experience
              <span className="absolute bottom-0 left-0 right-0 h-px bg-emerald-500 shadow-[0_0_10px_2px_rgba(16,185,129,0.8)]" />
            </span>
            <span className="relative text-sm font-medium text-muted uppercase tracking-[0.15em] pb-1">
              Activities
              <span className="absolute bottom-0 left-0 right-0 h-px bg-amber-500 shadow-[0_0_10px_2px_rgba(245,158,11,0.8)]" />
            </span>
          </div>
        </div>

        {/* Term Sections */}
        {termKeys.map((termKey) => {
          const termItems = termGroups.get(termKey) || [];
          
          // Deduplicate items within each term using unique identifier
          const seenItems = new Set<string>();
          const uniqueTermItems = termItems.filter((item) => {
            const itemId = item.slug || item.link || `${item.title}-${item.term}`;
            if (seenItems.has(itemId)) {
              return false;
            }
            seenItems.add(itemId);
            return true;
          });
          
          const projects = filterItemsByType(uniqueTermItems, 'project');
          const experience = [
            ...filterItemsByType(uniqueTermItems, 'job'),
            ...filterItemsByType(uniqueTermItems, 'education'),
          ];
          const activities = filterItemsByType(uniqueTermItems, 'extracurricular');

          // Skip empty terms
          if (projects.length === 0 && experience.length === 0 && activities.length === 0) {
            return null;
          }

          return (
            <div key={termKey} className="mb-16 last:mb-0">
              {/* Term Header */}
              <div className="flex items-center gap-4 mb-6 px-8 md:px-12 lg:px-16">
                <h4 className="text-3xl font-display font-semibold text-foreground">
                  {termKey}
                </h4>
                <div className="flex-1 h-px bg-border/30" />
                <span className="text-xs text-muted">
                  {termItems.length} {termItems.length === 1 ? 'item' : 'items'}
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-8 md:px-12 lg:px-16">
                {/* Projects Column */}
                <div className="space-y-3">
                  {projects.length > 0 ? (
                    projects.map((item, idx) => (
                      <StaticCard key={`proj-${termKey}-${item.slug}-${idx}`} item={item} />
                    ))
                  ) : (
                    <EmptyColumn />
                  )}
                </div>

                {/* Experience Column */}
                <div className="space-y-3">
                  {experience.length > 0 ? (
                    experience.map((item, idx) => (
                      <StaticCard key={`exp-${termKey}-${item.slug}-${idx}`} item={item} />
                    ))
                  ) : (
                    <EmptyColumn />
                  )}
                </div>

                {/* Activities Column */}
                <div className="space-y-3">
                  {activities.length > 0 ? (
                    activities.map((item, idx) => (
                      <StaticCard key={`act-${termKey}-${item.slug}-${idx}`} item={item} />
                    ))
                  ) : (
                    <EmptyColumn />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * StaticCard - Minimal card for static view
 */
interface StaticCardProps {
  item: TimelineItem;
}

function StaticCard({ item }: StaticCardProps) {
  const link = item.link || '#';
  const dateRange = item.date ? formatDateRange(item.date, item.endDate) : '';

  const typeColors: Record<string, string> = {
    project: 'border-l-blue-500',
    job: 'border-l-emerald-500',
    education: 'border-l-violet-500',
    extracurricular: 'border-l-amber-500',
  };

  return (
      <Link
        href={link}
        className={`
          group block p-4 rounded-lg 
          bg-background-secondary/30 border border-border/30
          border-l-2 ${typeColors[item.type] || 'border-l-muted'}
          hover:bg-background-secondary/50 hover:border-accent/30
        transition-all duration-300
        `}
      >
        {/* Thumbnail */}
        {item.image && (
          <div className="relative w-full aspect-[5/3] mb-3 rounded-md overflow-hidden bg-background">
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}

        {/* Date */}
        <span className="text-[10px] text-muted uppercase tracking-wider">
          {dateRange}
        </span>

        {/* Title */}
        <h5 className="mt-1 text-sm font-medium text-foreground group-hover:text-accent transition-colors line-clamp-2">
          {item.title}
        </h5>

        {/* Subtitle */}
        {item.subtitle && (
          <p className="mt-1 text-xs text-foreground-secondary line-clamp-1">
            {item.subtitle}
          </p>
        )}

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {item.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="px-1.5 py-0.5 text-[9px] text-muted bg-background rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </Link>
  );
}

/**
 * EmptyColumn - Placeholder for empty columns
 */
function EmptyColumn() {
  return (
    <div className="py-4 text-center">
      <span className="text-xs text-muted/50 italic">—</span>
    </div>
  );
}

export default TimelineStatic;
