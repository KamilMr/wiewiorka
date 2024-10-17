import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {TabBarIcon} from './navigation/TabBarIcon';
import Menu from './Menu.tsx';
import {useState} from 'react';
import {Button} from 'react-native-paper';

type IconProp = {
  color: string;
  isFocus: boolean;
};

type Items = {
  title: string;
  onPress: () => void;
};
type ContextMenuAction = {
  [key: string]: Items[];
};
const MyTabBar = ({
  state,
  descriptors,
  navigation,
  showLabel = false,
}: BottomTabBarProps & {showLabel?: boolean}) => {
  const icons = {
    index: (props: IconProp) => (
      <TabBarIcon name={props.isFocus ? 'home' : 'home-outline'} {...props} />
    ),
    records: (props: IconProp) => (
      <TabBarIcon name={props.isFocus ? 'cash' : 'cash-outline'} {...props} />
    ),
    addnew: (props: IconProp) => (
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

  const [visible, setVisible] = useState<boolean[]>([]);

  const closeMenu = () => setVisible([]);
  const contextMenuAction: ContextMenuAction = {
    addnew: [
      {
        title: 'Dodaj Wpływ',
        onPress: () => {
          navigation.navigate('income');
          closeMenu();
        },
      },
    ],
  };

  const openMenu = (idx: number) => {
    const _visible = [...visible];
    _visible[idx] = true;
    setVisible(_visible);
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

        const onLongPress = (idx: number) => () => {
          openMenu(idx);
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <Button style={styles.tabBarItem} key={route.name}>
            <Menu
              visible={visible[index] || false}
              closeMenu={closeMenu}
              items={contextMenuAction[route.name] || []}
              anchor={
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityState={isFocused ? {selected: true} : {}}
                  accessibilityLabel={options.tabBarAccessibilityLabel}
                  testID={options.tabBarTestID}
                  onPress={onPress}
                  onLongPress={onLongPress(index)}>
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
              }
            />
          </Button>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 5,
    padding: 15,
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
