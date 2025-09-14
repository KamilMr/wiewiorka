import React, {useState, useRef} from 'react';
import {usePathname} from 'expo-router';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Modal,
  Dimensions,
} from 'react-native';

import {useAppDispatch} from '@/hooks';
import {toggleDevMode, setSnackbar, clearDevMode} from '@/redux/main/mainSlice';
import {useDev} from '@/hooks';
import {TabBarIcon} from '@/components/navigation/TabBarIcon';

interface DevModeToggleProps {
  children: React.ReactNode;
}

const DevModeToggle: React.FC<DevModeToggleProps> = ({children}) => {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const devMode = useDev();

  const [tapCount, setTapCount] = useState(0);
  const firstTapTime = useRef<number | null>(null);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({x: 0, y: 0});
  const devBadgeRef = useRef<TouchableOpacity>(null);

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
              msg: devMode ? 'Tryb dev wyłączony' : 'Tryb dev włączony',
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

  const handleDevBadgePress = () => {
    if (!devBadgeRef.current) return;

    devBadgeRef.current.measure((x, y, width, height, pageX, pageY) => {
      const menuWidth = 100;

      const posX = Math.max(10, pageX - menuWidth);

      setMenuPosition({
        x: posX,
        y: pageY,
      });
      setShowContextMenu(true);
    });
  };

  const handleExitDevMode = () => {
    dispatch(clearDevMode());
    dispatch(
      setSnackbar({
        msg: 'Tryb dev wyłączony',
        type: 'success',
      }),
    );
    setShowContextMenu(false);
  };

  return (
    <>
      <TouchableOpacity onPress={handleTap} style={styles.container}>
        {devMode && (
          <TouchableOpacity
            ref={devBadgeRef}
            onPress={handleDevBadgePress}
            style={styles.devBadge}
          >
            <Text style={styles.devText}>DEV</Text>
          </TouchableOpacity>
        )}
        {children}
      </TouchableOpacity>

      <Modal
        visible={showContextMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowContextMenu(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowContextMenu(false)}
        >
          <View
            style={[
              styles.contextMenu,
              {top: menuPosition.y, left: menuPosition.x},
            ]}
          >
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleExitDevMode}
            >
              <TabBarIcon name="exit" color="#239" size={16} />
              <Text style={styles.menuItemText}>Wyłącz</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  contextMenu: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    minWidth: 100,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  menuItemText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginLeft: 8,
  },
});

export default DevModeToggle;
