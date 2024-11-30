import {Text} from 'react-native-paper';
import {Props} from 'react-native-paper/lib/typescript/components/Typography/Text';

type CustomTextProps = Props<string> & {
  variant?: 'bodyLarge' | 'bodyMedium' | 'bodySmall' |'titleLarge';
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
