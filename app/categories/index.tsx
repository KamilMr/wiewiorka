import {useEffect, useState} from 'react';
import {router, useNavigation} from 'expo-router';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';

import _ from 'lodash';
import {IconButton} from 'react-native-paper';

import {Modal, Text, TextInput} from '@/components';
import {CustomModal} from '@/components/CustomModal';
import {CircleIcon} from '@/components/Icons';
import {useAppTheme} from '@/constants/theme';
import {useAppDispatch, useAppSelector} from '@/hooks';
import {selectCategories, selectMainCategories} from '@/redux/main/selectors';
import {
  handleCategory,
  handleDeleteCategory,
  handleDeleteGroupCategory,
  handleGroupCategory,
} from '@/redux/main/thunks';
import {
  AddEmptyModal,
  GroupedItemsProps,
  HandleDelete,
  ItemsProps,
} from '@/components/categories/types';

const WIDTH_ICON_VIEW = 45;

const modalState: () => CustomModal = () => ({
  visible: false,
  title: '',
  content: '',
  onDismiss: () => {},
  onApprove: () => {},
});

const GroupedItem = ({
  item,
  edit,
  addModal,
  emptyModal,
  handleDelete,
}: ItemsProps & AddEmptyModal & HandleDelete) => {
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
            onPress={() => router.navigate(`/categories/${item.id}`)}
          />
          <IconButton
            icon="trash-can"
            onPress={() =>
              addModal({
                visible: true,
                title: `Usunąć podkategorię ${item.name}?`,
                content: `Kiedy usuniesz, przypisane transakcje zostaną bez kategorii.`,
                onApprove: () => handleDelete({id: item.id, kind: 'category'}),
                onDismiss: emptyModal,
              })
            }
          />
        </View>
      )}
    </View>
  );
};

const GroupedItemsList = ({
  nameOfGroup,
  items = [],
  edit,
  addModal,
  emptyModal,
  handleDelete,
  groupId,
}: GroupedItemsProps & AddEmptyModal & HandleDelete) => {
  const [expanded, setExpanded] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const dispatch = useAppDispatch();

  const handleSave = () => {
    dispatch(
      handleCategory({
        method: 'POST',
        name: newCategory,
        groupId: +groupId,
        color: '#FFFFFF',
      }),
    ).then((res) => console.log('ok'));
  };

  return (
    <View>
      <TouchableOpacity onPress={() => setExpanded(!expanded)}>
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
                    onApprove: () => handleDelete({id: groupId, kind: 'group'}),
                  })
                }
              />
            </View>
          ) : (
            <View style={{width: WIDTH_ICON_VIEW}} />
          )}
          <Text
            style={{width: '70%'}}>{`${nameOfGroup} (${items.length})`}</Text>
          <IconButton icon={expanded ? 'chevron-down' : 'chevron-right'} />
        </View>
      </TouchableOpacity>
      {expanded && (
        <View style={styles.expandedContent}>
          {items.map((item) => (
            <GroupedItem
              key={item.id}
              item={item}
              edit={edit}
              addModal={addModal}
              emptyModal={emptyModal}
              handleDelete={handleDelete}
            />
          ))}
          {edit && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <IconButton
                icon="plus"
                onPress={() =>
                  router.navigate(`/categories/new?groupId=${groupId}`)
                }
              />
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default function MainView() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectCategories);
  const [edit, setEdit] = useState(false);
  const [modalContent, setModalContent] = useState<CustomModal>(modalState());
  const mainCategories = useAppSelector(selectMainCategories);

  const [newGroup, setNewGroup] = useState({name: ''});

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

  const grouped = _.groupBy(categories, 'groupName');

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

  const handleDelete = async ({id, kind}: DeleteCategory) => {
    if (kind === 'category') {
      dispatch(handleDeleteCategory({id}));
    }
    if (kind === 'group') {
      dispatch(handleDeleteGroupCategory({id}));
    }

    emptyModal();
  };

  const handleSave = () => {
    dispatch(handleGroupCategory({method: 'POST', name: newGroup.name}))
      .unwrap()
      .then(() => {
        setNewGroup({name: ''});
      });
  };

  return (
    <View style={{height: '100%', backgroundColor: t.colors.white}}>
      <ScrollView>
        {mainCategories.map(([groupName, groupId]) => (
          <GroupedItemsList
            key={groupName}
            nameOfGroup={groupName}
            items={grouped[groupName]}
            edit={edit}
            addModal={addModal}
            emptyModal={emptyModal}
            handleDelete={handleDelete}
            groupId={groupId}
          />
        ))}
        {edit && (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput
              label={'Wpisz nową kategorię'}
              mode="outlined"
              style={{width: '80%'}}
              value={newGroup.name}
              onChangeText={(text) => {
                setNewGroup({name: text});
              }}
            />

            <IconButton icon="check" onPress={handleSave} />
          </View>
        )}
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
