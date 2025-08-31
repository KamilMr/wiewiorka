import {useEffect, useState, memo, useCallback} from 'react';
import {SafeAreaView, ScrollView, View} from 'react-native';
import {addDays, addMonths, formatDate} from 'date-fns';
import {router} from 'expo-router';
import _ from 'lodash';
import { TextInput as PaperTextInput } from 'react-native-paper';

import {
  TextInput,
  ButtonWithStatus as Button,
  Text,
} from '@/components';

import {useAppDispatch, useAppSelector} from '@/hooks';
import {sizes, useAppTheme} from '@/constants/theme';
import {selectCategories} from '@/redux/main/selectors';
import {Budget, uploadMultiBudgets} from '@/redux/main/thunks';
import {setSnackbar} from '@/redux/main/mainSlice';

interface Subcategory {
  id: number;
  name: string;
  groupName: string;
  color: string;
  groupId: number;
}

interface CategoryInputProps {
  category: Subcategory;
  value: string;
  onChangeText: (categoryId: number, text: string) => void;
}

const CategoryInput = memo(({category, value, onChangeText}: CategoryInputProps) => {
  const handleChange = useCallback((text: string) => {
    onChangeText(category.id, text);
  }, [category.id, onChangeText]);

  return (
    <View key={category.id} style={{marginBottom: sizes.md}}>
      <TextInput
        label={category.name}
        value={value}
        keyboardType="numeric"
        onChangeText={handleChange}
        right={<PaperTextInput.Affix text="zł" />}
      />
    </View>
  );
});

const CreateBudget = () => {
  const categories: Subcategory[] = useAppSelector(selectCategories);
  const budgets = useAppSelector(state => state.main.budgets);
  const dispatch = useAppDispatch();
  const t = useAppTheme();

  // Get next month and year for new budget
  const budgetDate = formatDate(addMonths(new Date(), 1), 'yyyy-MM-dd');
  const [yy, mm] = budgetDate.split('-');

  // Get current month's date (previous month relative to new budget)
  const currentMonth = new Date();
  const currentMonthDate = formatDate(currentMonth, 'yyyy-MM');

  const getPrefillAmounts = (budgets: any[], currentMonthDate: string): {[key: number]: string} => {
    const currentMonthBudgets = budgets.filter(budget => 
      budget.yearMonth.startsWith(currentMonthDate)
    );
    
    const prefillAmounts: {[key: number]: string} = {};
    currentMonthBudgets.forEach(budget => {
      if (budget.categoryId) {
        prefillAmounts[budget.categoryId] = budget.amount.toString();
      }
    });
    
    return prefillAmounts;
  };

  const [budgetAmounts, setBudgetAmounts] = useState<{[key: number]: string}>(() => 
    getPrefillAmounts(budgets, currentMonthDate)
  );

  const groupedByMain = _.groupBy(categories, 'groupName');

  const handleAmountChange = useCallback((categoryId: number, amount: string) => {
    setBudgetAmounts(prev => ({...prev, [categoryId]: amount}));
  }, []);

  const handleSave = async () => {
    const budgetsToSave = Object.entries(budgetAmounts)
      .filter(([_, amount]) => amount && amount.trim() !== '' && parseInt(amount) > 0)
      .map(([categoryId, amount]) => ({
        amount: parseInt(amount),
        date: budgetDate,
        categoryId: parseInt(categoryId)
      }));

    if (budgetsToSave.length === 0) {
      dispatch(setSnackbar({open: true, msg: 'Nie wprowadzono żadnych budżetów'}));
      return;
    }

    try {
      await dispatch(uploadMultiBudgets(budgetsToSave)).unwrap();
      router.back();
    } catch (error: any) {
      let message = 'Wystąpił błąd podczas zapisywania budżetu';
      if (error?.message === 'budget_exists_for_month') {
        message = 'Budżet już istnieje dla tego miesiąca';
      }
      dispatch(setSnackbar({open: true, msg: message}));
    }
  };

  return (
    <SafeAreaView>
      <ScrollView style={{padding: sizes.xl}}>
        <Text variant="bodyLarge" style={{textAlign: 'center', marginBottom: sizes.xl}}>
          Nowy Budżet {mm}-{yy}
        </Text>
        
        {Object.entries(groupedByMain).map(([groupName, subcategories]) => (
          <View key={groupName} style={{marginBottom: sizes.lg}}>
            <Text variant="bodyMedium" style={{marginBottom: sizes.md, color: t.colors.primary}}>
              {groupName}
            </Text>
            {subcategories.map((category) => (
              <CategoryInput
                key={category.id}
                category={category}
                value={budgetAmounts[category.id] || ''}
                onChangeText={handleAmountChange}
              />
            ))}
          </View>
        ))}
        
        <Button
          mode="contained"
          onPress={handleSave}
          style={{marginTop: sizes.lg, alignSelf: 'center', marginBottom: sizes.xxxl}}
        >
          Zapisz budżet
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateBudget;
