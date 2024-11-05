import {MD3LightTheme as DefaultTheme, useTheme} from 'react-native-paper';

export const colorNames = {
  softLavender: '#E8DEF8',
  deepMaroon: '#400303',
};

/**
 * Base size multiplier
 * @constant {number}
 */
export const SM: number = 2;

/**
 * Object containing size options with different scaling factors.
 * Each key represents a size (sm, md, lg, xl, xxl, xxxl) with values based on powers of SM.
 * - `sm`: 2
 * - `md`: 4
 * - `lg`: 8
 * - `xl`: 16
 * - `xxl`: 32
 * - `xxxl`: 64
 *
 * @type {{ sm: 2, md: 4, lg: 8, xl: 16, xxl: 32, xxxl: 64 }}
 */
export const sizes: Record<'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl', number> =
  {
    sm: SM, // 2
    md: SM ** 2, // 4
    lg: SM ** 3, // 8
    xl: SM ** 4, // 16
    xxl: SM ** 5, // 32
    xxxl: SM ** 6, // 64
  };

export const paperTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    ...colorNames,
    // primary: '#5C4033', // A deep brown resembling the tree bark
    // onPrimary: '#FFFFFF', // White for contrast
    // secondaryContainer: '#A67B5B', // Light brown for subtle highlights
    // onSecondaryContainer: '#FFFFFF', // White for readability
    background: '#FFFFFF', // Dark brown almost black for background depth
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

export type AppTheme = typeof paperTheme;

export const useAppTheme = () => useTheme<AppTheme>();
