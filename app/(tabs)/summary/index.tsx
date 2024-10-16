import {useState} from 'react';
import {ScrollView, View} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';
import {Button, RadioButton, Text} from 'react-native-paper';

import {selectComparison} from '@/redux/main/selectors';
import {BarChart, SummaryCard} from '@/components';
import {useAppSelector} from '@/hooks';

const MONTH = 1;
const YEAR = 12;
const SUMMARY_TITLE = 'Podsumowanie';
const MONTH_LABEL = 'miesiac';
const YEAR_LABEL = 'rok';

const Config = ({selection, onChange, title}) => {
  const [active, setActive] = useState(0);

  const handleChange = (f) => {
      onChange?.(f);
    setActive(selection.map((el) => el[0]).findIndex((n) => n === +f));
  };

  return (
    <View style={{alignItems: 'center', marginBottom: 16}}>
      <Text variant="headlineLarge">{title}</Text>
      <RadioButton.Group
        onValueChange={(value) => handleChange(value)}
        value={selection[active][0].toString()}>
        <View style={{flexDirection: 'row'}}>
          {selection.map(([f, name], idx) => (
            <Button
              key={f}
              style={{marginRight: 4}}
              mode={idx === active ? 'contained' : 'outlined'}
              onPress={() => handleChange(f.toString())}>
              {name}
            </Button>
          ))}
        </View>
      </RadioButton.Group>
    </View>
  );
};

const Summary = () => {
  const [filter, setFilter] = useState(MONTH);
  const summary = useAppSelector(selectComparison(filter));
  const handleChange = (f) => setFilter(f);

  return (
    <SafeAreaView>
      <ScrollView>
        <Config
          selection={[
            [MONTH, MONTH_LABEL],
            [YEAR, YEAR_LABEL],
          ]}
          onChange={handleChange}
          title={SUMMARY_TITLE}
        />
        {summary.map((sumObj) => (
          <SummaryCard
            key={sumObj.id}
            income={sumObj.income}
            outcome={sumObj.outcome}
            date={sumObj.date}
            costs={sumObj.costs}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Summary;
