import { Colors, ThemeColors } from '../constants/colors';
import { useColorScheme as useRNColorScheme } from 'react-native';

/**
 * Get theme colors based on theme setting and system theme
 * This is NOT a hook - it's a pure function that takes system theme as parameter
 */
export const getThemeColors = (
  theme: 'light' | 'dark' | 'auto',
  systemTheme: 'light' | 'dark' | null | undefined = null
): ThemeColors => {
  if (theme === 'auto') {
    return Colors[systemTheme === 'dark' ? 'dark' : 'light'];
  }
  return Colors[theme];
};

/**
 * Hook to get current theme colors
 */
export const useThemeColors = (): ThemeColors => {
  const systemTheme = useRNColorScheme();
  // Get theme from store - we'll need to import this where used
  // For now, return light theme as default
  return Colors[systemTheme === 'dark' ? 'dark' : 'light'];
};
