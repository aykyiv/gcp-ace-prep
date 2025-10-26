/**
 * Date and time utility functions
 * Used for scheduling, formatting, and calculating review dates
 */

/**
 * Adds days to a date and returns new Date object
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Checks if a date is today
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * Checks if a date is in the past (before today)
 */
export function isPast(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);
  return compareDate < today;
}

/**
 * Checks if a date is due (today or in the past)
 */
export function isDue(date: Date): boolean {
  return isToday(date) || isPast(date);
}

/**
 * Calculates days between two dates
 */
export function daysBetween(date1: Date, date2: Date): number {
  const oneDay = 24 * 60 * 60 * 1000;
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.round(diffTime / oneDay);
}

/**
 * Formats date to readable string (e.g., "Jan 15, 2025")
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Formats date to short string (e.g., "01/15/25")
 */
export function formatDateShort(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "2-digit",
  });
}

/**
 * Formats date to ISO string for storage
 */
export function formatDateISO(date: Date): string {
  return date.toISOString();
}

/**
 * Parses ISO string to Date object
 */
export function parseDate(isoString: string): Date {
  return new Date(isoString);
}

/**
 * Gets the start of today (00:00:00)
 */
export function getStartOfToday(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

/**
 * Gets the end of today (23:59:59)
 */
export function getEndOfToday(): Date {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return today;
}

/**
 * Calculates relative time string (e.g., "in 3 days", "2 days ago")
 */
export function getRelativeTimeString(date: Date): string {
  const today = getStartOfToday();
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);

  const days = daysBetween(today, targetDate);

  if (isToday(date)) return "Today";
  if (days === 1) {
    return targetDate > today ? "Tomorrow" : "Yesterday";
  }
  if (targetDate > today) {
    return `in ${days} days`;
  }
  return `${days} days ago`;
}

// TODO: Add timezone handling if needed for multi-region users
// TODO: Add week/month calculations for calendar views
