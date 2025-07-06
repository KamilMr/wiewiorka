import {useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, TouchableOpacity, View} from 'react-native';
import {formatDate} from 'date-fns';
import _ from 'lodash';

import {TextInput, ButtonWithStatus as Button, Select, Text, IconButton} from '@/components';

import {useAppDispatch, useAppSelector} from '@/hooks';
import {sizes, useAppTheme} from '@/constants/theme';
import {selectCategories} from '@/redux/main/selectors';
import {Budget, uploadBudget} from '@/redux/main/thunks';
import {Items} from '@/components/CustomSelect';

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

const monthAndYearSliders: Items = [
  // this month
  {
    label: new Date().toLocaleString('pl', {month: 'long'}),
    value: new Date().toLocaleString('pl', {month: '2-digit'}),
  },
  // + 1 month
  {
    label: new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleString('pl', {month: 'long'}),
    value: new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleString('pl', {month: '2-digit'}),
  },
];

const yearSliders = [{label: '2025', value: '2025'}];

const SelectMonthAndYear = ({onChange}: {onChange: (month: number, year: number) => void}) => {
  const [month, setMonth] = useState(new Date().toLocaleString('pl', {month: '2-digit'}));
  const [year, setYear] = useState(new Date().getFullYear().toString());

  useEffect(() => {
    if (Number.isNaN(parseInt(month)) || Number.isNaN(parseInt(year))) return;
    onChange(parseInt(month), parseInt(year));
  }, []);

  const handleMonthChange = (month: {label: string; value: string}) => {
    setMonth(month.value);
    if (Number.isNaN(parseInt(month.value))) return;
    onChange(parseInt(month.value), parseInt(year));
  };

  const handleYearChange = (value: string) => {
    setYear(value);
    if (Number.isNaN(parseInt(value))) return;
    onChange(parseInt(month), parseInt(value));
  };

  return (
    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
      <View style={{flex: 1}}>
        <Select
          title="Miesiąc"
          placeholder="Wybierz miesiąc"
          items={monthAndYearSliders}
          value={month}
          onChange={handleMonthChange}
        />
      </View>
      <View style={{flex: 1}}>
        <Select
          title="Rok"
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
            <IconButton icon={expand[index] ? 'chevron-down' : 'chevron-right'} onPress={() => handleExpand(index)} />
          </View>
          {expand[index] &&
            items.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => onChange?.({name: item.name, id: item.id, type: 'category'})}>
                <Text key={item.id} style={{marginLeft: sizes.xl, marginVertical: sizes.md}}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
        </View>
      ))}
    </View>
  );
};

const NewBudget = () => {
  const categories = useAppSelector(selectCategories);
  const [amount, setAmount] = useState<string>('');
  const [budgetDate, setBudgetDate] = useState<string | null>(null);
  const [showCategories, setShowCategories] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<SelectedCategory | null>(null);
  const dispatch = useAppDispatch();
  const t = useAppTheme();

  const groupedByMain = _.groupBy(categories, 'groupName');

  const handleSave = () => {
    if (!amount || !budgetDate) return;
    const isGroup = selectedCategory?.groupId;
    const key = isGroup ? 'groupId' : 'categoryId';
    const budgetData: Budget = {
      amount: parseInt(amount),
      date: formatDate(budgetDate, 'yyyy-MM-dd'),
      [key]: selectedCategory?.[key],
    };
    dispatch(uploadBudget(budgetData));
  };

  const handleChangeCategory = ({name, id, type}: {name: string; id: number; type: string}) => {
    setSelectedCategory({name, id, [`${type}Id`]: id});
    setShowCategories(false);
  };

  const handleSelectMonthAndYear = (month: number, year: number) => {
    setBudgetDate(`${year}-${month}-01`);
  };

  return (
    <SafeAreaView>
      <ScrollView style={{padding: sizes.xl}}>
        <View style={{marginTop: sizes.xl * 3, backgroundColor: t.colors.white}}>
          <SelectMonthAndYear onChange={handleSelectMonthAndYear} />
        </View>
        <TextInput label="Kwota" value={amount} keyboardType="numeric" onChangeText={(text) => setAmount(text)} />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text variant={selectedCategory?.name ? 'titleMedium' : 'bodySmall'} style={{color: t.colors.secondary}}>
            {selectedCategory?.name ?? 'Nie wybrano kategorii'}
          </Text>
          <Button onPress={() => setShowCategories(!showCategories)}>
            {showCategories ? 'Ukryj kategorie' : 'Pokaż kategorie'}
          </Button>
        </View>
        {showCategories && <ExtendablesCategories categories={groupedByMain} onChange={handleChangeCategory} />}
        <Button
          mode="contained"
          onPress={handleSave}
          disabled={!amount || !budgetDate || !selectedCategory?.name}
          style={{marginTop: sizes.lg, alignSelf: 'center'}}>
          Dodaj budżet
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NewBudget;
