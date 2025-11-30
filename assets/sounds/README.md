# 🔊 Adhan Sound Files

This directory contains Adhan (call to prayer) audio files used for prayer time notifications.

## 📁 Required Files

To enable Adhan notifications, you need to add MP3 audio files to this directory:

- `adhan-default.mp3` - Default Adhan (used for all prayers)
- `adhan-fajr.mp3` - Special Adhan for Fajr prayer (optional)

## 🎵 Where to Get Adhan Sounds

### Free Sources:
1. **Islamic Audio Sites**:
   - https://www.islamicfinder.org (Download Adhan sounds)
   - https://www.muslimpro.com (Various Adhan recordings)

2. **YouTube** (Download as MP3):
   - Search for "Adhan Makkah" or "Adhan Madinah"
   - Use a YouTube to MP3 converter
   - Popular reciters: Sheikh Ali Ahmed Mulla, Sheikh Mishary Rashid Alafasy

3. **Mobile Apps**:
   - Extract Adhan files from popular Islamic apps (ensure copyright compliance)

### Popular Adhan Types:
- **Makkah Adhan** - Traditional Adhan from Masjid al-Haram
- **Madinah Adhan** - Adhan from Masjid an-Nabawi
- **Turkish Adhan** - Beautiful melodic Turkish style
- **Egyptian Adhan** - Classic Egyptian style

## 🎼 File Format Requirements

- **Format**: MP3 (recommended) or WAV
- **Bitrate**: 128kbps or higher
- **Duration**: 1-3 minutes (typical Adhan length)
- **Sample Rate**: 44.1 kHz
- **File Size**: Keep under 5MB for best performance

## 📝 File Naming

Use these exact names for the app to recognize them:

```
assets/sounds/
├── adhan-default.mp3      # Main Adhan (REQUIRED)
├── adhan-fajr.mp3         # Fajr-specific Adhan (optional)
└── README.md              # This file
```

## 🔧 Usage in App

Once you add the files:
1. The app will automatically detect them
2. Go to Settings → Notifications
3. Enable prayer time notifications
4. Select your preferred Adhan sound
5. Test the notification

## ⚖️ Copyright Notice

**IMPORTANT**: Ensure you have the right to use any Adhan audio files you add. Most Islamic content is free to use for non-commercial purposes, but always verify the license.

Recommended: Use recordings from official mosque websites or content explicitly marked as free for use.

## 🎯 Quick Start

If you don't have Adhan files yet, the app will use the default device notification sound. To add Adhan:

1. Download an Adhan MP3 from a free source
2. Rename it to `adhan-default.mp3`
3. Place it in this `assets/sounds/` directory
4. Rebuild the app (if using Expo Go, you may need `expo start -c`)

---

*May Allah accept our prayers* 🤲
