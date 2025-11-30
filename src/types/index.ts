// Prayer Types
export interface PrayerTimes {
  fajr: Date;
  sunrise: Date;
  dhuhr: Date;
  asr: Date;
  maghrib: Date;
  isha: Date;
}

export type PrayerName = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export interface PrayerSettings {
  method: string;
  madhab: 'Shafi' | 'Hanafi';
  adjustments: {
    [key in PrayerName]?: number;
  };
  notifications: {
    [key in PrayerName]: boolean;
  };
}

// Quran Types
export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: 'Meccan' | 'Medinan';
  numberOfAyahs: number;
}

export interface Ayah {
  number: number;
  numberInSurah: number;
  text: string;
  surah: number;
  juz: number;
  page: number;
}

export interface Translation {
  text: string;
  edition: string;
  language: string;
}

export interface Bookmark {
  id: string;
  surah: number;
  ayah: number;
  note?: string;
  createdAt: Date;
  color?: string;
}

export interface ReadingProgress {
  surah: number;
  ayah: number;
  lastRead: Date;
}

export interface MemorizationProgress {
  surah: number;
  memorizedAyahs: number[];
  progress: number;
  lastReviewed?: Date;
}

// Adkar Types
export interface Dhikr {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
  reference?: string;
  repetitions: number;
  category: string;
  benefit?: string;
}

export interface AdkarCategory {
  id: string;
  nameEn: string;
  nameAr: string;
  adhkar: Dhikr[];
}

export interface DhikrProgress {
  dhikrId: string;
  count: number;
  completed: boolean;
  date: string;
}

// Location Types
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocationInfo {
  coordinates: Coordinates;
  city?: string;
  country?: string;
}

// Settings Types
export interface AppSettings {
  language: 'en' | 'ar';
  theme: 'light' | 'dark' | 'auto';
  fontSize: number;
  showTranslation: boolean;
  selectedTranslation: string;
  prayerSettings: PrayerSettings;
  notifications: {
    prayers: boolean;
    adkar: boolean;
    dailyVerse: boolean;
  };
}

// Navigation Types
export type RootStackParamList = {
  Home: undefined;
  Quran: undefined;
  QuranReader: { surah: number; ayah?: number };
  Adkar: undefined;
  AdkarDetails: { categoryId: string };
  Qibla: undefined;
  PrayerTimes: undefined;
  Settings: undefined;
  Bookmarks: undefined;
  Progress: undefined;
};
