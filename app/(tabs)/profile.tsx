import {Button} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';

import {useAppDispatch} from '@/hooks';
import {logout} from '@/redux/auth/thunks';
import {DatePicker, TextInput, Select} from '@/components';

const Profile = () => {
  const dispatch = useAppDispatch();
  const handleLogout = () => {
    dispatch(logout());
  };
  return (
    <SafeAreaView>
      <Button
        icon="logout"
        mode="contained"
        onPress={handleLogout}
        style={{marginBottom: 40}}>
        logout
      </Button>
      <DatePicker />
      <TextInput style={{marginTop: 40}} />
      <Select
        items={[
          {label: 'test1', value: 'test1'},
          {label: 'test2', value: 'test2'},
        ]}
      />
    </SafeAreaView>
  );
};

export default Profile;
