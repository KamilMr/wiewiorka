import {BudgetCard, Button} from '@/components';
import {sizes} from '@/constants/theme';
import {useAppSelector} from '@/hooks';
import {selectBudgets} from '@/redux/main/selectors';
import {Link} from 'expo-router';
import {View} from 'react-native';

interface BudgetProps {}

const BudgetCardWithButton = () => {
  const items = useAppSelector(selectBudgets());
  return (
    <View style={{padding: sizes.xl}}>
      <BudgetCard items={items} />
      <Link href="/budget/new" asChild>
        <Button
          mode="contained"
          style={{marginTop: sizes.lg, alignSelf: 'center'}}>
          Dodaj budżet
        </Button>
      </Link>
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
