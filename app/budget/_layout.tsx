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
        title: 'Budzet',
      }}
    />
  );
}
