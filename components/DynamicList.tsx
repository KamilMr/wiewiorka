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
import {colorNames, sizes, useAppTheme} from '@/constants/theme';
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
  const t = useAppTheme();
  return (
    <ScrollView onScroll={handleScroll}>
      {_.keys(records).map(dateKey => (
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
              onTouchEnd={handleNavigate(exp.id, exp.exp)}
            >
              <CircleIcon
                fillOuter={exp.exp ? exp.color : t.colors.softLavender}
                fillInner={exp.exp ? t.colors.white : t.colors.softLavender}
              />

              {/* Description */}
              <View style={{flex: 1, marginLeft: sizes.lg}}>
                <Text variant="bodyMedium">{exp.description}</Text>
                <Text variant="bodySmall" style={{color: t.colors.secondary}}>
                  {`${exp.category || exp.source || 'Nieznana'}`}
                </Text>
              </View>

              {/* Price */}
              <View style={{alignItems: 'flex-end'}}>
                <Text
                  variant="bodyMedium"
                  style={{
                    color: exp.exp ? t.colors.deepMaroon : t.colors.primary,
                  }}
                >
                  {exp.price + ' zł'}
                </Text>
                <Text
                  variant="bodySmall"
                  style={{textAlign: 'right', color: t.colors.secondary}}
                >
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
    paddingVertical: sizes.xl,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: sizes.xl,
  },
});
