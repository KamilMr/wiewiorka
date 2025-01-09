import {useCallback, useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {
  Link,
  router,
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from 'expo-router';
import {SafeAreaView} from 'react-native-safe-area-context';
import {IconButton} from 'react-native-paper';

import _ from 'lodash';
import {format} from 'date-fns';

import {selectCategories, selectExpense} from '@/redux/main/selectors';
import {deleteExpense, uploadExpense} from '@/redux/main/thunks';
import {useAppDispatch, useAppSelector} from '@/hooks';
import {
  ButtonWithStatus as Button,
  Image,
  Select,
  TextInput,
} from '@/components';
import CustomDatePicker from '@/components/DatePicker';
import {useAppTheme} from '@/constants/theme';

interface Expense {
  id: string;
  description: string;
  date: string;
  price: string;
  categoryId: number;
  category: string;
  image: string;
  owner: string;
}

const initState = (expense?: Expense) => ({
  id: '',
  description: '',
  price: '',
  owner: '',
  categoryId: '',
  image: '',
  ...expense,
  date: format(new Date(), 'dd/MM/yyyy'),
});

const validateInput = (ob: Pick<Expense, 'date' | 'categoryId' | 'price'>) => {
  if (ob.date && ob.price && ob.categoryId) return true;
  return false;
};

const Expense = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const {id} = useLocalSearchParams();
  const expense = useAppSelector(selectExpense(+id)) || initState();
  const categories = useAppSelector(selectCategories);

  // State for edit mode and editing fields
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedExpense, setEditedExpense] = useState(initState(expense));

  const isValid = validateInput(editedExpense);

  const t = useAppTheme();

  useFocusEffect(
    useCallback(() => {
      setIsEditMode(!Number.isInteger(+id));
      setEditedExpense(initState(expense));

      return () => {
        setEditedExpense(initState());
        setIsEditMode(false);
      };
    }, [id]),
  );

  useFocusEffect(
    useCallback(() => {
      const unsubscribe = navigation.addListener('blur', () => {
        navigation.setParams({id: undefined, screen: undefined});
      });
      return unsubscribe;
    }, [navigation]),
  );

  // Toggle between edit and view modes
  const handleEdit = () => {
    setEditedExpense({...expense});
    setIsEditMode(true);
  };

  const handleSave = () => {
    const newD = _.chain(editedExpense)
      .pick(['date', 'description', 'categoryId', 'price', 'image'])
      .omitBy((d) => !d || d === 'undefined')
      .value();

    if (newD.date) {
      try {
        const [day, month, year] = newD.date.split('/');
        const parsedDate = new Date(+year, +month - 1, +day);
        if (isNaN(parsedDate.getTime())) {
          throw new Error('Invalid date');
        }
        newD.date = format(parsedDate, 'yyyy-MM-dd');
      } catch (error) {
        console.error('Invalid date format:', error);
        // Handle the error (e.g., show an error message to the user)
        return;
      }
    }
    newD.image = newD.image ? newD.image : '';

    dispatch(
      uploadExpense({
        id: Number.isInteger(id * 1) ? id : '',
        ...newD,
      }),
    )
      .unwrap()
      .then(() => {
        setIsEditMode(false);
        router.navigate('/(tabs)/records');
      });
  };

  const handleCancel = () => {
    setEditedExpense({...expense}); // Revert changes

    setIsEditMode(false);
    if (!id || id === 'null') router.navigate('/(tabs)/records');
  };

  const handleDate = (date: Date | undefined) => {
    if (!date) return;
    setEditedExpense({
      ...editedExpense,
      date: format(date, 'dd/MM/yyyy'),
    });
  };

  const handleSelectCategory = (cat: {value: string} | undefined) => {
    if (!cat) return;
    setEditedExpense({
      ...editedExpense,
      categoryId: categories.find((c) => c.name === cat.value)?.id,
    });
  };

  const handleImageSave = (url: string) => {
    setEditedExpense({...editedExpense, image: url});
  };

  const handleDeleteExpense = () => {
    if (!id) return;
    dispatch(deleteExpense({id}))
      .unwrap()
      .then(() => router.navigate('/(tabs)/records'));
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: t.colors.white}]}>
      <ScrollView keyboardShouldPersistTaps="always">
        <View>
          {Number.isInteger(id * 1) && (
            <IconButton
              icon={'trash-can'}
              style={{
                alignSelf: 'flex-end',
              }}
              onPress={handleDeleteExpense}
            />
          )}
          <TextInput
            style={styles.input}
            value={editedExpense.description}
            label="Opis"
            readOnly={!isEditMode}
            onChangeText={(text: string) =>
              setEditedExpense({...editedExpense, description: text})
            }
          />
          <CustomDatePicker
            editable={!isEditMode}
            label="Wybierz datę"
            disabled={!isEditMode}
            style={styles.input}
            value={new Date(editedExpense.date.split('/').reverse().join('-'))}
            onChange={handleDate}
          />
          <TextInput
            style={styles.input}
            value={String(editedExpense.price)}
            label="Cena"
            readOnly={!isEditMode}
            autoFocus={true}
            keyboardType="numeric"
            onChangeText={(text) =>
              setEditedExpense({
                ...editedExpense,
                price: text.replace(',', '.'),
              })
            }
          />

          {isEditMode ? null : (
            <TextInput
              style={styles.input}
              label="Kto dokonał zakupu"
              readOnly={true}
              disabled={true}
              value={editedExpense.owner}
              onChangeText={(text) =>
                setEditedExpense({...editedExpense, owner: text})
              }
            />
          )}

          <Select
            value={
              categories.find(({id}) => id === editedExpense.categoryId)
                ?.name || ''
            }
            title="Wybierz kategorię"
            onChange={handleSelectCategory}
            disable={!isEditMode}
            items={categories.map((cat) => ({
              label: cat.name,
              value: cat.name,
            }))}
          />
          {/*
          <Image
            imageSrc={editedExpense.image}
            editable={isEditMode}
            onChange={handleImageSave}
          />

          */}
        </View>

        {/* Buttons for Edit, Save, Cancel */}
        <View style={styles.buttonContainer}>
          {isEditMode ? (
            <>
              <Button
                mode="contained"
                onPress={handleSave}
                disabled={!isValid}
                showLoading
                style={styles.button}>
                Zapisz
              </Button>
              <Button
                mode="outlined"
                onPress={handleCancel}
                style={styles.button}>
                Przerwij
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
        <View style={{height: 80}} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between', // Ensure buttons stay at the bottom
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

// export default Expense;
