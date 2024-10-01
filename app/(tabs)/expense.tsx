import {useCallback, useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Image, ScrollView} from 'react-native';
import {router, useFocusEffect, useLocalSearchParams} from 'expo-router';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Text, Button} from 'react-native-paper';

import _ from 'lodash';
import {format} from 'date-fns';

import {selectExpense} from '@/redux/main/selectors';
import {uploadExpense} from '@/redux/main/thunks';
import {useAppDispatch, useAppSelector} from '@/hooks';
import {TextInput} from '@/components';

interface Expense {
  id?: string;
  description?: string;
  date?: string;
  price?: string;
  categoryId?: string;
  category: string;
  image?: string;
  owner: string;
}

const initState = (expense?: Expense) => ({
  id: '',
  description: '',
  date: format(new Date(), 'yyyy-MM-dd'),
  price: '',
  categoryId: '',
  image: '',
  ...expense,
});

const Expense = () => {
  const dispatch = useAppDispatch();
  const param = useLocalSearchParams();
  const expense = useAppSelector(selectExpense(param.id)) || {};

  // State for edit mode and editing fields
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedExpense, setEditedExpense] = useState(initState(expense));

  const focusElem = useRef<any>();

  useFocusEffect(
    useCallback(() => {
      console.log('focus expense', param.id);
      setIsEditMode(param.id ? false : true);
      setEditedExpense(initState(expense));

      return () => {
        console.log('lost focus expense');
        setEditedExpense(initState());
      };
    }, [param.id]),
  );

  useEffect(() => {
    if (!isEditMode) return;
    if (focusElem.current) focusElem.current.focus();
    console.log('works')
  }, [editedExpense, editedExpense, param.id]);

  // Placeholder image if no image is provided
  const imagePlaceholder = 'https://via.placeholder.com/150';

  // Toggle between edit and view modes
  const handleEdit = () => {
    setEditedExpense({...expense});
    setIsEditMode(true);
  };

  const handleSave = () => {
    const newD = _.chain(editedExpense)
      .pick(['date', 'description', 'categoryId', 'price', 'image'])
      .omitBy(editedExpense, (d) => !d || d === 'undefined')
      .value();

    newD.date = newD.date.split('/').reverse().join('-');
    newD.image = newD.image ? newD.image : '';

    dispatch(
      uploadExpense({
        id: param.id,
        ...newD,
      }),
    );
    setIsEditMode(false);
  };

  const handleCancel = () => {
    setEditedExpense({...expense}); // Revert changes
    setIsEditMode(false);
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
            innerRef={focusElem}
            keyboardType="numeric"
            onChangeText={(text) =>
              setEditedExpense({...editedExpense, price: parseFloat(text)})
            }
          />
          <TextInput
            style={styles.input}
            label="Wybierz datę"
            readOnly={!isEditMode}
            value={editedExpense.date}
            onChangeText={(text) =>
              setEditedExpense({...editedExpense, date: text})
            }
          />

          <TextInput
            style={styles.input}
            label="Kto dokonał zakupu"
            readOnly={!isEditMode}
            value={editedExpense.owner}
            onChangeText={(text) =>
              setEditedExpense({...editedExpense, owner: text})
            }
          />

          <TextInput
            style={styles.input}
            label="Kategoria"
            value={editedExpense.category}
            readOnly={!isEditMode}
            onChangeText={(text) =>
              setEditedExpense({...editedExpense, category: text})
            }
          />

          {/* Image (if provided) */}
          {expense.image ? (
            <Image source={{uri: expense.image}} style={styles.image} />
          ) : (
            <Image source={{uri: imagePlaceholder}} style={styles.image} />
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
