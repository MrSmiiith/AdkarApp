import { Coordinates } from '../types';
import { Config } from '../constants/config';

/**
 * Calculate Qibla direction (bearing to Kaaba from current location)
 * @param userLocation User's current coordinates
 * @returns Bearing in degrees (0-360) from North
 */
export const calculateQiblaDirection = (userLocation: Coordinates): number => {
  const { latitude: lat1, longitude: lon1 } = userLocation;
  const { latitude: lat2, longitude: lon2 } = Config.kaaba;

  // Convert to radians
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  // Calculate bearing using formula
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

  let bearing = (Math.atan2(y, x) * 180) / Math.PI;

  // Normalize to 0-360
  bearing = (bearing + 360) % 360;

  return bearing;
};

/**
 * Calculate distance to Kaaba in kilometers
 * @param userLocation User's current coordinates
 * @returns Distance in kilometers
 */
export const calculateDistanceToKaaba = (userLocation: Coordinates): number => {
  const { latitude: lat1, longitude: lon1 } = userLocation;
  const { latitude: lat2, longitude: lon2 } = Config.kaaba;

  const R = 6371; // Earth's radius in kilometers
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};
