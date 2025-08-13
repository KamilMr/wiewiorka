import {useIsLoading} from '@/hooks/index';
import {View} from 'react-native';

import {ButtonWithStatus as Button} from '@/components';

interface TwoButtonsProps {
  handleOk: () => void;
  handleCancel: () => void;
  cancelTxt?: string;
  okTxt?: string;
  visible?: boolean;
  disableOk?: boolean;
}

export const TwoButtons: React.FC<TwoButtonsProps> = ({
  handleOk,
  handleCancel,
  cancelTxt = 'Anuluj',
  okTxt = 'Tak',
  visible = true,
  disableOk = false,
}) => {
  if (!visible) return null;
  return (
    <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
      <Button mode="outlined" onPress={handleCancel} disabled={disableOk}>
        {cancelTxt}
      </Button>
      <Button
        mode="contained"
        showLoading
        onPress={handleOk}
        disabled={disableOk}
      >
        {okTxt}
      </Button>
    </View>
  );
};
