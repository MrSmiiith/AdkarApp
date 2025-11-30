import React from 'react';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { ViewStyle } from 'react-native';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: ViewStyle;
}

// Icon mappings to vector icons
const ICON_MAP: { [key: string]: { library: 'MaterialCommunityIcons' | 'Ionicons'; icon: any } } = {
  // Navigation
  home: { library: 'Ionicons', icon: 'home' },
  'home-outline': { library: 'Ionicons', icon: 'home-outline' },
  book: { library: 'Ionicons', icon: 'book' },
  'book-open': { library: 'MaterialCommunityIcons', icon: 'book-open-page-variant' },
  moon: { library: 'Ionicons', icon: 'moon' },
  'moon-outline': { library: 'Ionicons', icon: 'moon-outline' },
  sun: { library: 'Ionicons', icon: 'sunny' },
  'sun-outline': { library: 'Ionicons', icon: 'sunny-outline' },
  sunrise: { library: 'Ionicons', icon: 'sunny' },
  compass: { library: 'MaterialCommunityIcons', icon: 'compass' },
  time: { library: 'Ionicons', icon: 'time' },
  clock: { library: 'Ionicons', icon: 'time-outline' },

  // Actions
  search: { library: 'Ionicons', icon: 'search' },
  settings: { library: 'Ionicons', icon: 'settings' },
  bookmark: { library: 'Ionicons', icon: 'bookmark' },
  'bookmark-outline': { library: 'Ionicons', icon: 'bookmark-outline' },
  star: { library: 'Ionicons', icon: 'star' },
  'star-outline': { library: 'Ionicons', icon: 'star-outline' },
  heart: { library: 'Ionicons', icon: 'heart' },
  'heart-outline': { library: 'Ionicons', icon: 'heart-outline' },

  // Directions
  'chevron-right': { library: 'Ionicons', icon: 'chevron-forward' },
  'chevron-left': { library: 'Ionicons', icon: 'chevron-back' },
  'chevron-up': { library: 'Ionicons', icon: 'chevron-up' },
  'chevron-down': { library: 'Ionicons', icon: 'chevron-down' },
  'arrow-right': { library: 'Ionicons', icon: 'arrow-forward' },
  'arrow-left': { library: 'Ionicons', icon: 'arrow-back' },

  // Interface
  close: { library: 'Ionicons', icon: 'close' },
  check: { library: 'Ionicons', icon: 'checkmark' },
  plus: { library: 'Ionicons', icon: 'add' },
  minus: { library: 'Ionicons', icon: 'remove' },
  menu: { library: 'Ionicons', icon: 'menu' },
  'dots-vertical': { library: 'Ionicons', icon: 'ellipsis-vertical' },
  'dots-horizontal': { library: 'Ionicons', icon: 'ellipsis-horizontal' },

  // Islamic
  mosque: { library: 'MaterialCommunityIcons', icon: 'mosque' },
  prayer: { library: 'MaterialCommunityIcons', icon: 'hands-pray' },
  quran: { library: 'MaterialCommunityIcons', icon: 'book-open-variant' },
  kaaba: { library: 'MaterialCommunityIcons', icon: 'kaaba' },
};

export const Icon: React.FC<IconProps> = ({ name, size = 24, color = '#000', style }) => {
  const iconConfig = ICON_MAP[name];

  if (!iconConfig) {
    return <Ionicons name="help-circle" size={size} color={color} style={style} />;
  }

  if (iconConfig.library === 'MaterialCommunityIcons') {
    return <MaterialCommunityIcons name={iconConfig.icon} size={size} color={color} style={style} />;
  }

  return <Ionicons name={iconConfig.icon} size={size} color={color} style={style} />;
};
