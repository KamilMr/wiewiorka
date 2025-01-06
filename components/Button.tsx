import {Button, ButtonProps} from 'react-native-paper';
import {useIsLoading} from '@/hooks';

export default function CustomButton(props: ButtonProps) {
  const {children, ...pr} = props;
  return <Button {...pr}>{children}</Button>;
}

export function ButtonWithStatus(props: ButtonProps & {showLoading?: boolean}) {
  const isLoading = useIsLoading();
  const {children, ...pr} = props;
  return (
    <Button
      disabled={isLoading || pr.disabled}
      {...pr}
      loading={(props.showLoading && isLoading) || pr.loading}>
      {children}
    </Button>
  );
}
