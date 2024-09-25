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
        name="income"
        options={{
          title: 'Wpływy',
          tabBarIcon: ({color, focused}) => (
            <TabBarIcon
              name={focused ? 'cash' : 'cash-outline'}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="expenses"
        options={{
          title: 'Wydatki',
          tabBarIcon: ({color, focused}) => (
            <TabBarIcon
              name={focused ? 'cart' : 'cart-outline'}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="summary"
        options={{
          title: 'Podsumowanie',
          tabBarIcon: ({color, focused}) => (
            <TabBarIcon
              name={focused ? 'bar-chart' : 'bar-chart-outline'}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({color, focused}) => (
            <TabBarIcon
              name={focused ? 'person' : 'person-outline'}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
};
export default TabLayout;
