import {Stack, router} from 'expo-router';
import {useEffect} from 'react';
import {useDev} from '@/hooks';
import KeyboardView from '@/components/KeyboardView';
import {
  appHeaderOptions,
  appHeaderStatusOptions,
} from '@/components/navigation/AppHeaderTitle';

export default function DevLayout() {
  const devMode = useDev();

  useEffect(() => {
    if (!devMode) {
      router.replace('/(tabs)/settings');
    }
  }, [devMode]);

  if (!devMode) {
    return null;
  }

  return (
    <KeyboardView offset={0}>
      <Stack
        screenOptions={{
          ...appHeaderOptions,
          ...appHeaderStatusOptions,
        }}
      >
        <Stack.Screen name="index" options={{title: 'Dev'}} />
        <Stack.Screen name="show-reel" options={{title: 'Show Reel'}} />
        <Stack.Screen name="dropdown" options={{title: 'Dropdown'}} />
        <Stack.Screen name="storage" options={{title: 'Storage'}} />
        <Stack.Screen name="sync-logs" options={{title: 'Sync Logs'}} />
      </Stack>
    </KeyboardView>
  );
}
