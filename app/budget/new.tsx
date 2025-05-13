import {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import {formatDate} from 'date-fns';
import _ from 'lodash';

import {
  TextInput,
  ButtonWithStatus as Button,
  Select,
  Text,
  IconButton,
} from '@/components';

import {useAppDispatch, useAppSelector} from '@/hooks';
import {sizes, useAppTheme} from '@/constants/theme';
import {selectCategories} from '@/redux/main/selectors';

const addBudget = (payload: any) => ({type: 'ADD_BUDGET', payload});

interface Category {
  id: number;
  name: string;
  groupId: number;
}

interface Categories {
  [key: string]: Category[];
}

type SelectedCategory = {
  [key: string]: number | string;
};

const monthAndYearSliders = [
  // this month
  {
    label: new Date().toLocaleString('pl', {month: 'long'}),
    value: new Date().toLocaleString('pl', {month: '2-digit'}),
  },
  // + 1 month
  {
    label: new Date(
      new Date().setMonth(new Date().getMonth() + 1),
    ).toLocaleString('pl', {month: 'long'}),
    value: new Date(
      new Date().setMonth(new Date().getMonth() + 1),
    ).toLocaleString('pl', {month: '2-digit'}),
  },
];

const yearSliders = [{label: '2025', value: '2025'}];

const SelectMonthAndYear = ({
  onChange,
}: {
  onChange: (month: string, year: string) => void;
}) => {
  const [month, setMonth] = useState('01');
  const [year, setYear] = useState('2025');

  const handleMonthChange = (value: string) => {
    setMonth(value);
    onChange(value, year);
  };

  const handleYearChange = (value: string) => {
    setYear(value);
    onChange(month, value);
  };

  return (
    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
      <View style={{flex: 1}}>
        <Select
          label="Miesiąc"
          placeholder="Wybierz miesiąc"
          items={monthAndYearSliders}
          value={month}
          onChange={handleMonthChange}
        />
      </View>
      <View style={{flex: 1}}>
        <Select
          label="Rok"
          placeholder="Wybierz rok"
          items={yearSliders}
          disable={true}
          value={year}
          onChange={handleYearChange}
        />
      </View>
    </View>
  );
};
const ExtendablesCategories = ({
  categories,
  onChange,
}: {
  categories: Categories;
  onChange: ({name, id}: {name: string; id: number; type: string}) => void;
}) => {
  const [expand, setExpand] = useState(_.keys(categories).map(() => false));

  const handleExpand = (index: number) => {
    setExpand((prev) => prev.map((_, i) => (i === index ? !prev[i] : prev[i])));
  };

  return (
    <View style={{marginTop: sizes.xl, marginHorizontal: sizes.xl}}>
      {_.entries(categories).map(([groupName, items], index) => (
        <View key={groupName}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              onPress={() =>
                onChange?.({
                  name: groupName,
                  id: items[0].groupId,
                  type: 'group',
                })
              }>
              <Text variant="titleMedium">{groupName}</Text>
            </TouchableOpacity>
            <IconButton
              icon={expand[index] ? 'chevron-down' : 'chevron-right'}
              onPress={() => handleExpand(index)}
            />
          </View>
          {expand[index] &&
            items.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() =>
                  onChange?.({name: item.name, id: item.id, type: 'category'})
                }>
                <Text
                  key={item.id}
                  style={{marginLeft: sizes.xl, marginVertical: sizes.md}}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
        </View>
      ))}
    </View>
  );
};

export default function NewBudget() {
  const categories = useAppSelector(selectCategories);
  const [amount, setAmount] = useState<string>('');
  const [budgetDate, setBudgetDate] = useState(null);
  const [showCategories, setShowCategories] = useState(false);
  const [selectedCatagory, setSelectedCategory] =
    useState<SelectedCategory | null>(null);
  const dispatch = useAppDispatch();
  const t = useAppTheme();

  const groupedByMain = _.groupBy(categories, 'groupName');

  const handleSave = () => {
    if (!amount || !budgetDate) return;
    dispatch(
      addBudget({
        amount: parseInt(amount),
        budgetDate: formatDate(budgetDate, 'yyyy-MM-dd'),
      }),
    );
  };

  const handleChangeCategory = ({
    name,
    id,
    type,
  }: {
    name: string;
    id: number;
    type: string;
  }) => {
    setSelectedCategory({name, id, [`${type}Id`]: id});
    setShowCategories(false);
  };

  return (
    <SafeAreaView>
      <ScrollView style={{padding: sizes.xl}}>
        <View
          style={{marginTop: sizes.xl * 3, backgroundColor: t.colors.white}}>
          <SelectMonthAndYear
            onChange={(month, year) => console.log(month, year)}
          />
        </View>
        <TextInput
          label="Kwota"
          value={amount}
          onChangeText={(text) => setAmount(text)}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text variant="titleMedium">{selectedCatagory?.name ?? ''}</Text>
          <Button onPress={() => setShowCategories(!showCategories)}>
            {showCategories ? 'Ukryj kategorie' : 'Pokaż kategorie'}
          </Button>
        </View>
        {showCategories && (
          <ExtendablesCategories
            categories={groupedByMain}
            onChange={handleChangeCategory}
          />
        )}
        <Button
          mode="contained"
          onPress={handleSave}
          style={{marginTop: sizes.lg, alignSelf: 'center'}}>
          Dodaj budżet
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};
