import {
  GestureResponderEvent,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import {Text} from '@/components';
import _ from 'lodash';
import {format as formatDate} from 'date-fns';
import {colorNames, sizes} from '@/constants/theme';
import {CircleIcon} from './Icons';

interface SelExpense {
  id: number;
  description: string;
  exp: boolean;
  color: string;
  category: string;
  price: string;
  owner: string;
  source: string;
  date: string;
  image: string;
}

interface Props {
  handleNavigate?: (
    number: number,
    exp: boolean,
  ) => (event: GestureResponderEvent) => void;
  handleScroll?: ({
    nativeEvent,
  }: {
    nativeEvent: NativeSyntheticEvent<NativeScrollEvent>['nativeEvent'];
  }) => void;
  records: {
    [key: string]: SelExpense[];
  };
}

// TODO: Consider using flat list

export default function DynamicRecordList({
  records,
  handleScroll = () => {},
  handleNavigate = () => () => {},
}: Props) {
  return (
    <ScrollView onScroll={handleScroll}>
      {_.keys(records).map((dateKey) => (
        <View key={dateKey} style={{marginBottom: sizes.xxl}}>
          <Text variant="bodyLarge">
            {dateKey === formatDate(new Date(), 'dd/MM/yyyy')
              ? 'dziś'
              : dateKey}
          </Text>

          {records[dateKey].map((exp: SelExpense) => (
            <View
              style={styles.row}
              key={exp.id}
              onTouchEnd={handleNavigate(exp.id, exp.exp)}>
              <CircleIcon stroke={exp.color} fill={exp.color?'none':colorNames.softLavender} />

              {/* Description */}
              <View style={{flex: 1, marginLeft: sizes.lg}}>
                <Text variant='bodyMedium'>{exp.description}</Text>
                <Text variant='bodySmall' style={{color: 'gray'}}>
                  {`${exp.category || exp.source || 'Nieznana'} : ${exp.date}`}
                </Text>
              </View>

              {/* Price */}
              <View>
                <Text
                  variant='bodyMedium'
                  style={{
                    fontWeight: 'bold',
                    color: exp.exp ? colorNames.deepMaroon : undefined,
                  }}>
                  {exp.price + ' zł'}
                </Text>
                <Text variant='bodySmall' style={{ textAlign: 'right'}}>
                  {exp.owner}
                </Text>
              </View>
            </View>
          ))}
        </View>
      ))}
      <View style={{height: 80}}></View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    // borderBottomWidth: 0.2,
    // borderBottomColor: 'lightgray',
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 16,
  },
});
