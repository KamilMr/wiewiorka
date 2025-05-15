import {View, Text} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {BudgetCard} from '@/components';
import {useAppTheme} from '@/constants/theme';
import {useAppSelector} from '@/hooks';
import {selectBudgets} from '@/redux/main/selectors';
import SummaryCard_v2 from '@/components/SummaryCardv2';

const Home = () => {
  const t = useAppTheme();
  const items = useAppSelector(selectBudgets());
  return (
    <SafeAreaView style={{backgroundColor: t.colors.white}}>
      <View
        style={{
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: t.colors.white,
        }}>
        <View style={{width: '90%'}}>
          <SummaryCard_v2 date="2025-04-01" />
          {/* <BudgetCard items={items} /> */}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Home;
