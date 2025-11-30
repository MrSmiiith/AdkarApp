import axios from 'axios';
import { Surah, Ayah, Translation } from '../types';

// QuranJSON repository base URL
const QURANJSON_BASE_URL = 'https://raw.githubusercontent.com/semarketir/quranjson/master/source';

const api = axios.create({
  timeout: 15000,
});

/**
 * Fetch all Surahs metadata
 */
export const fetchAllSurahs = async (): Promise<Surah[]> => {
  try {
    return SURAHS_DATA;
  } catch (error) {
    console.error('Error fetching surahs:', error);
    throw error;
  }
};

/**
 * Fetch a specific Surah with verses and translation from QuranJSON
 */
export const fetchSurah = async (
  surahNumber: number,
  translationLang: string = 'en'
): Promise<{ surah: Surah; ayahs: Ayah[] }> => {
  try {
    // Format surah number with leading zeros (e.g., 1 -> 001)
    const formattedNumber = surahNumber.toString().padStart(3, '0');

    // Fetch Arabic text
    const arabicUrl = `${QURANJSON_BASE_URL}/surah/surah_${surahNumber}.json`;
    const arabicResponse = await api.get(arabicUrl);
    const arabicData = arabicResponse.data;

    // Fetch English translation
    const translationUrl = `${QURANJSON_BASE_URL}/translation/${translationLang}/${translationLang}_translation_${surahNumber}.json`;
    const translationResponse = await api.get(translationUrl);
    const translationData = translationResponse.data;

    // Get surah metadata
    const surahMeta = SURAHS_DATA.find(s => s.number === surahNumber);
    if (!surahMeta) {
      throw new Error(`Surah ${surahNumber} not found in metadata`);
    }

    // Combine Arabic text with translations
    const ayahs: Ayah[] = [];
    for (let i = 1; i <= surahMeta.numberOfAyahs; i++) {
      const verseKey = `verse_${i}`;
      ayahs.push({
        number: i, // global number
        numberInSurah: i,
        text: arabicData.verse[verseKey] || '',
        translation: translationData.verse[verseKey] || '',
        surah: surahNumber,
        juz: arabicData.juz?.[0]?.index || 1, // simplified
        page: 1, // will be calculated based on our quranPages.ts
      });
    }

    return {
      surah: surahMeta,
      ayahs,
    };
  } catch (error) {
    console.error(`Error fetching surah ${surahNumber}:`, error);
    throw error;
  }
};

/**
 * Fetch verse with translation
 */
export const fetchVerseWithTranslation = async (
  surah: number,
  ayah: number,
  translationLang: string = 'en'
): Promise<{ arabic: Ayah; translation: Translation }> => {
  try {
    const surahData = await fetchSurah(surah, translationLang);
    const verse = surahData.ayahs.find(a => a.numberInSurah === ayah);

    if (!verse) {
      throw new Error(`Verse ${surah}:${ayah} not found`);
    }

    return {
      arabic: verse,
      translation: {
        text: verse.translation || '',
        edition: translationLang,
        language: translationLang,
      },
    };
  } catch (error) {
    console.error(`Error fetching verse ${surah}:${ayah}:`, error);
    throw error;
  }
};

// Surahs metadata (bundled for offline access) - All 114 Surahs
const SURAHS_DATA: Surah[] = [
  { number: 1, name: 'الفاتحة', englishName: 'Al-Faatiha', englishNameTranslation: 'The Opening', revelationType: 'Meccan', numberOfAyahs: 7 },
  { number: 2, name: 'البقرة', englishName: 'Al-Baqara', englishNameTranslation: 'The Cow', revelationType: 'Medinan', numberOfAyahs: 286 },
  { number: 3, name: 'آل عمران', englishName: 'Aal-i-Imraan', englishNameTranslation: 'Family of Imran', revelationType: 'Medinan', numberOfAyahs: 200 },
  { number: 4, name: 'النساء', englishName: 'An-Nisaa', englishNameTranslation: 'The Women', revelationType: 'Medinan', numberOfAyahs: 176 },
  { number: 5, name: 'المائدة', englishName: 'Al-Maaida', englishNameTranslation: 'The Table Spread', revelationType: 'Medinan', numberOfAyahs: 120 },
  { number: 6, name: 'الأنعام', englishName: 'Al-An\'aam', englishNameTranslation: 'The Cattle', revelationType: 'Meccan', numberOfAyahs: 165 },
  { number: 7, name: 'الأعراف', englishName: 'Al-A\'raaf', englishNameTranslation: 'The Heights', revelationType: 'Meccan', numberOfAyahs: 206 },
  { number: 8, name: 'الأنفال', englishName: 'Al-Anfaal', englishNameTranslation: 'The Spoils of War', revelationType: 'Medinan', numberOfAyahs: 75 },
  { number: 9, name: 'التوبة', englishName: 'At-Tawba', englishNameTranslation: 'The Repentance', revelationType: 'Medinan', numberOfAyahs: 129 },
  { number: 10, name: 'يونس', englishName: 'Yunus', englishNameTranslation: 'Jonah', revelationType: 'Meccan', numberOfAyahs: 109 },
  { number: 11, name: 'هود', englishName: 'Hud', englishNameTranslation: 'Hud', revelationType: 'Meccan', numberOfAyahs: 123 },
  { number: 12, name: 'يوسف', englishName: 'Yusuf', englishNameTranslation: 'Joseph', revelationType: 'Meccan', numberOfAyahs: 111 },
  { number: 13, name: 'الرعد', englishName: 'Ar-Ra\'d', englishNameTranslation: 'The Thunder', revelationType: 'Medinan', numberOfAyahs: 43 },
  { number: 14, name: 'ابراهيم', englishName: 'Ibrahim', englishNameTranslation: 'Abraham', revelationType: 'Meccan', numberOfAyahs: 52 },
  { number: 15, name: 'الحجر', englishName: 'Al-Hijr', englishNameTranslation: 'The Rocky Tract', revelationType: 'Meccan', numberOfAyahs: 99 },
  { number: 16, name: 'النحل', englishName: 'An-Nahl', englishNameTranslation: 'The Bee', revelationType: 'Meccan', numberOfAyahs: 128 },
  { number: 17, name: 'الإسراء', englishName: 'Al-Israa', englishNameTranslation: 'The Night Journey', revelationType: 'Meccan', numberOfAyahs: 111 },
  { number: 18, name: 'الكهف', englishName: 'Al-Kahf', englishNameTranslation: 'The Cave', revelationType: 'Meccan', numberOfAyahs: 110 },
  { number: 19, name: 'مريم', englishName: 'Maryam', englishNameTranslation: 'Mary', revelationType: 'Meccan', numberOfAyahs: 98 },
  { number: 20, name: 'طه', englishName: 'Taa-Haa', englishNameTranslation: 'Ta-Ha', revelationType: 'Meccan', numberOfAyahs: 135 },
  { number: 21, name: 'الأنبياء', englishName: 'Al-Anbiyaa', englishNameTranslation: 'The Prophets', revelationType: 'Meccan', numberOfAyahs: 112 },
  { number: 22, name: 'الحج', englishName: 'Al-Hajj', englishNameTranslation: 'The Pilgrimage', revelationType: 'Medinan', numberOfAyahs: 78 },
  { number: 23, name: 'المؤمنون', englishName: 'Al-Muminoon', englishNameTranslation: 'The Believers', revelationType: 'Meccan', numberOfAyahs: 118 },
  { number: 24, name: 'النور', englishName: 'An-Noor', englishNameTranslation: 'The Light', revelationType: 'Medinan', numberOfAyahs: 64 },
  { number: 25, name: 'الفرقان', englishName: 'Al-Furqaan', englishNameTranslation: 'The Criterion', revelationType: 'Meccan', numberOfAyahs: 77 },
  { number: 26, name: 'الشعراء', englishName: 'Ash-Shu\'araa', englishNameTranslation: 'The Poets', revelationType: 'Meccan', numberOfAyahs: 227 },
  { number: 27, name: 'النمل', englishName: 'An-Naml', englishNameTranslation: 'The Ant', revelationType: 'Meccan', numberOfAyahs: 93 },
  { number: 28, name: 'القصص', englishName: 'Al-Qasas', englishNameTranslation: 'The Stories', revelationType: 'Meccan', numberOfAyahs: 88 },
  { number: 29, name: 'العنكبوت', englishName: 'Al-Ankaboot', englishNameTranslation: 'The Spider', revelationType: 'Meccan', numberOfAyahs: 69 },
  { number: 30, name: 'الروم', englishName: 'Ar-Room', englishNameTranslation: 'The Romans', revelationType: 'Meccan', numberOfAyahs: 60 },
  { number: 31, name: 'لقمان', englishName: 'Luqman', englishNameTranslation: 'Luqman', revelationType: 'Meccan', numberOfAyahs: 34 },
  { number: 32, name: 'السجدة', englishName: 'As-Sajda', englishNameTranslation: 'The Prostration', revelationType: 'Meccan', numberOfAyahs: 30 },
  { number: 33, name: 'الأحزاب', englishName: 'Al-Ahzaab', englishNameTranslation: 'The Combined Forces', revelationType: 'Medinan', numberOfAyahs: 73 },
  { number: 34, name: 'سبإ', englishName: 'Saba', englishNameTranslation: 'Sheba', revelationType: 'Meccan', numberOfAyahs: 54 },
  { number: 35, name: 'فاطر', englishName: 'Faatir', englishNameTranslation: 'Originator', revelationType: 'Meccan', numberOfAyahs: 45 },
  { number: 36, name: 'يس', englishName: 'Yaseen', englishNameTranslation: 'Ya Sin', revelationType: 'Meccan', numberOfAyahs: 83 },
  { number: 37, name: 'الصافات', englishName: 'As-Saaffaat', englishNameTranslation: 'Those who set the Ranks', revelationType: 'Meccan', numberOfAyahs: 182 },
  { number: 38, name: 'ص', englishName: 'Saad', englishNameTranslation: 'The Letter Saad', revelationType: 'Meccan', numberOfAyahs: 88 },
  { number: 39, name: 'الزمر', englishName: 'Az-Zumar', englishNameTranslation: 'The Troops', revelationType: 'Meccan', numberOfAyahs: 75 },
  { number: 40, name: 'غافر', englishName: 'Ghafir', englishNameTranslation: 'The Forgiver', revelationType: 'Meccan', numberOfAyahs: 85 },
  { number: 41, name: 'فصلت', englishName: 'Fussilat', englishNameTranslation: 'Explained in Detail', revelationType: 'Meccan', numberOfAyahs: 54 },
  { number: 42, name: 'الشورى', englishName: 'Ash-Shura', englishNameTranslation: 'The Consultation', revelationType: 'Meccan', numberOfAyahs: 53 },
  { number: 43, name: 'الزخرف', englishName: 'Az-Zukhruf', englishNameTranslation: 'The Ornaments of Gold', revelationType: 'Meccan', numberOfAyahs: 89 },
  { number: 44, name: 'الدخان', englishName: 'Ad-Dukhaan', englishNameTranslation: 'The Smoke', revelationType: 'Meccan', numberOfAyahs: 59 },
  { number: 45, name: 'الجاثية', englishName: 'Al-Jaathiya', englishNameTranslation: 'The Crouching', revelationType: 'Meccan', numberOfAyahs: 37 },
  { number: 46, name: 'الأحقاف', englishName: 'Al-Ahqaf', englishNameTranslation: 'The Wind-Curved Sandhills', revelationType: 'Meccan', numberOfAyahs: 35 },
  { number: 47, name: 'محمد', englishName: 'Muhammad', englishNameTranslation: 'Muhammad', revelationType: 'Medinan', numberOfAyahs: 38 },
  { number: 48, name: 'الفتح', englishName: 'Al-Fath', englishNameTranslation: 'The Victory', revelationType: 'Medinan', numberOfAyahs: 29 },
  { number: 49, name: 'الحجرات', englishName: 'Al-Hujuraat', englishNameTranslation: 'The Rooms', revelationType: 'Medinan', numberOfAyahs: 18 },
  { number: 50, name: 'ق', englishName: 'Qaaf', englishNameTranslation: 'The Letter Qaf', revelationType: 'Meccan', numberOfAyahs: 45 },
  { number: 51, name: 'الذاريات', englishName: 'Adh-Dhaariyat', englishNameTranslation: 'The Winnowing Winds', revelationType: 'Meccan', numberOfAyahs: 60 },
  { number: 52, name: 'الطور', englishName: 'At-Tur', englishNameTranslation: 'The Mount', revelationType: 'Meccan', numberOfAyahs: 49 },
  { number: 53, name: 'النجم', englishName: 'An-Najm', englishNameTranslation: 'The Star', revelationType: 'Meccan', numberOfAyahs: 62 },
  { number: 54, name: 'القمر', englishName: 'Al-Qamar', englishNameTranslation: 'The Moon', revelationType: 'Meccan', numberOfAyahs: 55 },
  { number: 55, name: 'الرحمن', englishName: 'Ar-Rahmaan', englishNameTranslation: 'The Beneficent', revelationType: 'Medinan', numberOfAyahs: 78 },
  { number: 56, name: 'الواقعة', englishName: 'Al-Waaqia', englishNameTranslation: 'The Inevitable', revelationType: 'Meccan', numberOfAyahs: 96 },
  { number: 57, name: 'الحديد', englishName: 'Al-Hadid', englishNameTranslation: 'The Iron', revelationType: 'Medinan', numberOfAyahs: 29 },
  { number: 58, name: 'المجادلة', englishName: 'Al-Mujaadila', englishNameTranslation: 'The Pleading Woman', revelationType: 'Medinan', numberOfAyahs: 22 },
  { number: 59, name: 'الحشر', englishName: 'Al-Hashr', englishNameTranslation: 'The Exile', revelationType: 'Medinan', numberOfAyahs: 24 },
  { number: 60, name: 'الممتحنة', englishName: 'Al-Mumtahana', englishNameTranslation: 'She that is to be examined', revelationType: 'Medinan', numberOfAyahs: 13 },
  { number: 61, name: 'الصف', englishName: 'As-Saff', englishNameTranslation: 'The Ranks', revelationType: 'Medinan', numberOfAyahs: 14 },
  { number: 62, name: 'الجمعة', englishName: 'Al-Jumu\'a', englishNameTranslation: 'The Congregation, Friday', revelationType: 'Medinan', numberOfAyahs: 11 },
  { number: 63, name: 'المنافقون', englishName: 'Al-Munaafiqoon', englishNameTranslation: 'The Hypocrites', revelationType: 'Medinan', numberOfAyahs: 11 },
  { number: 64, name: 'التغابن', englishName: 'At-Taghaabun', englishNameTranslation: 'The Mutual Disillusion', revelationType: 'Medinan', numberOfAyahs: 18 },
  { number: 65, name: 'الطلاق', englishName: 'At-Talaaq', englishNameTranslation: 'The Divorce', revelationType: 'Medinan', numberOfAyahs: 12 },
  { number: 66, name: 'التحريم', englishName: 'At-Tahrim', englishNameTranslation: 'The Prohibition', revelationType: 'Medinan', numberOfAyahs: 12 },
  { number: 67, name: 'الملك', englishName: 'Al-Mulk', englishNameTranslation: 'The Sovereignty', revelationType: 'Meccan', numberOfAyahs: 30 },
  { number: 68, name: 'القلم', englishName: 'Al-Qalam', englishNameTranslation: 'The Pen', revelationType: 'Meccan', numberOfAyahs: 52 },
  { number: 69, name: 'الحاقة', englishName: 'Al-Haaqqa', englishNameTranslation: 'The Reality', revelationType: 'Meccan', numberOfAyahs: 52 },
  { number: 70, name: 'المعارج', englishName: 'Al-Ma\'aarij', englishNameTranslation: 'The Ascending Stairways', revelationType: 'Meccan', numberOfAyahs: 44 },
  { number: 71, name: 'نوح', englishName: 'Nooh', englishNameTranslation: 'Noah', revelationType: 'Meccan', numberOfAyahs: 28 },
  { number: 72, name: 'الجن', englishName: 'Al-Jinn', englishNameTranslation: 'The Jinn', revelationType: 'Meccan', numberOfAyahs: 28 },
  { number: 73, name: 'المزمل', englishName: 'Al-Muzzammil', englishNameTranslation: 'The Enshrouded One', revelationType: 'Meccan', numberOfAyahs: 20 },
  { number: 74, name: 'المدثر', englishName: 'Al-Muddaththir', englishNameTranslation: 'The Cloaked One', revelationType: 'Meccan', numberOfAyahs: 56 },
  { number: 75, name: 'القيامة', englishName: 'Al-Qiyaama', englishNameTranslation: 'The Resurrection', revelationType: 'Meccan', numberOfAyahs: 40 },
  { number: 76, name: 'الانسان', englishName: 'Al-Insaan', englishNameTranslation: 'The Man', revelationType: 'Medinan', numberOfAyahs: 31 },
  { number: 77, name: 'المرسلات', englishName: 'Al-Mursalaat', englishNameTranslation: 'The Emissaries', revelationType: 'Meccan', numberOfAyahs: 50 },
  { number: 78, name: 'النبإ', englishName: 'An-Naba', englishNameTranslation: 'The Tidings', revelationType: 'Meccan', numberOfAyahs: 40 },
  { number: 79, name: 'النازعات', englishName: 'An-Naazi\'aat', englishNameTranslation: 'Those who drag forth', revelationType: 'Meccan', numberOfAyahs: 46 },
  { number: 80, name: 'عبس', englishName: 'Abasa', englishNameTranslation: 'He Frowned', revelationType: 'Meccan', numberOfAyahs: 42 },
  { number: 81, name: 'التكوير', englishName: 'At-Takwir', englishNameTranslation: 'The Overthrowing', revelationType: 'Meccan', numberOfAyahs: 29 },
  { number: 82, name: 'الإنفطار', englishName: 'Al-Infitaar', englishNameTranslation: 'The Cleaving', revelationType: 'Meccan', numberOfAyahs: 19 },
  { number: 83, name: 'المطففين', englishName: 'Al-Mutaffifin', englishNameTranslation: 'The Defrauding', revelationType: 'Meccan', numberOfAyahs: 36 },
  { number: 84, name: 'الإنشقاق', englishName: 'Al-Inshiqaaq', englishNameTranslation: 'The Sundering', revelationType: 'Meccan', numberOfAyahs: 25 },
  { number: 85, name: 'البروج', englishName: 'Al-Burooj', englishNameTranslation: 'The Mansions of the Stars', revelationType: 'Meccan', numberOfAyahs: 22 },
  { number: 86, name: 'الطارق', englishName: 'At-Taariq', englishNameTranslation: 'The Nightcomer', revelationType: 'Meccan', numberOfAyahs: 17 },
  { number: 87, name: 'الأعلى', englishName: 'Al-A\'laa', englishNameTranslation: 'The Most High', revelationType: 'Meccan', numberOfAyahs: 19 },
  { number: 88, name: 'الغاشية', englishName: 'Al-Ghaashiya', englishNameTranslation: 'The Overwhelming', revelationType: 'Meccan', numberOfAyahs: 26 },
  { number: 89, name: 'الفجر', englishName: 'Al-Fajr', englishNameTranslation: 'The Dawn', revelationType: 'Meccan', numberOfAyahs: 30 },
  { number: 90, name: 'البلد', englishName: 'Al-Balad', englishNameTranslation: 'The City', revelationType: 'Meccan', numberOfAyahs: 20 },
  { number: 91, name: 'الشمس', englishName: 'Ash-Shams', englishNameTranslation: 'The Sun', revelationType: 'Meccan', numberOfAyahs: 15 },
  { number: 92, name: 'الليل', englishName: 'Al-Lail', englishNameTranslation: 'The Night', revelationType: 'Meccan', numberOfAyahs: 21 },
  { number: 93, name: 'الضحى', englishName: 'Ad-Dhuhaa', englishNameTranslation: 'The Morning Hours', revelationType: 'Meccan', numberOfAyahs: 11 },
  { number: 94, name: 'الشرح', englishName: 'Ash-Sharh', englishNameTranslation: 'The Relief', revelationType: 'Meccan', numberOfAyahs: 8 },
  { number: 95, name: 'التين', englishName: 'At-Tin', englishNameTranslation: 'The Fig', revelationType: 'Meccan', numberOfAyahs: 8 },
  { number: 96, name: 'العلق', englishName: 'Al-Alaq', englishNameTranslation: 'The Clot', revelationType: 'Meccan', numberOfAyahs: 19 },
  { number: 97, name: 'القدر', englishName: 'Al-Qadr', englishNameTranslation: 'The Power', revelationType: 'Meccan', numberOfAyahs: 5 },
  { number: 98, name: 'البينة', englishName: 'Al-Bayyina', englishNameTranslation: 'The Clear Proof', revelationType: 'Medinan', numberOfAyahs: 8 },
  { number: 99, name: 'الزلزلة', englishName: 'Az-Zalzala', englishNameTranslation: 'The Earthquake', revelationType: 'Medinan', numberOfAyahs: 8 },
  { number: 100, name: 'العاديات', englishName: 'Al-Aadiyaat', englishNameTranslation: 'The Courser', revelationType: 'Meccan', numberOfAyahs: 11 },
  { number: 101, name: 'القارعة', englishName: 'Al-Qaari\'a', englishNameTranslation: 'The Calamity', revelationType: 'Meccan', numberOfAyahs: 11 },
  { number: 102, name: 'التكاثر', englishName: 'At-Takaathur', englishNameTranslation: 'The Rivalry in world increase', revelationType: 'Meccan', numberOfAyahs: 8 },
  { number: 103, name: 'العصر', englishName: 'Al-Asr', englishNameTranslation: 'The Declining Day', revelationType: 'Meccan', numberOfAyahs: 3 },
  { number: 104, name: 'الهمزة', englishName: 'Al-Humaza', englishNameTranslation: 'The Traducer', revelationType: 'Meccan', numberOfAyahs: 9 },
  { number: 105, name: 'الفيل', englishName: 'Al-Fil', englishNameTranslation: 'The Elephant', revelationType: 'Meccan', numberOfAyahs: 5 },
  { number: 106, name: 'قريش', englishName: 'Quraish', englishNameTranslation: 'Quraysh', revelationType: 'Meccan', numberOfAyahs: 4 },
  { number: 107, name: 'الماعون', englishName: 'Al-Maa\'un', englishNameTranslation: 'The Small kindnesses', revelationType: 'Meccan', numberOfAyahs: 7 },
  { number: 108, name: 'الكوثر', englishName: 'Al-Kawthar', englishNameTranslation: 'The Abundance', revelationType: 'Meccan', numberOfAyahs: 3 },
  { number: 109, name: 'الكافرون', englishName: 'Al-Kaafiroon', englishNameTranslation: 'The Disbelievers', revelationType: 'Meccan', numberOfAyahs: 6 },
  { number: 110, name: 'النصر', englishName: 'An-Nasr', englishNameTranslation: 'The Divine Support', revelationType: 'Medinan', numberOfAyahs: 3 },
  { number: 111, name: 'المسد', englishName: 'Al-Masad', englishNameTranslation: 'The Palm Fiber', revelationType: 'Meccan', numberOfAyahs: 5 },
  { number: 112, name: 'الإخلاص', englishName: 'Al-Ikhlaas', englishNameTranslation: 'The Sincerity', revelationType: 'Meccan', numberOfAyahs: 4 },
  { number: 113, name: 'الفلق', englishName: 'Al-Falaq', englishNameTranslation: 'The Daybreak', revelationType: 'Meccan', numberOfAyahs: 5 },
  { number: 114, name: 'الناس', englishName: 'An-Naas', englishNameTranslation: 'Mankind', revelationType: 'Meccan', numberOfAyahs: 6 },
];
