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
  return new Date(term.year, month - 1, 1);
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

  return new Date(year, month, 0, 23, 59, 59);
}

/**
 * Groups timeline items by academic term.
 * 
 * Items with date ranges that span multiple terms are included in all relevant terms.
 * Results are sorted chronologically (oldest → newest).
 * 
 * @param items - Array of timeline items with date and optional endDate
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
export function groupItemsByTerm(items: any[]): Map<string, any[]> {
  const grouped = new Map<string, any[]>();

  items.forEach((item) => {
    // Get the starting term
    const { term, year } = getAcademicTerm(item.date);

    // Get all terms this item spans
    const termsToAdd: AcademicTerm[] = [{ term, year }];

    // If item has endDate, check if it spans multiple terms
    if (item.endDate) {
      const endTerm = getAcademicTerm(item.endDate);

      // Add intermediate terms if item spans multiple terms
      let currentTerm: AcademicTerm = { term, year };

      while (
        currentTerm.year < endTerm.year ||
        (currentTerm.year === endTerm.year && getTermOrder(currentTerm.term) < getTermOrder(endTerm.term))
      ) {
        const nextTerm = getNextTerm(currentTerm);
        termsToAdd.push(nextTerm);
        currentTerm = nextTerm;
      }
    }

    // Add item to all relevant terms
    termsToAdd.forEach((t) => {
      const termKey = getTermLabel(t);

      if (!grouped.has(termKey)) {
        grouped.set(termKey, []);
      }
      grouped.get(termKey)!.push(item);
    });
  });

  // Sort terms chronologically
  const sortedTerms = Array.from(grouped.keys()).sort((a, b) => {
    const [aYear, aSeason] = a.split(' ');
    const [bYear, bSeason] = b.split(' ');

    if (aYear !== bYear) {
      return parseInt(aYear) - parseInt(bYear);
    }

    const seasonOrder: Record<string, number> = { Fall: 1, Winter: 2, Summer: 3 };
    return seasonOrder[aSeason] - seasonOrder[bSeason];
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
export function sortTimelineItems(items: any[], ascending = false): any[] {
  const sorted = [...items].sort((a, b) => {
    const aDate = new Date(a.date).getTime();
    const bDate = new Date(b.date).getTime();

    return ascending ? aDate - bDate : bDate - aDate;
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
