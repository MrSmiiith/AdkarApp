import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import * as Location from 'expo-location';
import { Magnetometer } from 'expo-sensors';
import * as Haptics from 'expo-haptics';
import { useSettingsStore } from '../store/settingsStore';
import { getThemeColors } from '../utils/themeHelpers';
import { useTranslation } from '../hooks/useTranslation';
import { calculateQiblaDirection, calculateDistanceToKaaba } from '../utils/qiblaCalculator';
import { Coordinates } from '../types';
import { Icon } from '../components/common/Icon';
import { KaabaIcon } from '../components/common/KaabaIcon';
import { Typography } from '../constants/typography';

interface MagnetometerData {
  x: number;
  y: number;
  z: number;
}

export const QiblaFinderScreen = () => {
  const { theme } = useSettingsStore();
  const { t } = useTranslation();
  const systemTheme = useColorScheme();
  const colors = getThemeColors(theme, systemTheme);

  // State
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [qiblaDirection, setQiblaDirection] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);
  const [compassHeading, setCompassHeading] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAligned, setIsAligned] = useState<boolean>(false);

  // Animation
  const rotation = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Magnetometer subscription
  const magnetometerSubscription = useRef<any>(null);
  const isInitialized = useRef<boolean>(false);
  const lastAlignmentCheck = useRef<boolean>(false);

  // Initialize once on mount (get location)
  useEffect(() => {
    initializeQiblaFinder();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  // Start/Stop magnetometer based on screen focus
  useFocusEffect(
    useCallback(() => {
      // Screen is focused
      if (isInitialized.current && qiblaDirection > 0) {
        // Already initialized, just restart magnetometer
        startMagnetometer(qiblaDirection);
      }

      return () => {
        // Screen is unfocused (navigating away)
        stopMagnetometer();
      };
    }, [qiblaDirection])
  );

  const startMagnetometer = (qibla: number) => {
    if (magnetometerSubscription.current) {
      return; // Already running
    }

    Magnetometer.setUpdateInterval(100);
    magnetometerSubscription.current = Magnetometer.addListener((data: MagnetometerData) => {
      const heading = calculateHeading(data);
      setCompassHeading(heading);
      animateRotation(heading, qibla);
    });
  };

  const stopMagnetometer = () => {
    if (magnetometerSubscription.current) {
      magnetometerSubscription.current.remove();
      magnetometerSubscription.current = null;
      setIsAligned(false); // Reset alignment state
      lastAlignmentCheck.current = false; // Reset alignment tracking
    }
  };

  const initializeQiblaFinder = async () => {
    try {
      // Check magnetometer
      const isAvailable = await Magnetometer.isAvailableAsync();
      if (!isAvailable) {
        setError(t('magnetometerNotAvailable'));
        setIsLoading(false);
        return;
      }

      // Request location
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError(t('locationPermissionRequired'));
        setIsLoading(false);
        return;
      }

      // Get location (this is the slow part)
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced, // Changed from High to Balanced for faster results
      });

      const coords: Coordinates = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };

      setLocation(coords);

      // Calculate Qibla
      const qibla = calculateQiblaDirection(coords);
      const dist = calculateDistanceToKaaba(coords);

      setQiblaDirection(qibla);
      setDistance(dist);

      // Mark as initialized
      isInitialized.current = true;

      // Start magnetometer
      startMagnetometer(qibla);

      setIsLoading(false);
    } catch (err) {
      setError(t('failedToInitialize'));
      setIsLoading(false);
    }
  };

  const calculateHeading = (data: MagnetometerData): number => {
    let angle = Math.atan2(data.y, data.x) * (180 / Math.PI);
    // Adjust by 90 degrees to match iOS compass (0 = North)
    angle = angle - 90;
    // Normalize to 0-360
    angle = (angle + 360) % 360;
    return angle;
  };

  const animateRotation = (heading: number, qibla: number) => {
    // Rotate arrow to point to Qibla
    const targetAngle = qibla - heading;

    Animated.timing(rotation, {
      toValue: targetAngle,
      duration: 100,
      useNativeDriver: true,
    }).start();

    // Check alignment - Calculate difference in degrees
    const diff = Math.abs(((heading - qibla + 180) % 360) - 180);
    const shouldBeAligned = diff <= 10;

    // Update alignment state whenever it changes
    if (shouldBeAligned !== lastAlignmentCheck.current) {
      lastAlignmentCheck.current = shouldBeAligned;

      if (shouldBeAligned) {
        // Becoming aligned - trigger haptic feedback
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setIsAligned(true);
      } else {
        // Becoming unaligned - remove green effect
        setIsAligned(false);
      }
    }
  };

  // Loading
  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>{t('findingQibla')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error
  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
        <View style={styles.centerContent}>
          <Icon name="compass" size={60} color={colors.textSecondary} />
          <Text style={[styles.errorText, { color: colors.text, marginTop: 20 }]}>
            {error}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Title */}
        <View style={styles.header}>
          <KaabaIcon size={32} color={colors.primary} />
          <Text style={[styles.title, { color: colors.text }]}>{t('qiblaFinder')}</Text>
        </View>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {t('rotateArrow')} ↑
        </Text>

        {/* Main Arrow Container */}
        <View style={styles.arrowContainer}>
          {/* Green Glow Effect when Aligned */}
          {isAligned && (
            <View
              style={[
                styles.alignedGlow,
                {
                  shadowColor: colors.success,
                  backgroundColor: colors.success + '20',
                  borderColor: colors.success,
                },
              ]}
            />
          )}

          {/* Compass Circle Background */}
          <View
            style={[
              styles.compassCircle,
              {
                borderColor: isAligned ? colors.success : colors.border,
                borderWidth: isAligned ? 3 : 2,
              },
            ]}
          >
            {/* Degree markers */}
            {[0, 90, 180, 270].map((deg) => (
              <View
                key={deg}
                style={[
                  styles.degreeLine,
                  {
                    transform: [{ rotate: `${deg}deg` }],
                  },
                ]}
              >
                <View style={[styles.degreeLineInner, { backgroundColor: colors.border }]} />
              </View>
            ))}
          </View>

          {/* Main Arrow - Points to Qibla */}
          <Animated.View
            style={[
              styles.arrow,
              {
                transform: [
                  {
                    rotate: rotation.interpolate({
                      inputRange: [0, 360],
                      outputRange: ['0deg', '360deg'],
                    }),
                  },
                ],
              },
            ]}
          >
            {/* Arrow Head */}
            <View
              style={[
                styles.arrowHead,
                { borderBottomColor: isAligned ? colors.success : colors.primary },
              ]}
            />

            {/* Arrow Body */}
            <View
              style={[
                styles.arrowBody,
                { backgroundColor: isAligned ? colors.success : colors.primary },
              ]}
            />

            {/* Kaaba Icon at bottom of arrow */}
            <View
              style={[
                styles.kaabaIcon,
                { backgroundColor: isAligned ? colors.success : colors.primary },
              ]}
            >
              <KaabaIcon size={36} color="#FFFFFF" />
              <Text style={styles.kaabaLabel}>{t('kaaba')}</Text>
            </View>
          </Animated.View>

          {/* Center Dot */}
          <View
            style={[
              styles.centerCircle,
              { backgroundColor: isAligned ? colors.success : colors.primary },
            ]}
          />
        </View>

        {/* Qibla Info */}
        <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Icon name="compass" size={24} color={colors.primary} style={{ marginBottom: 8 }} />
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{t('qiblaDirection')}</Text>
              <Text style={[styles.infoValue, { color: colors.primary }]}>
                {qiblaDirection.toFixed(1)}°
              </Text>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.infoItem}>
              <Icon name="compass" size={24} color={colors.primary} style={{ marginBottom: 8 }} />
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{t('distanceToKaaba')}</Text>
              <Text style={[styles.infoValue, { color: colors.primary }]}>
                {distance >= 1000 ? `${(distance / 1000).toFixed(1)}k` : distance.toFixed(0)} km
              </Text>
            </View>
          </View>
        </View>

        {/* Current Heading */}
        <View style={styles.headingBox}>
          <Text style={[styles.headingLabel, { color: colors.textSecondary }]}>
            {t('currentHeading')}
          </Text>
          <Text style={[styles.headingValue, { color: colors.text }]}>
            {compassHeading.toFixed(0)}°
          </Text>
        </View>

        {/* Alignment Indicator */}
        {isAligned && (
          <View style={[styles.alignedBadge, { backgroundColor: colors.success }]}>
            <Icon name="check" size={16} color="#FFFFFF" />
            <Text style={styles.alignedText}>{t('alignedWithQibla')}</Text>
          </View>
        )}

        {/* Location */}
        {location && (
          <Text style={[styles.locationText, { color: colors.textSecondary }]}>
            {location.latitude.toFixed(2)}°{location.latitude >= 0 ? 'N' : 'S'},{' '}
            {location.longitude.toFixed(2)}°{location.longitude >= 0 ? 'E' : 'W'}
          </Text>
        )}
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 20,
    marginBottom: 8,
  },
  title: {
    ...Typography.h1,
  },
  subtitle: {
    ...Typography.body,
    marginBottom: 30,
  },
  loadingText: {
    ...Typography.body,
    marginTop: 16,
  },
  errorText: {
    ...Typography.body,
    textAlign: 'center',
  },
  arrowContainer: {
    width: 320,
    height: 320,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30,
  },
  alignedGlow: {
    width: 280,
    height: 280,
    borderRadius: 140,
    position: 'absolute',
    borderWidth: 4,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  compassCircle: {
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 2,
    position: 'absolute',
  },
  degreeLine: {
    position: 'absolute',
    width: 2,
    height: 130,
    top: 0,
    left: 129,
  },
  degreeLineInner: {
    width: 2,
    height: 20,
  },
  arrow: {
    width: 220,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  arrowHead: {
    width: 0,
    height: 0,
    borderLeftWidth: 18,
    borderRightWidth: 18,
    borderBottomWidth: 28,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    position: 'absolute',
    top: 10,
  },
  arrowBody: {
    width: 6,
    height: 90,
    borderRadius: 3,
    position: 'absolute',
    top: 32,
  },
  kaabaIcon: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  kaabaLabel: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  centerCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    position: 'absolute',
  },
  infoCard: {
    width: '100%',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 50,
    marginHorizontal: 16,
  },
  infoLabel: {
    ...Typography.caption,
    marginBottom: 8,
    textAlign: 'center',
  },
  infoValue: {
    ...Typography.h2,
    fontWeight: '600',
  },
  headingBox: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headingLabel: {
    ...Typography.caption,
    marginBottom: 4,
  },
  headingValue: {
    ...Typography.h3,
    fontWeight: '600',
  },
  alignedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 16,
  },
  alignedText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  locationText: {
    ...Typography.caption,
  },
});
