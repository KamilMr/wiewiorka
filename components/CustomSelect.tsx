import {useState, useRef, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';

import {Menu, Text, TouchableRipple, TextInput} from 'react-native-paper';
import AntDesign from '@expo/vector-icons/AntDesign';

import CustomText from './CustomText';

export type Items = Array<{label: string; value: string}>;

export interface Props {
  onChange: (data: any) => any;
  value: any;
  styles?: Object;
  items: Items;
  title?: string;
  disable?: boolean;
  placeholder?: string;
}

const DropdownComponent = ({
  onChange = () => {},
  value,
  items,
  title = '',
  disable = false,
  placeholder = 'Wybierz',
}: Props) => {
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<any>(null);

  const selectedItem = items.find(item => item.value === value);

  // Filter items based on search query
  const filteredItems = items.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Auto-focus search input when menu becomes visible
  useEffect(() => {
    if (isVisible && searchInputRef.current) {
      // Small delay to ensure the menu is fully rendered
      const timeout = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [isVisible]);

  const handleOnChange = (item: {label: string; value: string}) => {
    setIsVisible(false);
    setSearchQuery(''); // Clear search when item is selected
    onChange(item);
  };

  const handleMenuDismiss = () => {
    setIsVisible(false);
    setSearchQuery(''); // Clear search when menu is dismissed
  };

  const renderLabel = () => {
    if ((value || isVisible) && title) {
      return (
        <CustomText style={[styles.label, isVisible && {color: 'blue'}]}>
          {title}
        </CustomText>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      {renderLabel()}
      <Menu
        visible={isVisible}
        onDismiss={handleMenuDismiss}
        anchor={
          <TouchableRipple
            onPress={() => !disable && setIsVisible(true)}
            disabled={disable}
            style={[
              styles.dropdown,
              isVisible && {borderColor: 'blue'},
              disable && styles.disabled,
            ]}>
            <View style={styles.dropdownContent}>
              <View style={styles.dropdownLeft}>
                <AntDesign
                  style={styles.icon}
                  color={isVisible ? 'blue' : 'black'}
                  name="Safety"
                  size={20}
                />
                <Text style={styles.dropdownText}>
                  {selectedItem ? selectedItem.label : placeholder}
                </Text>
              </View>
              <AntDesign
                name={isVisible ? 'up' : 'down'}
                size={16}
                color={isVisible ? 'blue' : 'black'}
              />
            </View>
          </TouchableRipple>
        }>
        {/* Search TextField */}
        <View style={styles.searchContainer}>
          <TextInput
            ref={searchInputRef}
            placeholder="Szukaj..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            mode="outlined"
            dense
            left={<TextInput.Icon icon="magnify" />}
          />
        </View>

        {/* Filtered items */}
        {filteredItems.map((item, index) => (
          <Menu.Item
            key={index}
            onPress={() => handleOnChange(item)}
            title={item.label}
            leadingIcon={item.value === value ? 'check' : undefined}
          />
        ))}

        {/* Show message if no items match search */}
        {filteredItems.length === 0 && searchQuery.length > 0 && (
          <Menu.Item
            title="Brak wyników"
            disabled
            titleStyle={styles.noResultsText}
          />
        )}
      </Menu>
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
    justifyContent: 'center',
  },
  dropdownContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  dropdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dropdownText: {
    fontSize: 16,
    marginLeft: 5,
  },
  disabled: {
    opacity: 0.5,
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
  searchContainer: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInput: {
    backgroundColor: 'white',
  },
  noResultsText: {
    color: '#666',
    fontStyle: 'italic',
  },
});
