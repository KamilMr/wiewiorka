import React, {forwardRef} from 'react';
import {StyleSheet} from 'react-native';

import {TextInput, TextInputProps} from 'react-native-paper';

import {sizes} from '@/constants/theme';

const CustomTextInput = forwardRef<typeof TextInput, TextInputProps>(
  ({onChangeText, value, style, ...props}, ref) => {
    return (
      <TextInput
        onChangeText={onChangeText}
        dense
        mode="outlined"
        value={value}
        ref={ref}
        style={[styles.root, style]}
        {...props}
      />
    );
  },
);

const styles = StyleSheet.create({
  root: {
  },
});

export default CustomTextInput;
