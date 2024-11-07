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
import {Button, IconButton} from 'react-native-paper';

import _ from 'lodash';
import {format} from 'date-fns';

import {selectCategories, selectExpense} from '@/redux/main/selectors';
import {deleteExpense, uploadExpense} from '@/redux/main/thunks';
import {useAppDispatch, useAppSelector} from '@/hooks';
import {Select, TextInput, Image, Text, ViewWithText} from '@/components';
import CustomeDatePicker from '@/components/DatePicker';
import {sizes, useAppTheme} from '@/constants/theme';

interface Expense {
  id: string;
  description: string;
  date: string;
  price: string;
  categoryId: string;
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

  const [isLoading, setIsLoading] = useState(false);
  const isValid = validateInput(editedExpense);
  const isEmpty =
    !editedExpense.date && !editedExpense.price && !editedExpense.categoryId;

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
    if (isLoading) return;
    setIsLoading(true);
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
        setIsLoading(false);
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
      categoryId: categories.find((c) => c.category === cat.value).catId,
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
        {Number.isInteger(id * 1) && (
          <IconButton
            icon={'trash-can'}
            style={{
              alignSelf: 'flex-end',
            }}
            onPress={handleDeleteExpense}
          />
        )}
        {isEditMode ? (
          <TextInput
            style={{marginBottom: sizes.xl}}
            value={editedExpense.description}
            label="Opis"
            readOnly={!isEditMode}
            onChangeText={(text: string) =>
              setEditedExpense({...editedExpense, description: text})
            }
          />
        ) : (
          <ViewWithText
            label="Opis"
            txt={editedExpense.description || 'brak'}
          />
        )}
        {isEditMode ? (
          <CustomeDatePicker
            editable={!isEditMode}
            label="Wybierz datę"
            disabled={!isEditMode}
            style={{marginBottom: sizes.lg}}
            value={new Date(editedExpense.date.split('/').reverse().join('-'))}
            onChange={handleDate}
          />
        ) : (
          <ViewWithText label="Data" txt={editedExpense.date} />
        )}
        {isEditMode ? (
          <TextInput
            style={{marginBottom: sizes.xl}}
            value={String(editedExpense.price)}
            label="Cena"
            autoFocus={isEditMode}
            readOnly={!isEditMode}
            keyboardType="numeric"
            onChangeText={(text) =>
              setEditedExpense({
                ...editedExpense,
                price: text.replace(',', '.'),
              })
            }
          />
        ) : (
          <ViewWithText label="Cena" txt={editedExpense.price} />
        )}

        {editedExpense.owner ? (
          <ViewWithText label="Kto?" txt={editedExpense.owner} />
        ) : null}

        {isEditMode ? (
          <Select
            value={
              categories.find(({catId}) => catId === editedExpense.categoryId)
                ?.category || ''
            }
            title="Wybierz kategorię"
            onChange={handleSelectCategory}
            disable={!isEditMode}
            items={categories.map((cat) => ({
              label: cat.category,
              value: cat.category,
            }))}
          />
        ) : (
          <ViewWithText
            label="Kategoria"
            txt={
              categories.find(({catId}) => catId === editedExpense.categoryId)
                ?.category || ''
            }
          />
        )}
        <Image
          imageSrc={editedExpense.image}
          editable={isEditMode}
          onChange={handleImageSave}
        />

        {/* Buttons for Edit, Save, Cancel */}
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={isEditMode ? handleSave : handleEdit}
            loading={isLoading}
            disabled={!isValid && !isEmpty}
            style={styles.button}>
            {isEditMode ? 'Zapisz' : 'Edytuj'}
          </Button>
          <Button
            mode="outlined"
            onPress={
              isEditMode && Number.isInteger(+id)
                ? handleCancel
                : () => {
                    router.navigate('/(tabs)/records');
                  }
            }
            style={styles.button}>
            {isEditMode ? 'Przerwij' : 'Zakończ'}
          </Button>
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

export default Expense;
/*
 *
 *<View
            style={{
              marginHorizontal: sizes.xl,
              padding: sizes.lg,
              borderRadius: 4,
                height: 60,
              marginBottom: sizes.xl,
              backgroundColor: t.colors.softLavender,
            }}>
            <Text>{String(editedExpense.price)}</Text>
          </View>
 *
 * */
