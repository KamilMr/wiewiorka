import {Stack} from 'expo-router';
import {appHeaderStatusOptions} from '@/components/navigation/AppHeaderTitle';

export default function IncomeSummaryLayout() {
  return (
    <Stack
      screenOptions={{
        ...appHeaderStatusOptions,
        title: 'Wpływy',
      }}
    />
  );
}
