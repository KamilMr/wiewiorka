import {BudgetCard, Button, Text} from '@/components';
import {sizes} from '@/constants/theme';
import {useAppSelector} from '@/hooks';
import {selectBudgets} from '@/redux/main/selectors';
import {View} from 'react-native';

interface BudgetProps {}

const BudgetCardWithButton = () => {
  const items = useAppSelector(selectBudgets());
  return (
    <View style={{padding: sizes.xl}}>
      <BudgetCard items={items} />
      <Button
        mode="contained"
        onPress={() => console.log('Pressed')}
        style={{marginTop: sizes.lg, alignSelf: 'center'}}>
        Dodaj budżet
      </Button>
    </View>
  );
};

export default function Page({}: BudgetProps) {
  return (
    <View>
      <BudgetCardWithButton />
    </View>
  );
}
