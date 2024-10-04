import {View, StyleSheet} from 'react-native';
import {IconButton, Modal} from 'react-native-paper';

const CustomModal = ({visible, onDismiss, children}) => {
  return (
    <Modal visible={visible} onDismiss={onDismiss}>
      <View style={styles.modalBg}>
        <View style={styles.header}>
          <IconButton icon="close" onPress={onDismiss} style={{margin: 0}} />
        </View>
        <View style={{flex: 1, justifyContent: 'center', overflow: 'hidden'}}>
          {children}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
