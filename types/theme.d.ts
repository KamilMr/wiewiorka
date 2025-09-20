import {MD3Theme} from 'react-native-paper';

declare module 'react-native-paper' {
  interface MD3Colors {
    // Primary palette - Navy blue
    primary: string;
    primaryLight: string;
    primaryDark: string;

    // Accent colors - Amber
    accent: string;
    accentLight: string;
    accentDark: string;

    // Background colors - Beige system
    background: string;
    surface: string;
    surfaceVariant: string;
    warmBeige: string;

    // Semantic colors
    success: string;
    successLight: string;
    warning: string;
    warningLight: string;
    error: string;
    errorLight: string;
    info: string;
    infoLight: string;

    // Neutral palette
    textPrimary: string;
    textSecondary: string;
    textTertiary: string;
    outline: string;
    outlineVariant: string;

    // Additional accent colors
    gold: string;
    warmOrange: string;

    // Text colors on surfaces
    onSurface: string;
    onSurfaceVariant: string;
    onPrimary: string;
    onAccent: string;
  }

  interface MD3Theme {
    spacing: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
      xxl: number;
      xxxl: number;
      cardPadding: number;
      sectionGap: number;
      componentGap: number;
      buttonPadding: number;
    };
    typography: {
      displayLarge: {fontSize: number; fontWeight: string; lineHeight: number};
      displayMedium: {fontSize: number; fontWeight: string; lineHeight: number};
      headlineLarge: {fontSize: number; fontWeight: string; lineHeight: number};
      headlineMedium: {
        fontSize: number;
        fontWeight: string;
        lineHeight: number;
      };
      titleLarge: {fontSize: number; fontWeight: string; lineHeight: number};
      titleMedium: {fontSize: number; fontWeight: string; lineHeight: number};
      titleSmall: {fontSize: number; fontWeight: string; lineHeight: number};
      bodyLarge: {fontSize: number; fontWeight: string; lineHeight: number};
      bodyMedium: {fontSize: number; fontWeight: string; lineHeight: number};
      bodySmall: {fontSize: number; fontWeight: string; lineHeight: number};
      labelLarge: {fontSize: number; fontWeight: string; lineHeight: number};
      labelMedium: {fontSize: number; fontWeight: string; lineHeight: number};
      labelSmall: {fontSize: number; fontWeight: string; lineHeight: number};
    };
    borderRadius: {
      sm: number;
      md: number;
      lg: number;
      xl: number;
    };
    shadows: {
      sm: {elevation: number; shadowRadius: number};
      md: {elevation: number; shadowRadius: number};
      lg: {elevation: number; shadowRadius: number};
    };
  }
}
