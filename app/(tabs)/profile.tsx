import {Button} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';

import {useAppDispatch} from '@/hooks';
import {logout} from '@/redux/auth/thunks';
import {useAppTheme} from '@/constants/theme';

const Profile = () => {
  const dispatch = useAppDispatch();
  const t = useAppTheme();
  const handleLogout = () => {
    dispatch(logout());
  };
  return (
    <View style={[styles.root, {backgroundColor: t.colors.white}]}>
      <Button
        icon="logout"
        mode="contained"
        onPress={handleLogout}
        style={{marginBottom: 40}}>
        logout
      </Button>
      <View style={{height: 80}} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: '100%',
    marginBottom: 90,
  },
});

export default Profile;
