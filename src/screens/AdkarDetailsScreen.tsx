import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useSettingsStore } from '../store/settingsStore';
import { getThemeColors } from '../utils/themeHelpers';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { ALL_ADKAR } from '../database/data/adkar';
import { Dhikr } from '../types';

export const AdkarDetailsScreen = () => {
  const route = useRoute();
  const { categoryId } = route.params as { categoryId: string };
  const { theme } = useSettingsStore();
  const colors = getThemeColors(theme);

  const adhkar = ALL_ADKAR[categoryId as keyof typeof ALL_ADKAR] || [];
  const [counters, setCounters] = useState<{ [key: string]: number }>({});

  const incrementCounter = (dhikrId: string, maxCount: number) => {
    setCounters((prev) => {
      const currentCount = prev[dhikrId] || 0;
      const newCount = currentCount >= maxCount ? 0 : currentCount + 1;
      return { ...prev, [dhikrId]: newCount };
    });
  };

  const resetCounter = (dhikrId: string) => {
    setCounters((prev) => ({ ...prev, [dhikrId]: 0 }));
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {adhkar.map((dhikr: Dhikr, index: number) => {
        const count = counters[dhikr.id] || 0;
        const isCompleted = count >= dhikr.repetitions;

        return (
          <View
            key={dhikr.id}
            style={[
              styles.dhikrCard,
              { backgroundColor: colors.card },
              isCompleted && { backgroundColor: colors.success + '20' },
            ]}
          >
            {/* Arabic Text */}
            <Text
              style={[
                styles.arabicText,
                { color: colors.text },
              ]}
            >
              {dhikr.arabic}
            </Text>

            {/* Transliteration */}
            <Text
              style={[styles.transliteration, { color: colors.textSecondary }]}
            >
              {dhikr.transliteration}
            </Text>

            {/* Translation */}
            <Text style={[styles.translation, { color: colors.text }]}>
              {dhikr.translation}
            </Text>

            {/* Reference */}
            {dhikr.reference && (
              <Text style={[styles.reference, { color: colors.textSecondary }]}>
                Reference: {dhikr.reference}
              </Text>
            )}

            {/* Benefit */}
            {dhikr.benefit && (
              <View
                style={[
                  styles.benefitContainer,
                  { backgroundColor: colors.surface },
                ]}
              >
                <Text style={[styles.benefitLabel, { color: colors.primary }]}>
                  Benefit:
                </Text>
                <Text style={[styles.benefitText, { color: colors.text }]}>
                  {dhikr.benefit}
                </Text>
              </View>
            )}

            {/* Counter */}
            <View style={styles.counterContainer}>
              <View style={styles.counterInfo}>
                <Text style={[styles.counterText, { color: colors.text }]}>
                  {count} / {dhikr.repetitions}
                </Text>
                {isCompleted && (
                  <Text style={[styles.completedText, { color: colors.success }]}>
                    ✓ Completed
                  </Text>
                )}
              </View>

              <View style={styles.counterButtons}>
                <TouchableOpacity
                  style={[
                    styles.counterButton,
                    { backgroundColor: colors.surface },
                  ]}
                  onPress={() => resetCounter(dhikr.id)}
                >
                  <Text style={[styles.buttonText, { color: colors.text }]}>
                    Reset
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.counterButton,
                    styles.countButton,
                    { backgroundColor: colors.primary },
                  ]}
                  onPress={() =>
                    incrementCounter(dhikr.id, dhikr.repetitions)
                  }
                >
                  <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>
                    Count
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dhikrCard: {
    margin: 16,
    padding: 20,
    borderRadius: 12,
  },
  arabicText: {
    fontSize: 24,
    lineHeight: 40,
    textAlign: 'right',
    marginBottom: 12,
  },
  transliteration: {
    ...Typography.body,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  translation: {
    ...Typography.bodyLarge,
    marginBottom: 12,
  },
  reference: {
    ...Typography.caption,
    marginBottom: 12,
  },
  benefitContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  benefitLabel: {
    ...Typography.caption,
    fontWeight: '600',
    marginBottom: 4,
  },
  benefitText: {
    ...Typography.body,
  },
  counterContainer: {
    marginTop: 8,
  },
  counterInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  counterText: {
    ...Typography.h3,
  },
  completedText: {
    ...Typography.body,
    fontWeight: '600',
  },
  counterButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  counterButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  countButton: {
    flex: 2,
  },
  buttonText: {
    ...Typography.button,
  },
});
