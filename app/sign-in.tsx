import {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Text, TextInput} from 'react-native-paper';
import {signIn} from '@/redux/auth/thunks';
import {router} from 'expo-router';
import {useAppDispatch} from '@/hooks';

const Login = () => {
  const dispatch = useAppDispatch();
  const [data, setData] = useState({
    email: process.env.EXPO_PUBLIC_USER_EMAIL || '',
    password: process.env.EXPO_PUBLIC_USER_PASSWORD || '',
  });
  const [rememberUser, setRememberUser] = useState(false);

  const isFormReady = data.password && data.email;

  const handleCheckbox = () => setRememberUser(!rememberUser);

  const handleData = (field: string) => (text: string) => {
    setData((data) => ({...data, [field]: text}));
  };

  const handleForgotPassword = () => {
    // TODO:
  };

  const handleSave = () => {
    dispatch(signIn(data)).then(() => router.replace('/'));
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text variant="headlineSmall" style={styles.heading}>
        Logowanie do konta
      </Text>
      <TextInput
        label="Email"
        value={data.email}
        onChangeText={handleData('email')}
        style={[styles.textInput, {marginBottom: 4 * 2}]}
      />
      <TextInput
        label="Hasło"
        value={data.password}
        onChangeText={handleData('password')}
        style={styles.textInput}
      />
      <Button onPress={handleSave} disabled={!isFormReady}>
        Login
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    textAlign: 'center',
    marginBottom: 4 * 4,
  },
  textInput: {
    width: '80%',
  },
});

export default Login;
