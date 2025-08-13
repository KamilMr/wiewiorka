import {router, useNavigation} from 'expo-router';

import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {IconButtonWithStatus as IconButton} from '@/components';
import {Text} from '..';
import {
  ItemsProps,
  AddEmptyModal,
  HandleDelete,
  GroupedItemsProps,
} from './types';
import {CircleIcon} from '../Icons';
import {useAppDispatch} from '@/hooks';
import {handleCategory} from '@/redux/main/thunks';
import {useState} from 'react';

const WIDTH_ICON_VIEW = 45;

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
    ).then(res => console.log('ok'));
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
            style={{width: '70%'}}
          >{`${nameOfGroup} (${items.length})`}</Text>
          <IconButton icon={expanded ? 'chevron-down' : 'chevron-right'} />
        </View>
      </TouchableOpacity>
      {expanded && (
        <View style={styles.expandedContent}>
          {items.map(item => (
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
              }}
            >
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

export default GroupedItemsList;
