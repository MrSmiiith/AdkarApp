import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePrayerStore } from '../store/prayerStore';
import { useSettingsStore } from '../store/settingsStore';
import { getThemeColors } from '../utils/themeHelpers';
import { Typography } from '../constants/typography';
import { Icon } from '../components/common/Icon';
import { formatPrayerTime, formatDate, getHijriDate, formatTimeRemaining } from '../utils/dateHelpers';
import { getNextPrayer, calculatePrayerTimes } from '../services/prayerService';
import { addDays, format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { PrayerTimes } from '../types';

export const PrayerTimesScreen = () => {
  const { theme } = useSettingsStore();
  const { prayerTimes, location } = usePrayerStore();
  const systemTheme = useColorScheme();
  const colors = getThemeColors(theme, systemTheme);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [monthlyPrayers, setMonthlyPrayers] = useState<{ [key: string]: PrayerTimes }>({});
  const [viewMode, setViewMode] = useState<'today' | 'week' | 'month'>('today');

  useEffect(() => {
    if (location && viewMode === 'month') {
      generateMonthlyPrayers();
    }
  }, [location, selectedDate, viewMode]);

  const generateMonthlyPrayers = () => {
    if (!location) return;

    const start = startOfMonth(selectedDate);
    const end = endOfMonth(selectedDate);
    const days = eachDayOfInterval({ start, end });

    const prayers: { [key: string]: PrayerTimes } = {};
    days.forEach(day => {
      const dayPrayers = calculatePrayerTimes(location, day);
      prayers[format(day, 'yyyy-MM-dd')] = dayPrayers;
    });

    setMonthlyPrayers(prayers);
  };

  const getSelectedDayPrayers = (): PrayerTimes | null => {
    if (!location) return null;

    const isToday = format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
    if (isToday && prayerTimes) return prayerTimes;

    return calculatePrayerTimes(location, selectedDate);
  };

  const selectedDayPrayers = getSelectedDayPrayers();
  const nextPrayer = selectedDayPrayers ? getNextPrayer(selectedDayPrayers) : null;

  const changeDate = (days: number) => {
    setSelectedDate(addDays(selectedDate, days));
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const isToday = format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Prayer Times</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          {getHijriDate(selectedDate)}
        </Text>
      </View>

      {/* View Mode Selector */}
      <View style={[styles.viewModeContainer, { backgroundColor: colors.surface }]}>
        <TouchableOpacity
          style={[
            styles.viewModeButton,
            viewMode === 'today' && { backgroundColor: colors.primary },
          ]}
          onPress={() => setViewMode('today')}
        >
          <Text
            style={[
              styles.viewModeText,
              { color: viewMode === 'today' ? '#FFFFFF' : colors.text },
            ]}
          >
            Today
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.viewModeButton,
            viewMode === 'week' && { backgroundColor: colors.primary },
          ]}
          onPress={() => setViewMode('week')}
        >
          <Text
            style={[
              styles.viewModeText,
              { color: viewMode === 'week' ? '#FFFFFF' : colors.text },
            ]}
          >
            Week
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.viewModeButton,
            viewMode === 'month' && { backgroundColor: colors.primary },
          ]}
          onPress={() => setViewMode('month')}
        >
          <Text
            style={[
              styles.viewModeText,
              { color: viewMode === 'month' ? '#FFFFFF' : colors.text },
            ]}
          >
            Month
          </Text>
        </TouchableOpacity>
      </View>

      {/* Date Navigator */}
      {viewMode !== 'month' && (
        <View style={[styles.dateNavigator, { backgroundColor: colors.card }]}>
          <TouchableOpacity onPress={() => changeDate(-1)} style={styles.navButton}>
            <Icon name="chevron-left" size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.dateInfo}>
            <Text style={[styles.dateText, { color: colors.text }]}>
              {formatDate(selectedDate)}
            </Text>
            {!isToday && (
              <TouchableOpacity onPress={goToToday} style={styles.todayButton}>
                <Text style={[styles.todayButtonText, { color: colors.primary }]}>
                  Go to Today
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity onPress={() => changeDate(1)} style={styles.navButton}>
            <Icon name="chevron-right" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      )}

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {viewMode === 'today' || viewMode === 'week' ? (
          <>
            {/* Next Prayer Card */}
            {nextPrayer && isToday && (
              <View style={[styles.nextPrayerCard, { backgroundColor: colors.primary }]}>
                <View style={styles.nextPrayerHeader}>
                  <Icon name="clock" size={24} color="#FFFFFF" />
                  <Text style={styles.nextPrayerLabel}>Next Prayer</Text>
                </View>
                <Text style={styles.nextPrayerName}>{nextPrayer.name}</Text>
                <Text style={styles.nextPrayerTime}>
                  {formatPrayerTime(nextPrayer.time)}
                </Text>
                <Text style={styles.nextPrayerRemaining}>
                  in {formatTimeRemaining(nextPrayer.time)}
                </Text>
              </View>
            )}

            {/* Prayer Times List */}
            {selectedDayPrayers && (
              <View style={[styles.prayersList, { backgroundColor: colors.card }]}>
                <Text style={[styles.listTitle, { color: colors.text }]}>
                  All Prayers - {format(selectedDate, 'MMM d, yyyy')}
                </Text>

                <PrayerRow
                  name="Fajr"
                  nameAr="الفجر"
                  time={selectedDayPrayers.fajr}
                  icon="sunrise"
                  colors={colors}
                  isNext={nextPrayer?.name === 'Fajr' && isToday}
                />
                <PrayerRow
                  name="Sunrise"
                  nameAr="الشروق"
                  time={selectedDayPrayers.sunrise}
                  icon="sun"
                  colors={colors}
                  isNext={false}
                  isInfo
                />
                <PrayerRow
                  name="Dhuhr"
                  nameAr="الظهر"
                  time={selectedDayPrayers.dhuhr}
                  icon="sun"
                  colors={colors}
                  isNext={nextPrayer?.name === 'Dhuhr' && isToday}
                />
                <PrayerRow
                  name="Asr"
                  nameAr="العصر"
                  time={selectedDayPrayers.asr}
                  icon="sun"
                  colors={colors}
                  isNext={nextPrayer?.name === 'Asr' && isToday}
                />
                <PrayerRow
                  name="Maghrib"
                  nameAr="المغرب"
                  time={selectedDayPrayers.maghrib}
                  icon="sunset"
                  colors={colors}
                  isNext={nextPrayer?.name === 'Maghrib' && isToday}
                />
                <PrayerRow
                  name="Isha"
                  nameAr="العشاء"
                  time={selectedDayPrayers.isha}
                  icon="moon"
                  colors={colors}
                  isNext={nextPrayer?.name === 'Isha' && isToday}
                />
              </View>
            )}

            {/* Week View */}
            {viewMode === 'week' && location && (
              <View style={[styles.weekView, { backgroundColor: colors.card }]}>
                <Text style={[styles.listTitle, { color: colors.text }]}>
                  Next 7 Days
                </Text>
                {[0, 1, 2, 3, 4, 5, 6].map(dayOffset => {
                  const date = addDays(new Date(), dayOffset);
                  const dayPrayers = calculatePrayerTimes(location, date);
                  return (
                    <TouchableOpacity
                      key={dayOffset}
                      style={styles.weekDayCard}
                      onPress={() => setSelectedDate(date)}
                    >
                      <View style={styles.weekDayHeader}>
                        <Text style={[styles.weekDayName, { color: colors.text }]}>
                          {format(date, 'EEEE, MMM d')}
                        </Text>
                        {dayOffset === 0 && (
                          <View style={[styles.todayBadge, { backgroundColor: colors.primary }]}>
                            <Text style={styles.todayBadgeText}>Today</Text>
                          </View>
                        )}
                      </View>
                      <View style={styles.weekPrayerTimes}>
                        <Text style={[styles.weekPrayerTime, { color: colors.textSecondary }]}>
                          Fajr: {formatPrayerTime(dayPrayers.fajr)}
                        </Text>
                        <Text style={[styles.weekPrayerTime, { color: colors.textSecondary }]}>
                          Dhuhr: {formatPrayerTime(dayPrayers.dhuhr)}
                        </Text>
                        <Text style={[styles.weekPrayerTime, { color: colors.textSecondary }]}>
                          Asr: {formatPrayerTime(dayPrayers.asr)}
                        </Text>
                        <Text style={[styles.weekPrayerTime, { color: colors.textSecondary }]}>
                          Maghrib: {formatPrayerTime(dayPrayers.maghrib)}
                        </Text>
                        <Text style={[styles.weekPrayerTime, { color: colors.textSecondary }]}>
                          Isha: {formatPrayerTime(dayPrayers.isha)}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </>
        ) : (
          // Monthly View
          <View style={styles.monthView}>
            <View style={[styles.monthHeader, { backgroundColor: colors.card }]}>
              <TouchableOpacity
                onPress={() => setSelectedDate(addDays(selectedDate, -30))}
                style={styles.monthNavButton}
              >
                <Icon name="chevron-left" size={24} color={colors.text} />
              </TouchableOpacity>
              <Text style={[styles.monthTitle, { color: colors.text }]}>
                {format(selectedDate, 'MMMM yyyy')}
              </Text>
              <TouchableOpacity
                onPress={() => setSelectedDate(addDays(selectedDate, 30))}
                style={styles.monthNavButton}
              >
                <Icon name="chevron-right" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            {Object.entries(monthlyPrayers).map(([dateStr, prayers]) => (
              <View
                key={dateStr}
                style={[styles.monthDayCard, { backgroundColor: colors.card }]}
              >
                <Text style={[styles.monthDayDate, { color: colors.text }]}>
                  {format(new Date(dateStr), 'EEE, MMM d')}
                </Text>
                <View style={styles.monthPrayerRow}>
                  <Text style={[styles.monthPrayerText, { color: colors.textSecondary }]}>
                    Fajr {formatPrayerTime(prayers.fajr)}
                  </Text>
                  <Text style={[styles.monthPrayerText, { color: colors.textSecondary }]}>
                    Dhuhr {formatPrayerTime(prayers.dhuhr)}
                  </Text>
                  <Text style={[styles.monthPrayerText, { color: colors.textSecondary }]}>
                    Asr {formatPrayerTime(prayers.asr)}
                  </Text>
                  <Text style={[styles.monthPrayerText, { color: colors.textSecondary }]}>
                    Maghrib {formatPrayerTime(prayers.maghrib)}
                  </Text>
                  <Text style={[styles.monthPrayerText, { color: colors.textSecondary }]}>
                    Isha {formatPrayerTime(prayers.isha)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const PrayerRow = ({ name, nameAr, time, icon, colors, isNext, isInfo }: any) => (
  <View
    style={[
      styles.prayerRow,
      isNext && { backgroundColor: colors.primary + '20' },
      isInfo && { opacity: 0.6 },
    ]}
  >
    <View style={styles.prayerRowLeft}>
      <Icon name={icon} size={24} color={isNext ? colors.primary : colors.textSecondary} />
      <View style={styles.prayerRowNames}>
        <Text
          style={[
            styles.prayerRowName,
            { color: isNext ? colors.primary : colors.text },
            isInfo && { fontStyle: 'italic' },
          ]}
        >
          {name}
        </Text>
        <Text style={[styles.prayerRowNameAr, { color: colors.textSecondary }]}>
          {nameAr}
        </Text>
      </View>
    </View>
    <View style={styles.prayerRowRight}>
      <Text
        style={[
          styles.prayerRowTime,
          { color: isNext ? colors.primary : colors.text },
        ]}
      >
        {formatPrayerTime(time)}
      </Text>
      {isNext && (
        <View style={[styles.nextBadge, { backgroundColor: colors.primary }]}>
          <Text style={styles.nextBadgeText}>Next</Text>
        </View>
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: {
    ...Typography.h2,
    marginBottom: 4,
  },
  headerSubtitle: {
    ...Typography.caption,
  },
  viewModeContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  viewModeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewModeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  dateNavigator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  navButton: {
    padding: 8,
  },
  dateInfo: {
    flex: 1,
    alignItems: 'center',
  },
  dateText: {
    ...Typography.bodyLarge,
    fontWeight: '600',
  },
  todayButton: {
    marginTop: 4,
  },
  todayButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  nextPrayerCard: {
    margin: 16,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  nextPrayerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  nextPrayerLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
    textTransform: 'uppercase',
  },
  nextPrayerName: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  nextPrayerTime: {
    color: '#FFFFFF',
    fontSize: 42,
    fontWeight: '300',
  },
  nextPrayerRemaining: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    marginTop: 8,
  },
  prayersList: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
  },
  listTitle: {
    ...Typography.h3,
    marginBottom: 16,
  },
  prayerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  prayerRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  prayerRowNames: {
    gap: 2,
  },
  prayerRowName: {
    ...Typography.bodyLarge,
    fontWeight: '600',
  },
  prayerRowNameAr: {
    fontSize: 13,
    fontFamily: 'Cairo-SemiBold',
  },
  prayerRowRight: {
    alignItems: 'flex-end',
  },
  prayerRowTime: {
    ...Typography.bodyLarge,
    fontWeight: '600',
  },
  nextBadge: {
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  nextBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  weekView: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
  },
  weekDayCard: {
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  weekDayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  weekDayName: {
    fontSize: 16,
    fontWeight: '600',
  },
  todayBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  todayBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  weekPrayerTimes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  weekPrayerTime: {
    fontSize: 13,
  },
  monthView: {
    padding: 16,
  },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  monthNavButton: {
    padding: 8,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  monthDayCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  monthDayDate: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  monthPrayerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  monthPrayerText: {
    fontSize: 12,
  },
});
