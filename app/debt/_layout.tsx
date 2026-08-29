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
        title: 'Długi',
      }}
    >
      <Stack.Screen name="index" options={{title: 'Długi'}} />
      <Stack.Screen name="[id]" options={{title: 'Szczegóły długu'}} />
    </Stack>
  );
}
