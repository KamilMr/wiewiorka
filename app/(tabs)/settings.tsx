import {Button, ActivityIndicator} from 'react-native-paper';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';

import {useAppDispatch, useAppSelector} from '@/hooks';
import {logout} from '@/redux/auth/thunks';
import {useAppTheme} from '@/constants/theme';
import {router} from 'expo-router';
import {selectStatus} from '@/redux/main/selectors';
import {setShouldReload, selectOperations} from '@/redux/sync/syncSlice';
import {TabBarIcon} from '@/components/navigation/TabBarIcon';
import {useNetInfo} from '@react-native-community/netinfo';
import AppVersion from '@/components/AppVersion';

const Settings = () => {
  const dispatch = useAppDispatch();
  const t = useAppTheme();
  const fetching = useAppSelector(selectStatus);
  const operations = useAppSelector(selectOperations);
  const netInfo = useNetInfo();

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleFetch = async () => {
    if (fetching === 'fetching') return;
    dispatch(setShouldReload());
  };

  const getReloadIconColor = () => {
    if (!netInfo.isConnected) return '#666666';
    if (netInfo.isInternetReachable === false) return '#FFA500';
    return '#4CAF50';
  };
  return (
    <View style={[styles.root, {backgroundColor: t.colors.white}]}>
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.navigate('/budget')}
        >
          <TabBarIcon name="wallet" color={t.colors.primary} />
          <Text style={[styles.tabText, {color: t.colors.primary}]}>
            Budżet
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.navigate('/categories')}
        >
          <TabBarIcon name="list" color={t.colors.primary} />
          <Text style={[styles.tabText, {color: t.colors.primary}]}>
            Kategorie
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.reloadContainer}>
        {fetching === 'idle' ? (
          <TouchableOpacity onPress={handleFetch} style={styles.reloadButton}>
            <View style={styles.iconContainer}>
              <TabBarIcon name="reload" color={getReloadIconColor()} />
              {operations.length > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}></Text>
                </View>
              )}
            </View>
            <Text style={styles.reloadText}>Synchronizuj</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.reloadButton}>
            <ActivityIndicator />
            <Text style={styles.reloadText}>Synchronizacja...</Text>
          </View>
        )}
      </View>
      <Button icon="logout" mode="contained" onPress={handleLogout}>
        Wyloguj się
      </Button>
      <AppVersion />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: '100%',
    marginBottom: 90,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    marginBottom: 40,
  },
  tabItem: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 8,
  },
  tabText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    marginBottom: 40,
  },
  reloadContainer: {
    marginBottom: 40,
  },
  reloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  iconContainer: {
    position: 'relative',
    marginRight: 8,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  reloadText: {
    fontSize: 16,
    color: '#333',
  },
});

export default Settings;
