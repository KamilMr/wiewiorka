import React from 'react';
import {useSelector} from 'react-redux';
import {Redirect, Tabs} from 'expo-router';

import {TabBarIcon} from '@/components/navigation/TabBarIcon';
import {selectToken} from '@/redux/auth/authSlice';

const TabLayout = () => {
  const token = useSelector(selectToken);

  if (!token) return <Redirect href="/sign-in" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({color, focused}) => (
            <TabBarIcon
              name={focused ? 'home' : 'home-outline'}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Wpływy',
          tabBarIcon: ({color, focused}) => (
            <TabBarIcon
              name={focused ? 'code-slash' : 'code-slash-outline'}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
};
export default TabLayout;
