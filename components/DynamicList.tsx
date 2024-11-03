import {Image, ScrollView, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';

import {FontAwesome} from '@expo/vector-icons';
import _ from 'lodash';

const DynamicRecordList = ({records, handleScroll, handleNavigate}) => {
  return (
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
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 16,
  },
});

export default DynamicRecordList;
