import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSettingsStore } from '../store/settingsStore';
import { useTranslation } from '../hooks/useTranslation';
import { getThemeColors } from '../utils/themeHelpers';
import { Typography } from '../constants/typography';
import { Icon } from '../components/common/Icon';
import { PrayerName } from '../types';
import {
  requestNotificationPermissions,
  areNotificationsEnabled,
} from '../services/notificationService';

export const SettingsScreen = () => {
  const {
    theme,
    language,
    setTheme,
    setLanguage,
    notifications,
    toggleNotification,
    togglePrayerNotification,
    prayerSettings,
  } = useSettingsStore();
  const [hasPermission, setHasPermission] = useState(false);
  const { t } = useTranslation();
  const systemTheme = useColorScheme();
  const colors = getThemeColors(theme, systemTheme);

  const themeOptions = [
    { value: 'light', label: t('light'), labelAr: t('lightArabic'), iconName: 'sun' },
    { value: 'dark', label: t('dark'), labelAr: t('darkArabic'), iconName: 'moon' },
    { value: 'auto', label: t('auto'), labelAr: t('autoArabic'), iconName: 'settings' },
  ];

  const languageOptions = [
    { value: 'en', label: t('english') },
    { value: 'ar', label: t('arabic') },
  ];

  const prayerOptions: Array<{ name: PrayerName; label: string }> = [
    { name: 'fajr', label: t('fajr') },
    { name: 'dhuhr', label: t('dhuhr') },
    { name: 'asr', label: t('asr') },
    { name: 'maghrib', label: t('maghrib') },
    { name: 'isha', label: t('isha') },
  ];

  // Check notification permission on mount
  useEffect(() => {
    async function checkPermission() {
      const enabled = await areNotificationsEnabled();
      setHasPermission(enabled);
    }
    checkPermission();
  }, []);

  const handleRequestPermission = async () => {
    const granted = await requestNotificationPermissions();
    setHasPermission(granted);

    if (granted) {
      Alert.alert(
        language === 'ar' ? 'تم منح الإذن' : 'Permission Granted',
        language === 'ar'
          ? 'يمكنك الآن تلقي إشعارات الصلاة'
          : 'You can now receive prayer notifications'
      );
    } else {
      Alert.alert(
        language === 'ar' ? 'تم الرفض' : 'Permission Denied',
        language === 'ar'
          ? 'يرجى تفعيل الإشعارات من الإعدادات'
          : 'Please enable notifications in settings'
      );
    }
  };

  const handleTogglePrayerNotifications = () => {
    if (!hasPermission) {
      handleRequestPermission();
      return;
    }
    toggleNotification('prayers');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {t('settings')}
          </Text>
        </View>

        {/* Theme Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('theme')}
          </Text>
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            {themeOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionRow,
                  theme === option.value && {
                    backgroundColor: colors.primary + '15',
                  },
                ]}
                onPress={() => setTheme(option.value as any)}
              >
                <View style={styles.optionLeft}>
                  <View style={[styles.iconCircle, { backgroundColor: colors.surface }]}>
                    <Icon name={option.iconName} size={22} color={colors.primary} />
                  </View>
                  <View>
                    <Text
                      style={[
                        styles.optionLabel,
                        { color: colors.text },
                        theme === option.value && { fontFamily: 'Cairo-Bold' },
                      ]}
                    >
                      {option.label}
                    </Text>
                    <Text
                      style={[styles.optionSubtitle, { color: colors.textSecondary }]}
                    >
                      {option.labelAr}
                    </Text>
                  </View>
                </View>
                {theme === option.value && (
                  <Icon name="check" size={20} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Language Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('language')}
          </Text>
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            {languageOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionRow,
                  language === option.value && {
                    backgroundColor: colors.primary + '15',
                  },
                ]}
                onPress={() => setLanguage(option.value as any)}
              >
                <View style={styles.optionLeft}>
                  <Text
                    style={[
                      styles.optionLabel,
                      { color: colors.text },
                      language === option.value && { fontFamily: 'Cairo-Bold' },
                    ]}
                  >
                    {option.label}
                  </Text>
                </View>
                {language === option.value && (
                  <Icon name="check" size={20} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('notifications')}
          </Text>

          {/* Permission Warning */}
          {!hasPermission && (
            <TouchableOpacity
              style={[styles.permissionCard, { backgroundColor: colors.warning + '15', borderColor: colors.warning }]}
              onPress={handleRequestPermission}
            >
              <Icon name="bell" size={24} color={colors.warning} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[styles.permissionTitle, { color: colors.text }]}>
                  {t('notificationPermission')}
                </Text>
                <Text style={[styles.permissionDesc, { color: colors.textSecondary }]}>
                  {t('notificationPermissionDesc')}
                </Text>
              </View>
              <Icon name="chevron-right" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}

          {/* Prayer Notifications */}
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <View style={styles.optionRow}>
              <View style={styles.optionLeft}>
                <View style={[styles.iconCircle, { backgroundColor: colors.surface }]}>
                  <Icon name="bell" size={22} color={colors.primary} />
                </View>
                <View>
                  <Text style={[styles.optionLabel, { color: colors.text }]}>
                    {t('prayerNotifications')}
                  </Text>
                  <Text style={[styles.optionSubtitle, { color: colors.textSecondary }]}>
                    {t('prayerNotificationsDesc')}
                  </Text>
                </View>
              </View>
              <Switch
                value={notifications.prayers}
                onValueChange={handleTogglePrayerNotifications}
                trackColor={{ false: colors.border, true: colors.primary + '50' }}
                thumbColor={notifications.prayers ? colors.primary : colors.surface}
              />
            </View>

            {/* Individual Prayer Toggles */}
            {notifications.prayers && hasPermission && (
              <View style={[styles.prayerToggles, { borderTopColor: colors.border }]}>
                <Text style={[styles.prayerTogglesTitle, { color: colors.textSecondary }]}>
                  {t('enableForPrayers')}
                </Text>
                {prayerOptions.map((prayer, index) => (
                  <View
                    key={prayer.name}
                    style={[
                      styles.prayerToggleRow,
                      index < prayerOptions.length - 1 && {
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        borderBottomColor: colors.border,
                      },
                    ]}
                  >
                    <Text style={[styles.prayerToggleLabel, { color: colors.text }]}>
                      {prayer.label}
                    </Text>
                    <Switch
                      value={prayerSettings.notifications[prayer.name]}
                      onValueChange={() => togglePrayerNotification(prayer.name)}
                      trackColor={{ false: colors.border, true: colors.primary + '50' }}
                      thumbColor={
                        prayerSettings.notifications[prayer.name] ? colors.primary : colors.surface
                      }
                    />
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                {t('version')}
              </Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                1.0.0
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                {t('createdBy')}
              </Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                MrSmith
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                {t('openSource')}
              </Text>
              <Text style={[styles.infoValue, { color: colors.primary }]}>
                MIT License
              </Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </Text>
          <Text
            style={[
              styles.footerSubtext,
              { color: colors.textSecondary, marginTop: 8 },
            ]}
          >
            {t('madeLove')}
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
  headerTitle: {
    ...Typography.h2,
  },
  section: {
    marginTop: 8,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    ...Typography.h3,
    marginBottom: 12,
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  optionLabel: {
    ...Typography.bodyLarge,
  },
  optionSubtitle: {
    ...Typography.caption,
    marginTop: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  infoLabel: {
    ...Typography.body,
  },
  infoValue: {
    ...Typography.body,
    fontFamily: 'Cairo-SemiBold',
  },
  footer: {
    alignItems: 'center',
    padding: 32,
  },
  footerText: {
    ...Typography.bodyLarge,
    textAlign: 'center',
  },
  footerSubtext: {
    ...Typography.caption,
    textAlign: 'center',
  },
  permissionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  permissionTitle: {
    ...Typography.bodyLarge,
    fontFamily: 'Cairo-SemiBold',
    marginBottom: 4,
  },
  permissionDesc: {
    ...Typography.caption,
  },
  prayerToggles: {
    borderTopWidth: 1,
    paddingTop: 12,
    marginTop: 8,
  },
  prayerTogglesTitle: {
    ...Typography.caption,
    textTransform: 'uppercase',
    marginBottom: 12,
    marginLeft: 16,
  },
  prayerToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  prayerToggleLabel: {
    ...Typography.body,
  },
});
