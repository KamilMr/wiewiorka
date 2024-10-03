import {
  DatePickerInput,
  pl,
  registerTranslation,
} from 'react-native-paper-dates';

registerTranslation('pl', pl);

interface CustomeDatePickerProps {
  editable: boolean;
  label: string;
  onChange: (date: Date | undefined) => Date | undefined;
  readOnly: boolean;
  style?: any;
  value: Date | null;
}

const defaultValue = new Date();

const CustomeDatePicker = ({
  label,
  editable,
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
    <DatePickerInput
      inputMode="end"
      readOnly={readOnly}
      editable={editable}
      keyboardType="numeric"
      locale="pl"
      label={label}
      value={value || defaultValue}
      onChange={handleOnConfirm}
      style={[style]}
    />
  );
};

export default CustomeDatePicker;
