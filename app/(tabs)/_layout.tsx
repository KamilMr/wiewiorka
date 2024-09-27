import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Redirect, Tabs} from 'expo-router';

import {TabBarIcon} from '@/components/navigation/TabBarIcon';
import {selectToken} from '@/redux/auth/authSlice';
import {fetchIni} from '@/redux/main/thunks';

const TabLayout = () => {
  const token = useSelector(selectToken);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!token) return;
    console.log('fetching ini');
    dispatch(fetchIni());
  }, [dispatch]);

  if (!token) return <Redirect href="/sign-in" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          borderTopWidth: 0,
          padding: 0,
        },
        tabBarShowLabel: false,
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
        name="records"
        options={{
          title: 'Historia',
          tabBarIcon: ({color, focused}) => (
            <TabBarIcon
              name={focused ? 'cash' : 'cash-outline'}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="newRecord"
        options={{
          title: 'Dodaj',
          tabBarIcon: ({color, focused}) => (
            <TabBarIcon
              name={focused ? 'add' : 'add-outline'}
              color={color}
              style={{
                backgroundColor: 'green',
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderRadius: 50,
                height: 50,
                marginBottom: 20,
              }}
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
      <Tabs.Screen
        name="expense"
        options={{
          href: null
        }}
      />
    </Tabs>
  );
};
export default TabLayout;
