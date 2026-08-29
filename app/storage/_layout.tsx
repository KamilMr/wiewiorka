import {Stack} from 'expo-router';
import {
  appHeaderOptions,
  appHeaderStatusOptions,
} from '@/components/navigation/AppHeaderTitle';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        ...appHeaderOptions,
        ...appHeaderStatusOptions,
      }}
    >
      <Stack.Screen name="index" options={{title: 'Spiżarnia'}} />
      <Stack.Screen name="shop-list" options={{title: 'Lista zakupów'}} />
    </Stack>
  );
}
