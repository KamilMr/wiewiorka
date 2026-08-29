import {Redirect, Stack} from 'expo-router';

import {useAppSelector} from '@/hooks';
import {selectToken} from '@/redux/auth/authSlice';
import {
  appHeaderOptions,
  appHeaderStatusOptions,
} from '@/components/navigation/AppHeaderTitle';

export default function Layout() {
  const token = useAppSelector(selectToken);

  if (!token) return <Redirect href="/sign-in" />;

  return (
    <Stack screenOptions={{...appHeaderOptions, ...appHeaderStatusOptions}}>
      <Stack.Screen
        name="index"
        options={{headerShown: true, title: 'Kategorie'}}
      />
      <Stack.Screen
        name="[id]"
        options={{headerShown: true, title: 'Edycja'}}
      />
    </Stack>
  );
}
