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

