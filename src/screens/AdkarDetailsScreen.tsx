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
                { color: colors.text, fontFamily: 'Cairo-Bold' },
              ]}
            >
              {dhikr.arabic}
            </Text>

            {/* Translation */}
            <Text style={[styles.translation, { color: colors.textSecondary }]}>
              {dhikr.translation}
            </Text>

            {/* Counter Display */}
            <View style={styles.counterDisplayContainer}>
              <View style={styles.counterCircle}>
                <Text style={[styles.counterLargeNumber, { color: colors.primary }]}>
                  {count}
                </Text>
                <Text style={[styles.counterSmallText, { color: colors.textSecondary }]}>
                  of {dhikr.repetitions}
                </Text>
              </View>
              {isCompleted && (
                <View style={[styles.completedBadge, { backgroundColor: colors.success + '20' }]}>
                  <Text style={[styles.completedText, { color: colors.success }]}>
                    ✓ Completed
                  </Text>
                  <Text style={[styles.completedSubtext, { color: colors.textSecondary }]}>
                    Auto-reset in 10min
                  </Text>
                </View>
              )}
            </View>

            {/* Counter Buttons */}
            <View style={styles.counterButtons}>
              <TouchableOpacity
                style={[
                  styles.resetButton,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                ]}
                onPress={() => resetCounter(dhikr.id)}
              >
                <Text style={[styles.resetButtonText, { color: colors.text }]}>
                  Reset
                </Text>
              </TouchableOpacity>

              {!isCompleted && (
                <TouchableOpacity
                  style={[
                    styles.countButton,
                    { backgroundColor: colors.primary },
                    isCurrent && { borderWidth: 3, borderColor: '#FFD700' },
                  ]}
                  onPress={() =>
                    incrementCounter(dhikr.id, dhikr.repetitions, index)
                  }
                  activeOpacity={0.7}
                >
                  <Text style={[styles.countButtonText, { color: '#FFFFFF' }]}>
                    TAP TO COUNT
                  </Text>
                  <Text style={[styles.countButtonSubtext, { color: 'rgba(255,255,255,0.9)' }]}>
                    {dhikr.repetitions - count} remaining
                  </Text>
                </TouchableOpacity>
              )}
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
    fontSize: 26,
    lineHeight: 44,
    textAlign: 'right',
    marginBottom: 16,
  },
  translation: {
    ...Typography.bodyLarge,
    marginBottom: 20,
    lineHeight: 24,
  },
  counterDisplayContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  counterCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#0D5C3D',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  counterLargeNumber: {
    fontSize: 48,
    fontWeight: '700',
  },
  counterSmallText: {
    fontSize: 14,
    marginTop: 4,
  },
  completedBadge: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  completedText: {
    fontSize: 16,
    fontWeight: '700',
  },
  completedSubtext: {
    fontSize: 12,
    marginTop: 2,
  },
  counterButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  resetButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  countButton: {
    flex: 1,
    paddingVertical: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countButtonText: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  countButtonSubtext: {
    fontSize: 13,
    marginTop: 4,
  },
  buttonText: {
    ...Typography.button,
  },
});
