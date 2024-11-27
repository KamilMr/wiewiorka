import {Redirect, Stack} from 'expo-router';

import {useAppSelector} from '@/hooks';
import {selectToken} from '@/redux/auth/authSlice';

export default function Layout() {
  const token = useAppSelector(selectToken);

  if (!token) return <Redirect href="/sign-in" />;

  return (
    <Stack>
      <Stack.Screen name="index" options={{headerShown: false}} />
    </Stack>
  );
}
