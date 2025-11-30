import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { fetchSurah } from '../services/quranService';
import { useSettingsStore } from '../store/settingsStore';
import { useQuranStore } from '../store/quranStore';
import { useTranslation } from '../hooks/useTranslation';
import { getThemeColors } from '../utils/themeHelpers';
import { Typography } from '../constants/typography';
import { Surah, Ayah, RootStackParamList } from '../types';
import { Icon } from '../components/common/Icon';

type QuranReaderRouteProp = RouteProp<RootStackParamList, 'QuranReader'>;

export const QuranReaderScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<QuranReaderRouteProp>();
  const { theme, fontSize } = useSettingsStore();
  const { updateReadingProgress, bookmarks, addBookmark, removeBookmark } = useQuranStore();
  const { t } = useTranslation();
  const systemTheme = useColorScheme();
  const colors = getThemeColors(theme, systemTheme);

  const [surah, setSurah] = useState<Surah | null>(null);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const surahNumber = route.params?.surah || 1;

  // Check if surah is bookmarked
  const isBookmarked = bookmarks.some((b) => b.surah === surahNumber);

  const toggleBookmark = () => {
    if (isBookmarked) {
      const bookmark = bookmarks.find((b) => b.surah === surahNumber);
      if (bookmark) {
        removeBookmark(bookmark.id);
      }
    } else {
      addBookmark(surahNumber, 1, `${surah?.englishName || 'Surah'} bookmark`);
    }
  };

  const toggleAyahBookmark = (ayahNumber: number) => {
    const existingBookmark = bookmarks.find(
      (b) => b.surah === surahNumber && b.ayah === ayahNumber
    );

    if (existingBookmark) {
      removeBookmark(existingBookmark.id);
    } else {
      const ayahText = ayahs.find((a) => a.numberInSurah === ayahNumber);
      addBookmark(
        surahNumber,
        ayahNumber,
        `${surah?.englishName || 'Surah'} - Verse ${ayahNumber}`
      );
      // Update reading progress when bookmarking
      updateReadingProgress(surahNumber, ayahNumber);
    }
  };

  const isAyahBookmarked = (ayahNumber: number) => {
    return bookmarks.some(
      (b) => b.surah === surahNumber && b.ayah === ayahNumber
    );
  };

  useEffect(() => {
    loadSurah();
  }, [surahNumber]);

  const loadSurah = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchSurah(surahNumber);
      setSurah(data.surah);
      setAyahs(data.ayahs);

      // Update reading progress
      updateReadingProgress(surahNumber, 1);
    } catch (err) {
      console.error('Error loading surah:', err);
      setError('Failed to load Surah. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Loading Surah...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !surah) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <Icon name="close" size={48} color={colors.textSecondary} />
          <Text style={[styles.errorText, { color: colors.text }]}>
            {error || 'Surah not found'}
          </Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: colors.primary }]}
            onPress={loadSurah}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {surah.englishName}
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            {surah.englishNameTranslation} • {surah.numberOfAyahs} {t('verses')}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerIcon} onPress={toggleBookmark}>
            <Icon
              name={isBookmarked ? "bookmark" : "bookmark-outline"}
              size={24}
              color={isBookmarked ? colors.primary : colors.text}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Surah Header Card */}
        <View style={[styles.surahCard, { backgroundColor: colors.primary }]}>
          <Text style={styles.surahNameArabic}>{surah.name}</Text>
          <Text style={styles.surahInfo}>
            {surah.revelationType} • {surah.numberOfAyahs} Verses
          </Text>
        </View>

        {/* Bismillah (except for Surah At-Tawba) */}
        {surahNumber !== 9 && (
          <View style={[styles.bismillahContainer, { backgroundColor: colors.surface }]}>
            <Text style={[styles.bismillahText, { color: colors.text, fontSize: fontSize + 4 }]}>
              بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
            </Text>
          </View>
        )}

        {/* Verses */}
        {ayahs.map((ayah) => (
          <View
            key={ayah.number}
            style={[styles.ayahContainer, { borderBottomColor: colors.border }]}
          >
            <View style={styles.ayahNumberBadge}>
              <Text style={[styles.ayahNumberText, { color: colors.primary }]}>
                {ayah.numberInSurah}
              </Text>
            </View>
            <Text
              style={[
                styles.ayahText,
                { color: colors.text, fontSize: fontSize + 6, lineHeight: (fontSize + 6) * 1.8 }
              ]}
            >
              {ayah.text}
            </Text>
            <View style={styles.ayahActions}>
              <TouchableOpacity
                style={styles.ayahAction}
                onPress={() => toggleAyahBookmark(ayah.numberInSurah)}
              >
                <Icon
                  name={isAyahBookmarked(ayah.numberInSurah) ? "bookmark" : "bookmark-outline"}
                  size={18}
                  color={isAyahBookmarked(ayah.numberInSurah) ? colors.primary : colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Footer Spacer */}
        <View style={styles.footerSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    ...Typography.body,
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    ...Typography.bodyLarge,
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    ...Typography.bodyLarge,
    fontWeight: '700',
    marginBottom: 2,
  },
  headerSubtitle: {
    ...Typography.caption,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginLeft: 16,
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  surahCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  surahNameArabic: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  surahInfo: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  bismillahContainer: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  bismillahText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  ayahContainer: {
    paddingVertical: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  ayahNumberBadge: {
    alignSelf: 'flex-start',
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#0D5C3D',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  ayahNumberText: {
    fontSize: 14,
    fontWeight: '700',
  },
  ayahText: {
    textAlign: 'right',
    fontWeight: '500',
    marginBottom: 12,
  },
  ayahActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  ayahAction: {
    marginLeft: 16,
    padding: 4,
  },
  footerSpacer: {
    height: 40,
  },
});
