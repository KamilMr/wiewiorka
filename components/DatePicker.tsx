import {useState} from 'react';
import {
  DatePickerInput,
  pl,
  registerTranslation,
} from 'react-native-paper-dates';

registerTranslation('pl', pl);

interface CustomeDatePickerProps {
  editable: boolean;
  label: string;
  onChange: (date: Date | undefined) => Date;
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
  const [date, setDate] = useState<Date | undefined>(value || new Date());

  const handleOnConfirm = (date: Date | undefined) => {
    setDate(date);
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
      value={date}
      onChange={handleOnConfirm}
      style={[style]}
    />
  );
};

export default CustomeDatePicker;
