# Changelog

All notable changes to the Adkar Islamic App will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [1.0.0] - 2025-11-30

### Added

#### 🔔 Prayer Time Notifications
- **Automatic prayer time notifications** with full Adhan sound support
- Individual prayer notification toggles (Fajr, Dhuhr, Asr, Maghrib, Isha)
- Bilingual notifications (Arabic and English)
- Custom Adhan sound support (MP3/WAV files)
- Notification settings in Settings screen with permission management
- Auto-scheduling at midnight for new day
- Works even when app is closed or in background
- Created `assets/sounds/` directory with README for Adhan files
- New notification service (`src/services/notificationService.ts`)

#### 🧭 Qibla Finder Enhancements
- **Green visual feedback** - Beautiful glowing effect when perfectly aligned with Qibla
- Green shadow/glow around compass circle when aligned (±10° tolerance)
- Arrow, compass circle, and Kaaba icon turn green when aligned
- Instant color reversion when moving away from Qibla direction
- Improved magnetometer management for better performance
- Fixed vibration continuing when navigating to other pages
- Fixed 10-second lag when switching back to Qibla page
- Instant restart of magnetometer when returning to Qibla screen
- Changed location accuracy from High to Balanced for faster initial load (2-3s vs 10s)

### Fixed
- **Qibla vibration bug**: Haptic feedback now stops immediately when leaving Qibla page
- **Green color persistence**: Colors now instantly revert to normal when moving away from Qibla
- **Page switching lag**: Qibla compass now starts instantly when returning to the page (no re-initialization needed)
- **Alignment detection**: Improved state tracking for accurate green/normal color transitions
- Magnetometer properly stops/starts based on screen focus using `useFocusEffect`

### Technical Changes
- Added `expo-notifications` and `expo-av` packages
- Integrated notification service with App.tsx lifecycle
- Enhanced settings store with `togglePrayerNotification` method
- Added notification translations (English & Arabic)
- Implemented proper magnetometer lifecycle management
- Added state caching for Qibla calculations (no repeated location fetches)
- Created comprehensive testing guide (`NOTIFICATION_TESTING.md`)

### Documentation
- Updated README.md with Prayer Notifications section
- Updated README.md with enhanced Qibla Finder features
- Updated FEATURES.md marking notifications as completed
- Updated version roadmap (v1.0.0 released with notifications)
- Created NOTIFICATION_TESTING.md with detailed testing instructions
- Created CHANGELOG.md

## [0.9.0] - 2025-11-29

### Initial Features

#### Core Features
- Prayer times display with multiple calculation methods (MWL, ISNA, Egyptian, etc.)
- Quran reader with Arabic Uthmani script and English translation
- Bookmark verses with personal notes
- Reading progress tracking (continue from where you left off)
- Memorization tracking - mark verses as memorized
- 5 categories of authentic Adkar from Hisnul Muslim:
  - Morning Adkar
  - Evening Adkar
  - After Prayer Adkar
  - Before Sleep Adkar
  - General Supplications
- Qibla Finder with real-time compass and haptic feedback
- Settings (theme, language, prayer calculation methods)

#### UI/UX
- Dark mode support
- Bilingual (English & Arabic)
- RTL (Right-to-Left) support for Arabic
- Beautiful modern design with Islamic green color scheme
- Smooth animations and transitions
- Custom Kaaba icon from FontAwesome

#### Technical Stack
- React Native 0.81.5
- Expo 54.0
- TypeScript
- Zustand for state management
- React Navigation v7
- expo-location for GPS
- expo-sensors (Magnetometer) for Qibla compass
- expo-haptics for vibration feedback
- Al-Quran Cloud API integration
- Adhan library for prayer times

---

## Upcoming Features

### v1.1.0 (Planned)
- Audio Quran recitations with verse highlighting
- Multiple Quran translations (10+ languages)
- Quran page view (Mushaf-style)
- Prayer times widget for home screen

### v1.2.0 (Planned)
- Tasbih counter
- Hadith collections (40 Hadith Nawawi, Bukhari, Muslim)
- Enhanced bookmarking system
- Salah tracking and statistics

### v1.3.0 (Planned)
- Ramadan special features
- Zakat calculator
- More Adhan sounds

---

**For detailed feature roadmap, see [FEATURES.md](FEATURES.md)**

**For notification testing, see [NOTIFICATION_TESTING.md](NOTIFICATION_TESTING.md)**
