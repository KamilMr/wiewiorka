import {useIsLoading} from '@/hooks/index';
import {View} from 'react-native';

import {Button} from 'react-native-paper';

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
  const loading = useIsLoading();
  return (
    <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
      <Button mode="outlined" onPress={handleCancel} disabled={disableOk || loading}>
        {cancelTxt}
      </Button>
      <Button
        loading={loading}
        mode="contained"
        onPress={handleOk}
        disabled={disableOk || loading}>
        {okTxt}
      </Button>
    </View>
  );
};
