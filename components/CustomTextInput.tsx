import {StyleSheet} from 'react-native';
import {TextInput} from 'react-native-paper';

const CustomTextInput = ({onChangeText, value, style, ...props}) => {
  return (
    <TextInput
      onChangeText={onChangeText}
      value={value}
      {...props}
      style={[styles.root, style]}
    />
  );
};

const styles = StyleSheet.create({
  root: {},
});

export default CustomTextInput;
