import React, {useEffect} from 'react';
import {Redirect, Tabs} from 'expo-router';
import {View, StyleSheet} from 'react-native';

import {selectToken} from '@/redux/auth/authSlice';
import {fetchIni} from '@/redux/main/thunks';
import {useAppDispatch, useAppSelector} from '@/hooks';
import {TabBarIcon} from '@/components/navigation/TabBarIcon';
import {sizes} from '@/constants/theme';
import {selectOperations} from '@/redux/sync/syncSlice';
import {useNetInfo} from '@react-native-community/netinfo';

export default function TabLayout() {
  const token = useAppSelector(selectToken);
  const operations = useAppSelector(selectOperations);
  const dispatch = useAppDispatch();
  const netInfo = useNetInfo();

  useEffect(() => {
    if (!token) return;
    dispatch(fetchIni());
  }, [dispatch]);

  if (!token) return <Redirect href="/sign-in" />;

  const getStatusDotColor = () => {
    if (!netInfo.isConnected) return '#666666';
    if (netInfo.isInternetReachable === false) return '#FFA500';
    if (operations.length > 0) return '#4CAF50';
    return '#4CAF50';
  };

  const getStatusDotStyle = () => {
    const baseStyle = {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: getStatusDotColor(),
    };

    if (netInfo.isConnected && operations.length > 0) {
      return {
        ...baseStyle,
        borderWidth: 2,
        borderColor: '#FFA500',
      };
    }

    return baseStyle;
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTitle: '',
        tabBarShowLabel: false,
        headerRightContainerStyle: {paddingRight: sizes.xxl},
        headerRight: () => {
          return <View style={getStatusDotStyle()} />;
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({color}) => <TabBarIcon name="home" color={color} />,
          title: 'Stron główna',
        }}
      />
      <Tabs.Screen
        name="records"
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({color}) => <TabBarIcon name="cash" color={color} />,
          title: 'Wydatki/Wpływy',
          headerShown: true,
        }}
      />
      <Tabs.Screen
        name="addnew"
        options={{
          tabBarIcon: ({color}) => <TabBarIcon name="add" color={color} />,
          title: 'Dodaj',
        }}
      />
      <Tabs.Screen
        name="summary"
        options={{
          tabBarIcon: ({color}) => (
            <TabBarIcon name="bar-chart" color={color} />
          ),
          title: 'Podsumowanie',
          headerShown: true,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({color}) => <TabBarIcon name="settings" color={color} />,
          title: 'Ustawienia',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({});
