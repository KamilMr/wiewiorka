import {MD3DarkTheme, MD3LightTheme} from 'react-native-paper';

export const paperTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    // primary: '#5C4033', // A deep brown resembling the tree bark
    // onPrimary: '#FFFFFF', // White for contrast
    // secondaryContainer: '#A67B5B', // Light brown for subtle highlights
    // onSecondaryContainer: '#FFFFFF', // White for readability
    // background: '#3E2C1F', // Dark brown almost black for background depth
    // onBackground: '#FFFFFF', // White to pop against dark backgrounds
    // surface: '#8D6E63', // Muted earth tone for surfaces
    // surfaceVariant: '#5C4033', // Dark brown to complement primary
    // onSurface: '#8D6E63', // White for clarity on darker surfaces
    // elevation: {
    //   level1: '#5C4033', // Dark brown to keep consistency with shadows
    //   level2: '#A67B5B', // Light brown for elevated elements
    //   level3: '#5C4033', // Dark brown for deeper elevation
    //   level4: '#3E2C1F', // Deeper shade for the utmost elevation
    //   level5: '#3E2C1F', // Same as level 4 for consistency
    // },
    error: '#D32F2F', // Standard error color for clear visibility
  },
};

