import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useNetInfo} from '@react-native-community/netinfo';
import {useAppSelector} from '@/hooks';
import {selectOperations} from '@/redux/sync/syncSlice';

const StatusIndicator: React.FC = () => {
  const netInfo = useNetInfo();
  const operations = useAppSelector(selectOperations);

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

  return <View style={getStatusDotStyle()} />;
};

const styles = StyleSheet.create({});

export default StatusIndicator;
