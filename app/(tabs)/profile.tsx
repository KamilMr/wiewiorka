import {Button} from 'react-native-paper';

import {useAppDispatch} from '@/hooks';
import {logout} from '@/redux/auth/thunks';
import {StyleSheet, View} from 'react-native';

const Profile = () => {
  const dispatch = useAppDispatch();
  const handleLogout = () => {
    dispatch(logout());
  };
  return (
    <View style={styles.root}>
      <Button
        icon="logout"
        mode="contained"
        onPress={handleLogout}
        style={{marginBottom: 40}}>
        logout
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 90,
  },
});

export default Profile;
