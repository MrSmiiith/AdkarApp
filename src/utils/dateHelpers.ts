import { format, differenceInMinutes, differenceInHours, addDays } from 'date-fns';

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
 * Get Hijri date (simplified - for full implementation use a library)
 */
export const getHijriDate = (): string => {
  // This is a placeholder. In production, use a library like 'hijri-date'
  return 'Jumada Al-Awwal 28, 1447'; // Example
};

/**
 * Check if current time is between two times
 */
export const isTimeBetween = (current: Date, start: Date, end: Date): boolean => {
  return current >= start && current <= end;
};
