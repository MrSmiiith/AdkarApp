import { format, differenceInMinutes, differenceInHours, addDays } from 'date-fns';
import moment from 'moment-hijri';

/**
 * Format time for display (e.g., "5:30 PM")
 */
export const formatPrayerTime = (date: Date): string => {
  return format(date, 'h:mm a');
};

/**
 * Format date for display (e.g., "Monday, Nov 30, 2025")
 */
export const formatDate = (date: Date): string => {
  return format(date, 'EEEE, MMM d, yyyy');
};

/**
 * Format Gregorian date for display
 */
export const formatGregorianDate = (date: Date = new Date()): string => {
  return format(date, 'EEEE, MMMM d, yyyy');
};

/**
 * Calculate time remaining until a specific time
 * @returns Object with hours and minutes
 */
export const getTimeRemaining = (targetTime: Date): { hours: number; minutes: number } => {
  const now = new Date();
  const totalMinutes = differenceInMinutes(targetTime, now);

  if (totalMinutes < 0) {
    return { hours: 0, minutes: 0 };
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return { hours, minutes };
};

/**
 * Format time remaining for display
 */
export const formatTimeRemaining = (targetTime: Date): string => {
  const { hours, minutes } = getTimeRemaining(targetTime);

  if (hours === 0 && minutes === 0) {
    return 'Now';
  }

  if (hours === 0) {
    return `${minutes}m`;
  }

  return `${hours}h ${minutes}m`;
};

/**
 * Get Hijri date with proper conversion
 */
export const getHijriDate = (date: Date = new Date()): string => {
  const hijriDate = moment(date);
  return hijriDate.format('iMMMM iD, iYYYY');
};

/**
 * Get short Hijri date (e.g., "28 Jumada I 1447")
 */
export const getShortHijriDate = (date: Date = new Date()): string => {
  const hijriDate = moment(date);
  return hijriDate.format('iD iMMMM iYYYY');
};

/**
 * Get current Islamic month name
 */
export const getIslamicMonth = (date: Date = new Date()): string => {
  const hijriDate = moment(date);
  return hijriDate.format('iMMMM');
};

/**
 * Get Islamic year
 */
export const getIslamicYear = (date: Date = new Date()): number => {
  const hijriDate = moment(date);
  return hijriDate.iYear();
};

/**
 * Check if current time is between two times
 */
export const isTimeBetween = (current: Date, start: Date, end: Date): boolean => {
  return current >= start && current <= end;
};
