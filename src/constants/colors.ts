export const Colors = {
  light: {
    primary: '#0D5C3D',        // Islamic green
    primaryLight: '#1A8B5B',    // Lighter green
    secondary: '#D4AF37',       // Gold accent
    background: '#FFFFFF',      // Pure white background
    surface: '#F8F9FA',         // Light gray surface
    text: '#1A1A1A',           // Almost black text
    textSecondary: '#6C757D',  // Gray text
    border: '#DEE2E6',         // Light border
    error: '#DC3545',          // Red
    success: '#28A745',        // Green
    warning: '#FFC107',        // Yellow
    card: '#FFFFFF',           // White cards
    shadow: '#00000020',       // Light shadow
  },
  dark: {
    primary: '#1A8B5B',        // Lighter green for dark mode
    primaryLight: '#2DA873',    // Even lighter
    secondary: '#FFD700',       // Bright gold
    background: '#0A0E0D',     // Very dark green-tinted background
    surface: '#1C2420',        // Dark green surface
    text: '#FFFFFF',           // White text
    textSecondary: '#ADB5BD',  // Light gray text
    border: '#2C3531',         // Dark border
    error: '#EF5350',          // Light red
    success: '#66BB6A',        // Light green
    warning: '#FFA726',        // Light orange
    card: '#141917',           // Dark card
    shadow: '#00000050',       // Darker shadow
  },
};

export type ColorScheme = keyof typeof Colors;
export type ThemeColors = typeof Colors.light;
