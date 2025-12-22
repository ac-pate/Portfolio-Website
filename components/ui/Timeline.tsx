'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { TimelineItem } from '@/lib/mdx';
import { filterItemsByType, sortTimelineItems, formatDateRange } from '@/lib/timeline';

interface TimelineProps {
  items: TimelineItem[];
  isGSAPMode?: boolean;
}

/**
 * Timeline Component (Static Mode)
 * 
 * Clean, minimal three-column layout for static timeline view.
 * Used as fallback when 3D mode is disabled.
 */
export function Timeline({ items }: TimelineProps) {
  const [isMounted, setIsMounted] = useState(false);
  const sortedItems = sortTimelineItems(items, false); // newest first

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const projectItems = filterItemsByType(sortedItems, 'project');
  const experienceItems = [
    ...filterItemsByType(sortedItems, 'job'),
    ...filterItemsByType(sortedItems, 'education'),
  ];
  const activities = filterItemsByType(sortedItems, 'extracurricular');

  if (!isMounted) {
    return <div className="min-h-[50vh]" />;
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
        {/* Projects Column */}
        <div>
          <h3 className="text-xs font-medium text-muted uppercase tracking-[0.2em] mb-8 pb-2 border-b border-border/30">
            Projects
          </h3>
          <div className="space-y-1">
            {projectItems.length > 0 ? (
              projectItems.map((item) => (
                <TimelineRow key={item.slug} item={item} />
              ))
            ) : (
              <p className="text-sm text-muted italic">No projects yet</p>
            )}
          </div>
        </div>

        {/* Experience Column */}
        <div>
          <h3 className="text-xs font-medium text-muted uppercase tracking-[0.2em] mb-8 pb-2 border-b border-border/30">
            Experience
          </h3>
          <div className="space-y-1">
            {experienceItems.length > 0 ? (
              experienceItems.map((item) => (
                <TimelineRow key={item.slug} item={item} />
              ))
            ) : (
              <p className="text-sm text-muted italic">No experience yet</p>
            )}
          </div>
        </div>

        {/* Activities Column */}
        <div>
          <h3 className="text-xs font-medium text-muted uppercase tracking-[0.2em] mb-8 pb-2 border-b border-border/30">
            Activities
          </h3>
          <div className="space-y-1">
            {activities.length > 0 ? (
              activities.map((item) => (
                <TimelineRow key={item.slug} item={item} />
              ))
            ) : (
              <p className="text-sm text-muted italic">No activities yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * TimelineRow - Minimal single-line entry for static timeline
 */
interface TimelineRowProps {
  item: TimelineItem;
}

function TimelineRow({ item }: TimelineRowProps) {
  const link = item.link || '#';
  const dateRange = formatDateRange(item.date, item.endDate);

  const typeColors: Record<string, string> = {
    project: 'bg-blue-500',
    job: 'bg-emerald-500',
    education: 'bg-violet-500',
    extracurricular: 'bg-amber-500',
  };

  return (
    <Link
      href={link}
      className="group flex items-start gap-3 py-3 border-b border-border/20 hover:border-accent/30 transition-colors"
    >
      {/* Thumbnail */}
      {item.image && (
        <div className="relative w-12 h-12 rounded-md overflow-hidden shrink-0 bg-background-secondary">
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>
      )}
      {!item.image && (
        <div className={`w-2 h-2 mt-2 rounded-full shrink-0 ${typeColors[item.type] || 'bg-muted'}`} />
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-foreground group-hover:text-accent transition-colors truncate">
          {item.title}
        </h4>
        <p className="text-xs text-muted truncate">{item.subtitle}</p>
      </div>

      {/* Date */}
      <span className="text-[10px] text-muted shrink-0 hidden sm:block">
        {dateRange}
      </span>
    </Link>
  );
}
