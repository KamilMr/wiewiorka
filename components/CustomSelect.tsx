import {useState, useRef, useEffect} from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';

import {
  Menu,
  Text,
  TouchableRipple,
  TextInput,
  Divider,
} from 'react-native-paper';
import AntDesign from '@expo/vector-icons/AntDesign';

import {normalize} from '@/common';

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

const DropdownComponent = ({
  onChange = () => {},
  value,
  items,
  title = '',
  showDivider = false,
  disable = false,
  placeholder = 'Wybierz',
  style = {},
}: Props) => {
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<any>(null);

  const selectedItem = items.find(item => item.value === value);

  // Filter items based on search query
  const filteredItems = items.filter(item =>
    normalize(item.label.toLowerCase()).includes(
      normalize(searchQuery.toLowerCase()),
    ),
  );

  // Split filtered items into first three and rest
  const firstItems = filteredItems.slice(0, 3);
  const restItems = filteredItems.slice(3);

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

  const handleCleanSearchQuery = () => setSearchQuery('');

  return (
    <View style={{backgroundColor: 'transparent'}}>
      <Menu
        visible={isVisible}
        onDismiss={handleMenuDismiss}
        style={{backgroundColor: 'white', width: '80%'}}
        contentStyle={{
          maxHeight: 400,
          marginBottom: 10,
        }}
        anchorPosition="bottom"
        mode="elevated"
        anchor={
          <TouchableRipple
            onPress={() => !disable && setIsVisible(true)}
            disabled={disable}
            style={[
              styles.dropdownContainer,
              isVisible && {borderColor: 'blue'},
              disable && styles.disabled,
            ]}
          >
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
        }
      >
        {/* Fixed Search TextField */}
        <View style={styles.searchContainer}>
          <TextInput
            ref={searchInputRef}
            placeholder="Szukaj..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            mode="outlined"
            dense
            autoFocus={isVisible}
            left={<TextInput.Icon icon="magnify" />}
            right={
              searchQuery ? (
                <TextInput.Icon icon="close" onPress={handleCleanSearchQuery} />
              ) : null
            }
          />
        </View>

        {/* Scrollable Menu Items */}
        <ScrollView
          style={styles.scrollableContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={true}
        >
          {/* First three items */}
          {firstItems.map((item, index) => (
            <Menu.Item
              key={`first-${index}`}
              onPress={() => handleOnChange(item)}
              title={item.label}
              leadingIcon={item.value === value ? 'check' : undefined}
            />
          ))}

          {/* Divider if there are rest items */}
          {restItems.length > 0 && showDivider && searchQuery.length === 0 && (
            <Divider style={{height: 2}} />
          )}

          {/* Rest of the items */}
          {restItems.map((item, index) => (
            <Menu.Item
              key={`rest-${index}`}
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
        </ScrollView>
      </Menu>
    </View>
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  dropdownContainer: {
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
  scrollableContent: {
    maxHeight: 300,
  },
  searchInput: {
    backgroundColor: 'white',
  },
  noResultsText: {
    color: '#666',
    fontStyle: 'italic',
  },
});
