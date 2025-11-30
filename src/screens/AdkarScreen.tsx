import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useSettingsStore } from '../store/settingsStore';
import { useTranslation } from '../hooks/useTranslation';
import { getThemeColors } from '../utils/themeHelpers';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Config } from '../constants/config';
import { Icon } from '../components/common/Icon';
import { ALL_ADKAR } from '../database/data/adkar';

const { width } = Dimensions.get('window');

export const AdkarScreen = () => {
  const navigation = useNavigation();
  const { theme } = useSettingsStore();
  const { t } = useTranslation();
  const systemTheme = useColorScheme();
  const colors = getThemeColors(theme, systemTheme);

  const categories = [
    {
      id: 'morning',
      nameEn: t('morningAdkar'),
      nameAr: 'أذكار الصباح',
      icon: 'sunrise',
      count: ALL_ADKAR.morning.length,
      gradient: ['#FF6B6B', '#FF8E53'],
      description: 'Start your day with remembrance',
    },
    {
      id: 'evening',
      nameEn: t('eveningAdkar'),
      nameAr: 'أذكار المساء',
      icon: 'moon',
      count: ALL_ADKAR.evening.length,
      gradient: ['#4E54C8', '#8F94FB'],
      description: 'End your day with blessings',
    },
    {
      id: 'prayer',
      nameEn: t('prayerAdkar'),
      nameAr: 'أذكار بعد الصلاة',
      icon: 'mosque',
      count: ALL_ADKAR.prayer.length,
      gradient: ['#0D5C3D', '#1A8B5B'],
      description: 'After each Salah',
    },
    {
      id: 'sleep',
      nameEn: t('sleepAdkar'),
      nameAr: 'أذكار النوم',
      icon: 'moon-outline',
      count: ALL_ADKAR.sleep.length,
      gradient: ['#667eea', '#764ba2'],
      description: 'Before going to sleep',
    },
    {
      id: 'general',
      nameEn: t('generalAdkar'),
      nameAr: 'أذكار عامة',
      icon: 'prayer',
      count: ALL_ADKAR.general.length,
      gradient: ['#f093fb', '#f5576c'],
      description: 'Anytime remembrance',
    },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['bottom']}>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            {t('adkar')} & Supplications
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Authentic remembrances from Hisnul Muslim
          </Text>
        </View>

        <View style={styles.cardsContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryCard,
                { backgroundColor: category.gradient[0] },
              ]}
              onPress={() =>
                // @ts-ignore
                navigation.navigate('AdkarDetails', { categoryId: category.id })
              }
              activeOpacity={0.9}
            >
              <View style={styles.cardHeader}>
                <View style={styles.iconCircle}>
                  <Icon name={category.icon} size={28} color="#FFFFFF" />
                </View>
                <View style={styles.countBadge}>
                  <Text style={styles.countText}>{category.count}</Text>
                </View>
              </View>

              <View style={styles.cardContent}>
                <Text style={styles.categoryNameEn}>{category.nameEn}</Text>
                <Text style={styles.categoryNameAr}>{category.nameAr}</Text>
                <Text style={styles.categoryDescription}>
                  {category.description}
                </Text>
              </View>

              <View style={styles.cardFooter}>
                <Text style={styles.viewText}>View All</Text>
                <Icon name="chevron-right" size={20} color="rgba(255,255,255,0.9)" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <Icon name="check" size={20} color={colors.primary} />
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            All supplications are from authentic Islamic sources
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  title: {
    ...Typography.h2,
    marginBottom: 8,
  },
  subtitle: {
    ...Typography.body,
  },
  cardsContainer: {
    padding: 16,
    paddingTop: 8,
  },
  categoryCard: {
    width: width - 32,
    minHeight: 140,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countBadge: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  countText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  cardContent: {
    marginBottom: 12,
  },
  categoryNameEn: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  categoryNameAr: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 16,
    marginBottom: 6,
  },
  categoryDescription: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  viewText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 6,
  },
  footer: {
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    ...Typography.caption,
    textAlign: 'center',
    marginLeft: 8,
  },
});
