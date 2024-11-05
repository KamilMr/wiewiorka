import {Text, TextProps} from 'react-native-paper';

type CustomTextProps = TextProps<{}> & {
  variant?: 'bodyLarge' | 'bodyMedium' | 'bodySmall';
};

export default function CustomText({
  children,
  variant,
  ...props
}: CustomTextProps) {
  return (
    <Text {...props} variant={variant}>
      {children}
    </Text>
  );
}
