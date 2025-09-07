import {Button, Text, Select} from '@/components';
import {sizes} from '@/constants/theme';
import {useAppSelector, useAppDispatch} from '@/hooks';
import {selectBudgets} from '@/redux/main/selectors';
import {updateBudgetItem, deleteBudget} from '@/redux/main/thunks';
import {addMonths, format} from 'date-fns';
import {router} from 'expo-router';

import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useState} from 'react';
import formatDateTz, {timeFormats} from '@/utils/formatTimeTz';
import {parseInt} from 'lodash';

interface BudgetProps {}

const SelectDate = ({
  onSelect,
  selectedDate,
}: {
  onSelect: Function;
  selectedDate: string;
}) => {
  const budgets = useAppSelector(state => state.main.budgets);
  const uniqueDates = [
    ...new Set(
      budgets
        .map(budget => budget.yearMonth)
        .concat([
          format(new Date(), 'yyyy-MM-dd'),
          format(addMonths(new Date(), 1), 'yyyy-MM-dd'),
        ])
        .map(d => {
          const [y, m] = d.split('-');
          return [y, m, '01'].join('-');
        }),
    ),
  ].filter(Boolean);

  const monthNames = [
    'Styczeń',
    'Luty',
    'Marzec',
    'Kwiecień',
    'Maj',
    'Czerwiec',
    'Lipiec',
    'Sierpień',
    'Wrzesień',
    'Październik',
    'Listopad',
    'Grudzień',
  ];

  const dateOptions = uniqueDates
    .map(date => {
      const [year, month] = date.split('-');
      const displayDate = `${monthNames[parseInt(month) - 1]} ${year}`;
      return {
        label: displayDate,
        value: `${year}-${month}-01`,
      };
    })
    .sort((a, b) => new Date(a.value).getTime() - new Date(b.value).getTime());

  return (
    <View style={styles.dateSelector}>
      <Select
        items={dateOptions}
        value={selectedDate}
        onChange={item => onSelect(item.value)}
        placeholder="Wybierz miesiąc"
      />
    </View>
  );
};

const BasicList = ({date}: {date: string}) => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectBudgets(date));
  const [editingId, setEditingId] = useState('');
  const [editedValues, setEditedValues] = useState<{
    [key: string]: {allocated: number};
  }>({});

  const handleEdit = (id: string) => {
    setEditingId(id);
    const item = items.find(item => item.id === id);
    if (item) setEditedValues({[id]: {allocated: item.allocated}});
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Potwierdź usunięcie',
      'Czy na pewno chcesz usunąć ten budżet?',
      [
        {
          text: 'Anuluj',
          style: 'cancel',
        },
        {
          text: 'Usuń',
          style: 'destructive',
          onPress: () => {
            dispatch(deleteBudget({id}));
          },
        },
      ],
    );
  };

  const handleSave = (id: string) => {
    const changedKeys = editedValues[id];
    if (changedKeys && Object.keys(changedKeys).length > 0) {
      const changes: {amount?: number} = {};
      // Convert string values to appropriate types
      if (changedKeys.allocated) changes.amount = changedKeys.allocated;

      dispatch(updateBudgetItem({id, changes}));
    }
    setEditingId('');
    setEditedValues(prev => {
      const newState = {...prev};
      delete newState[id];

      return newState;
    });
  };

  const handleCancel = () => {
    setEditingId('');
    setEditedValues(prev => {
      const newState = {...prev};
      delete newState[editingId];
      return newState;
    });
  };

  const updateValue = (id: string, key: string, value: string) => {
    setEditedValues(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [key]: +value,
      },
    }));
  };

  return (
    <View style={{flex: 1}}>
      {items.length ? (
        <>
          <View style={styles.updateButtonContainer}>
            <Button
              onPress={() =>
                router.push({
                  pathname: '/budget/update-budget',
                  params: {date},
                })
              }
            >
              Zmień budżet
            </Button>
          </View>
          {items.map(item => (
            <View key={item.id} style={styles.budgetItem}>
              <View style={styles.budgetInfo}>
                <Text style={styles.budgetName}>{item.budgetedName}</Text>
                <View style={styles.budgetAmounts}>
                  {editingId === item.id ? (
                    <TextInput
                      style={styles.editInput}
                      value={
                        editedValues[item.id]?.allocated.toString() ||
                        item.allocated.toString()
                      }
                      onChangeText={value =>
                        updateValue(item.id, 'allocated', value)
                      }
                      keyboardType="numeric"
                    />
                  ) : (
                    <Text style={styles.allocatedText}>
                      Ulokowano: {item.allocated} zł | Wydano:{' '}
                      {Math.floor(item.amount)} zł
                    </Text>
                  )}
                </View>
              </View>
              <TouchableOpacity
                onPress={() =>
                  editingId === item.id
                    ? handleSave(item.id)
                    : handleEdit(item.id)
                }
                style={styles.editButton}
              >
                <Ionicons
                  name={editingId === item.id ? 'checkmark' : 'pencil'}
                  size={22}
                  color="black"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={
                  editingId === item.id
                    ? handleCancel
                    : () => handleDelete(item.id)
                }
                style={styles.deleteCancelButton}
              >
                <Ionicons
                  name={editingId === item.id ? 'close' : 'trash'}
                  size={22}
                  color="red"
                />
              </TouchableOpacity>
            </View>
          ))}
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Button
            onPress={() =>
              router.push({
                pathname: '/budget/create-budget',
                params: {date},
              })
            }
          >
            Dodaj Budżet
          </Button>
        </View>
      )}
    </View>
  );
};

const BudgetList = () => {
  const [currentDate, setCurrentDate] = useState(
    formatDateTz({pattern: timeFormats.dateOnly})
      .split('/')
      .reverse()
      .slice(0, 2)
      .concat(['01'])
      .join('-'),
  );

  return (
    <View style={styles.budgetListContainer}>
      <SelectDate
        onSelect={(d: string) => setCurrentDate(d)}
        selectedDate={currentDate}
      />
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={true}
      >
        <BasicList date={currentDate} />
      </ScrollView>
    </View>
  );
};

export default function Page({}: BudgetProps) {
  return (
    <KeyboardAvoidingView
      style={{flex: 1, backgroundColor: 'white', paddingBottom: 80}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <BudgetList />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  navigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  arrowButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  budgetContainer: {
    flex: 1,
    marginHorizontal: sizes.sm,
  },
  dateSelector: {
    paddingVertical: sizes.sm,
  },
  budgetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: sizes.sm,
    paddingHorizontal: sizes.md,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    height: 80,
  },
  budgetInfo: {
    flex: 1,
  },
  budgetName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  budgetAmounts: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  allocatedText: {
    fontSize: 12,
    color: '#666',
  },
  editInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: sizes.sm,
    paddingVertical: 4,
    minWidth: 80,
    fontSize: 14,
  },
  editButton: {
    padding: sizes.sm,
    marginLeft: sizes.xxl,
    marginRight: sizes.xl,
  },
  cancelButton: {
    padding: sizes.sm,
    marginLeft: sizes.sm,
    marginRight: sizes.lg,
  },
  deleteCancelButton: {
    padding: sizes.sm,
    marginLeft: sizes.xs,
  },
  budgetListContainer: {
    flex: 1,
    padding: sizes.md,
  },
  dateTitle: {
    marginBottom: sizes.sm,
    textAlign: 'center',
  },
  scrollContainer: {
    flex: 1,
    marginTop: sizes.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  updateButtonContainer: {
    paddingVertical: sizes.sm,
    paddingHorizontal: sizes.md,
    alignItems: 'flex-end',
  },
});
