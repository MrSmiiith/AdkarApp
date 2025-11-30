import { create } from 'zustand';
import { PrayerTimes, Coordinates } from '../types';
import { calculatePrayerTimes } from '../services/prayerService';
import { useSettingsStore } from './settingsStore';

interface PrayerState {
  location: Coordinates | null;
  prayerTimes: PrayerTimes | null;
  isLoading: boolean;
  error: string | null;

  setLocation: (location: Coordinates) => void;
  updatePrayerTimes: () => void;
  refreshPrayerTimes: () => void;
}

export const usePrayerStore = create<PrayerState>((set, get) => ({
  location: null,
  prayerTimes: null,
  isLoading: false,
  error: null,

  setLocation: (location) => {
    set({ location });
    get().updatePrayerTimes();
  },

  updatePrayerTimes: () => {
    const { location } = get();
    if (!location) {
      set({ error: 'Location not available' });
      return;
    }

    try {
      set({ isLoading: true, error: null });
      const settings = useSettingsStore.getState().prayerSettings;
      const times = calculatePrayerTimes(location, new Date(), settings);
      set({ prayerTimes: times, isLoading: false });
    } catch (error) {
      set({
        error: 'Failed to calculate prayer times',
        isLoading: false,
      });
    }
  },

  refreshPrayerTimes: () => {
    get().updatePrayerTimes();
  },
}));
