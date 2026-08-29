import {StyleSheet, Text, View} from 'react-native';

import {warmColors} from '@/constants/warmTheme';

type TabHeaderTitleProps = {
  title: string;
};

export function TabHeaderTitle({title}: TabHeaderTitleProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>WIEWIORKA</Text>
      <Text numberOfLines={1} style={styles.title}>
        {title}
      </Text>
    </View>
  );
}

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
