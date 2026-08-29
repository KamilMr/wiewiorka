import React from 'react';
import {Redirect, Stack} from 'expo-router';
import {View} from 'react-native';

import {IconButton} from 'react-native-paper';

import {useAppSelector} from '@/hooks';
import {selectToken} from '@/redux/auth/authSlice';
import DevModeToggle from '@/components/DevModeToggle';
import StatusIndicator from '@/components/StatusIndicator';
import {appHeaderOptions} from '@/components/navigation/AppHeaderTitle';

export default function Layout() {
  const token = useAppSelector(selectToken);

  if (!token) return <Redirect href="/sign-in" />;

  return (
    <Stack screenOptions={appHeaderOptions}>
      <Stack.Screen
        name="index"
        options={() => ({
          headerShown: true,
          title: 'Kategorie',
          headerRightContainerStyle: {paddingRight: 20},
          headerRight: () => (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <DevModeToggle>
                <StatusIndicator />
              </DevModeToggle>
            </View>
          ),
        })}
      />
      <Stack.Screen
        name="[id]"
        options={() => ({
          headerShown: true,
          title: 'Edycja',
          headerRightContainerStyle: {paddingRight: 20},
          headerRight: () => (
            <DevModeToggle>
              <StatusIndicator />
            </DevModeToggle>
          ),
        })}
      />
    </Stack>
  );
}
