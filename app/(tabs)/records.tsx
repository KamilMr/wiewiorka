import {selectRecords} from '@/redux/main/mainSlice';
import {useState} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {Text} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import {FontAwesome} from '@expo/vector-icons'; // Assuming you're using FontAwesome for icons
import _ from 'lodash';

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
  const [openFilter, setOpenFilter] = useState(false);
  const [filter, setFilter] = useState({txt: '', categories: []}); // [txt, categoryid]
  const expenses = useSelector(selectRecords(number, filter));

  return (
    <SafeAreaView style={{padding: 16}}>
      <Text style={{fontSize: 18, fontWeight: 'bold'}}>
        Transaction History
      </Text>
      <ScrollView>
        {_.keys(expenses).map((dateKey) => (
          <View key={dateKey}>
            <Text>{dateKey}</Text>

            {expenses[dateKey].map((exp: Expense) => (
              <View style={styles.row} key={exp.id}>
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
