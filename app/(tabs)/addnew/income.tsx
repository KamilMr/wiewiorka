import {useCallback, useState} from 'react';
import {
  router,
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from 'expo-router';
import {View, StyleSheet, ScrollView} from 'react-native';
import {Button, IconButton} from 'react-native-paper';

import {SafeAreaView} from 'react-native-safe-area-context';
import _ from 'lodash';
import {format} from 'date-fns';

import {selectIncome, selectSources} from '@/redux/main/selectors';
import {deleteIncome, uploadIncome} from '@/redux/main/thunks';
import {useAppDispatch, useAppSelector} from '@/hooks';
import {Select, TextInput,Text} from '@/components';
import CustomeDatePicker from '@/components/DatePicker';
import {convertDate} from '@/common';
import { useAppTheme } from '@/constants/theme';

interface Income {
  id?: string;
  description?: string;
  date?: string;
  price?: string;
  source?: string;
  owner?: string;
}

const initState = (income: Income) => ({
  id: '',
  description: '',
  price: '',
  owner: '',
  ...income,
  date: format(new Date(income.date || new Date()), 'dd/MM/yyyy'),
});

const Income = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const param = useLocalSearchParams();
  const income = useAppSelector(selectIncome(param.id)) || {};
  const sources = useAppSelector(selectSources) || [];

  // State for edit mode and editing fields
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedIncome, setEditedIncome] = useState(initState(income));

  const [isNewSource, setIsNewSource] = useState(false);

  const t = useAppTheme();

  // Toggle between edit and view modes
  const handleEdit = () => {
    setEditedIncome({...editedIncome});
    setIsEditMode(true);
  };
  useFocusEffect(
    useCallback(() => {
      setIsEditMode(!Number.isInteger(+param.id));
      setEditedIncome(initState(income));

      return () => {
        setEditedIncome(initState({}));
        setIsEditMode(false);
        setIsNewSource(false);
      };
    }, [param.id]),
  );

  useFocusEffect(
    useCallback(() => {
      const unsubscribe = navigation.addListener('blur', () => {
        navigation.setParams({id: null, screen: undefined});
      });
      return unsubscribe;
    }, [navigation]),
  );

  const handleSave = () => {
    const newD = _.chain(editedIncome)
      .pick(['date', 'source', 'vat', 'price'])
      .omitBy((d) => !d || d === 'undefined')
      .value();

    newD.date = convertDate(newD.date);
    newD.price = +newD.price;

    dispatch(
      uploadIncome({
        id: param.id,
        ...newD,
      }),
    )
      .unwrap()
      .then(() => router.navigate('/records'))
      .catch(() => console.log('coś nie tak'));
    // setIsEditMode(false);
  };

  const handleCancel = () => {
    setEditedIncome(initState(income)); // Revert changes
    setIsEditMode(false);
    if (!param.id || param.id === 'null') {
      router.navigate('/(tabs)/records');
    }
  };

  const handleDate = (date: Date | undefined) => {
    if (!date) return;
    setEditedIncome({
      ...editedIncome,
      date: format(date, 'dd/MM/yyyy'),
    });
  };

  const handleDeleteExpense = () => {
    if (!param.id) return;
    dispatch(deleteIncome({id: param.id}))
      .unwrap()
      .then(() => router.navigate('/(tabs)/records'));
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: t.colors.white}]}>
      <ScrollView keyboardShouldPersistTaps="always">
        {Number.isInteger(param.id * 1) && (
          <IconButton
            icon={'trash-can'}
            style={{
              alignSelf: 'flex-end',
            }}
            onPress={handleDeleteExpense}
          />
        )}
        <View style={styles.detailsContainer}>
          {isEditMode ? (
            <TextInput
              style={styles.input}
              label="Opis"
              value={editedIncome.description}
              onChangeText={(text) =>
                setEditedIncome({...editedIncome, description: text})
              }
            />
          ) : (
            <Text style={styles.value}>{income.description}</Text>
          )}

          {isEditMode ? (
            <CustomeDatePicker
              editable={!isEditMode}
              label="Wybierz datę"
              disabled={!isEditMode}
              value={new Date(editedIncome.date.split('/').reverse().join('-'))}
              onChange={handleDate}
            />
          ) : (
            <Text style={styles.value}>{income.date}</Text>
          )}

          {isEditMode ? null : (
            <>
              <Text style={styles.label}>Zarobił</Text>
              <Text style={styles.value}>{income.owner}</Text>
            </>
          )}

          {isEditMode ? (
            <TextInput
              style={styles.input}
              label={'Kwota'}
              value={String(editedIncome.price)}
              autoFocus={true}
              keyboardType="numeric"
              onChangeText={(text) =>
                setEditedIncome({
                  ...editedIncome,
                  price: text.replace(',', '.'),
                })
              }
            />
          ) : (
            <Text style={styles.value}>{income.price} zł</Text>
          )}

          {isEditMode && !isNewSource ? (
            <Select
              value={editedIncome.source}
              onChange={({value}) => {
                if (value === 'Dodaj nowe źródło') return setIsNewSource(true);
                setEditedIncome({...editedIncome, source: value});
              }}
              items={sources
                .concat(['Dodaj nowe źródło'])
                .map((s: string) => ({label: s, value: s}))}
            />
          ) : (
            <TextInput
              style={styles.input}
              value={editedIncome.source}
              onChangeText={(txt) => {
                setEditedIncome({...editedIncome, source: txt});
              }}
            />
          )}
        </View>

        {/* Buttons for Edit, Save, Cancel */}
        <View style={styles.buttonContainer}>
          {isEditMode ? (
            <>
              <Button
                mode="contained"
                onPress={handleSave}
                style={styles.button}>
                Zapisz
              </Button>
              <Button
                mode="outlined"
                onPress={handleCancel}
                style={styles.button}>
                Stop
              </Button>
            </>
          ) : (
            <>
              <Button
                mode="contained"
                onPress={handleEdit}
                style={styles.button}>
                Edytuj
              </Button>
              <Button
                mode="outlined"
                onPress={() => {
                  router.navigate('/(tabs)/records');
                }}
                style={styles.button}>
                Zamknij
              </Button>
            </>
          )}
        </View>
        <View style={{height: 60}} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between', // Ensure buttons stay at the bottom
    padding: 16,
  },
  detailsContainer: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
  },
  value: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 4,
    marginBottom: 12,
  },
  image: {
    width: '100%',
    height: 200,
    marginTop: 16,
    borderRadius: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
});

export default Income;
