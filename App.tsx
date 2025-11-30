import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme, AppState, AppStateStatus } from 'react-native';
import * as Font from 'expo-font';
import { Cairo_400Regular, Cairo_600SemiBold, Cairo_700Bold } from '@expo-google-fonts/cairo';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useSettingsStore } from './src/store/settingsStore';
import { usePrayerStore } from './src/store/prayerStore';
import {
  requestNotificationPermissions,
  schedulePrayerNotifications,
  addNotificationResponseListener,
} from './src/services/notificationService';

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const systemTheme = useColorScheme();
  const { theme, language, prayerSettings, notifications } = useSettingsStore();
  const { location } = usePrayerStore();

  // Load fonts
  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'Cairo-Regular': Cairo_400Regular,
        'Cairo-SemiBold': Cairo_600SemiBold,
        'Cairo-Bold': Cairo_700Bold,
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  // Initialize notifications on app start
  useEffect(() => {
    async function initializeNotifications() {
      // Request permissions
      const granted = await requestNotificationPermissions();

      if (!granted) {
        console.log('Notification permissions not granted');
        return;
      }

      // Schedule notifications if location and settings are available
      if (location && notifications.prayers) {
        await schedulePrayerNotifications(location, prayerSettings, language);
      }
    }

    initializeNotifications();
  }, []);

  // Re-schedule notifications when settings or location changes
  useEffect(() => {
    async function updateNotifications() {
      if (!location || !notifications.prayers) {
        return;
      }

      await schedulePrayerNotifications(location, prayerSettings, language);
    }

    updateNotifications();
  }, [location, prayerSettings, language, notifications.prayers]);

  // Listen for notification responses (when user taps a notification)
  useEffect(() => {
    const subscription = addNotificationResponseListener((response) => {
      const data = response.notification.request.content.data;
      console.log('Notification tapped:', data);
      // TODO: Navigate to prayer times screen or show relevant info
    });

    return () => subscription.remove();
  }, []);

  // Re-schedule notifications at midnight (new day)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active' && location && notifications.prayers) {
        // Check if it's a new day and re-schedule
        schedulePrayerNotifications(location, prayerSettings, language);
      }
    });

    return () => {
      subscription.remove();
    };
  }, [location, prayerSettings, language, notifications.prayers]);

  // Determine effective theme (auto uses system theme)
  const effectiveTheme = theme === 'auto' ? (systemTheme || 'light') : theme;

  if (!fontsLoaded) {
    return null; // Or a loading screen
  }

  return (
    <>
      <StatusBar style={effectiveTheme === 'dark' ? 'light' : 'dark'} />
      <AppNavigator />
    </>
  );
}
