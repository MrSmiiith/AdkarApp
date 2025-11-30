import React from 'react';
import { useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useSettingsStore } from '../store/settingsStore';
import { getThemeColors } from '../utils/themeHelpers';
import { useTranslation } from '../hooks/useTranslation';
import { Icon } from '../components/common/Icon';

// Screens
import { HomeScreen } from '../screens/HomeScreen';
import { QuranScreen } from '../screens/QuranScreen';
import { QuranReaderScreen } from '../screens/QuranReaderScreen';
import { AdkarScreen } from '../screens/AdkarScreen';
import { AdkarDetailsScreen } from '../screens/AdkarDetailsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { PrayerTimesScreen } from '../screens/PrayerTimesScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabNavigator() {
  const { theme } = useSettingsStore();
  const { t } = useTranslation();
  const systemTheme = useColorScheme();
  const colors = getThemeColors(theme, systemTheme);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = '';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Quran') {
            iconName = 'book-open';
          } else if (route.name === 'Adkar') {
            iconName = focused ? 'moon' : 'moon-outline';
          } else if (route.name === 'Settings') {
            iconName = 'settings';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false, title: t('home') }}
      />
      <Tab.Screen name="Quran" component={QuranScreen} options={{ headerShown: false, title: t('quran') }} />
      <Tab.Screen name="Adkar" component={AdkarScreen} options={{ headerShown: false, title: t('adkar') }} />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ headerShown: false, title: t('settings') }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const { theme } = useSettingsStore();
  const systemTheme = useColorScheme();
  const colors = getThemeColors(theme, systemTheme);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      >
        <Stack.Screen
          name="Main"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AdkarDetails"
          component={AdkarDetailsScreen}
          options={{ title: 'Adkar' }}
        />
        <Stack.Screen
          name="QuranReader"
          component={QuranReaderScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PrayerTimes"
          component={PrayerTimesScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
