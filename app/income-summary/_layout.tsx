import {Stack} from 'expo-router';
import {
  appHeaderOptions,
  appHeaderStatusOptions,
} from '@/components/navigation/AppHeaderTitle';

export default function IncomeSummaryLayout() {
  return (
    <Stack
      screenOptions={{
        ...appHeaderOptions,
        ...appHeaderStatusOptions,
        title: 'Wpływy',
      }}
    />
  );
}
