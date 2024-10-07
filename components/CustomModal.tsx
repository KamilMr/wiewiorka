import React from 'react';
import {View, StyleSheet} from 'react-native';
import {IconButton, Modal} from 'react-native-paper';

interface CustomModal {
  visible: boolean;
  children: React.ReactNode;
  onDismiss: () => void;
}

const CustomModal = (props: CustomModal) => {
  const {visible, onDismiss, children} = props;
  return (
    <Modal visible={visible} onDismiss={onDismiss}>
      <View style={styles.modalBg}>
        <View style={styles.header}>
          <IconButton icon="close" onPress={onDismiss} style={{margin: 0}} />
        </View>
        <View style={styles.view}>{children}</View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  view: {flex: 1, justifyContent: 'center', overflow: 'hidden'},
  modalBg: {
    width: '100%',
    height: '100%',
  },
  header: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

export default CustomModal;
