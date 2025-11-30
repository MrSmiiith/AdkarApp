export const translations = {
  en: {
    // Common
    appName: 'Adkar',
    home: 'Home',
    quran: 'Quran',
    adkar: 'Adkar',
    qibla: 'Qibla',
    settings: 'Settings',

    // Home Screen
    welcomeBack: 'Welcome Back',
    todayDate: "Today's Date",
    exploreQuran: 'Explore Quran',
    exploreQuranDesc: 'Read and reflect on the Holy Quran',
    dailyAdkar: 'Daily Adkar',
    dailyAdkarDesc: 'Remember Allah with daily supplications',
    findQibla: 'Find Qibla',
    findQiblaDesc: 'Find the direction of prayer',
    prayerTimes: 'Prayer Times',
    prayerTimesDesc: 'Never miss your prayers',

    // Prayer Times
    fajr: 'Fajr',
    dhuhr: 'Dhuhr',
    asr: 'Asr',
    maghrib: 'Maghrib',
    isha: 'Isha',
    sunrise: 'Sunrise',

    // Quran Screen
    searchSurah: 'Search Surah...',
    verses: 'verses',
    verse: 'Verse',
    continueReading: 'Continue Reading',

    // Adkar Screen
    morningAdkar: 'Morning Adkar',
    eveningAdkar: 'Evening Adkar',
    prayerAdkar: 'After Prayer',
    sleepAdkar: 'Before Sleep',
    generalAdkar: 'General',

    // Settings Screen
    theme: 'Theme',
    themeArabic: 'المظهر',
    language: 'Language',
    languageArabic: 'اللغة',
    light: 'Light',
    lightArabic: 'فاتح',
    dark: 'Dark',
    darkArabic: 'داكن',
    auto: 'Auto',
    autoArabic: 'تلقائي',
    english: 'English',
    arabic: 'العربية',
    version: 'Version',
    createdBy: 'Created by',
    openSource: 'Open Source',
    madeLove: 'Made with ❤ for the Muslim Ummah',

    // Qibla Screen
    qiblaDirection: 'Qibla Direction',
    rotatePhone: 'Rotate your phone until the arrow points north',
    kaaba: 'Kaaba',
    mecca: 'Mecca, Saudi Arabia',
  },
  ar: {
    // Common
    appName: 'أذكار',
    home: 'الرئيسية',
    quran: 'القرآن',
    adkar: 'أذكار',
    qibla: 'القبلة',
    settings: 'الإعدادات',

    // Home Screen
    welcomeBack: 'مرحباً بك',
    todayDate: 'تاريخ اليوم',
    exploreQuran: 'تصفح القرآن',
    exploreQuranDesc: 'اقرأ وتدبر القرآن الكريم',
    dailyAdkar: 'الأذكار اليومية',
    dailyAdkarDesc: 'اذكر الله بالأدعية اليومية',
    findQibla: 'اتجاه القبلة',
    findQiblaDesc: 'اعثر على اتجاه الصلاة',
    prayerTimes: 'أوقات الصلاة',
    prayerTimesDesc: 'لا تفوت صلواتك',

    // Prayer Times
    fajr: 'الفجر',
    dhuhr: 'الظهر',
    asr: 'العصر',
    maghrib: 'المغرب',
    isha: 'العشاء',
    sunrise: 'الشروق',

    // Quran Screen
    searchSurah: 'بحث عن سورة...',
    verses: 'آيات',
    verse: 'آية',
    continueReading: 'متابعة القراءة',

    // Adkar Screen
    morningAdkar: 'أذكار الصباح',
    eveningAdkar: 'أذكار المساء',
    prayerAdkar: 'أذكار بعد الصلاة',
    sleepAdkar: 'أذكار النوم',
    generalAdkar: 'أذكار عامة',

    // Settings Screen
    theme: 'المظهر',
    themeArabic: 'المظهر',
    language: 'اللغة',
    languageArabic: 'اللغة',
    light: 'فاتح',
    lightArabic: 'فاتح',
    dark: 'داكن',
    darkArabic: 'داكن',
    auto: 'تلقائي',
    autoArabic: 'تلقائي',
    english: 'English',
    arabic: 'العربية',
    version: 'الإصدار',
    createdBy: 'تم إنشاؤه بواسطة',
    openSource: 'مفتوح المصدر',
    madeLove: 'صُنع بحب للأمة الإسلامية',

    // Qibla Screen
    qiblaDirection: 'اتجاه القبلة',
    rotatePhone: 'قم بتدوير هاتفك حتى يشير السهم إلى الشمال',
    kaaba: 'الكعبة',
    mecca: 'مكة المكرمة، السعودية',
  },
};

export type TranslationKey = keyof typeof translations.en;
export type Language = 'en' | 'ar';
