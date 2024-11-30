import {Modal, Text} from '@/components';
import {CustomModal} from '@/components/CustomModal';
import {CircleIcon} from '@/components/Icons';
import {useAppTheme} from '@/constants/theme';
import {useAppSelector} from '@/hooks';
import {Subcategory} from '@/redux/main/mainSlice';
import {selectCategories} from '@/redux/main/selectors';
import {useLocalSearchParams, useNavigation} from 'expo-router';
import _ from 'lodash';
import {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, TextBase, View} from 'react-native';
import {IconButton} from 'react-native-paper';

interface GroupedItemsProps {
  nameOfGroup: string;
  items: Subcategory[];
  edit: boolean;
}

interface ItemsProps {
  item: Subcategory;
  edit: boolean;
}

interface AddEmptyModal {
  addModal: (arg: CustomModal) => void;
  emptyModal: () => void;
}

const WIDTH_ICON_VIEW = 45;

const GroupedItem = ({item, edit}: ItemsProps) => {
  return (
    <View style={styles.itemContainer}>
      {/* Placeholder on the left */}
      <CircleIcon fillInner={item.color} />

      {/* Item Name */}
      <Text style={styles.itemText}>{item.name}</Text>

      {/* Edit and Trash Icons */}
      {edit && (
        <View style={styles.iconGroup}>
          <IconButton
            icon="pencil"
            onPress={() => {
              /* Handle edit */
            }}
          />
          <IconButton
            icon="trash-can"
            onPress={() => {
              /* Handle delete */
            }}
          />
        </View>
      )}
    </View>
  );
};

const GroupedItemsList = ({
  nameOfGroup,
  items,
  edit,
  addModal,
  emptyModal,
}: GroupedItemsProps & AddEmptyModal) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View>
      <View key={nameOfGroup} style={styles.groupContainer}>
        {edit ? (
          <View style={{width: WIDTH_ICON_VIEW}}>
            <IconButton
              icon="trash-can"
              onPress={() =>
                addModal({
                  visible: true,
                  title: `Usunąć kategorię ${nameOfGroup}?`,
                  content: `Kategoria zostanie usunięta a przypisanie traksakcje zostaną bez kategorii`,
                  onDismiss: emptyModal,
                })
              }
            />
          </View>
        ) : (
          <View style={{width: WIDTH_ICON_VIEW}} />
        )}
        <Text style={{width: '70%'}}>{`${nameOfGroup} (${items.length})`}</Text>
        <IconButton
          icon={expanded ? 'chevron-down' : 'chevron-right'}
          onPress={() => setExpanded(!expanded)}
        />
      </View>
      {expanded && (
        <View style={styles.expandedContent}>
          {items.map((item, index) => (
            <GroupedItem key={index} item={item} edit={edit} />
          ))}
        </View>
      )}
    </View>
  );
};

const modalState: () => CustomModal = () => ({
  visible: false,
  title: '',
  content: '',
  onDismiss: () => {},
  onApprove: () => {},
});

export default function MainView() {
  const navigation = useNavigation();
  const categories = useAppSelector(selectCategories);
  const params = useLocalSearchParams();
  const [edit, setEdit] = useState(false);
  const [modalContent, setModalContent] = useState<CustomModal>(modalState());

  const emptyModal = () => {
    setModalContent(modalState());
  };

  const addModal = ({
    title,
    content,
    onDismiss,
    onApprove,
  }: CustomModal): void => {
    setModalContent({
      visible: true,
      title,
      content,
      onDismiss,
      onApprove,
    });
  };

  const t = useAppTheme();
  console.log(t);

  const grouped = _.groupBy(categories, 'groupName');
  console.log(grouped);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon={edit ? 'check' : 'pencil'}
          onPressIn={() => setEdit(!edit)}
        />
      ),
    });
  }, [navigation, edit]);

  return (
    <View style={{height: '100%', backgroundColor: t.colors.white}}>
      <ScrollView>
        {_.keys(grouped).map((groupName) => (
          <GroupedItemsList
            key={groupName}
            nameOfGroup={groupName}
            items={grouped[groupName]}
            edit={edit}
            addModal={addModal}
            emptyModal={emptyModal}
          />
        ))}
      </ScrollView>
      <Modal
        visible={modalContent.visible}
        title={modalContent.title}
        content={modalContent.content}
        onDismiss={modalContent.onDismiss}
        onApprove={modalContent.onApprove}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  groupContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  expandedContent: {},
  itemText: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 30,
    height: 50,
  },
  iconGroup: {
    flexDirection: 'row',
  },
});
