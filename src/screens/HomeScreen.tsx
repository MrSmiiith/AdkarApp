import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  useColorScheme,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { usePrayerStore } from '../store/prayerStore';
import { useSettingsStore } from '../store/settingsStore';
import { Typography } from '../constants/typography';
import { formatPrayerTime, formatTimeRemaining, getHijriDate } from '../utils/dateHelpers';
import { getNextPrayer } from '../services/prayerService';
import { getThemeColors } from '../utils/themeHelpers';
import { useTranslation } from '../hooks/useTranslation';
import { Logo } from '../components/common/Logo';
import { Icon } from '../components/common/Icon';
import * as Location from 'expo-location';

const { width } = Dimensions.get('window');

export const HomeScreen = () => {
  const navigation = useNavigation();
  const { prayerTimes, setLocation } = usePrayerStore();
  const { theme } = useSettingsStore();
  const { t, language } = useTranslation();
  const systemTheme = useColorScheme();
  const colors = getThemeColors(theme, systemTheme);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;
  const isRTL = language === 'ar';

  useEffect(() => {
    requestLocationPermission();

    // Fade in animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const nextPrayer = prayerTimes ? getNextPrayer(prayerTimes) : null;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View
          style={[
            styles.header,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Logo size="small" showText={true} />
          <Text style={[styles.welcomeText, { color: colors.text }]}>
            {t('welcomeBack')}
          </Text>
          <Text style={[styles.date, { color: colors.textSecondary }]}>
            {getHijriDate()}
          </Text>
        </Animated.View>

        {/* Feature Cards - Full Screen Width */}
        <Animated.View
          style={[
            styles.cardsContainer,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* Quran Card */}
          <FeatureCard
            title={t('exploreQuran')}
            description={t('exploreQuranDesc')}
            iconName="book-open"
            gradient={['#0D5C3D', '#1A8B5B']}
            onPress={() => {
              // @ts-ignore
              navigation.navigate('Quran');
            }}
            colors={colors}
          />

          {/* Adkar Card */}
          <FeatureCard
            title={t('dailyAdkar')}
            description={t('dailyAdkarDesc')}
            iconName="moon"
            gradient={['#7B2CBF', '#9D4EDD']}
            onPress={() => {
              // @ts-ignore
              navigation.navigate('Adkar');
            }}
            colors={colors}
          />

          {/* Qibla Card */}
          <FeatureCard
            title={t('findQibla')}
            description={t('findQiblaDesc')}
            iconName="compass"
            gradient={['#0077B6', '#00B4D8']}
            onPress={() => {
              // @ts-ignore
              navigation.navigate('Qibla');
            }}
            colors={colors}
          />

          {/* Next Prayer Card */}
          {nextPrayer && (
            <View style={[styles.prayerCard, { backgroundColor: colors.primary }]}>
              <View style={styles.prayerCardHeader}>
                <Icon name="clock" size={28} color="#FFFFFF" />
                <Text style={styles.prayerLabel}>{t('prayerTimes')}</Text>
              </View>
              <View style={styles.prayerCardContent}>
                <Text style={styles.prayerName}>
                  {t(nextPrayer.name.toLowerCase() as any)}
                </Text>
                <Text style={styles.prayerTime}>
                  {formatPrayerTime(nextPrayer.time)}
                </Text>
                <Text style={styles.timeRemaining}>
                  {formatTimeRemaining(nextPrayer.time)}
                </Text>
              </View>
            </View>
          )}

          {/* Prayer Times Summary */}
          {prayerTimes && (
            <View style={[styles.prayerTimesCard, { backgroundColor: colors.card }]}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>
                {t('prayerTimes')}
              </Text>
              <PrayerTimeRow
                name={t('fajr')}
                time={prayerTimes.fajr}
                colors={colors}
                iconName="sunrise"
              />
              <PrayerTimeRow
                name={t('dhuhr')}
                time={prayerTimes.dhuhr}
                colors={colors}
                iconName="time"
              />
              <PrayerTimeRow
                name={t('asr')}
                time={prayerTimes.asr}
                colors={colors}
                iconName="time"
              />
              <PrayerTimeRow
                name={t('maghrib')}
                time={prayerTimes.maghrib}
                colors={colors}
                iconName="time"
              />
              <PrayerTimeRow
                name={t('isha')}
                time={prayerTimes.isha}
                colors={colors}
                iconName="moon"
              />
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const FeatureCard = ({ title, description, iconName, gradient, onPress, colors }: any) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
    >
      <Animated.View
        style={[
          styles.featureCard,
          { backgroundColor: gradient[0], transform: [{ scale: scaleAnim }] },
        ]}
      >
        <View style={styles.featureCardContent}>
          <View style={styles.featureCardIcon}>
            <Icon name={iconName} size={40} color="#FFFFFF" />
          </View>
          <View style={styles.featureCardText}>
            <Text style={styles.featureCardTitle}>{title}</Text>
            <Text style={styles.featureCardDescription}>{description}</Text>
          </View>
        </View>
        <Icon name="chevron-right" size={24} color="rgba(255,255,255,0.7)" />
      </Animated.View>
    </TouchableOpacity>
  );
};

const PrayerTimeRow = ({ name, time, colors, iconName }: any) => (
  <View style={styles.prayerRow}>
    <View style={styles.prayerRowLeft}>
      <Icon name={iconName} size={20} color={colors.textSecondary} style={{ marginRight: 12 }} />
      <Text style={[styles.prayerRowName, { color: colors.text }]}>{name}</Text>
    </View>
    <Text style={[styles.prayerRowTime, { color: colors.textSecondary }]}>
      {formatPrayerTime(time)}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 8,
    alignItems: 'center',
  },
  welcomeText: {
    ...Typography.h2,
    marginTop: 12,
    marginBottom: 4,
  },
  date: {
    ...Typography.caption,
    marginTop: 4,
  },
  cardsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  featureCard: {
    width: width - 32,
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  featureCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  featureCardIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureCardText: {
    flex: 1,
  },
  featureCardTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  featureCardDescription: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
    lineHeight: 18,
  },
  prayerCard: {
    width: width - 32,
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  prayerCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  prayerLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  prayerCardContent: {
    alignItems: 'center',
  },
  prayerName: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  prayerTime: {
    color: '#FFFFFF',
    fontSize: 42,
    fontWeight: '300',
  },
  timeRemaining: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 15,
    marginTop: 8,
  },
  prayerTimesCard: {
    width: width - 32,
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    ...Typography.h3,
    marginBottom: 16,
  },
  prayerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  prayerRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prayerRowName: {
    ...Typography.bodyLarge,
    fontWeight: '500',
  },
  prayerRowTime: {
    ...Typography.bodyLarge,
  },
});
