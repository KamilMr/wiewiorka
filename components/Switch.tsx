import {useEffect, useState} from 'react';
import {Switch, SwitchProps} from 'react-native-paper';

interface CustomSwitchProps {
  value?: boolean;
  onChange?: (value: boolean) => void;
  disabled?: boolean;
}

const CustomSwitch = (props: CustomSwitchProps & SwitchProps) => {
  const {value = false, onChange, disabled = false} = props;
  const [isSwitchOn, setIsSwitchOn] = useState(value);

  useEffect(() => {
    setIsSwitchOn(value);
  }, [value]);

  const onToggleSwitch = () => {
    setIsSwitchOn(!isSwitchOn);
    onChange?.(!isSwitchOn);
  };

  return (
    <Switch
      value={isSwitchOn}
      onValueChange={onToggleSwitch}
      disabled={disabled}
    />
  );
};

export default CustomSwitch;
