import {useState} from 'react';
import {ScrollView, View} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';
import {Button, RadioButton} from 'react-native-paper';

import {selectComparison} from '@/redux/main/selectors';
import {SummaryCard, Text} from '@/components';
import {useAppSelector} from '@/hooks';
import {useAppTheme} from '@/constants/theme';

const MONTH = 1;
const YEAR = 12;
const MONTH_LABEL = 'miesiac';
const YEAR_LABEL = 'rok';

const Config: React.FC<{
  selection: [number, string][];
  onChange: (value: string) => void;
  title?: string;
}> = ({selection, onChange, title = ''}) => {
  const [active, setActive] = useState<number>(0);

  const handleChange = (f: string) => {
    onChange?.(f);
    setActive(selection.map((el) => el[0]).findIndex((n) => n === +f));
  };

  return (
    <View style={{alignItems: 'center', marginBottom: 16}}>
      {title && <Text variant="headlineLarge">{title}</Text>}
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

const NoData = () => {
  const t = useAppTheme();
  return (
    <View
      style={{
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: t.colors.white,
      }}>
      <Text variant="titleLarge">Brak danych</Text>
    </View>
  );
};

const Summary = () => {
  const [filter, setFilter] = useState(MONTH);
  const summary = useAppSelector(selectComparison(filter));
  const handleChange = (f) => setFilter(f);

  const t = useAppTheme();

  return (
    <SafeAreaView style={{backgroundColor: t.colors.white}}>
      <ScrollView
        style={{
          backgroundColor: t.colors.white,
          height: '100%',
          marginTop: 4 * 4,
        }}>
        <Config
          selection={[
            [MONTH, MONTH_LABEL],
            [YEAR, YEAR_LABEL],
          ]}
          onChange={handleChange}
        />
        {!summary.length ? (
          <NoData />
        ) : (
          summary.map((sumObj) => (
            <SummaryCard
              key={sumObj.id}
              income={sumObj.income}
              outcome={sumObj.outcome}
              date={sumObj.date}
              costs={sumObj.costs}
            />
          ))
        )}
        <View style={{height: 80}} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Summary;
