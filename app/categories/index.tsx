import {useEffect, useState} from 'react';
import {useNavigation} from 'expo-router';
import {ScrollView, View} from 'react-native';

import _ from 'lodash';

import {
  Glow,
  Modal,
  NoData,
  TextInput,
  IconButtonWithStatus as IconButton,
} from '@/components';
import {CustomModal} from '@/components/CustomModal';
import {useAppTheme} from '@/constants/theme';
import {useAppDispatch, useAppSelector} from '@/hooks';
import {selectCategories, selectMainCategories} from '@/redux/main/selectors';
import {
  deleteSubcategoryLocal,
  deleteGroupCategoryLocal,
  addGroupCategoryLocal,
} from '@/redux/main/thunks';
import GroupedItemsList from '@/components/categories/GroupedItemsList';
import {DeleteCategory} from '@/components/categories/types';

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
        <Glow isGlowing={!edit} glowColor={t.colors.primary}>
          <IconButton
            showLoading
            icon={edit ? 'check' : 'pencil'}
            onPressIn={() => setEdit(!edit)}
            iconColor={t.colors.primary}
          />
        </Glow>
      ),
    });
  }, [navigation, edit]);

  const handleDelete = async ({id, kind}: DeleteCategory) => {
    if (kind === 'category') {
      dispatch(deleteSubcategoryLocal(id));
    }
    if (kind === 'group') {
      dispatch(deleteGroupCategoryLocal(id));
    }

    emptyModal();
  };

  const handleSave = () => {
    dispatch(addGroupCategoryLocal({name: newGroup.name, color: '#FFFFFF'}))
      .unwrap()
      .then(() => {
        setNewGroup({name: ''});
      });
  };

  return (
    <View style={{height: '100%', backgroundColor: t.colors.white}}>
      <ScrollView>
        {!mainCategories.length ? (
          <NoData text="Edytuj aby dodać kategorię" />
        ) : (
          mainCategories.map(([groupName, groupId]) => (
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
          ))
        )}
        {edit && (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput
              label={'Wpisz nową kategorię'}
              mode="outlined"
              style={{width: '80%'}}
              value={newGroup.name}
              onChangeText={text => {
                setNewGroup({name: text});
              }}
            />

            <IconButton showLoading icon="check" onPress={handleSave} />
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
