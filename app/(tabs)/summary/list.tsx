import {useState} from 'react';
import {router, useLocalSearchParams} from 'expo-router';

import {
  NativeSyntheticEvent,
  NativeScrollEvent,
  StyleSheet,
  View,
} from 'react-native';
import _ from 'lodash';

import {useAppSelector} from '@/hooks';
import {selectRecords} from '@/redux/main/selectors';
import DynamicRecordList from '@/components/DynamicList';
import {isCloseToBottom} from '@/common';
import {useAppTheme} from '@/constants/theme';

const TransactionList = () => {
  const [number, setNumber] = useState(30);
  const params: {category: string; dates: string} = useLocalSearchParams();
  const dates = params.dates.split(',').slice(0, 2);
  const records = useAppSelector(
    selectRecords(number, {
      txt: '',
      categories: [params.category],
      dates: [dates[0], dates[1]],
    }),
  );
  const t = useAppTheme();

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

  return (
    <View style={{padding: 16, backgroundColor: t.colors.white, flex: 1}}>
      <DynamicRecordList records={records} handleScroll={handleScroll} />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.2,
    borderBottomColor: 'lightgray',
  },
  image: {width: 40, height: 40, borderRadius: 20, marginRight: 16},
});
export default TransactionList;
