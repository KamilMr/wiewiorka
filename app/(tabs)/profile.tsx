import {useAppDispatch} from '@/hooks';
import {logout} from '@/redux/auth/thunks';
import {Button} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';

const Profile = () => {
  const dispatch = useAppDispatch();
  const handleLogout = () => {
    dispatch(logout());
  };
  return (
    <SafeAreaView>
      <Button icon="camera" mode="contained" onPress={handleLogout}>
        logout
      </Button>
    </SafeAreaView>
  );
};

export default Profile;
