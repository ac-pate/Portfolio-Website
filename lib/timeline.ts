/**
 * Timeline Utilities
 * 
 * Helper functions for academic term detection, grouping, and sorting.
 * Supports organizing timeline items by academic terms (Fall, Winter, Summer).
 * 
 * Academic Calendar:
 * - Fall: September (9) - December (12)
 * - Winter: January (1) - April (4)
 * - Summer: May (5) - August (8)
 */

export interface AcademicTerm {
  term: 'Fall' | 'Winter' | 'Summer';
  year: number;
}

export interface TermGroup {
  termKey: string; // e.g., "Fall 2022"
  term: AcademicTerm;
  items: any[];
}

/**
 * Detects the academic term from a given date string.
 * 
 * @param dateString - ISO date string or any valid date format
 * @returns Object with term name and year
 * 
 * @example
 * getAcademicTerm('2022-09-15') // { term: 'Fall', year: 2022 }
 * getAcademicTerm('2023-02-20') // { term: 'Winter', year: 2023 }
 * getAcademicTerm('2023-06-01') // { term: 'Summer', year: 2023 }
 */
export function getAcademicTerm(dateString: string): AcademicTerm {
  const date = new Date(dateString);
  const month = date.getMonth() + 1; // 1-12
  const year = date.getFullYear();

  // Academic calendar:
  // Fall: September (9) - December (12)
  // Winter: January (1) - April (4)
  // Summer: May (5) - August (8)

  if (month >= 9 && month <= 12) {
    return { term: 'Fall', year };
  } else if (month >= 1 && month <= 4) {
    return { term: 'Winter', year };
  } else {
    return { term: 'Summer', year };
  }
}

/**
 * Generates a sortable term key from an academic term.
 * Format: "YYYY-0X-TermName" where 0X is 01 (Fall), 02 (Winter), 03 (Summer)
 * 
 * This allows terms to sort correctly by year and season.
 * 
 * @param term - Academic term object
 * @returns Sortable key string
 * 
 * @example
 * getTermSortKey({ term: 'Fall', year: 2022 })    // "2022-01-Fall"
 * getTermSortKey({ term: 'Winter', year: 2023 })  // "2023-02-Winter"
 * getTermSortKey({ term: 'Summer', year: 2023 })  // "2023-03-Summer"
 */
export function getTermSortKey(term: AcademicTerm): string {
  const seasonOrder: Record<string, number> = {
    Fall: 1,
    Winter: 2,
    Summer: 3,
  };

  const order = seasonOrder[term.term];
  return `${term.year}-${String(order).padStart(2, '0')}-${term.term}`;
}

/**
 * Generates a human-readable term label.
 * 
 * @param term - Academic term object
 * @returns Display string e.g., "Fall 2022"
 * 
 * @example
 * getTermLabel({ term: 'Fall', year: 2022 })    // "Fall 2022"
 * getTermLabel({ term: 'Winter', year: 2023 })  // "Winter 2023"
 */
export function getTermLabel(term: AcademicTerm): string {
  return `${term.term} ${term.year}`;
}

/**
 * Checks if a date falls within a given academic term.
 * 
 * @param dateString - ISO date string to check
 * @param term - Academic term to check against
 * @returns True if date falls within the term
 * 
 * @example
 * isDateInTerm('2022-09-15', { term: 'Fall', year: 2022 })  // true
 * isDateInTerm('2022-08-15', { term: 'Fall', year: 2022 })  // false
 */
export function isDateInTerm(dateString: string, term: AcademicTerm): boolean {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  // Check year first
  if (year !== term.year) {
    return false;
  }

  // Check month based on term
  if (term.term === 'Fall') {
    return month >= 9 && month <= 12;
  } else if (term.term === 'Winter') {
    return month >= 1 && month <= 4;
  } else {
    return month >= 5 && month <= 8;
  }
}

/**
 * Checks if a date range overlaps with a given academic term.
 * Useful for items that span multiple terms.
 * 
 * @param startDate - ISO date string
 * @param endDate - ISO date string (optional)
 * @param term - Academic term to check against
 * @returns True if date range overlaps with the term
 */
export function isDateRangeInTerm(
  startDate: string,
  endDate: string | undefined,
  term: AcademicTerm
): boolean {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : start;

  // Get the date range of the academic term
  const termStart = getTermStartDate(term);
  const termEnd = getTermEndDate(term);

  // Check if ranges overlap
  return start <= termEnd && end >= termStart;
}

/**
 * Gets the start date of an academic term.
 * 
 * @param term - Academic term
 * @returns Date object for the start of the term
 * 
 * @example
 * getTermStartDate({ term: 'Fall', year: 2022 })    // 2022-09-01
 * getTermStartDate({ term: 'Winter', year: 2023 })  // 2023-01-01
 * getTermStartDate({ term: 'Summer', year: 2023 })  // 2023-05-01
 */
export function getTermStartDate(term: AcademicTerm): Date {
  const monthMap: Record<string, number> = {
    Fall: 9,
    Winter: 1,
    Summer: 5,
  };

  const month = monthMap[term.term];
  return new Date(Date.UTC(term.year, month - 1, 1));
}

/**
 * Gets the end date of an academic term.
 * 
 * @param term - Academic term
 * @returns Date object for the end of the term
 * 
 * @example
 * getTermEndDate({ term: 'Fall', year: 2022 })    // 2022-12-31
 * getTermEndDate({ term: 'Winter', year: 2023 })  // 2023-04-30
 * getTermEndDate({ term: 'Summer', year: 2023 })  // 2023-08-31
 */
export function getTermEndDate(term: AcademicTerm): Date {
  const monthMap: Record<string, number> = {
    Fall: 12,
    Winter: 4,
    Summer: 8,
  };

  const month = monthMap[term.term];
  const year = term.term === 'Winter' && month === 4 ? term.year : term.year;

  // Last day of the month at 23:59:59 UTC
  return new Date(Date.UTC(year, month, 0, 23, 59, 59));
}

/**
 * Groups timeline items by academic term.
 * 
 * Items are placed ONLY in their starting term (no duplicates across terms).
 * Results are sorted chronologically (oldest → newest).
 * 
 * @param items - Array of timeline items with date and optional endDate
 * @param includeAllTerms - If true, items spanning multiple terms appear in all terms (default: false)
 * @returns Map of term keys to grouped items
 * 
 * @example
 * const items = [
 *   { date: '2022-09-15', endDate: '2022-12-31', ... },
 *   { date: '2023-01-10', ... },
 * ];
 * const grouped = groupItemsByTerm(items);
 * // grouped has keys: "Fall 2022", "Winter 2023"
 */
/**
 * Parses term string (e.g., "Fall 2025") into [year, seasonMonth]
 * Uses representative calendar months for proper chronological sorting:
 * - Winter (Jan-Apr) = 2 (February)
 * - Summer (May-Aug) = 7 (July) 
 * - Fall (Sept-Dec) = 11 (November)
 */
function parseTermForSorting(term: string): [number, number] {
  const parts = term.trim().split(' ');
  const season = parts[0]; // "Fall", "Winter", or "Summer"
  const year = parseInt(parts[1] || '0', 10);
  
  // Map seasons to representative calendar months for chronological sorting
  const seasonToMonth: Record<string, number> = {
    'Winter': 2,  // Jan-Apr → February (month 2)
    'Summer': 7,  // May-Aug → July (month 7)
    'Fall': 11,   // Sept-Dec → November (month 11)
  };
  
  return [year, seasonToMonth[season] || 0];
}

export function groupItemsByTerm(items: any[], includeAllTerms: boolean = false): Map<string, any[]> {
  const grouped = new Map<string, any[]>();
  // Track items by unique identifier to prevent duplicates
  const itemIds = new Set<string>();

  items.forEach((item) => {
    // Create unique identifier for item (use slug, link, or title+term as fallback)
    const itemId = item.slug || item.link || `${item.title}-${item.term}`;
    
    // Skip if we've already processed this item
    if (itemIds.has(itemId)) {
      return;
    }
    itemIds.add(itemId);

    // Use term directly from item (NOT calculated from date)
    // NOTE: Date-based term calculation (getAcademicTerm) is not being used anymore
    const termKey = item.term;

    if (!termKey) {
      console.warn('Item missing term property:', item);
      return;
    }

    if (!grouped.has(termKey)) {
      grouped.set(termKey, []);
    }

    // Only add to the term specified (items don't span multiple terms anymore)
    // NOTE: includeAllTerms logic removed since we now use explicit term property
    grouped.get(termKey)!.push(item);
  });

  // Sort terms chronologically (oldest first) - will be reversed by components for display
  const sortedTerms = Array.from(grouped.keys()).sort((a, b) => {
    const [aYear, aMonth] = parseTermForSorting(a);
    const [bYear, bMonth] = parseTermForSorting(b);

    if (aYear !== bYear) {
      return aYear - bYear;
    }

    return aMonth - bMonth; // Winter (2) < Summer (7) < Fall (11)
  });

  // Create sorted map
  const sortedGrouped = new Map<string, any[]>();
  sortedTerms.forEach((termKey) => {
    sortedGrouped.set(termKey, grouped.get(termKey)!);
  });

  return sortedGrouped;
}

/**
 * Gets the next academic term.
 * 
 * @param term - Current academic term
 * @returns Next academic term
 * 
 * @example
 * getNextTerm({ term: 'Fall', year: 2022 })    // { term: 'Winter', year: 2023 }
 * getNextTerm({ term: 'Winter', year: 2023 })  // { term: 'Summer', year: 2023 }
 * getNextTerm({ term: 'Summer', year: 2023 })  // { term: 'Fall', year: 2023 }
 */
export function getNextTerm(term: AcademicTerm): AcademicTerm {
  const order = getTermOrder(term.term);

  if (order === 1) {
    return { term: 'Winter', year: term.year + 1 };
  } else if (order === 2) {
    return { term: 'Summer', year: term.year };
  } else {
    return { term: 'Fall', year: term.year };
  }
}

/**
 * Gets the sort order of a term (for sorting within a year).
 * 
 * @param term - Term name
 * @returns Order (1 = Fall, 2 = Winter, 3 = Summer)
 */
function getTermOrder(term: 'Fall' | 'Winter' | 'Summer'): number {
  const order: Record<string, number> = { Fall: 1, Winter: 2, Summer: 3 };
  return order[term];
}

/**
 * Filters timeline items by category type.
 * 
 * @param items - Timeline items to filter
 * @param type - Type to filter by ('project', 'job', 'education', 'extracurricular')
 * @returns Filtered items
 * 
 * @example
 * const projects = filterItemsByType(items, 'project');
 * const jobs = filterItemsByType(items, 'job');
 */
export function filterItemsByType(items: any[], type: string): any[] {
  return items.filter((item) => item.type === type);
}

/**
 * Formats a date range into a human-readable string.
 * 
 * @param startDate - ISO date string
 * @param endDate - ISO date string (optional)
 * @returns Formatted string e.g., "Sep 2022 - Dec 2022" or "Sep 2022 - Present"
 * 
 * @example
 * formatDateRange('2022-09-15', '2022-12-31')  // "Sep 2022 - Dec 2022"
 * formatDateRange('2022-09-15')                // "Sep 2022 - Present"
 */
export function formatDateRange(startDate: string, endDate?: string): string {
  const start = new Date(startDate);
  const startStr = start.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  if (!endDate) {
    return `${startStr} - Present`;
  }

  const end = new Date(endDate);
  const endStr = end.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  return `${startStr} - ${endStr}`;
}

/**
 * Sorts timeline items chronologically (newest first by default).
 * 
 * @param items - Timeline items to sort
 * @param ascending - If true, sorts oldest first; if false (default), newest first
 * @returns Sorted items
 */
/**
 * Sorts timeline items by term (NOT by date)
 * NOTE: Date-based sorting is not being used anymore - we sort by term property
 */
export function sortTimelineItems(items: any[], ascending = false): any[] {
  const sorted = [...items].sort((a, b) => {
    // Sort by term primarily (NOT by date)
    // NOTE: Date-based term calculation (getAcademicTerm) is not being used anymore
    
    if (!a.term || !b.term) {
      // Items without term go to the end
      if (!a.term) return 1;
      if (!b.term) return -1;
    }
    
    // Parse terms for sorting (format: "Fall 2025" -> [2025, 11])
    const [aYear, aMonth] = parseTermForSorting(a.term || '');
    const [bYear, bMonth] = parseTermForSorting(b.term || '');
    
    // Primary sort: by year
    // When ascending=false (descending): newer years first (2025 before 2024)
    if (aYear !== bYear) {
      return ascending ? aYear - bYear : bYear - aYear;
    }
    
    // Secondary sort: by season/month (if same year)
    // Winter=2, Summer=7, Fall=11
    // When ascending=false (descending): later months first (Fall before Summer before Winter)
    if (aMonth !== bMonth) {
      return ascending ? aMonth - bMonth : bMonth - aMonth;
    }
    
    // Tertiary sort: by endDate within same term
    // Ongoing projects (no endDate) come first, then most recently completed
    const aHasEndDate = a.endDate !== undefined && a.endDate !== null && a.endDate !== '';
    const bHasEndDate = b.endDate !== undefined && b.endDate !== null && b.endDate !== '';
    
    // Ongoing projects (no endDate) should appear first
    if (!aHasEndDate && bHasEndDate) return -1; // a is ongoing, comes first
    if (aHasEndDate && !bHasEndDate) return 1;  // b is ongoing, comes first
    
    // Both have endDates: sort by endDate (most recent first when descending)
    if (aHasEndDate && bHasEndDate) {
      const aEndTime = new Date(a.endDate).getTime();
      const bEndTime = new Date(b.endDate).getTime();
      return ascending ? aEndTime - bEndTime : bEndTime - aEndTime;
    }
    
    // Both ongoing or no endDate info: maintain original order
    return 0;
  });

  return sorted;
}

/**
 * Gets the current academic term based on today's date.
 * 
 * @returns Current academic term object and formatted label
 * 
 * @example
 * // If today is December 21, 2024
 * getCurrentAcademicTerm() // { term: { term: 'Fall', year: 2024 }, label: 'Fall 2024' }
 */
export function getCurrentAcademicTerm(): { term: AcademicTerm; label: string } {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  let term: AcademicTerm;

  if (month >= 9 && month <= 12) {
    term = { term: 'Fall', year };
  } else if (month >= 1 && month <= 4) {
    term = { term: 'Winter', year };
  } else {
    term = { term: 'Summer', year };
  }

  return {
    term,
    label: getTermLabel(term),
  };
}
