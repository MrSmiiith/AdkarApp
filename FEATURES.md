# 🚀 Features & Roadmap

This document outlines completed features and planned improvements for the Adkar App.

## ✅ Completed Features

### 🧭 Qibla Finder
**Status:** ✅ Completed in v1.0.0

A comprehensive Qibla compass to help Muslims find the direction of prayer.

**Implemented Features:**
- ✅ Real-time compass using device magnetometer
- ✅ Accurate Qibla calculation based on GPS location
- ✅ Smooth rotation animations (100ms update interval)
- ✅ Distance to Kaaba display (in km)
- ✅ Haptic feedback when aligned with Qibla (±10° tolerance)
- ✅ Visual alignment indicator with badge
- ✅ Current heading display
- ✅ Simple arrow design pointing to Qibla
- ✅ Kaaba icon from FontAwesome
- ✅ Bilingual support (English & Arabic)
- ✅ Works in both light and dark modes
- ✅ Works offline after initial location fetch

**Technical Implementation:**
- Expo Sensors (Magnetometer) with 100ms updates
- Expo Location (GPS) for accurate positioning
- Expo Haptics for feedback
- React Native SVG for Kaaba icon
- Spherical geometry calculations for Qibla direction
- Animated API for smooth rotations
- iOS compass behavior matching (0° = North)

---

## 📋 Planned Features

### 📿 Tasbih Counter (Priority: Medium)
**Status:** Planned for v1.2.0

Digital prayer beads counter for Dhikr.

**Features:**
- Simple tap counter
- Preset goals (33, 99, 100, 1000)
- Vibration feedback on milestones
- Counter history and statistics
- Multiple independent counters
- Reset and save functionality
- Beautiful bead animation

---

### 📖 Quran Enhancements (Priority: High)
**Status:** Planned for v1.1.0

**Features to Add:**
- Audio recitation with verse highlighting
- Multiple translations (Sahih International, Pickthall, etc.)
- Tafsir (commentary) integration
- Full-text search across Quran
- Download for offline reading
- Night reading mode with customizable themes
- Copy/Share verses
- Notes and highlights
- Recitation progress tracking
- Multiple reciters (Mishary, Sudais, etc.)

---

### 🕌 Prayer Times Enhancements (Priority: High)
**Status:** ✅ Notifications Completed - Additional features planned for v1.1.0+

**Completed Features:**
- ✅ Prayer time notifications with Adhan support
- ✅ Multiple Adhan sounds support (MP3/WAV)
- ✅ Individual prayer notification toggles
- ✅ Bilingual notifications (Arabic/English)
- ✅ Auto-scheduling and permission management

**Features to Add:**
- [ ] Prayer times widget for home screen
- [ ] Monthly prayer times calendar
- [ ] Mosque finder nearby
- [ ] Qiyam al-Layl reminder
- [ ] Salah tracking (mark prayers as completed)
- [ ] Prayer statistics and streaks

---

### 📚 Islamic Library (Priority: Medium)
**Status:** Planned for v2.0.0

**Features:**
- 40 Hadith Nawawi
- Hadith collections (Bukhari, Muslim, etc.)
- 99 Names of Allah
- Dua collections
- Islamic articles and knowledge
- Search functionality
- Bookmarking and favorites

---

### 🌙 Ramadan Features (Priority: Medium)
**Status:** Planned for v1.3.0

**Features:**
- Ramadan calendar
- Suhoor and Iftar timings
- Daily Ramadan reminders
- Ramadan Quran reading plan (Khatm)
- Laylat al-Qadr notifications
- Zakat calculator
- Sadaqah tracker

---

### 🎨 Customization (Priority: Low)
**Status:** Ongoing

**Features:**
- Custom color themes
- Font size adjustment (✅ Already implemented for Quran)
- Arabic font selection
- App icon variants
- Background images for different screens
- Notification sound customization

---

### 📱 Social & Community (Priority: Low)
**Status:** Planned for v2.0.0

**Features:**
- Share verses and Adkar to social media
- Prayer group reminders
- Community Quran reading challenges
- Streak sharing with friends
- Islamic calendar events

---

### 🌍 Localization (Priority: Medium)
**Status:** v1.0.0 (English, Arabic) - More languages planned

**Planned Languages:**
- Urdu
- Turkish
- French
- Indonesian
- Malay
- Bengali

---

### ⚙️ Technical Improvements (Priority: High)
**Status:** Ongoing

**Planned Improvements:**
- Offline mode for all features
- Cloud backup for bookmarks and progress
- Performance optimizations
- App size reduction
- Better error handling
- Accessibility improvements (screen reader support)
- Unit and integration tests
- CI/CD pipeline

---

### 📊 Analytics & Insights (Priority: Low)
**Status:** Planned for v1.4.0

**Features:**
- Reading statistics
- Prayer consistency tracking
- Streak counters
- Personal Islamic knowledge progress
- Monthly reports

---

## 🎯 Version Roadmap

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

### v1.1.0 (Planned)
- [ ] Audio Quran recitations with verse highlighting
- [ ] Multiple Quran translations (10+ languages)
- [ ] Quran page view (Mushaf-style)
- [ ] Prayer times widget for home screen

### v1.2.0
- Tasbih counter
- Hadith collections
- Enhanced bookmarking

### v1.3.0
- Ramadan special features
- Zakat calculator
- More Adhan sounds

### v2.0.0
- Islamic library
- Community features
- Advanced analytics

---

## 💡 Feature Requests

Have an idea? Please open an issue on GitHub or contribute to the project!

**How to Request a Feature:**
1. Check if it's already listed here
2. Open a GitHub issue with the tag `feature-request`
3. Describe the feature and its benefits
4. Optional: Submit a PR if you can implement it!

---

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

**Priority Areas:**
- Audio recitation integration (Next Focus)
- Multiple Quran translations
- Quran page view (Mushaf-style)
- Additional language support

---

*Last updated: November 30, 2025*
