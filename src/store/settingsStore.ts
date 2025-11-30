import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppSettings } from '../types';
import { Config } from '../constants/config';

interface SettingsState extends AppSettings {
  setLanguage: (language: 'en' | 'ar') => void;
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  setFontSize: (size: number) => void;
  toggleTranslation: () => void;
  setSelectedTranslation: (translation: string) => void;
  updatePrayerSettings: (settings: Partial<AppSettings['prayerSettings']>) => void;
  toggleNotification: (type: keyof AppSettings['notifications']) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      // Default settings
      language: 'en',
      theme: 'light',
      fontSize: 20,
      showTranslation: true,
      selectedTranslation: Config.quran.defaultTranslation,
      prayerSettings: {
        method: Config.prayerTimes.defaultMethod,
        madhab: 'Shafi',
        adjustments: {},
        notifications: {
          fajr: true,
          dhuhr: true,
          asr: true,
          maghrib: true,
          isha: true,
        },
      },
      notifications: {
        prayers: true,
        adkar: true,
        dailyVerse: true,
      },

      // Actions
      setLanguage: (language) => set({ language }),
      setTheme: (theme) => set({ theme }),
      setFontSize: (fontSize) => set({ fontSize }),
      toggleTranslation: () =>
        set((state) => ({ showTranslation: !state.showTranslation })),
      setSelectedTranslation: (selectedTranslation) =>
        set({ selectedTranslation }),
      updatePrayerSettings: (settings) =>
        set((state) => ({
          prayerSettings: { ...state.prayerSettings, ...settings },
        })),
      toggleNotification: (type) =>
        set((state) => ({
          notifications: {
            ...state.notifications,
            [type]: !state.notifications[type],
          },
        })),
    }),
    {
      name: 'adkar-settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
