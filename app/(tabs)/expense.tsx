import {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet, Image, TextInput, ScrollView} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {router, useFocusEffect, useLocalSearchParams} from 'expo-router';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Text, Button} from 'react-native-paper';

import {selectExpense} from '@/redux/main/mainSlice';
import {uploadExpense} from '@/redux/main/thunks';
import _ from 'lodash';
import {format} from 'date-fns';

interface Expense {
  id?: string;
  description?: string;
  date?: string;
  price?: string;
  categoryId?: string;
  image?: string;
}

const initState = (expense: Expense) => ({
  id: '',
  description: '',
  date: format(new Date(), 'yyyy-MM-dd'),
  price: '',
  categoryId: '',
  image: '',
  ...expense,
});

const Expense = () => {
  const dispatch = useDispatch();
  const param = useLocalSearchParams();
  const expense = useSelector(selectExpense(param.id)) || {};

  // State for edit mode and editing fields
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedExpense, setEditedExpense] = useState(initState(expense));

  useFocusEffect(
    useCallback(() => {
      console.log('fopcus', param.id)
      setIsEditMode(param.id ? false : true);
    }, [param.id]),
  );

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
          <Text style={styles.label}>Opis:</Text>
          {isEditMode ? (
            <TextInput
              style={styles.input}
              value={editedExpense.description}
              onChangeText={(text) =>
                setEditedExpense({...editedExpense, description: text})
              }
            />
          ) : (
            <Text style={styles.value}>{expense.description}</Text>
          )}

          <Text style={styles.label}>Cena:</Text>
          {isEditMode ? (
            <TextInput
              style={styles.input}
              value={String(editedExpense.price)}
              keyboardType="numeric"
              onChangeText={(text) =>
                setEditedExpense({...editedExpense, price: parseFloat(text)})
              }
            />
          ) : (
            <Text style={styles.value}>{expense.price} zł</Text>
          )}

          <Text style={styles.label}>Data:</Text>
          {isEditMode ? (
            <TextInput
              style={styles.input}
              value={editedExpense.date}
              onChangeText={(text) =>
                setEditedExpense({...editedExpense, date: text})
              }
            />
          ) : (
            <Text style={styles.value}>{expense.date}</Text>
          )}

          <Text style={styles.label}>Właściciel:</Text>
          {isEditMode ? (
            <TextInput
              style={styles.input}
              value={editedExpense.owner}
              onChangeText={(text) =>
                setEditedExpense({...editedExpense, owner: text})
              }
            />
          ) : (
            <Text style={styles.value}>{expense.owner}</Text>
          )}

          <Text style={styles.label}>Kategoria:</Text>
          {isEditMode ? (
            <TextInput
              style={styles.input}
              value={editedExpense.category}
              onChangeText={(text) =>
                setEditedExpense({...editedExpense, category: text})
              }
            />
          ) : (
            <Text
              style={{
                ...styles.value,
                backgroundColor: `#${expense.catColor}`,
              }}>
              {expense.category || 'brak'}
            </Text>
          )}

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

export default Expense;
