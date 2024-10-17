import {useCallback, useRef, useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {Link, router, useFocusEffect, useLocalSearchParams, useNavigation} from 'expo-router';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button} from 'react-native-paper';

import _ from 'lodash';
import {format} from 'date-fns';

import {selectCategories, selectExpense} from '@/redux/main/selectors';
import {uploadExpense} from '@/redux/main/thunks';
import {useAppDispatch, useAppSelector} from '@/hooks';
import {Select, TextInput, Image} from '@/components';
import CustomeDatePicker from '@/components/DatePicker';
import {selectMe} from '@/redux/auth/authSlice';

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
  date: format(new Date(), 'dd/MM/yyyy'),
  price: '',
  owner: '',
  categoryId: '',
  image: '',
  ...expense,
});

const Expense = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const {id} = useLocalSearchParams();
  const expense = useAppSelector(selectExpense(+id)) || initState();
  const categories = useAppSelector(selectCategories);
  const user = useAppSelector(selectMe);

  // State for edit mode and editing fields
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedExpense, setEditedExpense] = useState(initState(expense));

  const focusElem = useRef<any>();

  useFocusEffect(
    useCallback(() => {
      console.log('focus expense', id);
      setIsEditMode(!Number.isInteger(+id));
      setEditedExpense(initState(expense));

      return () => {
        console.log('lost focus expense');
        setEditedExpense(initState());
        setIsEditMode(false);
        navigation.setParams({id: ''});
      };
    }, [id]),
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
        id: id,
        ...newD,
      }),
    );
    setIsEditMode(false);
  };

  const handleCancel = () => {
    setEditedExpense({...expense}); // Revert changes
    setIsEditMode(false);
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.detailsContainer}>
          <TextInput
            style={styles.input}
            value={editedExpense.description}
            label="Opis"
            readOnly={!isEditMode}
            onChangeText={(text: string) =>
              setEditedExpense({...editedExpense, description: text})
            }
          />
          <TextInput
            style={styles.input}
            value={String(editedExpense.price)}
            label="Cena"
            readOnly={!isEditMode}
            autoFocus={true}
            keyboardType="numeric"
            onChangeText={(text) =>
              setEditedExpense({...editedExpense, price: parseFloat(text)})
            }
          />
          <CustomeDatePicker
            editable={!isEditMode}
            label="Wybierz datę"
            disabled={!isEditMode}
            style={styles.input}
            value={new Date(editedExpense.date.split('/').reverse().join('-'))}
            onChange={handleDate}
          />

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
          <Image
            imageSrc={editedExpense.image}
            editable={isEditMode}
            onChange={handleImageSave}
          />
        </View>

        {/* Buttons for Edit, Save, Cancel */}
        <View style={styles.buttonContainer}>
          {isEditMode ? (
            <>
              <Button
                mode="contained"
                onPress={handleSave}
                style={styles.button}>
                Save
              </Button>
              <Button
                mode="outlined"
                onPress={handleCancel}
                style={styles.button}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                mode="contained"
                onPress={handleEdit}
                style={styles.button}>
                Edit
              </Button>
              <Button
                mode="outlined"
                onPress={() => {
                  router.navigate('/(tabs)/records');
                }}
                style={styles.button}>
                Close
              </Button>
            </>
          )}
        </View>
        <View style={{height: 60}}/>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between', // Ensure buttons stay at the bottom
    padding: 12,
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

export default Expense;
