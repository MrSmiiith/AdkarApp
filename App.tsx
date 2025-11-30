import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import * as Font from 'expo-font';
import { Cairo_400Regular, Cairo_600SemiBold, Cairo_700Bold } from '@expo-google-fonts/cairo';
import { Amiri_400Regular, Amiri_700Bold } from '@expo-google-fonts/amiri';
import { ScheherazadeNew_400Regular, ScheherazadeNew_700Bold } from '@expo-google-fonts/scheherazade-new';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useSettingsStore } from './src/store/settingsStore';

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const systemTheme = useColorScheme();
  const { theme } = useSettingsStore();

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'Cairo-Regular': Cairo_400Regular,
        'Cairo-SemiBold': Cairo_600SemiBold,
        'Cairo-Bold': Cairo_700Bold,
        'Amiri-Regular': Amiri_400Regular,
        'Amiri-Bold': Amiri_700Bold,
        'Scheherazade-Regular': ScheherazadeNew_400Regular,
        'Scheherazade-Bold': ScheherazadeNew_700Bold,
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

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
