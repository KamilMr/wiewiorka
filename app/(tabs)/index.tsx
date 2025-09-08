import {ScrollView, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import FinancialQuote from '@/components/FinancialQuote';
import SummaryCard_v2 from '@/components/SummaryCardv2';
import {BudgetCard} from '@/components';
import {selectBudgets} from '@/redux/main/selectors';
import {useAppSelector} from '@/hooks';
import {useAppTheme} from '@/constants/theme';
import formatDateTz, {timeFormats} from '@/utils/formatTimeTz';
import _ from 'lodash';

const Home = () => {
  const t = useAppTheme();
  const items = useAppSelector(selectBudgets());
  return (
    <SafeAreaView style={{backgroundColor: t.colors.white}}>
      <View
        style={{
          height: '100%',
          alignItems: 'center',
          backgroundColor: t.colors.white,
        }}
      >
        <View style={{width: '90%', gap: 16}}>
          <ScrollView>
            <SummaryCard_v2 />
            <FinancialQuote />
            <BudgetCard
              items={_.sortBy(items, ['budgetedName'])}
              date={formatDateTz({pattern: timeFormats.dateOnly2})}
            />
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Home;
