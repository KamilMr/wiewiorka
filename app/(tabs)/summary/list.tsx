import {ScrollView, StyleSheet, View} from 'react-native';
import {router, useLocalSearchParams} from 'expo-router';
import {Text} from 'react-native-paper';
import {useAppSelector} from '@/hooks';
import {selectRecords} from '@/redux/main/selectors';
import Expense from '../addnew';
import _ from 'lodash';

const TransactionList = () => {
  const params: {category: string; dates: string} = useLocalSearchParams();
  const dates = params.dates.split(',').slice(0, 2);
  const records = useAppSelector(
    selectRecords(100, {
      txt: '',
      categories: [params.category],
      dates: [dates[0], dates[1]],
    }),
  );

  return (
    <View>
      <ScrollView>
        {_.keys(records).map((dateKey) => (
          <View key={dateKey}>
            <Text>{dateKey}</Text>

            {records[dateKey].map((exp: Expense) => (
              <View style={styles.row} key={exp.id}>
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
      <View style={{height: 80}}></View>
      </ScrollView>
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
