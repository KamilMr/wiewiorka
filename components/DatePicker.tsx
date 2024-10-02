import {
  DatePickerInput,
  pl,
  registerTranslation,
} from 'react-native-paper-dates';

registerTranslation('pl', pl);

interface CustomeDatePickerProps {
  editable: boolean;
  label: string;
  onChange: (date: Date | undefined) => Date | void;
  readOnly: boolean;
  style?: any;
  value: Date | null;
}

const CustomeDatePicker = ({
  label,
  editable,
  readOnly,
  onChange = () => {},
  value,
  style,
}: CustomeDatePickerProps) => {

  const handleOnConfirm = (date: Date | undefined) => {
    if(!date) return;
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
      value={value || new Date()}
      onChange={handleOnConfirm}
      style={[style]}
    />
  );
};

export default CustomeDatePicker;
