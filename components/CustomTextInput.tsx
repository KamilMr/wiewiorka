import {TextInput} from 'react-native-paper';

const CustomTextInput = ({onChange, value, ...props}) => {
  return <TextInput onChange={onChange} value={value} {...props} />;
};

export default CustomTextInput;
