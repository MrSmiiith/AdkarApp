import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSettingsStore } from '../store/settingsStore';
import { useTranslation } from '../hooks/useTranslation';
import { getThemeColors } from '../utils/themeHelpers';
import { Typography } from '../constants/typography';
import { Icon } from '../components/common/Icon';

export const SettingsScreen = () => {
  const { theme, language, setTheme, setLanguage } = useSettingsStore();
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

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
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
});
