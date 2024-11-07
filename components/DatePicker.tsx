import {sizes} from '@/constants/theme';
import {View} from 'react-native';
import {
  DatePickerInput,
  pl,
  registerTranslation,
} from 'react-native-paper-dates';

registerTranslation('pl', pl);

interface CustomeDatePickerProps {
  editable?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  label?: string;
  onChange: (date: Date | undefined) => void;
  style?: object;
  value: Date | null;
}

const defaultValue = new Date();

const CustomeDatePicker = ({
  label,
  editable,
  disabled,
  readOnly,
  onChange = () => {},
  value,
  style,
}: CustomeDatePickerProps) => {
  const handleOnConfirm = (date: Date | undefined) => {
    if (!date) return;
    onChange(date);
  };

  return (
    <View style={{maxWidth: 360, marginHorizontal: sizes.xl, ...style}}>
      <DatePickerInput
        inputMode="end"
        editable={editable}
        disabled={disabled}
        readOnly={readOnly}
        presentationStyle="pageSheet"
        keyboardType="numeric"
        locale="pl"
        label={label}
        value={value || defaultValue}
        onChange={handleOnConfirm}
      />
    </View>
  );
};

export default CustomeDatePicker;
