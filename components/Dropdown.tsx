import {useState} from 'react';
import {StyleSheet, Text, View, TextInput} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
// import AntDesign from '@expo/vector-icons/AntDesign';

export type Items = Array<{label: string; value: string}>;

interface Props {
  items: Items;
  onChange: (item: {label: string; value: string}) => void;
  value?: string;
  label?: string;
}

const DropdownComponent = ({
  items,
  onChange,
  value: propValue,
  label,
}: Props) => {
  const [isFocus, setIsFocus] = useState(false);

  const renderLabel = () => {
    if (propValue || isFocus) {
      return (
        <Text style={[styles.label, isFocus && {color: 'blue'}]}>
          {label ?? 'Wybierz'}
        </Text>
      );
    }
    return null;
  };

  const handleFocus = () => setIsFocus(true);
  const handleBlur = () => setIsFocus(false);

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
        keyboardShouldPersistTaps="handled"
        renderInputSearch={onSearch => (
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            onChangeText={onSearch}
            autoFocus
          />
        )}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? 'Select item' : '...'}
        searchPlaceholder="Search..."
        value={propValue}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={item => {
          onChange(item);
          setIsFocus(false);
        }}
        // renderLeftIcon={() => (
        //   <AntDesign
        //     style={styles.icon}
        //     color={isFocus ? 'blue' : 'black'}
        //     name="file-search"
        //     size={20}
        //   />
        // )}
      />
    </View>
  );
};

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
  searchInput: {
    height: 40,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    margin: 8,
    backgroundColor: 'white',
  },
});

export default DropdownComponent;
