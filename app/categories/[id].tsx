import {useEffect, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {useLocalSearchParams, router, useNavigation} from 'expo-router';
import {Button, IconButton, TouchableRipple} from 'react-native-paper';

import _ from 'lodash';

import {ColorPicker, Select, Text, TextInput} from '@/components';
import {useAppDispatch, useAppSelector} from '@/hooks';
import {
  selectCategories,
  selectCategory,
  selectStatus,
} from '@/redux/main/selectors';
import {Subcategory} from '@/redux/main/mainSlice';
import {sizes, useAppTheme} from '@/constants/theme';
import {Props} from '@/components/CustomSelect';
import {handleCategory} from '@/redux/main/thunks';

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

interface TwoButtonsProps {
  handleOk: () => void;
  handleCancel: () => void;
  cancelTxt?: string;
  okTxt?: string;
  visible?: boolean;
  disableOk?: boolean;
  loading: boolean;
}
const TwoButtons: React.FC<TwoButtonsProps> = ({
  handleOk,
  handleCancel,
  cancelTxt = 'Anuluj',
  okTxt = 'Tak',
  visible = true,
  disableOk = false,
  loading = false,
}) => {
  if (!visible) return null;
  console.log(disableOk);
  return (
    <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
      <Button mode="outlined" onPress={handleCancel} disabled={disableOk}>
        {cancelTxt}
      </Button>
      <Button
        loading={loading}
        mode="contained"
        onPress={handleOk}
        disabled={disableOk}>
        {okTxt}
      </Button>
    </View>
  );
};

export default function OneCategory() {
  const dispatch = useAppDispatch();
  const {id} = useLocalSearchParams();
  const navigation = useNavigation();
  const fetching = useAppSelector(selectStatus);
  const isFetching = fetching === 'fetching';

  const category: Subcategory | undefined = useAppSelector(selectCategory(+id));
  const categories = useAppSelector(selectCategories);

  const {id: catId, name, groupId, groupName, color} = category || {};

  const [state, setState] = useState<State>(
    emptyState({id: catId, name, groupName, groupId, color}),
  );
  const [edit, setEdit] = useState(false);
  const [openPicker, setOpenPicker] = useState(false);

  const t = useAppTheme();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon={edit ? 'check' : 'pencil'}
          onPressIn={() => {
            setEdit(!edit);
            handleSave();
          }}
        />
      ),
    });
  }, [navigation, edit]);

  // temp fix
  if (!category) router.navigate('..');

  // handlers
  const handleCancel = () => {
    setEdit(false);
    setState(emptyState({id: catId, name, groupName, groupId, color}));
  };

  const handleSave = async () => {
    // validate
    dispatch(handleCategory({method: 'PUT', ...state})).then((res) => {
      router.replace('/categories');
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

  const isDirty = !_.isEqual(
    emptyState({id: catId, name, groupName, groupId, color}),
    state,
  );

  const grouped = _.groupBy(categories, 'groupName');
  const itemsToSelect: Pick<Props, 'items'> = _.keys(grouped).map((k) => ({
    label: k,
    value: grouped[k][0].groupId,
  }));

  useEffect(() => {
    if (isDirty !== edit) {
      setEdit(isDirty);
    }
  }, [isDirty]);

  return (
    <ScrollView style={{height: '100%', backgroundColor: t.colors.white}}>
      <View
        style={{
          padding: sizes.lg,
          marginTop: sizes.xxl,
          height: '100%',
          backgroundColor: t.colors.white,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <TouchableRipple onPress={handleTogglePicker}>
            <View
              style={{
                backgroundColor: state?.color,
                width: 50,
                height: 50,
              }}
            />
          </TouchableRipple>
          <TextInput
            style={{width: '80%'}}
            value={state?.name}
            onChangeText={handleSubCatChange}
            label={'Podkategoria'}></TextInput>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: sizes.xl,
          }}></View>

        <Select
          title="Główna Kategoria"
          value={state?.groupId || ''}
          onChange={handleCatChange}
          items={itemsToSelect}
        />
      </View>
      <TwoButtons
        visible={edit}
        handleOk={handleSave}
        handleCancel={handleCancel}
        okTxt="Zapisz"
        disableOk={!isDirty}
        loading={isFetching}
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
