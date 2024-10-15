import React, {useEffect} from 'react';
import {Redirect, Tabs} from 'expo-router';

import {TabBarIcon} from '@/components/navigation/TabBarIcon';
import {selectToken} from '@/redux/auth/authSlice';
import {fetchIni} from '@/redux/main/thunks';
import {useAppDispatch, useAppSelector} from '@/hooks';
import {TabBar} from '@/components';

const TabLayout = () => {
  const token = useAppSelector(selectToken);
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log('works');
    if (!token) return;
    dispatch(fetchIni());
  }, [dispatch]);

  if (!token) return <Redirect href="/sign-in" />;

  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
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
        name="expense"
        options={{
          title: 'Dodaj',
          href: {
            pathname: '/(tabs)/expense',
            params: {id: ''},
          },
          tabBarIcon: ({color, focused}) => (
            <TabBarIcon
              name={focused ? 'add' : 'add-outline'}
              color={color}
              style={{
                backgroundColor: '#cd5700',
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
        name="income"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
};
export default TabLayout;
