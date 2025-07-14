import {useCallback, useEffect, useRef, useState} from 'react';

import _ from 'lodash';
import {
  router,
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from 'expo-router';
import {formatDate} from 'date-fns';
import {View, StyleSheet, ScrollView, SafeAreaView, Alert} from 'react-native';
import {RadioButton} from 'react-native-paper';

import {
  ButtonWithStatus,
  DatePicker,
  Select,
  Text,
  TextInput,
} from '@/components';
import {sizes} from '@/constants/theme';
import {deleteExpense, deleteIncome, uploadExpense, uploadIncome} from '@/redux/main/thunks';
import {useAppDispatch, useAppSelector} from '@/hooks';
import {
  selectCategories,
  selectExpense,
  selectIncome,
  selectSources,
} from '@/redux/main/selectors';

const SelectRadioButtons = ({
  items,
  selected,
  onSelect,
  disabled = false,
}: {
  items: {label: string; value: string}[];
  selected: string;
  disabled?: boolean;
  onSelect: (value: string) => void;
}) => {
  return (
    <View style={styles.radioButtons}>
      {items.map((item) => (
        <View key={item.value} style={styles.radioButton}>
          <Text>{item.label}</Text>
          <RadioButton
            disabled={disabled}
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
  const [newCustomIncome, setNewCustomIncome] = useState<string | null>(null);
  const expenseCategories = useAppSelector(selectCategories);
  const {id, type: incomingType = ''} = useLocalSearchParams();
  const incomeCategories = useAppSelector(selectSources) || [];
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  const focusRef = useRef<HTMLInputElement>(null);
  const dirty = useRef({});
  const buttonRef = useRef<HTMLButtonElement>(null);

  const isPasRecord = isNaN(+id) ? false : true;

  // logic when editing an existing record
  const record = useAppSelector(
    incomingType === 'expense' ? selectExpense(+id) : selectIncome(+id),
  );
  const [form, setForm] = useState(initState());

  const isDataTheSame = () => {
    return _.isEqual(dirty.current, form);
  };

  const cleanState = () => {
    setForm(initState());
    dirty.current = {};
    setNewCustomIncome(null);
    setType('expense');
  };

  useFocusEffect(
    useCallback(() => {
      // set focus
      if (focusRef.current) {
        setTimeout(() => {
          if (!focusRef.current) return;
          focusRef.current.focus();
        }, 0);
      }

      return () => {
        if (focusRef.current) {
          focusRef.current.blur();
        }
      };
    }, []),
  );

  useEffect(() => {
    if (
      incomingType &&
      typeof incomingType === 'string' &&
      incomingType !== 'undefined'
    ) {
      setType(incomingType);
    }
  }, [incomingType]);

  useFocusEffect(
    useCallback(() => {
      if (!record) return;
      const tR = {
        description: record?.description || '',
        date:
          incomingType === 'income'
            ? new Date(record?.date)
            : new Date(record.date.split('/').reverse().join('-')),
        price: record?.price.toString() || '',
        category: record?.category || record?.source || '',
      };
      setForm(tR);
      dirty.current = tR;
    }, [id]),
  );

  useFocusEffect(
    useCallback(() => {
      // clean up params
      const unsubscribe = navigation.addListener('blur', () => {
        navigation.setParams({id: undefined, type: undefined});
        cleanState();
      });

      return unsubscribe;
    }, []),
  );

  const itemsToSelect =
    type === 'expense'
      ? expenseCategories.map((cat) => ({label: cat.name, value: cat.name}))
      : incomeCategories.map((item: string) => ({label: item, value: item}));

  const handleSelectCategory = (category: {label: string; value: string}) => {
    if (category.value === 'Dodaj nową kategorię') {
      console.log('dodaj nową kategorię');
    } else {
      setForm({...form, category: category.value});
      if (!form.price) return focusRef.current?.focus();
      focusRef.current?.blur();
      buttonRef.current?.focus();
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
    dirty.current = {};
    router.navigate('/(tabs)/records');
  };

  const handleSave = () => {
    let dataToSave;
    if (type === 'expense') {
      const {description, date, price} = form;
      dataToSave = {
        id: id ? +id : '',
        description,
        date: formatDate(date, 'yyyy-MM-dd'),
        price: +price,
        categoryId:
          expenseCategories.find((cat) => cat.name === form.category)?.id || 0,
      };

      dataToSave = _.omitBy(dataToSave, (v) => typeof v === 'string' && !v);
    } else {
      dataToSave = {
        id: id ? +id : '',
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

  const handleDelete = () => {
    Alert.alert(
      'Potwierdź usunięcie',
      'Czy na pewno chcesz usunąć ten wpis?',
      [
        {
          text: 'Anuluj',
          style: 'cancel',
        },
        {
          text: 'Usuń',
          style: 'destructive',
          onPress: () => {
            if (type === 'expense') {
              dispatch(deleteExpense(id as string))
                .unwrap()
                .then(() => {
                  router.navigate('/(tabs)/records');
                });
            } else {
              dispatch(deleteIncome(id as string))
                .unwrap()
                .then(() => {
                  router.navigate('/(tabs)/records');
                });
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flexGrow: 1,
          padding: sizes.lg,
        }}>
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
            ref={focusRef}
            style={styles.input}
            label="Cena"
            keyboardType="numeric"
            onChangeText={(text) => setForm({...form, price: text})}
            value={form.price}
          />

          <SelectRadioButtons
            disabled={isPasRecord}
            items={[
              {label: 'Wydatek', value: 'expense'},
              {label: 'Przychód', value: 'income'},
            ]}
            onSelect={handleSelectType}
            selected={type}
          />

          {/* Add new category  selection */}
          {type === 'income' && (
            <SelectRadioButtons
              items={[
                {label: 'Dodaj nową kategorię', value: 'new'},
                {label: 'Wybierz z listy', value: 'list'},
              ]}
              onSelect={(value) => {
                if (value === 'new') {
                  setNewCustomIncome('');
                } else {
                  setNewCustomIncome(null);
                }
                setForm({...form, category: ''});
              }}
              selected={newCustomIncome !== null ? 'new' : 'list'}
            />
          )}

          {/* Add new category  input */}
          {newCustomIncome !== null && (
            <TextInput
              style={styles.input}
              label="Nowy rodzaj wpływu"
              onChangeText={(text) => setForm({...form, category: text})}
              value={form.category}
            />
          )}

          {(type === 'expense' ||
            (type === 'income' && newCustomIncome === null)) && (
            <Select
              items={itemsToSelect.sort((a, b) => a.label.localeCompare(b.label))}
              onChange={handleSelectCategory}
              value={
                type === 'income'
                  ? form.category
                  : expenseCategories.find((cat) => cat.name === form.category)
                      ?.name
              }
            />
          )}

        </View>
        <View style={styles.buttons}>
          {+id ? (<ButtonWithStatus
            textColor="red"
            onPress={handleDelete}>
            Usuń
          </ButtonWithStatus>) : null}
          <ButtonWithStatus onPress={handleNavigateBack}>
            Przerwij
          </ButtonWithStatus>
          <ButtonWithStatus
            ref={buttonRef}
            showLoading
            mode="contained"
            disabled={!validateForm() || isDataTheSame()}
            onPress={handleSave}>
            {isPasRecord ? 'Zapisz zmiany' : 'Zapisz'}
          </ButtonWithStatus>
        </View>
      </ScrollView>
    </SafeAreaView>
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
    // flex: 1,
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
