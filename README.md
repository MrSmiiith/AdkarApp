# Adkar - Islamic Mobile App

<div align="center">

**An open-source Islamic mobile application for iOS and Android**

Built with React Native | Created by MrSmith

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React Native](https://img.shields.io/badge/React%20Native-0.81-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-54-black.svg)](https://expo.dev/)

</div>

## 📱 Features

### 🕌 Prayer Times
- **Accurate prayer time calculations** using the `adhan` library
- Support for multiple calculation methods (MWL, ISNA, Egypt, Makkah, etc.)
- **Local notifications** for each prayer
- Customizable adjustments for prayer times
- Beautiful visual prayer timeline

### 📖 Quran Reader
- **Complete Quran text** (Arabic Uthmani script)
- English translations (Sahih International)
- **Bookmark verses** with personal notes
- Continue reading from where you left off
- **Memorization tracking** - mark verses as memorized
- **Progress tracking** with statistics
- Beautiful typography optimized for Arabic text
- Search by Surah name or number

### 🤲 Adkar & Supplications
- **Authentic Islamic supplications** from Hisnul Muslim
- Organized by categories:
  - Morning Adkar
  - Evening Adkar
  - After Prayer Adkar
  - Before Sleep Adkar
  - General Supplications
- **Arabic text** with transliteration and translation
- **Counter system** to track repetitions
- References from Quran and Hadith
- Benefits of each supplication

### 🧭 Qibla Finder
- **Real-time compass** using device magnetometer
- Accurate Qibla direction calculation based on GPS
- Distance to Kaaba display
- **Haptic feedback** when aligned with Qibla
- **Green visual feedback** - glowing effect when perfectly aligned
- Visual indicator with Kaaba icon
- Works in both light and dark modes
- Full Arabic/English translation support
- Instant restart when switching between pages

### 🔔 Prayer Time Notifications
- **Automatic notifications** at each prayer time
- Support for custom **Adhan sounds** (MP3/WAV)
- Individual prayer toggles (Fajr, Dhuhr, Asr, Maghrib, Isha)
- **Bilingual notifications** - Arabic and English
- Auto-schedule daily at midnight
- Works even when app is closed
- Permission management in Settings
- Customizable per-prayer notification settings

### 🎨 Additional Features
- **Dark mode** support
- **Bilingual** - English and Arabic
- **Offline-first** - works without internet
- Clean, modern UI/UX
- RTL (Right-to-Left) support for Arabic
- Fast and lightweight

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (macOS) or Android Emulator

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MrSmith/Adkar.git
   cd Adkar/AdkarApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on your device or emulator**
   - **iOS**: Press `i` or run `npm run ios`
   - **Android**: Press `a` or run `npm run android`
   - **Web**: Press `w` or run `npm run web`
   - **Scan QR code**: Use Expo Go app on your phone

## 📦 Tech Stack

### Core
- **React Native** 0.81.5 - Cross-platform mobile framework
- **Expo** 54.0 - Development and build tooling
- **TypeScript** - Type safety and better DX

### State Management
- **Zustand** - Lightweight state management
- **AsyncStorage** - Persistent local storage

### Navigation
- **React Navigation** v7 - Bottom tabs and stack navigation

### Islamic Features
- **adhan** - Prayer times calculation (tested and verified)
- **Al-Quran Cloud API** - Quran text and translations (tested and verified)
- **Hisnul Muslim** - Authentic adkar database

### Device Features
- **expo-location** - GPS for prayer times and Qibla direction
- **expo-sensors** - Magnetometer for Qibla compass
- **expo-haptics** - Haptic feedback
- **expo-font** - Custom Arabic fonts (Cairo)
- **react-native-svg** - SVG icon support

### Utilities
- **date-fns** - Date manipulation
- **axios** - HTTP client for API requests

## 📁 Project Structure

```
AdkarApp/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── common/        # Buttons, cards, etc.
│   │   ├── quran/         # Quran-specific components
│   │   ├── prayer/        # Prayer times components
│   │   └── adkar/         # Adkar components
│   ├── screens/           # Screen components
│   │   ├── HomeScreen.tsx
│   │   ├── QuranScreen.tsx
│   │   ├── QuranReaderScreen.tsx
│   │   ├── AdkarScreen.tsx
│   │   ├── AdkarDetailsScreen.tsx
│   │   ├── QiblaFinderScreen.tsx
│   │   ├── PrayerTimesScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── navigation/        # Navigation setup
│   ├── store/             # Zustand stores
│   ├── services/          # API and business logic
│   │   ├── prayerService.ts
│   │   └── quranService.ts
│   ├── database/          # Local data and models
│   │   └── data/
│   │       └── adkar.ts
│   ├── utils/             # Helper functions
│   │   ├── qiblaCalculator.ts
│   │   └── dateHelpers.ts
│   ├── hooks/             # Custom React hooks
│   ├── constants/         # Colors, typography, config
│   ├── types/             # TypeScript types
│   └── localization/      # i18n translations
├── assets/                # Images, fonts, icons
├── App.tsx               # Entry point
└── package.json

```

## 🧪 APIs Tested & Verified

All APIs have been tested before implementation:

### ✅ Al-Quran Cloud API
- **Status**: Working perfectly
- **Endpoints tested**:
  - `/v1/surah/{number}` - Fetch Surah data
  - `/v1/ayah/{reference}/editions` - Fetch verse with translation
- **Response**: Arabic Uthmani text + English translation
- **Rate limits**: None observed
- **Authentication**: Not required

### ✅ Adhan Library
- **Status**: Working perfectly
- **Tested locations**: New York, Makkah, London, Tokyo
- **Tested methods**: MWL, ISNA, Egyptian, UmmAlQura, Dubai, Karachi
- **Accuracy**: Verified against official prayer times
- **Qibla calculation**: Verified and accurate

## 🎯 Roadmap

### v1.0.0 ✅ RELEASED
- ✅ Prayer times display with multiple calculation methods
- ✅ Quran reader with bookmarks and reading progress
- ✅ Adkar (5 categories with 50+ authentic supplications)
- ✅ Settings (theme and language)
- ✅ Dark mode support
- ✅ Offline support
- ✅ **Qibla Finder** with real-time compass and haptic feedback
- ✅ **Prayer time notifications** with Adhan sound support
- ✅ Bilingual support (English & Arabic)

### v1.1.0 (In Progress 🚧)
- [ ] Audio Quran recitations with verse highlighting
- [ ] Multiple Quran translations (10+ languages)
- [ ] Quran page view (Mushaf-style)

### v1.2.0 & Beyond
See [FEATURES.md](FEATURES.md) for complete roadmap including:
- Tasbih counter
- Hadith collections
- Ramadan features
- Islamic library
- And much more!

## 🤝 Contributing

Contributions are welcome! This is an open-source project for the Muslim community.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and development process.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Quran text**: Al-Quran Cloud API
- **Adkar**: Hisnul Muslim (Fortress of the Muslim)
- **Prayer times**: Adhan library by @batoulapps
- **Islamic guidance**: Authentic sources from Quran and Sunnah
- **Community**: All contributors and testers

## 📧 Contact

Created by **MrSmith**

- GitHub: [@MrSmith](https://github.com/MrSmith)
- Issues: [GitHub Issues](https://github.com/MrSmith/Adkar/issues)

## ⭐ Support

If you find this app useful, please consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting new features
- 🤲 Making dua for the developers

---

<div align="center">

**بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ**

*Made with ❤️ for the Muslim Ummah*

</div>
