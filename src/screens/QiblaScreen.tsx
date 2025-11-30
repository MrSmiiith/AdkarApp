import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, useColorScheme, Dimensions, Platform, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Magnetometer } from 'expo-sensors';
import * as Location from 'expo-location';
import { useSettingsStore } from '../store/settingsStore';
import { getThemeColors } from '../utils/themeHelpers';
import { Typography } from '../constants/typography';
import { calculateQiblaDirection, calculateDistanceToKaaba } from '../utils/qiblaCalculator';
import { Icon } from '../components/common/Icon';

const { width } = Dimensions.get('window');

export const QiblaScreen = () => {
  const { theme } = useSettingsStore();
  const systemTheme = useColorScheme();
  const colors = getThemeColors(theme, systemTheme);

  const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [isAligned, setIsAligned] = useState(false);
  const [currentDegree, setCurrentDegree] = useState(0);
  const [userLocation, setUserLocation] = useState<string>('');
  const [manualLocation, setManualLocation] = useState(false);

  // Animation value
  const compassRotation = useRef(new Animated.Value(0)).current;

  // Smoothing
  const smoothedHeading = useRef(0);
  const magnetometerSubscription = useRef<any>(null);

  useEffect(() => {
    setupQibla();
    return () => {
      if (magnetometerSubscription.current) {
        magnetometerSubscription.current.remove();
      }
    };
  }, []);

  const setupQibla = async () => {
    try {
      // Get location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission denied');
        return;
      }

      // Get current location
      let location;
      try {
        location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
          timeout: 10000,
        });
      } catch (locError) {
        // If GPS fails, try last known location
        location = await Location.getLastKnownPositionAsync();
        if (!location) {
          setError('Cannot get GPS location. Please enable GPS and try again.');
          return;
        }
      }

      const userCoords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      // Store user location for display
      const latStr = userCoords.latitude >= 0 ? `${userCoords.latitude.toFixed(4)}°N` : `${Math.abs(userCoords.latitude).toFixed(4)}°S`;
      const lonStr = userCoords.longitude >= 0 ? `${userCoords.longitude.toFixed(4)}°E` : `${Math.abs(userCoords.longitude).toFixed(4)}°W`;
      setUserLocation(`${latStr}, ${lonStr}`);

      // Calculate Qibla direction
      const qibla = calculateQiblaDirection(userCoords);
      setQiblaDirection(qibla);

      // Set arrow to point at Qibla direction (fixed position on compass)
      compassRotation.setValue(qibla);

      // Log for debugging with location name
      console.log('========== QIBLA CALCULATION ==========');
      console.log('Your location:', userCoords);
      console.log('Display:', latStr, lonStr);
      console.log('Kaaba location: 21.4225°N, 39.8262°E');
      console.log('Calculated Qibla direction:', Math.round(qibla), '°');

      // Show what direction this is
      let directionName = '';
      const deg = Math.round(qibla);
      if (deg >= 0 && deg < 22.5) directionName = 'North';
      else if (deg >= 22.5 && deg < 67.5) directionName = 'Northeast';
      else if (deg >= 67.5 && deg < 112.5) directionName = 'East';
      else if (deg >= 112.5 && deg < 157.5) directionName = 'Southeast';
      else if (deg >= 157.5 && deg < 202.5) directionName = 'South';
      else if (deg >= 202.5 && deg < 247.5) directionName = 'Southwest';
      else if (deg >= 247.5 && deg < 292.5) directionName = 'West';
      else if (deg >= 292.5 && deg < 337.5) directionName = 'Northwest';
      else directionName = 'North';

      console.log('Direction Name:', directionName);
      console.log('');
      console.log('Compass Reference:');
      console.log('  0° = North (↑)');
      console.log(' 90° = East (→)');
      console.log('180° = South (↓)');
      console.log('270° = West (←)');

      // Detect if using emulator/fake GPS
      const isEmulatorLocation = Math.abs(userCoords.latitude - 34.829) < 0.1 && Math.abs(userCoords.longitude - 0.154) < 0.1;

      if (isEmulatorLocation) {
        console.log('');
        console.log('⚠️ DETECTED: Emulator default location (Algeria)');
        console.log('From Algeria to Mecca = 100° (East) ✓ CORRECT');
        console.log('');
        console.log('To use your REAL location:');
        console.log('1. Set GPS in emulator settings');
        console.log('2. Or tap "📍" to enter manually');
        setManualLocation(true);
      }
      console.log('=======================================');

      // Calculate distance to Kaaba
      const dist = calculateDistanceToKaaba(userCoords);
      setDistance(Math.round(dist));

      // Start magnetometer
      Magnetometer.setUpdateInterval(100);
      magnetometerSubscription.current = Magnetometer.addListener((data) => {
        // Calculate heading from magnetometer data
        let angle = Math.atan2(data.y, data.x) * (180 / Math.PI);
        angle = angle >= 0 ? angle : angle + 360;

        // Smooth the angle
        const smoothed = smoothAngle(angle);
        setCurrentDegree(Math.round(smoothed));

        // Calculate rotation for compass
        // FIXED ARROW: Arrow always points to Qibla direction on compass (like magnetic needle)
        if (qibla !== null) {
          // Arrow points to absolute Qibla direction (100° points near E marker)
          // No animation needed - arrow position is fixed

          // Check alignment (when your heading matches Qibla direction)
          let diff = Math.abs(qibla - smoothed);
          if (diff > 180) diff = 360 - diff; // Handle wrap-around

          // Debug log
          if (Math.round(smoothed) % 10 === 0) {
            console.log(`Qibla: ${Math.round(qibla)}° (fixed arrow), Your heading: ${Math.round(smoothed)}°, Difference: ${Math.round(diff)}°`);
          }

          setIsAligned(diff < 10);
        }
      });
    } catch (error) {
      console.error('Error setting up Qibla:', error);
      setError('Failed to get location');
    }
  };

  const smoothAngle = (newAngle: number): number => {
    const alpha = 0.2; // Smoothing factor

    let delta = newAngle - smoothedHeading.current;

    // Handle wrapping
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;

    smoothedHeading.current += delta * alpha;

    if (smoothedHeading.current < 0) smoothedHeading.current += 360;
    if (smoothedHeading.current >= 360) smoothedHeading.current -= 360;

    return smoothedHeading.current;
  };

  const getDirectionText = () => {
    if (!qiblaDirection) return '';
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(qiblaDirection / 45) % 8;
    return directions[index];
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {error ? (
        <View style={styles.errorContainer}>
          <Icon name="alert-circle" size={64} color={colors.textSecondary} />
          <Text style={[styles.errorText, { color: colors.text }]}>{error}</Text>
          <Text style={[styles.errorHint, { color: colors.textSecondary }]}>
            Enable location services to use Qibla finder
          </Text>
        </View>
      ) : (
        <>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>Qibla Direction</Text>
            {userLocation && (
              <TouchableOpacity onPress={() => {
                Alert.alert(
                  'GPS Location',
                  `${userLocation}\n\n${manualLocation ? '⚠️ Using emulator GPS' : 'Using real GPS'}\n\nTo set your real location:\n• Android Emulator: ⋯ → Location → Decimal\n• iOS Simulator: Features → Location → Custom\n• Or use a real device`,
                  [
                    { text: 'OK' },
                    {
                      text: 'Enter Manually',
                      onPress: () => {
                        Alert.prompt(
                          'Enter Your Location',
                          'Format: latitude, longitude\nExample: 41.0082, 28.9784 (Istanbul)',
                          (input) => {
                            const parts = input.split(',');
                            if (parts.length === 2) {
                              const lat = parseFloat(parts[0].trim());
                              const lon = parseFloat(parts[1].trim());
                              if (!isNaN(lat) && !isNaN(lon) && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
                                // Recalculate with manual coordinates
                                const qibla = calculateQiblaDirection({ latitude: lat, longitude: lon });
                                setQiblaDirection(qibla);
                                compassRotation.setValue(qibla);
                                const dist = calculateDistanceToKaaba({ latitude: lat, longitude: lon });
                                setDistance(Math.round(dist));
                                const latStr = lat >= 0 ? `${lat.toFixed(4)}°N` : `${Math.abs(lat).toFixed(4)}°S`;
                                const lonStr = lon >= 0 ? `${lon.toFixed(4)}°E` : `${Math.abs(lon).toFixed(4)}°W`;
                                setUserLocation(`${latStr}, ${lonStr} (manual)`);
                                setManualLocation(false);
                                console.log('Manual location set:', lat, lon, 'Qibla:', Math.round(qibla));
                              } else {
                                Alert.alert('Invalid coordinates', 'Please enter valid latitude (-90 to 90) and longitude (-180 to 180)');
                              }
                            }
                          }
                        );
                      }
                    }
                  ]
                );
              }}>
                <Text style={[styles.locationText, { color: manualLocation ? '#FF6B6B' : colors.textSecondary }]}>
                  📍 {userLocation} (tap to change)
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Alignment Status */}
          {isAligned && (
            <View style={[styles.statusCard, { backgroundColor: colors.primary + '20', borderColor: colors.primary }]}>
              <Icon name="checkmark-circle" size={20} color={colors.primary} />
              <Text style={[styles.statusText, { color: colors.primary }]}>
                Aligned with Qibla
              </Text>
            </View>
          )}

          {/* Compass */}
          <View style={styles.compassContainer}>
            <View style={[styles.compass, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              {/* Cardinal Directions */}
              <View style={styles.directionNContainer}>
                <Text style={[styles.directionN, { color: colors.primary }]}>N</Text>
                <Text style={[styles.degreeLabel, { color: colors.textSecondary }]}>0°</Text>
              </View>
              <View style={styles.directionEContainer}>
                <Text style={[styles.directionE, { color: colors.textSecondary }]}>E</Text>
                <Text style={[styles.degreeLabel, { color: colors.textSecondary }]}>90°</Text>
              </View>
              <View style={styles.directionSContainer}>
                <Text style={[styles.directionS, { color: colors.textSecondary }]}>S</Text>
                <Text style={[styles.degreeLabel, { color: colors.textSecondary }]}>180°</Text>
              </View>
              <View style={styles.directionWContainer}>
                <Text style={[styles.directionW, { color: colors.textSecondary }]}>W</Text>
                <Text style={[styles.degreeLabel, { color: colors.textSecondary }]}>270°</Text>
              </View>

              {/* Rotating Needle */}
              <Animated.View
                style={[
                  styles.needleContainer,
                  {
                    transform: [
                      {
                        rotate: compassRotation.interpolate({
                          inputRange: [-360, 360],
                          outputRange: ['-360deg', '360deg'],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <View style={[styles.needle, { backgroundColor: colors.primary }]}>
                  <View style={styles.needlePoint} />
                </View>
                <Text style={styles.kaabaIcon}>🕋</Text>
              </Animated.View>

              {/* Center Dot */}
              <View style={[styles.centerDot, { backgroundColor: colors.primary }]} />
            </View>

            {/* Current Heading */}
            <View style={[styles.headingCard, { backgroundColor: colors.card }]}>
              <Text style={[styles.headingValue, { color: colors.text }]}>
                {currentDegree}°
              </Text>
              <Text style={[styles.headingLabel, { color: colors.textSecondary }]}>
                Current Heading
              </Text>
            </View>
          </View>

          {/* Info Cards */}
          <View style={styles.infoContainer}>
            <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
              <Icon name="compass" size={24} color={colors.primary} />
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Direction</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {qiblaDirection ? Math.round(qiblaDirection) : '--'}°
              </Text>
              <Text style={[styles.infoExtra, { color: colors.textSecondary }]}>
                {getDirectionText()}
              </Text>
            </View>

            <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
              <Icon name="location" size={24} color={colors.primary} />
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Distance</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {distance ? distance.toLocaleString() : '--'}
              </Text>
              <Text style={[styles.infoExtra, { color: colors.textSecondary }]}>
                kilometers
              </Text>
            </View>
          </View>

          {/* Instructions */}
          <View style={[styles.instructionCard, { backgroundColor: colors.surface }]}>
            <Icon name="information-circle" size={20} color={colors.primary} />
            <Text style={[styles.instructionText, { color: colors.textSecondary }]}>
              Arrow shows Qibla direction. Rotate your body until your heading matches the direction (100°).
            </Text>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const COMPASS_SIZE = Math.min(width - 100, 280);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    alignItems: 'center',
  },
  title: {
    ...Typography.h2,
    marginBottom: 4,
  },
  locationText: {
    ...Typography.caption,
    marginTop: 4,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
  },
  statusText: {
    ...Typography.body,
    fontWeight: '600',
    marginLeft: 8,
  },
  compassContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  compass: {
    width: COMPASS_SIZE,
    height: COMPASS_SIZE,
    borderRadius: COMPASS_SIZE / 2,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  directionNContainer: {
    position: 'absolute',
    top: 8,
    alignItems: 'center',
  },
  directionN: {
    fontSize: 22,
    fontWeight: '700',
  },
  directionEContainer: {
    position: 'absolute',
    right: 8,
    top: '50%',
    marginTop: -20,
    alignItems: 'center',
  },
  directionE: {
    fontSize: 18,
    fontWeight: '600',
  },
  directionSContainer: {
    position: 'absolute',
    bottom: 8,
    alignItems: 'center',
  },
  directionS: {
    fontSize: 18,
    fontWeight: '600',
  },
  directionWContainer: {
    position: 'absolute',
    left: 8,
    top: '50%',
    marginTop: -20,
    alignItems: 'center',
  },
  directionW: {
    fontSize: 18,
    fontWeight: '600',
  },
  degreeLabel: {
    fontSize: 10,
    marginTop: 2,
  },
  needleContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  needle: {
    width: 40,
    height: 100,
    marginTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  needlePoint: {
    width: 0,
    height: 0,
    borderLeftWidth: 20,
    borderRightWidth: 20,
    borderBottomWidth: 25,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#FFFFFF',
    marginTop: -1,
  },
  kaabaIcon: {
    fontSize: 28,
    marginTop: 8,
  },
  centerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    position: 'absolute',
  },
  headingCard: {
    marginTop: 24,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  headingValue: {
    fontSize: 32,
    fontWeight: '700',
  },
  headingLabel: {
    ...Typography.caption,
    marginTop: 4,
  },
  infoContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  infoCard: {
    flex: 1,
    marginHorizontal: 6,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoLabel: {
    ...Typography.caption,
    marginTop: 8,
  },
  infoValue: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 4,
  },
  infoExtra: {
    ...Typography.caption,
    marginTop: 2,
  },
  instructionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 14,
    borderRadius: 12,
  },
  instructionText: {
    ...Typography.caption,
    flex: 1,
    marginLeft: 12,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  errorText: {
    ...Typography.bodyLarge,
    textAlign: 'center',
    marginTop: 16,
    fontWeight: '600',
  },
  errorHint: {
    ...Typography.caption,
    textAlign: 'center',
    marginTop: 8,
  },
});
