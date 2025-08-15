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
import {Button, IconButton} from 'react-native-paper';

import {
  ButtonWithStatus,
  DatePicker,
  PriceAndCategory,
  Select,
  TextInput,
} from '@/components';
import {SelectRadioButtons} from '@/components/addnew/SelectRadioButtons';
import {RemainingAmountDisplay} from '@/components/addnew/RemainingAmountDisplay';
import {sizes} from '@/constants/theme';
import {
  deleteExpense,
  deleteIncome,
  uploadExpense,
  uploadIncome,
} from '@/redux/main/thunks';
import {useAppDispatch, useAppSelector} from '@/hooks';
import {
  selectCategoriesByUsage,
  selectExpense,
  selectIncome,
  selectSources,
} from '@/redux/main/selectors';

const initState = (date = new Date()) => ({
  description: '',
  date,
  price: '',
  category: '',
});

const initSplitItem = () => ({
  price: '',
  category: '',
  description: '',
});

export default function AddNew() {
  const expenseCategories = useAppSelector(selectCategoriesByUsage);
  const incomeCategories = useAppSelector(selectSources) || [];
  const {id, type: incomingType = ''} = useLocalSearchParams();
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  const [type, setType] = useState<string>('expense');
  const [newCustomIncome, setNewCustomIncome] = useState<string | null>(null);
  const [isSplit, setIsSplit] = useState<boolean>(false);
  const [splitItems, setSplitItems] = useState<
    Array<{price: string; category: string; description: string}>
  >([initSplitItem(), initSplitItem()]);

  const focusRef = useRef<any>(null);
  const dirty = useRef({});
  const buttonRef = useRef<HTMLButtonElement>(null);

  const isPasRecord = isNaN(+id) ? false : true;

  // logic when editing an existing record
  const record = useAppSelector(state =>
    incomingType === 'expense'
      ? selectExpense(+id)(state)
      : selectIncome(+id)(state),
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
    setIsSplit(false);
    setSplitItems([initSplitItem(), initSplitItem()]);
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
        category: 'source' in record ? record.source : record.category || '',
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
      ? expenseCategories.map(cat => ({label: cat.name, value: cat.name}))
      : incomeCategories
          .map((item: string) => ({label: item, value: item}))
          .sort((a, b) => a.label.localeCompare(b.label));

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
    setIsSplit(false);
    setSplitItems([initSplitItem(), initSplitItem()]);
  };

  const handleSplitToggle = () => {
    if (!isSplit && form.price) {
      const totalPrice = parseFloat(form.price);
      const halfPrice = (totalPrice / 2).toString();
      setSplitItems([
        {price: halfPrice, category: form.category},
        {price: halfPrice, category: ''},
      ]);
    }
    setIsSplit(!isSplit);
  };

  const updateSplitItem = (
    index: number,
    field: 'price' | 'category' | 'description',
    value: string,
  ) => {
    const newSplitItems = [...splitItems];
    newSplitItems[index] = {...newSplitItems[index], [field]: value};
    setSplitItems(newSplitItems);
  };

  const addSplitItem = () => {
    setSplitItems([...splitItems, initSplitItem()]);
  };

  const removeSplitItem = (index: number) => {
    if (splitItems.length > 2) {
      setSplitItems(splitItems.filter((_, i) => i !== index));
    }
  };

  const validateForm = () => {
    if (isSplit && type === 'expense') {
      // For split items, validate each split item has price and category
      const hasValidItems = splitItems.every(
        item => item.price && item.category,
      );
      // Check if all money is allocated (no remaining amount)
      const totalSplitPrice = splitItems.reduce(
        (sum, item) => sum + (+item.price || 0),
        0,
      );
      const remainingAmount = (+form.price || 0) - totalSplitPrice;
      return hasValidItems && remainingAmount === 0;
    }

    // For non-split items, price and category are required
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

  const handleSave = async () => {
    console.log(type, isSplit);
    if (type === 'expense' && isSplit) {
      // Handle split expenses - save multiple expenses
      const savePromises = splitItems.map(item => {
        const dataToSave = {
          id: '',
          date: formatDate(form.date, 'yyyy-MM-dd'),
          price: +item.price,
          categoryId:
            expenseCategories.find(cat => cat.name === item.category)?.id || 0,
        };
        if (item.description) dataToSave.description = item.description;
        return dispatch(uploadExpense(dataToSave)).unwrap();
      });

      try {
        await Promise.all(savePromises);
        setForm(initState());
        setIsSplit(false);
        setSplitItems([initSplitItem(), initSplitItem()]);
        router.navigate('/(tabs)/records');
      } catch (error) {
        console.error('Error saving split expenses:', error);
      }
    } else {
      // Handle single expense or income
      let dataToSave;
      if (type === 'expense') {
        const {description, date, price} = form;
        dataToSave = {
          id: id ? +id : '',
          description,
          date: formatDate(date, 'yyyy-MM-dd'),
          price: +price,
          categoryId:
            expenseCategories.find(cat => cat.name === form.category)?.id || 0,
        };

        dataToSave = _.omitBy(dataToSave, v => typeof v === 'string' && !v);
      } else {
        dataToSave = {
          id: id ? +id : '',
          date: formatDate(form.date, 'yyyy-MM-dd'),
          price: +form.price,
          source: form.category,
          vat: 0,
        };
        dataToSave = _.omitBy(dataToSave, v => typeof v === 'string' && !v);
      }
      dispatch(
        type === 'expense'
          ? uploadExpense(dataToSave)
          : uploadIncome(dataToSave),
      )
        .unwrap()
        .then(() => {
          setForm(initState());
          router.navigate('/(tabs)/records');
        });
    }
  };

  const handleDelete = () => {
    Alert.alert('Potwierdź usunięcie', 'Czy na pewno chcesz usunąć ten wpis?', [
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
    ]);
  };

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flexGrow: 1,
          padding: sizes.lg,
        }}
      >
        <View style={{flex: 1}}>
          {!isSplit && (
            <TextInput
              style={styles.input}
              label={'Opis'}
              onChangeText={text => setForm({...form, description: text})}
              value={form.description}
            />
          )}

          <View style={[styles.input, {padding: 0, marginVertical: 24}]}>
            <DatePicker
              label="Wybierz Datę"
              onChange={date => date && setForm({...form, date})}
              value={form.date}
            />
          </View>

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
              onSelect={value => {
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
              onChangeText={text => setForm({...form, category: text})}
              value={form.category}
            />
          )}

          {(type === 'expense' || type === 'income') && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <TextInput
                ref={focusRef}
                label="Cena"
                style={{flex: 2}}
                keyboardType="numeric"
                disabled={isSplit}
                onChangeText={text => setForm({...form, price: text})}
                value={form.price}
              />
              {type === 'expense' && (
                <IconButton
                  icon={isSplit ? 'call-merge' : 'call-split'}
                  onPress={handleSplitToggle}
                  disabled={!form.price && !isSplit}
                  size={20}
                  style={{margin: 0, padding: 0, width: 60}}
                />
              )}
            </View>
          )}

          {!isSplit && (
            <View style={styles.splitIconRow}>
              {(type === 'expense' ||
                (type === 'income' && newCustomIncome === null)) && (
                <View style={{flex: 1}}>
                  <Select
                    items={itemsToSelect}
                    onChange={handleSelectCategory}
                    style={{root: {marginTop: 4}}}
                    value={
                      type === 'income'
                        ? form.category
                        : expenseCategories.find(
                            cat => cat.name === form.category,
                          )?.name
                    }
                  />
                </View>
              )}
            </View>
          )}

          {isSplit && type === 'expense' && (
            <View style={styles.splitContainer}>
              <RemainingAmountDisplay
                totalPrice={form.price}
                splitItems={splitItems}
              />
              {splitItems.map((item, index) => (
                <PriceAndCategory
                  key={index}
                  item={item}
                  index={index}
                  expenseCategories={expenseCategories}
                  onUpdateItem={updateSplitItem}
                  onRemoveItem={removeSplitItem}
                  canRemove={splitItems.length > 2}
                />
              ))}
              <Button
                mode="text"
                onPress={addSplitItem}
                style={{marginTop: 8}}
                icon="plus"
              >
                Dodaj pozycję
              </Button>
            </View>
          )}
        </View>
        <View>
          {+id ? (
            <ButtonWithStatus textColor="red" onPress={handleDelete}>
              Usuń
            </ButtonWithStatus>
          ) : null}
          <ButtonWithStatus onPress={handleNavigateBack}>
            Przerwij
          </ButtonWithStatus>
          <ButtonWithStatus
            ref={buttonRef}
            showLoading
            mode="contained"
            disabled={!validateForm() || isDataTheSame()}
            onPress={handleSave}
          >
            {isPasRecord ? 'Zapisz zmiany' : 'Zapisz'}
          </ButtonWithStatus>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
  },
  input: {
    marginVertical: sizes.lg,
    padding: sizes.lg,
  },
  splitContainer: {
    marginVertical: sizes.lg,
    padding: sizes.md,
    // backgroundColor: '#f5f5f5',
    borderRadius: sizes.lg,
  },
  splitIconRow: {
    marginVertical: sizes.lg,
  },
  splitCancelSection: {
    marginVertical: sizes.lg,
    alignItems: 'center',
  },
});
