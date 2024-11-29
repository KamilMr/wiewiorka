import {Text} from '@/components';
import {useAppSelector} from '@/hooks';
import {selectCategories} from '@/redux/main/selectors';
import {useLocalSearchParams, useNavigation} from 'expo-router';
import _ from 'lodash';
import {useEffect, useState} from 'react';
import {IconButton} from 'react-native-paper';

export default function MainView() {
  const navigation = useNavigation();
  const categories = useAppSelector(selectCategories);
  const params = useLocalSearchParams();
  const [edit, setEdit] = useState(false);

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
  return <Text>{edit ? 'Edit mode' : 'View mode'}</Text>;
}
