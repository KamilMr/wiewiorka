import { MD3DarkTheme } from "react-native-paper";

export const paperTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#5C4033', // A deep brown resembling the tree bark
    onPrimary: '#FFFFFF', // White for contrast
    secondaryContainer: '#A67B5B', // Light brown for subtle highlights
    onSecondaryContainer: '#FFFFFF', // White for readability
    background: '#3E2C1F', // Dark brown almost black for background depth
    onBackground: '#FFFFFF', // White to pop against dark backgrounds
    surface: '#8D6E63', // Muted earth tone for surfaces
    surfaceVariant: '#5C4033', // Dark brown to complement primary
    onSurface: '#FFFFFF', // White for clarity on darker surfaces
    elevation: {
      level1: '#5C4033', // Dark brown to keep consistency with shadows
      level2: '#A67B5B', // Light brown for elevated elements
      level3: '#5C4033', // Dark brown for deeper elevation
      level4: '#3E2C1F', // Deeper shade for the utmost elevation
      level5: '#3E2C1F', // Same as level 4 for consistency
    },
    error: '#D32F2F', // Standard error color for clear visibility
  },
};

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};
