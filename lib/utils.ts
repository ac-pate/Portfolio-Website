/**
 * Utility Functions
 * 
 * Common helper functions used throughout the application.
 * - cn: Combines class names (clsx wrapper)
 * - formatDate: Formats date strings for display
 * - formatDateRange: Formats date ranges (e.g., "Jan 2024 — Present")
 * - getYear: Extracts year from date string
 * - slugify: Converts text to URL-friendly slug
 * - truncate: Truncates text to specified length
 */
import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateRange(startDate: string, endDate?: string): string {
  const start = formatDate(startDate);
  const end = endDate ? formatDate(endDate) : 'Present';
  return `${start} — ${end}`;
}

export function getYear(dateString: string): number {
  return new Date(dateString).getFullYear();
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Determines the academic term from a date
 * Academic year runs: Fall (Sep-Dec), Winter (Jan-Apr), Summer (May-Aug)
 */
export interface AcademicTerm {
  term: 'Fall' | 'Winter' | 'Summer';
  year: number;
  label: string; // e.g., "Fall 2024"
  startDate: Date;
  endDate: Date;
}

/**
 * NOTE: This function is NOT being used anymore.
 * Terms are now provided directly via the 'term' property in frontmatter (e.g., "Fall 2025").
 * Keeping this function for backward compatibility, but it's not used for term calculation.
 */
export function getAcademicTerm(dateString: string): AcademicTerm {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 1-12

  let term: 'Fall' | 'Winter' | 'Summer';
  let termYear = year;
  let startDate: Date;
  let endDate: Date;

  if (month >= 9 && month <= 12) {
    // Fall: September - December
    term = 'Fall';
    startDate = new Date(Date.UTC(year, 8, 1)); // September 1 (UTC)
    endDate = new Date(Date.UTC(year, 11, 31)); // December 31 (UTC)
  } else if (month >= 1 && month <= 4) {
    // Winter: January - April
    term = 'Winter';
    startDate = new Date(Date.UTC(year, 0, 1)); // January 1 (UTC)
    endDate = new Date(Date.UTC(year, 3, 30)); // April 30 (UTC)
  } else {
    // Summer: May - August
    term = 'Summer';
    startDate = new Date(Date.UTC(year, 4, 1)); // May 1 (UTC)
    endDate = new Date(Date.UTC(year, 7, 31)); // August 31 (UTC)
  }

  return {
    term,
    year: termYear,
    label: `${term} ${termYear}`,
    startDate,
    endDate,
  };
}

/**
 * Formats an academic term date range from a term label (e.g., "Winter 2025")
 * This calculates the correct date range based on the term, not from a date
 */
export function formatAcademicTermDateRangeFromLabel(termLabel: string): string {
  const [season, yearStr] = termLabel.trim().split(' ');
  const year = parseInt(yearStr || '0', 10);
  
  let startMonth: number, endMonth: number;
  
  if (season === 'Fall') {
    // Fall: September - December
    startMonth = 8; // September (0-indexed)
    endMonth = 11; // December (0-indexed)
  } else if (season === 'Winter') {
    // Winter: January - April
    startMonth = 0; // January (0-indexed)
    endMonth = 3; // April (0-indexed)
  } else {
    // Summer: May - August
    startMonth = 4; // May (0-indexed)
    endMonth = 7; // August (0-indexed)
  }
  
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  const startFormatted = `${monthNames[startMonth]} ${year}`;
  const endFormatted = `${monthNames[endMonth]} ${year}`;
  
  return `${startFormatted} — ${endFormatted}`;
}

/**
 * Formats an academic term date range (legacy function, kept for backward compatibility)
 */
export function formatAcademicTermDateRange(termInfo: AcademicTerm): string {
  // Format dates directly from the Date objects to avoid timezone issues
  const startMonth = termInfo.startDate.getUTCMonth(); // 0-11
  const startYear = termInfo.startDate.getUTCFullYear();
  const endMonth = termInfo.endDate.getUTCMonth(); // 0-11
  const endYear = termInfo.endDate.getUTCFullYear();
  
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  const startFormatted = `${monthNames[startMonth]} ${startYear}`;
  const endFormatted = `${monthNames[endMonth]} ${endYear}`;
  
  return `${startFormatted} — ${endFormatted}`;
}

/**
 * Parses term string (e.g., "Fall 2025") into [year, season]
 */
function parseTermString(term: string): [number, string] {
  const parts = term.trim().split(' ');
  const season = parts[0]; // "Fall", "Winter", or "Summer"
  const year = parseInt(parts[1] || '0', 10);
  return [year, season];
}

/**
 * Groups items by academic term
 * Now uses the 'term' property from items instead of calculating from dates
 * NOTE: Date-based term calculation (getAcademicTerm) is not being used anymore
 */
export function groupByAcademicTerm<T extends { frontmatter: { term: string } }>(
  items: T[],
  getDate?: (item: T) => string // Optional - kept for backward compatibility but not used
): Map<string, T[]> {
  const grouped = new Map<string, T[]>();

  items.forEach((item) => {
    const termKey = item.frontmatter.term; // Use term directly from frontmatter

    if (!termKey) {
      console.warn('Item missing term property:', item);
      return;
    }

    if (!grouped.has(termKey)) {
      grouped.set(termKey, []);
    }

    grouped.get(termKey)!.push(item);
  });

  // Sort terms: most recent first (latest to oldest)
  // Order: Fall (ends latest in year) > Summer > Winter (ends earliest in year)
  const sortedMap = new Map(
    Array.from(grouped.entries()).sort((a, b) => {
      const [aYear, aSeason] = parseTermString(a[0]);
      const [bYear, bSeason] = parseTermString(b[0]);

      if (aYear !== bYear) {
        return bYear - aYear; // Newer year first
      }

      // For same year: Fall (3) > Summer (2) > Winter (1) - because Fall ends latest
      // We want Fall first, then Summer, then Winter (latest to oldest)
      const order = { Fall: 3, Summer: 2, Winter: 1 };
      // In sort: negative means a comes before b
      // We want Fall (3) before Winter (1), so: order[Winter] - order[Fall] = 1 - 3 = -2 (negative) ✓
      return order[bSeason as keyof typeof order] - order[aSeason as keyof typeof order];
    })
  );

  return sortedMap;
}

