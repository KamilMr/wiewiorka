import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {TabBarIcon} from './navigation/TabBarIcon';

const NOT_SHOWN = ['income'];

type IconProp = {
  color: string;
  isFocus: boolean;
};

const MyTabBar = ({
  state,
  descriptors,
  navigation,
  showLabel = false,
}: BottomTabBarProps & {showLabel: boolean}) => {
  const icons = {
    index: (props: IconProp) => (
      <TabBarIcon name={props.isFocus ? 'home' : 'home-outline'} {...props} />
    ),
    records: (props: IconProp) => (
      <TabBarIcon name={props.isFocus ? 'cash' : 'cash-outline'} {...props} />
    ),
    expense: (props: IconProp) => (
      <TabBarIcon name={props.isFocus ? 'add' : 'add-outline'} {...props} />
    ),
    summary: (props: IconProp) => (
      <TabBarIcon
        name={props.isFocus ? 'bar-chart' : 'bar-chart-outline'}
        {...props}
      />
    ),
    profile: (props: IconProp) => (
      <TabBarIcon
        name={props.isFocus ? 'person' : 'person-outline'}
        {...props}
      />
    ),
  };
  return (
    <View style={styles.root}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        if (NOT_SHOWN.includes(route.name)) return null;

        return (
          <TouchableOpacity
            key={route.name}
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabBarItem}>
            {icons[route.name]?.({
              color: isFocused ? '#673ab7' : '#222',
              isFocus: isFocused,
            })}
            {showLabel && (
              <Text style={{color: isFocused ? '#673ab7' : '#222'}}>
                {label}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    paddingVertical: 5,
    padding: 15,
    borderRadius: 35,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 20},
    shadowRadius: 10,
    shadowOpacity: 0.1,
  },
  tabBarItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    gap: 5,
  },
});

export default MyTabBar;
