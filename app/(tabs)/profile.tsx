import {Button} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';

import {useAppDispatch} from '@/hooks';
import {logout} from '@/redux/auth/thunks';
import CustomeDatePicker from '@/components/DatePicker';
import CustomTextInput from '@/components/CustomTextInput';
import CustomSelect from '@/components/CustomSelect';

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
      <CustomeDatePicker />
      <CustomTextInput style={{marginTop: 40}} />
      <CustomSelect
        items={[
          {label: 'test1', value: 'test1'},
          {label: 'test2', value: 'test2'},
        ]}
      />
    </SafeAreaView>
  );
};

export default Profile;
