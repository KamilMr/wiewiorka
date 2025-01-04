import {useEffect, useState} from 'react';
import {useNavigation} from 'expo-router';
import {ScrollView, View} from 'react-native';

import _ from 'lodash';
import {IconButton} from 'react-native-paper';

import {Modal, TextInput} from '@/components';
import {CustomModal} from '@/components/CustomModal';
import {useAppTheme} from '@/constants/theme';
import {useAppDispatch, useAppSelector} from '@/hooks';
import {selectCategories, selectMainCategories} from '@/redux/main/selectors';
import {
  handleDeleteCategory,
  handleDeleteGroupCategory,
  handleGroupCategory,
} from '@/redux/main/thunks';
import GroupedItemsList from '@/components/categories/GroupedItemsList';

const modalState: () => CustomModal = () => ({
  visible: false,
  title: '',
  content: '',
  onDismiss: () => {},
  onApprove: () => {},
});

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
