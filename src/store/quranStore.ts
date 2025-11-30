import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Bookmark, ReadingProgress, MemorizationProgress } from '../types';

interface QuranState {
  bookmarks: Bookmark[];
  readingProgress: ReadingProgress | null;
  memorization: MemorizationProgress[];

  // Bookmark actions
  addBookmark: (surah: number, ayah: number, note?: string, color?: string) => void;
  removeBookmark: (id: string) => void;
  updateBookmarkNote: (id: string, note: string) => void;

  // Reading progress
  updateReadingProgress: (surah: number, ayah: number) => void;

  // Memorization
  toggleAyahMemorization: (surah: number, ayah: number) => void;
  updateReviewDate: (surah: number) => void;
}

export const useQuranStore = create<QuranState>()(
  persist(
    (set) => ({
      bookmarks: [],
      readingProgress: null,
      memorization: [],

      addBookmark: (surah, ayah, note, color) =>
        set((state) => ({
          bookmarks: [
            ...state.bookmarks,
            {
              id: `${surah}-${ayah}-${Date.now()}`,
              surah,
              ayah,
              note,
              color,
              createdAt: new Date(),
            },
          ],
        })),

      removeBookmark: (id) =>
        set((state) => ({
          bookmarks: state.bookmarks.filter((b) => b.id !== id),
        })),

      updateBookmarkNote: (id, note) =>
        set((state) => ({
          bookmarks: state.bookmarks.map((b) =>
            b.id === id ? { ...b, note } : b
          ),
        })),

      updateReadingProgress: (surah, ayah) =>
        set({
          readingProgress: {
            surah,
            ayah,
            lastRead: new Date(),
          },
        }),

      toggleAyahMemorization: (surah, ayah) =>
        set((state) => {
          const existing = state.memorization.find((m) => m.surah === surah);

          if (!existing) {
            return {
              memorization: [
                ...state.memorization,
                {
                  surah,
                  memorizedAyahs: [ayah],
                  progress: 1,
                  lastReviewed: new Date(),
                },
              ],
            };
          }

          const memorizedAyahs = existing.memorizedAyahs.includes(ayah)
            ? existing.memorizedAyahs.filter((a) => a !== ayah)
            : [...existing.memorizedAyahs, ayah];

          return {
            memorization: state.memorization.map((m) =>
              m.surah === surah
                ? { ...m, memorizedAyahs, progress: memorizedAyahs.length }
                : m
            ),
          };
        }),

      updateReviewDate: (surah) =>
        set((state) => ({
          memorization: state.memorization.map((m) =>
            m.surah === surah ? { ...m, lastReviewed: new Date() } : m
          ),
        })),
    }),
    {
      name: 'adkar-quran',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
