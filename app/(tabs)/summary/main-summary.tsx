import {useState} from 'react';
import {useLocalSearchParams} from 'expo-router';
import {ScrollView, View} from 'react-native';
import {Text} from 'react-native-paper';

import {BarChart, DatePicker} from '@/components';
import {lastDayOfMonth} from 'date-fns';
import {useAppSelector} from '@/hooks';
import {aggregateExpenses} from '@/redux/main/selectors';
import {EXCLUDED_CAT, formatPrice} from '@/common';
import {parseInt} from 'lodash';
import {SafeAreaView} from 'react-native-safe-area-context';

type AggrExpense = {
  v: number;
  color: string;
  name: string;
  id: string;
};

type ToReturn = {
  value: number;
  frontColor: string;
  label: string;
  spacing: number;
  barWidth: number;
  topLabelComponent: () => JSX.Element;
};

const Summary = () => {
  const {date}: {date: string} = useLocalSearchParams();
  const isNotYear: boolean = date.split('-').length > 2;
  const [filterDates, setFilterDates] = useState([
    new Date(date),
    new Date(lastDayOfMonth(isNotYear ? new Date(date) : new Date())),
  ]);

  const aggrExpenses = useAppSelector(aggregateExpenses(filterDates)) || [];

  const categories = aggrExpenses.map((o: any) => ({name: o.name, id: o.id}));
  const [filters, setFilters] = useState(
    categories.filter((c) => !EXCLUDED_CAT.includes(c.id)),
  );

  const setCat = new Set(filters.map((o) => o.name));
  const handleRemoveFilters = () => setFilters([]);

  const data: ToReturn[] = aggrExpenses
    .filter((obj) => (setCat.size > 0 ? setCat.has(obj.name) : true))
    .map((obj: AggrExpense) => {
      const tR: ToReturn = {
        value: obj.v,
        frontColor: obj.color,
        label: obj.name,
        spacing: 10,
        barWidth: 50,
        topLabelComponent: () => (
          <>
            <Text style={{fontSize: 8}}>
              {formatPrice(parseInt(obj.v.toString()))}
            </Text>
          </>
        ),
      };

      return tR;
    });

  return (
    <SafeAreaView>
      <ScrollView>
        <View>
          <View style={{marginBottom: 16}}>
            <DatePicker
              value={filterDates[0]}
              style={{marginRight: 8, marginBottom: 8}}
              onChange={(date = filterDates[0]) => setFilterDates([date, filterDates[1]])}
            />
            <DatePicker
              style={{marginRight: 8, marginBottom: 8}}
              value={filterDates[1]}
              onChange={(date = filterDates[1])=> setFilterDates([filterDates[0], date])}
            />
          </View>
          <Text>{date}</Text>
          <BarChart title="title" barData={data} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Summary;
