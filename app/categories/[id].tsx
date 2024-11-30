import {useEffect, useState} from 'react';
import {SafeAreaView, View} from 'react-native';
import {useLocalSearchParams, router, useNavigation} from 'expo-router';
import {IconButton} from 'react-native-paper';

import _ from 'lodash';

import {Select, Text, TextInput} from '@/components';
import {useAppSelector} from '@/hooks';
import {selectCategories, selectCategory} from '@/redux/main/selectors';
import {Subcategory} from '@/redux/main/mainSlice';
import {useAppTheme} from '@/constants/theme';
import {Props} from '@/components/CustomSelect';

export default function OneCategory() {
  const {id} = useLocalSearchParams();
  const navigation = useNavigation();

  const category: Subcategory | undefined = useAppSelector(selectCategory(+id));
  const categories = useAppSelector(selectCategories);
  const [edit, setEdit] = useState(false);
  const t = useAppTheme();

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

  // temp fix
  if (!category) router.navigate('..');

  const selectData: Pick<Props, 'items'> = _.keys(grouped).map((k) => ({
    label: k,
    value: grouped[k][0].groupId,
  }));

  return (
    <View style={{padding: 8, height: '100%', backgroundColor: t.colors.white}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text style={{width: '50%'}} variant="titleLarge">
          {category?.name}
        </Text>
        <IconButton icon="trash-can" onPress={() => {}} />
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: 12,
        }}>
        <Text>Kolor: </Text>
        <View
          style={{
            backgroundColor: category?.color,
            width: 60,
            height: 30,
          }}
        />
      </View>

      <Select
        value={category?.groupId || ''}
        onChange={() => {}}
        items={selectData}
      />
      <TextInput value={category?.name} label={'Podkategoria'}></TextInput>
    </View>
  );
}
