import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { fetchAllSurahs } from '../services/quranService';
import { useSettingsStore } from '../store/settingsStore';
import { useQuranStore } from '../store/quranStore';
import { useTranslation } from '../hooks/useTranslation';
import { getThemeColors } from '../utils/themeHelpers';
import { Colors } from '../constants/colors';
import { Typography } from '../constants/typography';
import { Surah } from '../types';
import { Icon } from '../components/common/Icon';
import { getSurahPageInfo } from '../utils/quranPages';

export const QuranScreen = () => {
  const navigation = useNavigation();
  const { theme } = useSettingsStore();
  const { t } = useTranslation();
  const { readingProgress } = useQuranStore();
  const systemTheme = useColorScheme();
  const colors = getThemeColors(theme, systemTheme);

  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [filteredSurahs, setFilteredSurahs] = useState<Surah[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadSurahs();
  }, []);

  const loadSurahs = async () => {
    try {
      const data = await fetchAllSurahs();
      setSurahs(data);
      setFilteredSurahs(data);
    } catch (error) {
      console.error('Error loading surahs:', error);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredSurahs(surahs);
    } else {
      const filtered = surahs.filter(
        (surah) =>
          surah.englishName.toLowerCase().includes(query.toLowerCase()) ||
          surah.number.toString().includes(query)
      );
      setFilteredSurahs(filtered);
    }
  };

  const renderSurah = ({ item }: { item: Surah }) => {
    const isLastRead = readingProgress?.surah === item.number;
    const pageInfo = getSurahPageInfo(item.number);

    return (
      <TouchableOpacity
        style={[
          styles.surahItem,
          { backgroundColor: colors.card, borderBottomColor: colors.border },
          isLastRead && { backgroundColor: colors.primaryLight + '20' },
        ]}
        onPress={() => {
          // @ts-ignore
          navigation.navigate('QuranReader', { surah: item.number });
        }}
      >
        <View style={styles.surahNumber}>
          <Text style={[styles.numberText, { color: colors.primary }]}>
            {item.number}
          </Text>
        </View>
        <View style={styles.surahInfo}>
          <Text style={[styles.surahName, { color: colors.text }]}>
            {item.englishName}
          </Text>
          <Text style={[styles.surahTranslation, { color: colors.textSecondary }]}>
            {item.englishNameTranslation} • {item.numberOfAyahs} {t('verses')}
          </Text>
        </View>
        <View style={styles.surahArabic}>
          <Text style={[styles.arabicName, { color: colors.text }]}>
            {item.name}
          </Text>
          <Text style={[styles.revelationType, { color: colors.textSecondary }]}>
            {item.revelationType}
          </Text>
          {pageInfo && (
            <View style={styles.pageIndicator}>
              <Icon name="book-open" size={10} color={colors.textSecondary} style={{ marginRight: 4 }} />
              <Text style={[styles.pageText, { color: colors.textSecondary }]}>
                {pageInfo.startPage === pageInfo.endPage
                  ? `p.${pageInfo.startPage}`
                  : `p.${pageInfo.startPage}-${pageInfo.endPage}`}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {t('quran')}
        </Text>
      </View>

      {/* Continue Reading Card */}
      {readingProgress && (
        <TouchableOpacity
          style={[styles.continueCard, { backgroundColor: colors.primary }]}
          onPress={() => {
            const surahToRead = surahs.find((s) => s.number === readingProgress.surah);
            if (surahToRead) {
              // @ts-ignore
              navigation.navigate('QuranReader', { surah: readingProgress.surah });
            }
          }}
        >
          <Text style={styles.continueLabel}>{t('continueReading')}</Text>
          <Text style={styles.continueText}>
            {surahs.find((s) => s.number === readingProgress.surah)?.englishName || ''}
          </Text>
          <Text style={[styles.continueLabel, { marginTop: 4 }]}>
            {t('verse')} {readingProgress.ayah}
          </Text>
        </TouchableOpacity>
      )}

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
        <Icon name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder={t('searchSurah')}
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {/* Surahs List */}
      <FlatList
        data={filteredSurahs}
        renderItem={renderSurah}
        keyExtractor={(item) => item.number.toString()}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  headerTitle: {
    ...Typography.h2,
  },
  continueCard: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
    padding: 20,
    borderRadius: 12,
  },
  continueLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    opacity: 0.9,
  },
  continueText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 4,
  },
  searchContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    ...Typography.body,
    paddingVertical: 12,
    flex: 1,
  },
  surahItem: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  surahNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#0D5C3D',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  numberText: {
    fontSize: 16,
    fontWeight: '600',
  },
  surahInfo: {
    flex: 1,
  },
  surahName: {
    ...Typography.bodyLarge,
    fontWeight: '600',
    marginBottom: 2,
  },
  surahTranslation: {
    ...Typography.caption,
  },
  surahArabic: {
    alignItems: 'flex-end',
  },
  arabicName: {
    fontSize: 20,
    marginBottom: 2,
  },
  revelationType: {
    ...Typography.caption,
  },
  pageIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  pageText: {
    fontSize: 10,
    fontWeight: '500',
  },
});
