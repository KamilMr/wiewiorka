import React from 'react';

import {StyleSheet} from 'react-native';
import {Button, Dialog, Portal, Text} from 'react-native-paper';

export interface CustomModal {
  visible: boolean;
  onDismiss?: () => void;
  onApprove?: () => void;
  title?: string;
  content: string | React.ReactNode;
}

const CustomModal = (props: CustomModal) => {
  const {visible, onDismiss, onApprove, content, title} = props;

  // If 'visible' is false or 'content' is not provided, don't render the modal
  if (!visible || !content) {
    return null;
  }

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        {/* Render title only if it's provided */}
        {title && <Dialog.Title>{title}</Dialog.Title>}

        <Dialog.Content>
          {typeof content === 'string' ? (
            <Text variant="bodyMedium">{content}</Text>
          ) : (
            content
          )}
        </Dialog.Content>

        {/* Render actions only if 'onApprove' or 'onDismiss' is provided */}
        {(onApprove || onDismiss) && (
          <Dialog.Actions>
            {onApprove && <Button onPress={onApprove}>Tak</Button>}
            {onDismiss && <Button onPress={onDismiss}>Nie</Button>}
          </Dialog.Actions>
        )}
      </Dialog>
    </Portal>
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
