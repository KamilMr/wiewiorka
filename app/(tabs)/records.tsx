import {useState} from 'react';
import {View, Image, StyleSheet, ScrollView} from 'react-native';
import {router} from 'expo-router';

import {Text, Searchbar} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {FontAwesome} from '@expo/vector-icons'; // Assuming you're using FontAwesome for icons
import _ from 'lodash';

import {isCloseToBottom} from '@/common';
import {selectRecords} from '@/redux/main/selectors';
import {useAppSelector} from '@/hooks';

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
  const handleScroll = ({nativeEvent}) => {
    if (isCloseToBottom(nativeEvent)) {
      setNumber(number + 20);
    }
  };

  const handleNavigate = (id: number, isExpense: boolean) => () => {
    router.push({pathname: isExpense ? '/addnew/expense' : '/addnew/income', params: {id}});
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
        {_.keys(records).map((dateKey) => (
          <View key={dateKey}>
            <Text>{dateKey}</Text>

            {records[dateKey].map((exp: Expense) => (
              <View
                style={styles.row}
                key={exp.id}
                onTouchEnd={handleNavigate(exp.id, exp.exp)}>
                <FontAwesome
                  name="tag"
                  size={24}
                  color="black"
                  style={{marginRight: 16}}
                />

                {/* Image placeholder (small) */}
                <Image
                  source={{uri: 'https://via.placeholder.com/40'}}
                  style={styles.image}
                  tintColor={`#${exp.color}`}
                />

                {/* Description */}
                <View style={{flex: 1}}>
                  <Text>{exp.description}</Text>
                  <Text style={{fontSize: 10, color: 'gray'}}>
                    {(exp.category || exp.source) + ' : ' + exp.date}
                  </Text>
                </View>

                {/* Price */}
                <View>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 'bold',
                      color: exp.exp ? 'red' : undefined,
                    }}>
                    {exp.price + ' zł'}
                  </Text>
                  <Text style={{fontSize: 10, textAlign: 'right'}}>
                    {exp.owner}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
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

export default Records;
