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
    startDate = new Date(year, 8, 1); // September 1
    endDate = new Date(year, 11, 31); // December 31
  } else if (month >= 1 && month <= 4) {
    // Winter: January - April
    term = 'Winter';
    startDate = new Date(year, 0, 1); // January 1
    endDate = new Date(year, 3, 30); // April 30
  } else {
    // Summer: May - August
    term = 'Summer';
    startDate = new Date(year, 4, 1); // May 1
    endDate = new Date(year, 7, 31); // August 31
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
 * Formats an academic term date range
 */
export function formatAcademicTermDateRange(termInfo: AcademicTerm): string {
  const startFormatted = formatDate(termInfo.startDate.toISOString().split('T')[0]);
  const endFormatted = formatDate(termInfo.endDate.toISOString().split('T')[0]);
  return `${startFormatted} — ${endFormatted}`;
}

/**
 * Groups items by academic term
 */
export function groupByAcademicTerm<T>(
  items: T[],
  getDate: (item: T) => string
): Map<string, T[]> {
  const grouped = new Map<string, T[]>();

  items.forEach((item) => {
    const date = getDate(item);
    const term = getAcademicTerm(date);
    const key = `${term.term} ${term.year}`;

    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(item);
  });

  // Sort terms: most recent first
  const sortedMap = new Map(
    Array.from(grouped.entries()).sort((a, b) => {
      const termA = getAcademicTerm(getDate(a[1][0]));
      const termB = getAcademicTerm(getDate(b[1][0]));
      if (termA.year !== termB.year) {
        return termB.year - termA.year;
      }
      const order = { Fall: 3, Winter: 2, Summer: 1 };
      return order[termB.term] - order[termA.term];
    })
  );

  return sortedMap;
}

