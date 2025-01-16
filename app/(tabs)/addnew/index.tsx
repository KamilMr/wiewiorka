import React, {useCallback, useEffect, useState} from 'react';

import _, {set} from 'lodash';
import {router, useFocusEffect, useLocalSearchParams} from 'expo-router';
import {formatDate} from 'date-fns';
import {View, StyleSheet} from 'react-native';
import {RadioButton} from 'react-native-paper';

import {
  ButtonWithStatus,
  DatePicker,
  Select,
  Text,
  TextInput,
} from '@/components';
import {sizes} from '@/constants/theme';
import {uploadExpense, uploadIncome} from '@/redux/main/thunks';
import {useAppDispatch, useAppSelector} from '@/hooks';
import {selectCategories, selectSources} from '@/redux/main/selectors';

const SelectRadioButtons = ({
  items,
  selected,
  onSelect,
}: {
  items: {label: string; value: string}[];
  selected: string;
  onSelect: (value: string) => void;
}) => {
  return (
    <View style={styles.radioButtons}>
      {items.map((item) => (
        <View key={item.value} style={styles.radioButton}>
          <Text>{item.label}</Text>
          <RadioButton
            value={item.value}
            status={selected === item.value ? 'checked' : 'unchecked'}
            onPress={() => onSelect(item.value)}
          />
        </View>
      ))}
    </View>
  );
};

const initState = (date = new Date()) => ({
  description: '',
  date,
  price: '',
  category: '',
});

export default function AddNew() {
  const [type, setType] = useState<string>('expense');
  const expenseCategories = useAppSelector(selectCategories);
  const {id, type: incomingType = ''} = useLocalSearchParams();
  const incomeCategories = useAppSelector(selectSources) || [];
  const dispatch = useAppDispatch();

  const [form, setForm] = useState(initState());

  useEffect(() => {
    if (incomingType && typeof incomingType === 'string') {
      setType(incomingType);
    }

    return () => {
      console.log('cleanup');
    };
  }, [incomingType]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setForm(initState());
        setType('expense');
      };
    }, [])
  );

  // console.log('form', form, id);

  const itemsToSelect =
    type === 'expense'
      ? expenseCategories.map((cat) => ({label: cat.name, value: cat.name}))
      : incomeCategories
          .concat(['Dodaj nową kategorię'])
          .map((item: string) => ({label: item, value: item}));

  const handleSelectCategory = (category: {label: string; value: string}) => {
    if (category.value === 'Dodaj nową kategorię') {
      console.log('dodaj nową kategorię');
    } else {
      setForm({...form, category: category.value});
    }
  };

  const handleSelectType = (type: string) => {
    setType(type);
    setForm({...form, category: ''});
  };

  const validateForm = () => {
    // price and category are required
    if (!form.price || !form.category) {
      return false;
    }

    return true;
  };

  const handleNavigateBack = () => {
    setForm(initState());
    router.navigate('/(tabs)/records');
  };

  const handleSave = () => {
    let dataToSave;
    if (type === 'expense') {
      const {description, date, price} = form;
      dataToSave = {
        id: '',
        description,
        date: formatDate(date, 'yyyy-MM-dd'),
        price: +price,
        categoryId:
          expenseCategories.find((cat) => cat.name === form.category)?.id || 0,
      };

      dataToSave = _.omitBy(dataToSave, (v) => typeof v === 'string' && !v);
    } else {
      dataToSave = {
        id: '',
        date: formatDate(form.date, 'yyyy-MM-dd'),
        price: +form.price,
        source: form.category,
        vat: 0,
      };
      dataToSave = _.omitBy(dataToSave, (v) => typeof v === 'string' && !v);
    }
    dispatch(
      type === 'expense' ? uploadExpense(dataToSave) : uploadIncome(dataToSave),
    )
      .unwrap()
      .then(() => {
        setForm(initState());
        router.navigate('/(tabs)/records');
      });
  };

  return (
    <View style={{flex: 1, padding: sizes.lg}}>
      <View style={{flex: 1}}>
        <TextInput
          style={styles.input}
          label={'Opis'}
          onChangeText={(text) => setForm({...form, description: text})}
          value={form.description}
        />

        <View style={[styles.input, {padding: 0, marginVertical: 24}]}>
          <DatePicker
            label="Wybierz Datę"
            onChange={(date) => date && setForm({...form, date})}
            value={form.date}
          />
        </View>

        <TextInput
          style={styles.input}
          label="Cena"
          keyboardType="numeric"
          onChangeText={(text) => setForm({...form, price: text})}
          value={form.price}
        />

        <SelectRadioButtons
          items={[
            {label: 'Wydatek', value: 'expense'},
            {label: 'Przychód', value: 'income'},
          ]}
          onSelect={handleSelectType}
          selected={type}
        />

        <Select
          items={itemsToSelect}
          onChange={handleSelectCategory}
          value={
            type === 'income'
              ? form.category
              : expenseCategories.find((cat) => cat.name === form.category)
                  ?.name
          }
        />
      </View>
      <View style={styles.buttons}>
        <ButtonWithStatus onPress={handleNavigateBack}>
          Przerwj
        </ButtonWithStatus>
        <ButtonWithStatus
          showLoading
          mode="contained"
          disabled={!validateForm()}
          onPress={handleSave}>
          Dodaj
        </ButtonWithStatus>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    marginVertical: 8,
    padding: 8,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  radioButtons: {
    marginVertical: 16,
    flexDirection: 'row',
  },
  radioButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
});
