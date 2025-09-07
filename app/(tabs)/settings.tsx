import {Button, ActivityIndicator} from 'react-native-paper';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';

import {useAppDispatch, useAppSelector} from '@/hooks';
import {logout} from '@/redux/auth/thunks';
import {useAppTheme} from '@/constants/theme';
import {router} from 'expo-router';
import {fetchIni} from '@/redux/main/thunks';
import {selectStatus} from '@/redux/main/selectors';
import {setShouldReload, selectOperations} from '@/redux/sync/syncSlice';
import {TabBarIcon} from '@/components/navigation/TabBarIcon';
import {useNetInfo} from '@react-native-community/netinfo';

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
      <Button
        mode="contained"
        onPress={() => {
          router.navigate('/budget');
        }}
        style={{marginBottom: 40}}
      >
        Budżet
      </Button>
      <Button
        mode="contained"
        onPress={() => {
          router.navigate('/categories');
        }}
        style={{marginBottom: 40}}
      >
        Kategorie
      </Button>
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
      <Button
        icon="logout"
        mode="contained"
        onPress={handleLogout}
        style={{marginBottom: 40}}
      >
        Wyloguj się
      </Button>
      <View style={{height: 80}} />
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
