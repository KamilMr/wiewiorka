import React, {useState, useRef} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {usePathname} from 'expo-router';
import {useAppDispatch} from '@/hooks';
import {toggleDevMode, setSnackbar} from '@/redux/main/mainSlice';
import {useDev} from '@/common';

interface DevModeToggleProps {
  children: React.ReactNode;
}

const DevModeToggle: React.FC<DevModeToggleProps> = ({children}) => {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const devMode = useDev();

  const [tapCount, setTapCount] = useState(0);
  const firstTapTime = useRef<number | null>(null);

  const handleTap = () => {
    if (pathname !== '/settings') return;

    const now = Date.now();

    if (firstTapTime.current === null) {
      firstTapTime.current = now;
      setTapCount(1);
    } else {
      const timeDiff = now - firstTapTime.current;

      if (timeDiff <= 5000) {
        const newTapCount = tapCount + 1;
        setTapCount(newTapCount);

        if (newTapCount >= 5) {
          dispatch(toggleDevMode());
          dispatch(
            setSnackbar({
              msg: devMode
                ? 'Tryb programisty wyłączony'
                : 'Tryb programisty włączony',
              type: 'success',
            }),
          );
          setTapCount(0);
          firstTapTime.current = null;
        }
      } else {
        firstTapTime.current = now;
        setTapCount(1);
      }
    }
  };

  return (
    <TouchableOpacity onPress={handleTap} style={styles.container}>
      {devMode && (
        <View style={styles.devBadge}>
          <Text style={styles.devText}>DEV</Text>
        </View>
      )}
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  devBadge: {
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 8,
  },
  devText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default DevModeToggle;
