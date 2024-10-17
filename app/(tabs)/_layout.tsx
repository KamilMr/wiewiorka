import React, {useEffect} from 'react';
import {Redirect, Tabs} from 'expo-router';

import {selectToken} from '@/redux/auth/authSlice';
import {fetchIni} from '@/redux/main/thunks';
import {useAppDispatch, useAppSelector} from '@/hooks';
import {TabBar} from '@/components';

const TabLayout = () => {
  const token = useAppSelector(selectToken); const dispatch = useAppDispatch();

  useEffect(() => {
    if (!token) return;
    dispatch(fetchIni());
  }, [dispatch]);

  if (!token) return <Redirect href="/sign-in" />;

  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: true,
      }}>
      <Tabs.Screen name="index" options={{title: 'Stron główna'}}/>
      <Tabs.Screen name="records" options={{title: 'Wydatki/Wpływy'}}/>
      <Tabs.Screen name="addnew" options={{title: 'Dodaj'}}/>
      <Tabs.Screen name="summary" options={{title: 'Podsumowanie'}} />
      <Tabs.Screen name="profile" options={{title: 'Profil'}}/>
    </Tabs>
  );
};
export default TabLayout;
