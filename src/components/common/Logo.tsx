import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { useSettingsStore } from '../../store/settingsStore';
import { getThemeColors } from '../../utils/themeHelpers';
import { Icon } from './Icon';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'medium', showText = true }) => {
  const { theme } = useSettingsStore();
  const systemTheme = useColorScheme();
  const colors = getThemeColors(theme, systemTheme);

  const sizes = {
    small: { icon: 28, text: 16, container: 48 },
    medium: { icon: 40, text: 24, container: 64 },
    large: { icon: 52, text: 32, container: 80 },
  };

  const currentSize = sizes[size];

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: colors.primary,
            width: currentSize.container,
            height: currentSize.container,
          },
        ]}
      >
        <Icon name="moon" size={currentSize.icon} color="#FFFFFF" />
      </View>
      {showText && (
        <Text
          style={[
            styles.text,
            { color: colors.text, fontSize: currentSize.text },
          ]}
        >
          Adkar
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    fontWeight: '700',
    letterSpacing: 1,
  },
});
