import React, {useState} from 'react';
import {Link, router} from 'expo-router';
import {StyleSheet, View} from 'react-native';

import {Button, TextInput} from 'react-native-paper';

import {signIn} from '@/redux/auth/thunks';
import {useAppDispatch} from '@/hooks';
import {Text} from '@/components';
import {useAppTheme} from '@/constants/theme';

const Login = () => {
  const dispatch = useAppDispatch();
  const [data, setData] = useState({
    email: process.env.EXPO_PUBLIC_USER_EMAIL || '',
    password: process.env.EXPO_PUBLIC_USER_PASSWORD || '',
  });
  const [rememberUser, setRememberUser] = useState(false);

  const t = useAppTheme();

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
      <View style={{flex: 1}}></View>
      <View style={{flex: 2, width: '100%'}}>
        <Text variant="bodyLarge" style={styles.heading}>
          Logowanie do konta
        </Text>
        <TextInput
          label="Email"
          value={data.email}
          keyboardType="email-address"
          onChangeText={handleData('email')}
          style={[styles.textInput, {marginBottom: 4 * 2}]}
        />
        <TextInput
          label="Hasło"
          value={data.password}
          keyboardType="visible-password"
          onChangeText={handleData('password')}
          style={styles.textInput}
        />
      </View>
      <Button
        onPress={handleSave}
        disabled={!isFormReady}
        mode="contained"
        style={{width: '80%', marginBottom: 8 * 2}}>
        <Text style={{color: t.colors.white}}>Zaloguj się</Text>
      </Button>
      <View style={{flexDirection: 'row', marginBottom: 4 * 2}}>
        <Text>Nie masz konta? </Text>
        <Link href="/sign-up">
          <Text
            style={{
              color: t.colors.primary,
              textDecorationLine: 'underline',
            }}>
            Zarejestruj się
          </Text>
        </Link>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    textAlign: 'center',
    marginBottom: 4 * 4,
  },
  textInput: {
    marginVertical: 4 * 2,
    marginHorizontal: 4 * 2,
  },
});

export default Login;
