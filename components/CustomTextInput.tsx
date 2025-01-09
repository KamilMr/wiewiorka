import {sizes} from '@/constants/theme';
import {StyleSheet} from 'react-native';
import {TextInput, TextInputProps} from 'react-native-paper';

const CustomTextInput = ({
  onChangeText,
  value,
  style,
  innerRef,
  ...props
}: TextInputProps) => {
  return (
    <TextInput
      onChangeText={onChangeText}
      dense
      mode="outlined"
      value={value}
      ref={innerRef}
      style={[styles.root, style]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: sizes.sm,
  },
});

export default CustomTextInput;
