import type {BottomTabNavigationOptions} from '@react-navigation/bottom-tabs';
import type {NativeStackNavigationOptions} from '@react-navigation/native-stack';
import {StyleSheet, Text, View} from 'react-native';

import DevModeToggle from '@/components/DevModeToggle';
import StatusIndicator from '@/components/StatusIndicator';
import {warmColors} from '@/constants/warmTheme';

type AppHeaderTitleProps = {
  title: string;
};

export function AppHeaderTitle({title}: AppHeaderTitleProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>WIEWIORKA</Text>
      <Text numberOfLines={1} style={styles.title}>
        {title}
      </Text>
    </View>
  );
}

type SharedHeaderOptionKey =
  | 'headerTitle'
  | 'headerTitleAlign'
  | 'headerStyle'
  | 'headerShadowVisible'
  | 'headerTintColor';

type SharedHeaderOptions = Pick<
  NativeStackNavigationOptions,
  SharedHeaderOptionKey
> &
  Pick<BottomTabNavigationOptions, SharedHeaderOptionKey>;

type SharedHeaderStatusOptions = Pick<
  NativeStackNavigationOptions,
  'headerRight'
> &
  Pick<BottomTabNavigationOptions, 'headerRight'>;

export const appHeaderStatusOptions = {
  headerRight: () => (
    <DevModeToggle>
      <StatusIndicator />
    </DevModeToggle>
  ),
} satisfies SharedHeaderStatusOptions;

export const appTabHeaderStatusOptions = {
  ...appHeaderStatusOptions,
  headerRightContainerStyle: {paddingRight: 20},
} satisfies Pick<
  BottomTabNavigationOptions,
  'headerRight' | 'headerRightContainerStyle'
>;

export const appHeaderOptions = {
  headerTitle: ({children}: {children: string}) => (
    <AppHeaderTitle title={children} />
  ),
  headerTitleAlign: 'left' as const,
  headerStyle: {backgroundColor: warmColors.background},
  headerShadowVisible: false,
  headerTintColor: warmColors.foreground,
} satisfies SharedHeaderOptions;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  eyebrow: {
    color: warmColors.mutedForeground,
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.8,
    lineHeight: 16,
    marginBottom: 4,
  },
  title: {
    color: warmColors.foreground,
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: -0.3,
    lineHeight: 24,
  },
});
