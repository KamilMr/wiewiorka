import {Stack} from 'expo-router';
import DevModeToggle from '@/components/DevModeToggle';
import StatusIndicator from '@/components/StatusIndicator';
import {appHeaderOptions} from '@/components/navigation/AppHeaderTitle';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        ...appHeaderOptions,
        headerRightContainerStyle: {paddingRight: 20},
        headerRight: () => (
          <DevModeToggle>
            <StatusIndicator />
          </DevModeToggle>
        ),
      }}
    >
      <Stack.Screen name="index" options={{title: 'Spiżarnia'}} />
      <Stack.Screen name="shop-list" options={{title: 'Lista zakupów'}} />
    </Stack>
  );
}
