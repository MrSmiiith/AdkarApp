import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Vibration,
  useColorScheme,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useSettingsStore } from '../store/settingsStore';
import { getThemeColors } from '../utils/themeHelpers';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { ALL_ADKAR } from '../database/data/adkar';
import { Dhikr } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CounterState {
  count: number;
  completedAt?: number;
}

export const AdkarDetailsScreen = () => {
  const route = useRoute();
  const { categoryId } = route.params as { categoryId: string };
  const { theme } = useSettingsStore();
  const systemTheme = useColorScheme();
  const colors = getThemeColors(theme, systemTheme);
  const scrollRef = useRef<ScrollView>(null);

  const adhkar = ALL_ADKAR[categoryId as keyof typeof ALL_ADKAR] || [];
  const [counters, setCounters] = useState<{ [key: string]: CounterState }>({});
  const [currentDhikrIndex, setCurrentDhikrIndex] = useState(0);
  const resetTimersRef = useRef<{ [key: string]: NodeJS.Timeout }>({});

  // Load saved counters from AsyncStorage
  useEffect(() => {
    loadCounters();
  }, [categoryId]);

  // Auto-reset completed dhikrs after 10 minutes
  useEffect(() => {
    Object.entries(counters).forEach(([dhikrId, state]) => {
      if (state.completedAt) {
        const timeElapsed = Date.now() - state.completedAt;
        const timeRemaining = 10 * 60 * 1000 - timeElapsed; // 10 minutes

        if (timeRemaining > 0) {
          // Set timer for remaining time
          resetTimersRef.current[dhikrId] = setTimeout(() => {
            resetAndAdvance(dhikrId);
          }, timeRemaining);
        } else {
          // Already past 10 minutes, reset immediately
          resetAndAdvance(dhikrId);
        }
      }
    });

    return () => {
      // Clear all timers on unmount
      Object.values(resetTimersRef.current).forEach(clearTimeout);
    };
  }, [counters]);

  const loadCounters = async () => {
    try {
      const saved = await AsyncStorage.getItem(`adkar_counters_${categoryId}`);
      if (saved) {
        setCounters(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading counters:', error);
    }
  };

  const saveCounters = async (newCounters: { [key: string]: CounterState }) => {
    try {
      await AsyncStorage.setItem(`adkar_counters_${categoryId}`, JSON.stringify(newCounters));
    } catch (error) {
      console.error('Error saving counters:', error);
    }
  };

  const incrementCounter = (dhikrId: string, maxCount: number, dhikrIndex: number) => {
    setCounters((prev) => {
      const currentState = prev[dhikrId] || { count: 0 };
      const newCount = currentState.count + 1;

      let newState: CounterState;
      if (newCount >= maxCount) {
        // Completed
        newState = { count: newCount, completedAt: Date.now() };
        Vibration.vibrate([0, 50, 100, 50]); // Victory vibration

        // Auto-advance to next dhikr after a delay
        setTimeout(() => {
          if (dhikrIndex < adhkar.length - 1) {
            setCurrentDhikrIndex(dhikrIndex + 1);
          }
        }, 1500);
      } else {
        newState = { count: newCount };
        Vibration.vibrate(20); // Light tap feedback
      }

      const newCounters = { ...prev, [dhikrId]: newState };
      saveCounters(newCounters);
      return newCounters;
    });
  };

  const resetAndAdvance = (dhikrId: string) => {
    setCounters((prev) => {
      const newCounters = { ...prev, [dhikrId]: { count: 0 } };
      saveCounters(newCounters);
      return newCounters;
    });

    // Find next incomplete dhikr
    const currentIndex = adhkar.findIndex(d => d.id === dhikrId);
    if (currentIndex < adhkar.length - 1) {
      setCurrentDhikrIndex(currentIndex + 1);
    }
  };

  const resetCounter = (dhikrId: string) => {
    // Clear any pending reset timer
    if (resetTimersRef.current[dhikrId]) {
      clearTimeout(resetTimersRef.current[dhikrId]);
      delete resetTimersRef.current[dhikrId];
    }

    setCounters((prev) => {
      const newCounters = { ...prev, [dhikrId]: { count: 0 } };
      saveCounters(newCounters);
      return newCounters;
    });
  };

  return (
    <ScrollView
      ref={scrollRef}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {adhkar.map((dhikr: Dhikr, index: number) => {
        const counterState = counters[dhikr.id] || { count: 0 };
        const count = counterState.count;
        const isCompleted = count >= dhikr.repetitions;
        const isCurrent = index === currentDhikrIndex;

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
                <Text style={[styles.counterText, { color: colors.text, fontSize: 32 }]}>
                  {count} / {dhikr.repetitions}
                </Text>
                {isCompleted && (
                  <Text style={[styles.completedText, { color: colors.success }]}>
                    ✓ Completed - Auto-reset in 10min
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

                {!isCompleted && (
                  <TouchableOpacity
                    style={[
                      styles.largeTapButton,
                      { backgroundColor: colors.primary },
                      isCurrent && { backgroundColor: colors.primary, borderWidth: 3, borderColor: '#FFD700' },
                    ]}
                    onPress={() =>
                      incrementCounter(dhikr.id, dhikr.repetitions, index)
                    }
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.largeTapText, { color: '#FFFFFF' }]}>
                      TAP TO COUNT
                    </Text>
                    <Text style={[styles.largeTapSubtext, { color: 'rgba(255,255,255,0.9)' }]}>
                      {dhikr.repetitions - count} remaining
                    </Text>
                  </TouchableOpacity>
                )}
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
  largeTapButton: {
    flex: 2,
    paddingVertical: 28,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
  largeTapText: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 1,
  },
  largeTapSubtext: {
    fontSize: 14,
    marginTop: 6,
    fontWeight: '500',
  },
  buttonText: {
    ...Typography.button,
  },
});
