import {Stack, router} from 'expo-router';
import {useEffect} from 'react';
import {useDev} from '@/common';
import KeyboardView from '@/components/KeyboardView';

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
    <KeyboardView>
      <Stack>
        <Stack.Screen name="index" options={{title: 'Dev'}} />
        <Stack.Screen name="show-reel" options={{title: 'Show Reel'}} />
        <Stack.Screen name="dropdown" options={{title: 'Dropdown'}} />
      </Stack>
    </KeyboardView>
  );
}
