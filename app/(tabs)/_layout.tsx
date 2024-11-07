import React, {useEffect} from 'react';
import {Redirect, Tabs} from 'expo-router';
import {TouchableOpacity} from 'react-native';

import {ActivityIndicator} from 'react-native-paper';

import {selectToken} from '@/redux/auth/authSlice';
import {fetchIni} from '@/redux/main/thunks';
import {useAppDispatch, useAppSelector} from '@/hooks';
import {TabBar} from '@/components';
import {TabBarIcon} from '@/components/navigation/TabBarIcon';
import {sizes} from '@/constants/theme';
import {selectStatus} from '@/redux/main/selectors';

const TabLayout = () => {
  const token = useAppSelector(selectToken);
  const fetching = useAppSelector(selectStatus);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!token) return;
    dispatch(fetchIni());
  }, [dispatch]);

  if (!token) return <Redirect href="/sign-in" />;

  const handleFetch = async () => {
    if (fetching === 'fetching') return;
    dispatch(fetchIni());
  };

  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: true,
        headerTitle: '',
        headerRightContainerStyle: {paddingRight: sizes.xxl},
        headerRight: () => {
          return fetching === 'idle' ? (
            <TouchableOpacity onPress={handleFetch}>
              <TabBarIcon name="reload" />
            </TouchableOpacity>
          ) : (
            <ActivityIndicator />
          );
        },
      }}>
      <Tabs.Screen name="index" options={{title: 'Stron główna'}} />
      <Tabs.Screen
        name="records"
        options={{title: 'Wydatki/Wpływy', headerShown: true}}
      />
      <Tabs.Screen name="addnew" options={{title: 'Dodaj'}} />
      <Tabs.Screen
        name="summary"
        options={{title: 'Podsumowanie', headerShown: true}}
      />
      <Tabs.Screen name="profile" options={{title: 'Profil'}} />
    </Tabs>
  );
};
export default TabLayout;
