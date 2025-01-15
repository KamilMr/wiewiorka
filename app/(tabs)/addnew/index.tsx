import React from 'react';
import {
  ButtonWithStatus,
  DatePicker,
  Select,
  Text,
  TextInput,
} from '@/components';
import {sizes} from '@/constants/theme';
import {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {RadioButton} from 'react-native-paper';
import {useAppSelector} from '@/hooks';
import {selectCategories, selectSources} from '@/redux/main/selectors';
import { set } from 'lodash';

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

export default function AddNew() {
  const [type, setType] = useState('expense');
  const expenseCategories = useAppSelector(selectCategories);
  const incomeCategories = useAppSelector(selectSources) || [];

  const [form, setForm] = useState({
    description: '',
    date: new Date(),
    price: '',
    category: '',
  });

  console.log('form', form);

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
          onSelect={setType}
          selected={type}
        />

        <Select
          items={itemsToSelect}
          onChange={handleSelectCategory}
          value={type === 'income' ? form.category : expenseCategories.find((cat) => cat.name === form.category)?.name}
        />
      </View>
      <View style={styles.buttons}>
        <ButtonWithStatus>Przerwj</ButtonWithStatus>
        <ButtonWithStatus showLoading mode="contained">
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
