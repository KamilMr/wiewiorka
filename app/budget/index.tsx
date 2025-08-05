import {BudgetCard, Button} from '@/components';
import {sizes} from '@/constants/theme';
import {useAppSelector} from '@/hooks';
import {selectBudgets} from '@/redux/main/selectors';
import {format as formatDate, addMonths, subMonths} from 'date-fns';
import {Link} from 'expo-router';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useState} from 'react';

interface BudgetProps {}

const BudgetCardWithButton = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const date = formatDate(currentDate, 'yyyy-MM-dd');
  const items = useAppSelector(selectBudgets(date));

  const goToPreviousMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1));
  };

  return (
    <View style={{padding: sizes.xl}}>
      <View style={styles.navigationContainer}>
        <TouchableOpacity onPress={goToPreviousMonth} style={styles.arrowButton}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        
        <View style={styles.budgetContainer}>
          <BudgetCard items={items} date={date} />
        </View>
        
        <TouchableOpacity onPress={goToNextMonth} style={styles.arrowButton}>
          <Ionicons name="chevron-forward" size={24} color="black" />
        </TouchableOpacity>
      </View>
      
      <Link href="/budget/new" asChild>
        <Button mode="contained" style={{marginTop: sizes.lg, alignSelf: 'center'}}>
          Dodaj budżet
        </Button>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  navigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  arrowButton: {
    padding: sizes.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  budgetContainer: {
    flex: 1,
    marginHorizontal: sizes.sm,
  },
});

export default function Page({}: BudgetProps) {
  return (
    <View>
      <BudgetCardWithButton />
    </View>
  );
}
