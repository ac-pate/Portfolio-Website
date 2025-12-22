/**
 * TimelineCard Component
 * 
 * Compact, information-dense card optimized for timeline display.
 * Shows title, subtitle, date range, thumbnail, and tags.
 * 
 * Includes Studio Lumio-inspired effects:
 * - Grainy glow shadow on hover (Three.js Enhanced)
 * - Distortion effect on images
 * - Glitch text effect on title hover
 * 
 * Props:
 * - item: TimelineItem with type, date, title, subtitle, tags, image, etc.
 */

import Link from 'next/link';
import Image from 'next/image';
import { formatDateRange } from '@/lib/timeline';
import GlowWrapper from '@/components/ui/GlowWrapper';

interface TimelineCardProps {
  item: {
    type: 'project' | 'job' | 'education' | 'extracurricular';
    date: string;
    endDate?: string;
    title: string;
    subtitle: string;
    description?: string;
    tags?: string[];
    slug?: string;
    link?: string;
    image?: string;
  };
}

export function TimelineCard({ item }: TimelineCardProps) {
  const dateRange = formatDateRange(item.date, item.endDate);
  const displayTags = item.tags?.slice(0, 3) || [];
  const cardLink = item.link || '#';

  return (
    <Link href={cardLink} className="block h-full">
      <GlowWrapper className="rounded-lg h-full" preset="card">
        <div className="glass group relative h-full flex flex-col overflow-hidden rounded-lg border border-transparent bg-background-secondary/30 p-4 transition-all duration-300 hover:border-accent/40 hover:bg-background-secondary/50">
          
          {/* Thumbnail with distortion effect */}
          {item.image && (
            <div className="relative mb-3 h-32 w-full overflow-hidden rounded-md bg-gradient-to-b from-accent/10 to-transparent distort-hover">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {/* Grainy overlay on hover only for image */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none mix-blend-overlay"
                style={{
                  backgroundImage: 'url(/noise.png)',
                  backgroundSize: '128px 128px',
                }}
              />
            </div>
          )}

          {/* Content */}
          <div className="flex flex-1 flex-col">
            {/* Date Range */}
            <p className="mb-2 text-xs font-medium text-muted uppercase tracking-wide">
              {dateRange}
            </p>

            {/* Title with subtle glitch on hover */}
            <h3 
              className="glitch-hover mb-1 line-clamp-2 text-sm font-semibold text-foreground group-hover:text-accent transition-colors duration-300"
              data-text={item.title}
            >
              {item.title}
            </h3>

            {/* Subtitle */}
            {item.subtitle && (
              <p className="mb-2 text-xs text-foreground-secondary line-clamp-1">
                {item.subtitle}
              </p>
            )}

            {/* Type Badge */}
            <div className="mb-3 inline-flex w-fit">
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getTypeBadgeStyle(item.type)}`}>
                {getTypeLabel(item.type)}
              </span>
            </div>

            {/* Tags */}
            {displayTags.length > 0 && (
              <div className="mt-auto flex flex-wrap gap-1">
                {displayTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Hover indicator with glitch animation */}
          <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <svg
              className="h-4 w-4 text-accent"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{
                filter: 'drop-shadow(0 0 4px rgba(128, 0, 32, 0.5))',
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7m0 0l-7 7m7-7H5"
              />
            </svg>
          </div>
        </div>
      </GlowWrapper>
    </Link>
  );
}

/**
 * Gets the badge background color based on item type.
 */
function getTypeBadgeStyle(type: string): string {
  const styles: Record<string, string> = {
    project: 'bg-blue-500/20 text-blue-400',
    job: 'bg-green-500/20 text-green-400',
    education: 'bg-purple-500/20 text-purple-400',
    extracurricular: 'bg-yellow-500/20 text-yellow-400',
  };
  
  return styles[type] || 'bg-gray-500/20 text-gray-400';
}

/**
 * Gets the display label for item type.
 */
function getTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    project: 'Project',
    job: 'Job',
    education: 'Education',
    extracurricular: 'Extracurricular',
  };
  
  return labels[type] || 'Item';
}
