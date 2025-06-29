import {Card, ProgressBar} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';

import {Text} from '..';
import {sizes, useAppTheme} from '@/constants/theme';
import {formatPrice} from '@/common';
import {BudgetCardProps} from '@/utils/types';

export default function BudgetCard({items = []}: BudgetCardProps) {
  const t = useAppTheme();
  // three stages of color based of percentage
  const getColor = (percentage: number) => {
    if (percentage > 0.9) {
      return t.colors.error;
    } else {
      return t.colors.primary;
    }
  };

  const calculateProgress = (amount: number, allocated: number = 0) => {
    if (Number.isNaN(amount) || Number.isNaN(allocated)) return 0;
    const progress = Math.floor(((amount * 100 / allocated) / 100) * 100) / 100;

    if (!Number.isFinite(progress)) return 0;
    return progress;
  };

  return (
    <Card>
      <Card.Title title="Budżety" />
      <Card.Content>
        {items.map((item) => (
          <View key={item.id} style={styles.mainContentBox}>
            {/* Top box */}
            <View style={styles.mainInnerBox}>
              {/* Left side */}
              <View>
                <Text variant="titleMedium">{item.budgetedName}</Text>
                <Text variant="bodySmall">{formatPrice(item.amount)}</Text>
              </View>

              {/* Right side */}
              <View>
                <Text variant="titleMedium">{formatPrice(item.allocated)}</Text>
              </View>
            </View>

            {/* Bottom box slider */}
            <View>
              <ProgressBar
                progress={calculateProgress(+item.amount, item?.allocated || 0)}
                color={getColor(calculateProgress(+item.amount, +item.allocated))}
              />
            </View>
          </View>
        ))}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  mainContentBox: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginVertical: sizes.lg,
  },
  mainInnerBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});