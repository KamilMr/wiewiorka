import NetInfo from '@react-native-community/netinfo';
import {useEffect, useState} from 'react';

export interface NetworkState {
  isConnected: boolean | null;
  isInternetReachable: boolean | null;
  type: string | null;
}

export const useNetworkStatus = () => {
  const [networkState, setNetworkState] = useState<NetworkState>({
    isConnected: null,
    isInternetReachable: null,
    type: null,
  });

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setNetworkState({
        isConnected: state.isConnected,
        isInternetReachable: state.isInternetReachable,
        type: state.type,
      });
    });

    return unsubscribe;
  }, []);

  return networkState;
};

export const getCurrentNetworkState = async (): Promise<NetworkState> => {
  const state = await NetInfo.fetch();
  return {
    isConnected: state.isConnected,
    isInternetReachable: state.isInternetReachable,
    type: state.type,
  };
};

export const isOnline = async (): Promise<boolean> => {
  const state = await getCurrentNetworkState();
  return state.isConnected === true && state.isInternetReachable === true;
};
