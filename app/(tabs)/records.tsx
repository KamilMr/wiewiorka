import {useState} from 'react';
import {
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {router} from 'expo-router';

import {Text, Searchbar} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {FontAwesome} from '@expo/vector-icons'; // Assuming you're using FontAwesome for icons
import _ from 'lodash';

import {isCloseToBottom} from '@/common';
import {selectRecords} from '@/redux/main/selectors';
import {useAppSelector} from '@/hooks';
import DynamicRecordList from '@/components/DynamicList';

type Expense = {
  id: string | number;
  amount: number;
  date: string;
  description?: string;
  source?: string;
  owner?: string;
  price: string;
  category?: string;
  exp?: boolean;
  color?: string;
};

const Records = () => {
  const [number, setNumber] = useState(30);
  // const [openFilter, setOpenFilter] = useState(false);
  const [filter, setFilter] = useState([]); // [txt, categoryid]
  const [searchQuery, setSearchQuery] = useState('');
  const records = useAppSelector(
    selectRecords(number, {txt: searchQuery, categories: filter}),
  );

  // Load more items when the scroll reaches the bottom
  const handleScroll = ({
    nativeEvent,
  }: {
    nativeEvent: NativeSyntheticEvent<NativeScrollEvent>['nativeEvent'];
  }) => {
    if (isCloseToBottom(nativeEvent)) {
      setNumber(number + 20);
    }
  };

  const handleNavigate = (id: number, isExpense: boolean) => () => {
    router.push({
      pathname: isExpense ? '/addnew' : '/addnew/income',
      params: {id},
    });
  };

  return (
    <SafeAreaView style={{padding: 16}}>
      <Searchbar
        placeholder="Szukaj"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={{marginBottom: 12}}
      />
      <ScrollView onScroll={handleScroll}>
        <DynamicRecordList
          records={records}
          handleNavigate={handleNavigate}
          handleScroll={handleScroll}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Records;
