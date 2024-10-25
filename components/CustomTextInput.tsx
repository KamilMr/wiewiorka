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
      value={value}
      ref={innerRef}
      style={[styles.root, style]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  root: {marginVertical: 8},
});

export default CustomTextInput;
