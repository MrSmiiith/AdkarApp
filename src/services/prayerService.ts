import * as adhan from 'adhan';
import { PrayerTimes, PrayerName, PrayerSettings, Coordinates } from '../types';
import { Config } from '../constants/config';

/**
 * Calculate prayer times for a given location and date
 */
export const calculatePrayerTimes = (
  location: Coordinates,
  date: Date = new Date(),
  settings?: Partial<PrayerSettings>
): PrayerTimes => {
  // Create coordinates
  const coordinates = new adhan.Coordinates(
    location.latitude,
    location.longitude
  );

  // Get calculation parameters
  const params = getCalculationParams(settings?.method);

  // Set madhab if specified
  if (settings?.madhab) {
    params.madhab = settings.madhab === 'Hanafi'
      ? adhan.Madhab.Hanafi
      : adhan.Madhab.Shafi;
  }

  // Calculate prayer times
  const prayerTimes = new adhan.PrayerTimes(coordinates, date, params);

  // Apply adjustments if any
  const adjustments = settings?.adjustments || {};

  return {
    fajr: adjustTime(prayerTimes.fajr, adjustments.fajr),
    sunrise: prayerTimes.sunrise,
    dhuhr: adjustTime(prayerTimes.dhuhr, adjustments.dhuhr),
    asr: adjustTime(prayerTimes.asr, adjustments.asr),
    maghrib: adjustTime(prayerTimes.maghrib, adjustments.maghrib),
    isha: adjustTime(prayerTimes.isha, adjustments.isha),
  };
};

/**
 * Get current prayer name
 */
export const getCurrentPrayer = (prayerTimes: PrayerTimes): PrayerName | null => {
  const now = new Date();
  const times = prayerTimes;

  if (now >= times.isha || now < times.fajr) return null;
  if (now >= times.fajr && now < times.sunrise) return 'fajr';
  if (now >= times.dhuhr && now < times.asr) return 'dhuhr';
  if (now >= times.asr && now < times.maghrib) return 'asr';
  if (now >= times.maghrib && now < times.isha) return 'maghrib';

  return null;
};

/**
 * Get next prayer name and time
 */
export const getNextPrayer = (prayerTimes: PrayerTimes): { name: PrayerName; time: Date } => {
  const now = new Date();
  const prayers: Array<{ name: PrayerName; time: Date }> = [
    { name: 'fajr', time: prayerTimes.fajr },
    { name: 'dhuhr', time: prayerTimes.dhuhr },
    { name: 'asr', time: prayerTimes.asr },
    { name: 'maghrib', time: prayerTimes.maghrib },
    { name: 'isha', time: prayerTimes.isha },
  ];

  for (const prayer of prayers) {
    if (now < prayer.time) {
      return prayer;
    }
  }

  // If no more prayers today, return tomorrow's Fajr
  return { name: 'fajr', time: prayerTimes.fajr };
};

/**
 * Get calculation parameters based on method
 */
const getCalculationParams = (method?: string): adhan.CalculationParameters => {
  switch (method) {
    case 'Egyptian':
      return adhan.CalculationMethod.Egyptian();
    case 'Karachi':
      return adhan.CalculationMethod.Karachi();
    case 'UmmAlQura':
      return adhan.CalculationMethod.UmmAlQura();
    case 'Dubai':
      return adhan.CalculationMethod.Dubai();
    case 'NorthAmerica':
      return adhan.CalculationMethod.NorthAmerica();
    case 'MuslimWorldLeague':
    default:
      return adhan.CalculationMethod.MuslimWorldLeague();
  }
};

/**
 * Adjust prayer time by minutes
 */
const adjustTime = (time: Date, adjustmentMinutes: number = 0): Date => {
  if (adjustmentMinutes === 0) return time;

  const adjusted = new Date(time);
  adjusted.setMinutes(adjusted.getMinutes() + adjustmentMinutes);
  return adjusted;
};

/**
 * Calculate Qibla direction using adhan library
 */
export const calculateQibla = (location: Coordinates): number => {
  const coordinates = new adhan.Coordinates(
    location.latitude,
    location.longitude
  );
  return adhan.Qibla(coordinates);
};
