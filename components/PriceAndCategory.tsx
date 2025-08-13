import {StyleSheet, View} from 'react-native';
import {IconButton} from 'react-native-paper';

import {Select, Text, TextInput} from '@/components';
import {sizes} from '@/constants/theme';

interface PriceAndCategoryProps {
  item: {price: string; category: string};
  index: number;
  expenseCategories: Array<{name: string; id: number}>;
  onUpdateItem: (
    index: number,
    field: 'price' | 'category',
    value: string,
  ) => void;
  onRemoveItem: (index: number) => void;
  canRemove: boolean;
}

const PriceAndCategory = ({
  item,
  index,
  expenseCategories,
  onUpdateItem,
  onRemoveItem,
  canRemove,
}: PriceAndCategoryProps) => {
  const itemsToSelect = expenseCategories.map(cat => ({
    label: cat.name,
    value: cat.name,
  }));

  return (
    <View style={styles.root}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: sizes.md,
        }}
      >
        <Text style={{fontSize: 14, fontWeight: '500'}}>
          Pozycja {index + 1}
        </Text>
        {canRemove && (
          <IconButton
            icon="close"
            size={20}
            onPress={() => onRemoveItem(index)}
          />
        )}
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
        <TextInput
          style={{flex: 1, marginVertical: 0}}
          dense
          label="Cena"
          keyboardType="numeric"
          onChangeText={text => onUpdateItem(index, 'price', text)}
          value={item.price}
        />
        <View style={{flex: 2}}>
          <Select
            style={{root: {marginTop: sizes.md}}}
            items={itemsToSelect}
            onChange={category =>
              onUpdateItem(index, 'category', category.value)
            }
            value={item.category}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: 'white',
    padding: sizes.xl,
    marginVertical: sizes.md,
    borderRadius: sizes.sm,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: sizes.md,
  },
});

export default PriceAndCategory;
