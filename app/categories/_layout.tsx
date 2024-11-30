import {
  Redirect,
  Stack,
  useRootNavigationState,
  useLocalSearchParams,
  router,
} from 'expo-router';

import {IconButton} from 'react-native-paper';

import {useAppSelector} from '@/hooks';
import {selectToken} from '@/redux/auth/authSlice';

export default function Layout() {
  const token = useAppSelector(selectToken);

  if (!token) return <Redirect href="/sign-in" />;

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={() => ({
          headerShown: true,
          title: 'Kategorie',
          headerRight: () => <IconButton icon={'pencil'} />,
        })}
      />
      <Stack.Screen
        name="[id]"
        options={() => ({
          headerShown: true,
          title: 'Edycja',
          headerRight: () => <IconButton icon={'pencil'} />,
        })}
      />
    </Stack>
  );
}
