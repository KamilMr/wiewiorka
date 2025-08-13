import {View} from 'react-native';

import {Menu} from 'react-native-paper';

type Items = {
  title: string;
  onPress: () => void;
};

type Props = {
  closeMenu: () => void;
  visible: boolean;
  anchor: React.ReactNode;
  items: Items[];
};

const CustomMenu = ({
  closeMenu,
  visible = false,
  anchor,
  items = [],
}: Props) => {
  return (
    <View>
      <Menu visible={visible} onDismiss={closeMenu} anchor={anchor}>
        {items.map(item => (
          <Menu.Item
            key={item.title}
            onPress={item.onPress}
            title={item.title}
          />
        ))}
      </Menu>
    </View>
  );
};

export default CustomMenu;
