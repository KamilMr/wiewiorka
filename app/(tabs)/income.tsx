import {useState} from 'react';
import {router, useLocalSearchParams} from 'expo-router';
import {View, StyleSheet} from 'react-native';
import {Text, Button} from 'react-native-paper';

import {SafeAreaView} from 'react-native-safe-area-context';
import _ from 'lodash';
import {format} from 'date-fns';

import {selectIncome} from '@/redux/main/selectors';
import {uploadIncome} from '@/redux/main/thunks';
import {useAppDispatch, useAppSelector} from '@/hooks';
import {TextInput} from '@/components';

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
  const param = useLocalSearchParams();
  const income = useAppSelector(selectIncome(param.id)) || {};

  // State for edit mode and editing fields
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedIncome, setEditedIncome] = useState(initState(income));

  // Toggle between edit and view modes
  const handleEdit = () => {
    setEditedIncome({...income});
    setIsEditMode(true);
  };

  const handleSave = () => {
    const newD = _.chain(editedIncome)
      .pick(['date', 'source', 'vat', 'price'])
      .omitBy(editedIncome, (d) => !d || d === 'undefined')
      .value();

    newD.date = newD.date.split('/').reverse().join('-');
    newD.price = +newD.price;

    dispatch(
      uploadIncome({
        id: param.id,
        ...newD,
      }),
    );
    setIsEditMode(false);
  };

  const handleCancel = () => {
    setEditedIncome({...income}); // Revert changes
    setIsEditMode(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.detailsContainer}>
        <Text style={styles.label}>Opis:</Text>
        {isEditMode ? (
          <TextInput
            style={styles.input}
            value={editedIncome.description}
            onChangeText={(text) =>
              setEditedIncome({...editedIncome, description: text})
            }
          />
        ) : (
          <Text style={styles.value}>{income.description}</Text>
        )}

        <Text style={styles.label}>Kwota:</Text>
        {isEditMode ? (
          <TextInput
            style={styles.input}
            value={String(editedIncome.price)}
            keyboardType="numeric"
            onChangeText={(text) =>
              setEditedIncome({...editedIncome, price: text})
            }
          />
        ) : (
          <Text style={styles.value}>{income.price} zł</Text>
        )}

        <Text style={styles.label}>Date:</Text>
        {isEditMode ? (
          <TextInput
            style={styles.input}
            value={editedIncome.date}
            onChangeText={(text) =>
              setEditedIncome({...editedIncome, date: text})
            }
          />
        ) : (
          <Text style={styles.value}>{income.date}</Text>
        )}

        <Text style={styles.label}>Dostawca:</Text>
        {isEditMode ? (
          <TextInput
            style={styles.input}
            value={editedIncome.owner}
            onChangeText={(text) =>
              setEditedIncome({...editedIncome, owner: text})
            }
          />
        ) : (
          <Text style={styles.value}>{income.owner}</Text>
        )}

        <Text style={styles.label}>Źródło:</Text>
        {isEditMode ? (
          <TextInput
            style={styles.input}
            value={editedIncome.source}
            onChangeText={(text) =>
              setEditedIncome({...editedIncome, source: text})
            }
          />
        ) : (
          <Text
            style={{...styles.value, backgroundColor: `#${income.catColor}`}}>
            {income.source || 'brak'}
          </Text>
        )}
      </View>

      {/* Buttons for Edit, Save, Cancel */}
      <View style={styles.buttonContainer}>
        {isEditMode ? (
          <>
            <Button mode="contained" onPress={handleSave} style={styles.button}>
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
            <Button mode="contained" onPress={handleEdit} style={styles.button}>
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
