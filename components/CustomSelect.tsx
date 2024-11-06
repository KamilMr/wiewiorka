import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';

import {Dropdown} from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';

import {Text} from './CustomText';

interface Props {
  onChange: (data: any) => any;
  value: any;
  styles?: Object;
  items: Array<{label: string; value: string}>;
  title?: string;
  disable?: boolean;
}

const DropdownComponent = ({
  onChange = () => {},
  value,
  items,
  title = '',
  disable = false,
}: Props) => {
  const [isFocus, setIsFocus] = useState(false);

  const renderLabel = () => {
    if ((value || isFocus) && title) {
      return (
        <Text style={[styles.label, isFocus && {color: 'blue'}]}>{title}</Text>
      );
    }
    return null;
  };

  const handleOnChange = (item) => {
    setIsFocus(false);
    onChange(item);
  };

  return (
    <View style={styles.container}>
      {renderLabel()}
      <Dropdown
        style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={items}
        search
        disable={disable}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? 'Wybierz kategorię' : '...'}
        keyboardAvoiding
        searchPlaceholder="Szuka..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={handleOnChange}
        renderLeftIcon={() => (
          <AntDesign
            style={styles.icon}
            color={isFocus ? 'blue' : 'black'}
            name="Safety"
            size={20}
          />
        )}
      />
    </View>
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
