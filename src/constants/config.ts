export const Config = {
  // API Configuration
  api: {
    quran: 'https://api.alquran.cloud/v1',
    timeout: 10000,
  },

  // Kaaba Coordinates for Qibla
  kaaba: {
    latitude: 21.4225,
    longitude: 39.8262,
  },

  // Prayer Time Settings
  prayerTimes: {
    defaultMethod: 'MuslimWorldLeague', // MuslimWorldLeague, Egyptian, Karachi, UmmAlQura, Dubai, NorthAmerica
    madhab: 'Shafi', // Shafi (Standard) or Hanafi
    highLatitudeRule: 'MiddleOfTheNight', // MiddleOfTheNight, SeventhOfTheNight, TwilightAngle
  },

  // App Settings
  app: {
    name: 'Adkar',
    version: '1.0.0',
    author: 'MrSmith',
    github: 'https://github.com/MrSmith/Adkar',
  },

  // Quran Settings
  quran: {
    totalSurahs: 114,
    totalVerses: 6236,
    defaultTranslation: 'en.sahih', // Sahih International
    availableTranslations: [
      { id: 'en.sahih', name: 'Sahih International', language: 'en' },
      { id: 'ar.alafasy', name: 'Arabic (Uthmani)', language: 'ar' },
    ],
  },

  // Adkar Categories
  adkarCategories: [
    { id: 'morning', nameEn: 'Morning Adkar', nameAr: 'أذكار الصباح' },
    { id: 'evening', nameEn: 'Evening Adkar', nameAr: 'أذكار المساء' },
    { id: 'prayer', nameEn: 'After Prayer', nameAr: 'أذكار بعد الصلاة' },
    { id: 'sleep', nameEn: 'Before Sleep', nameAr: 'أذكار النوم' },
    { id: 'general', nameEn: 'General Supplications', nameAr: 'أدعية عامة' },
  ],
};
