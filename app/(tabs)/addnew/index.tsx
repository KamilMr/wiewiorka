import {
  ButtonWithStatus,
  DatePicker,
  Select,
  Text,
  TextInput,
} from '@/components';
import { sizes } from '@/constants/theme';
import {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {RadioButton} from 'react-native-paper';

const SelectRadioButtons = ({items, selected, onSelect}) => {
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

  return (
    <View style={{flex: 1, padding: sizes.lg}}>
      <View style={{flex: 1}}>
        <TextInput style={styles.input} label={'Opis'} />

        <View style={[styles.input, {padding: 0, marginVertical: 24}]}>
          <DatePicker label="Wybierz Datę" />
        </View>

        <TextInput style={styles.input} label="Cena" keyboardType="numeric" />

        <SelectRadioButtons
          items={[
            {label: 'Wydatek', value: 'expense'},
            {label: 'Przychód', value: 'income'},
          ]}
          onSelect={setType}
          selected={type}
        />

        <Select
          label="Kategoria"
          items={[{label: 'Kategoria 1', value: '1'}]}
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
