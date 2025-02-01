import {Card, ProgressBar} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';
import {Button, Text} from '..';
import {sizes, useAppTheme} from '@/constants/theme';
import {formatPrice} from '@/common';
import {BudgetCardProps} from '@/utils/types';

export default function BudgetCard({items = []}: BudgetCardProps) {
  items = items.length ? items : mockItems;
  const t = useAppTheme();
  // three stages of color based of percentage
  const getColor = (percentage: number) => {
    if (percentage > 0.7) {
      return t.colors.error;
    } else {
      return t.colors.primary;
    }
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
                progress={(item.amount * 100) / item.allocated / 100}
                color={getColor((item.amount * 100) / item.allocated / 100)}
              />
            </View>
          </View>
        ))}
      </Card.Content>
    </Card>
  );
}

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

const mockItems: Item[] = [
  {
    id: '1',
    budgetedName: 'Food',
    amount: 1000,
    allocated: 5000,
  },
  {
    id: '2',
    budgetedName: 'Transport',
    amount: 200,
    allocated: 1000,
  },
  {
    id: '3',
    budgetedName: 'Entertainment',
    amount: 300,
    allocated: 200,
  },
];
