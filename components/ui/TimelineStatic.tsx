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

interface TimelineStaticProps {
  items: TimelineItem[];
}

export function TimelineStatic({ items }: TimelineStaticProps) {
  // Sort items newest first
  const sortedItems = useMemo(() => sortTimelineItems(items, false), [items]);
  
  // Group by term
  const termGroups = useMemo(() => groupItemsByTerm(sortedItems), [sortedItems]);
  
  // Get terms in reverse order (newest first)
  const termKeys = useMemo(() => {
    const keys = Array.from(termGroups.keys());
    return keys.reverse();
  }, [termGroups]);

  return (
    <div className="py-24 md:py-32">
      <div className="section-container">
        {/* Header */}
        <div className="mb-16">
          <SectionHeading
            title="Journey"
            subtitle="My path through education, work, and projects."
          />
        </div>

        {/* Column Headers */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 px-4">
          <h3 className="text-xs font-medium text-accent uppercase tracking-[0.2em] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            Projects
          </h3>
          <h3 className="text-xs font-medium text-accent uppercase tracking-[0.2em] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Experience
          </h3>
          <h3 className="text-xs font-medium text-accent uppercase tracking-[0.2em] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Activities
          </h3>
        </div>

        {/* Term Sections */}
        {termKeys.map((termKey) => {
          const termItems = termGroups.get(termKey) || [];
          const projects = filterItemsByType(termItems, 'project');
          const experience = [
            ...filterItemsByType(termItems, 'job'),
            ...filterItemsByType(termItems, 'education'),
          ];
          const activities = filterItemsByType(termItems, 'extracurricular');

          // Skip empty terms
          if (projects.length === 0 && experience.length === 0 && activities.length === 0) {
            return null;
          }

          return (
            <div key={termKey} className="mb-16 last:mb-0">
              {/* Term Header */}
              <div className="flex items-center gap-4 mb-6 px-4">
                <h4 className="text-lg font-display font-semibold text-foreground">
                  {termKey}
                </h4>
                <div className="flex-1 h-px bg-border/30" />
                <span className="text-xs text-muted">
                  {termItems.length} {termItems.length === 1 ? 'item' : 'items'}
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4">
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
  const dateRange = formatDateRange(item.date, item.endDate);

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
        <div className="relative w-full h-24 mb-3 rounded-md overflow-hidden bg-background">
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
