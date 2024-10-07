import {useState} from 'react';
import {useLocalSearchParams} from 'expo-router';
import {View} from 'react-native';
import {Text} from 'react-native-paper';

import {BarChart} from '@/components';
import {lastDayOfMonth} from 'date-fns';
import {useAppSelector} from '@/hooks';
import {aggregateExpenses} from '@/redux/main/selectors';
import {formatPrice} from '@/common';
import {parseInt} from 'lodash';

type AggrExpense = {
  v: number;
  color: string;
  name: string;
};

const Summary = () => {
  const {date}: {date: string} = useLocalSearchParams();
  const isNotYear: boolean = date.split('-').length > 2;
  const [filterDates, setFilterDates] = useState([
    new Date(date),
    new Date(lastDayOfMonth(isNotYear ? new Date(date) : new Date())),
  ]);

  const aggrExpenses = useAppSelector(aggregateExpenses(filterDates)) || [];

  const data = aggrExpenses.map((obj: AggrExpense) => {
    const tR = {
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
    <View>
      <Text>Hello from summary: </Text>
      <Text>{date}</Text>
      <BarChart title="title" barData={data} />
    </View>
  );
};

export default Summary;
