import {Stack} from 'expo-router';
import DevModeToggle from '@/components/DevModeToggle';
import StatusIndicator from '@/components/StatusIndicator';
import {appHeaderOptions} from '@/components/navigation/AppHeaderTitle';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        ...appHeaderOptions,
        title: 'Budzet',
        headerRightContainerStyle: {paddingRight: 20},
        headerRight: () => (
          <DevModeToggle>
            <StatusIndicator />
          </DevModeToggle>
        ),
      }}
    />
  );
}
