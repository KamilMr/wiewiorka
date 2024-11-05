import {useState} from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
} from 'react-native';
import {router} from 'expo-router';

import {Searchbar, useTheme} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';

import _ from 'lodash';

import {isCloseToBottom} from '@/common';
import {selectRecords} from '@/redux/main/selectors';
import {useAppSelector} from '@/hooks';
import DynamicRecordList from '@/components/DynamicList';
import {sizes} from '@/constants/theme';

const Records = () => {
  const t = useTheme();
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
    <SafeAreaView style={{padding: sizes.xl, backgroundColor: t.colors.background}}>
      <Searchbar
        placeholder="Szukaj"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={{marginBottom: sizes.lg}}
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
