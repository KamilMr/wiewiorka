import {View} from 'react-native';

import Text from './CustomText';
import {sizes, useAppTheme} from '@/constants/theme';

export default function ({txt = '', label = ''}: {txt: string; label?: string}) {
  const t = useAppTheme();
  return (
    <View
      style={{
        marginHorizontal: sizes.xl,
      }}>
      <Text variant="bodySmall">{label}</Text>
      <View
        style={{
          padding: sizes.lg,
          borderRadius: 4,
          height: 60,
          marginBottom: sizes.xl,
          justifyContent: 'center',
          backgroundColor: t.colors.surfaceVariant,
        }}>
        <Text variant="bodyLarge">{txt}</Text>
      </View>
    </View>
  );
}
