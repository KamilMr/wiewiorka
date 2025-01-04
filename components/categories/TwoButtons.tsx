import {View} from 'react-native';

import {Button} from 'react-native-paper';
interface TwoButtonsProps {
  handleOk: () => void;
  handleCancel: () => void;
  cancelTxt?: string;
  okTxt?: string;
  visible?: boolean;
  disableOk?: boolean;
  loading: boolean;
}

export const TwoButtons: React.FC<TwoButtonsProps> = ({
  handleOk,
  handleCancel,
  cancelTxt = 'Anuluj',
  okTxt = 'Tak',
  visible = true,
  disableOk = false,
  loading = false,
}) => {
  if (!visible) return null;
  return (
    <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
      <Button mode="outlined" onPress={handleCancel} disabled={disableOk}>
        {cancelTxt}
      </Button>
      <Button
        loading={loading}
        mode="contained"
        onPress={handleOk}
        disabled={disableOk}>
        {okTxt}
      </Button>
    </View>
  );
};
