import {Button} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';

import {useAppDispatch} from '@/hooks';
import {logout} from '@/redux/auth/thunks';

const Profile = () => {
  const dispatch = useAppDispatch();
  const handleLogout = () => {
    dispatch(logout());
  };
  return (
    <SafeAreaView>
      <Button icon="logout" mode="contained" onPress={handleLogout}>
        logout
      </Button>
    </SafeAreaView>
  );
};

export default Profile;
