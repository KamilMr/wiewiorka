import {useState} from 'react';
import {ScrollView, View} from 'react-native';
import {useLocalSearchParams, router} from 'expo-router';
import {TouchableRipple} from 'react-native-paper';

import _, {isNaN} from 'lodash';

import {ColorPicker, Select, TextInput} from '@/components';
import {useAppDispatch, useAppSelector} from '@/hooks';
import {
  selectCategory,
  selectMainCategories,
  selectStatus,
} from '@/redux/main/selectors';
import {Subcategory} from '@/redux/main/mainSlice';
import {sizes, useAppTheme} from '@/constants/theme';
import {handleCategory} from '@/redux/main/thunks';
import {TwoButtons} from '@/components/categories/TwoButtons';

interface State {
  id?: number;
  color?: string;
  name?: string;
  groupName?: string;
  groupId?: number;
}

const emptyState = ({id, color, name, groupName, groupId}: State): State => ({
  id,
  color,
  name,
  groupId,
  groupName,
});

export default function OneCategory() {
  const dispatch = useAppDispatch();
  const {id, groupId: incomingGrId} = useLocalSearchParams();

  const category: Subcategory | undefined = useAppSelector(
    selectCategory(isNaN(+id) ? null : +id),
  );
  const categories = useAppSelector(selectMainCategories);

  const {
    id: catId,
    name = '',
    groupId,
    groupName = '',
    color = '#FFFFFF',
  } = category || {};

  const initialState = emptyState({
    id: catId,
    name,
    groupName:
      groupName || categories.find(k => +k[1] === +incomingGrId)?.[0] || '',
    groupId: groupId || +incomingGrId,
    color,
  });
  const [state, setState] = useState<State>(initialState);
  // const [edit, setEdit] = useState(false);
  const [openPicker, setOpenPicker] = useState(false);

  const t = useAppTheme();

  // useEffect(() => {
  //   navigation.setOptions({
  //     headerRight: () => (
  //       <IconButton
  //         icon={edit ? 'check' : 'pencil'}
  //         onPressIn={() => {
  //           setEdit(!edit);
  //           handleSave();
  //         }}
  //       />
  //     ),
  //   });
  // }, [navigation, edit]);

  // handlers
  const handleCancel = () => {
    // setEdit(false);
    setState(emptyState({id: catId, name, groupName, groupId, color}));
  };

  const handleSave = async () => {
    // validate
    dispatch(
      handleCategory({
        method: id && Number.isInteger(+id) ? 'PUT' : 'POST',
        ...state,
      }),
    )
      .unwrap()
      .then(() => {
        router.navigate('..');
      });
  };

  const handleColorChange = (color: string) => {
    setState({...state, color});
  };

  const handleTogglePicker = () => setOpenPicker(!openPicker);

  const handleCatChange = (cat: any) => {
    setState({...state, groupName: cat.label, groupId: cat.value});
  };

  const handleSubCatChange = (name: string) => {
    setState({...state, name});
  };

  const isDirty =
    !_.isEqual(
      emptyState({id: catId, name, groupName, groupId, color}),
      state,
    ) &&
    state.name &&
    state.groupName;

  const itemsToSelect = categories.map(([k, groupId]) => ({
    label: k,
    value: +groupId,
  }));

  // useEffect(() => {
  //   if (isDirty !== edit) {
  //     setEdit(isDirty);
  //   }
  // }, [isDirty]);

  return (
    <ScrollView style={{height: '100%', backgroundColor: t.colors.white}}>
      <View
        style={{
          padding: sizes.lg,
          marginTop: sizes.xxl,
          height: '100%',
          backgroundColor: t.colors.white,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <TouchableRipple onPress={handleTogglePicker}>
            <View
              style={{
                backgroundColor: state?.color,
                width: 50,
                height: 50,
                borderWidth: 1,
                borderColor: t.colors.primary,
                opacity: 0.4,
              }}
            />
          </TouchableRipple>
          <TextInput
            style={{width: '80%'}}
            value={state?.name}
            onChangeText={handleSubCatChange}
            label={'Wpisz podkategorię'}
          ></TextInput>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: sizes.xl,
          }}
        ></View>

        <Select
          title="Główna Kategoria"
          value={state?.groupId || ''}
          onChange={handleCatChange}
          items={itemsToSelect}
        />
      </View>
      <TwoButtons
        visible
        handleOk={handleSave}
        handleCancel={handleCancel}
        okTxt="Zapisz"
        disableOk={!isDirty}
      />
      <ColorPicker
        value={state.color}
        visible={openPicker}
        onChange={handleColorChange}
        openModal={handleTogglePicker}
        closeModal={handleTogglePicker}
      />
    </ScrollView>
  );
}
