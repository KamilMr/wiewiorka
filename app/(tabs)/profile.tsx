import {logout} from '@/redux/auth/thunks';
import {Button, Text} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';

const Profile = () => {
  const dispatch = useDispatch();
  return (
    <SafeAreaView>
      <Button icon="camera" mode="contained" onPress={() => dispatch(logout())}>
        logout
      </Button>
    </SafeAreaView>
  );
};

export default Profile;
