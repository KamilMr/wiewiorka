import {useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';

import {useAppTheme} from '@/constants/theme';

export type Items = Array<{label: string; value: string}>;

export interface Props {
  onChange: (data: any) => any;
  value: any;
  style?: Object;
  items: Items;
  title?: string;
  disable?: boolean;
  placeholder?: string;
  showDivider?: boolean;
}

const ElementDropdown = ({
  onChange = () => {},
  value,
  items,
  title = '',
  showDivider = false,
  disable = false,
  placeholder = 'Wybierz',
  style = {},
}: Props) => {
  const t = useAppTheme();
  const [isFocus, setIsFocus] = useState(false);

  const handleChange = (item: {label: string; value: string}) => {
    setIsFocus(false);
    onChange(item);
  };

  const renderItem = (item: {label: string; value: string}, index: number) => {
    const isSelected = item.value === value;
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
        {isSelected && (
          <AntDesign style={styles.icon} color="blue" name="check" size={16} />
        )}
      </View>
    );
  };

  return (
    <Dropdown
      style={[
        styles.dropdown,
        isFocus && {borderColor: 'blue'},
        disable && styles.disabled,
        style,
      ]}
      placeholderStyle={[
        styles.placeholderStyle,
        disable && styles.disabledText,
      ]}
      selectedTextStyle={[
        styles.selectedTextStyle,
        disable && styles.disabledText,
      ]}
      inputSearchStyle={styles.inputSearchStyle}
      iconStyle={styles.iconStyle}
      data={items}
      search
      maxHeight={300}
      labelField="label"
      valueField="value"
      dropdownPosition='top'
      placeholder={!isFocus ? placeholder : '...'}
      searchPlaceholder="Szukaj..."
      value={value}
      onFocus={() => !disable && setIsFocus(true)}
      onBlur={() => setIsFocus(false)}
      onChange={handleChange}
      renderLeftIcon={() => (
        <AntDesign
          style={styles.icon}
          color={isFocus && !disable ? 'blue' : 'black'}
          name="Safety"
          size={20}
        />
      )}
      renderItem={renderItem}
      disable={disable}
    />
  );
};

export default ElementDropdown;

const styles = StyleSheet.create({
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: 'white',
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  textItem: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#666',
    marginLeft: 5,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#000',
    marginLeft: 5,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    backgroundColor: 'white',
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    color: '#999',
  },
});
