import {forwardRef} from 'react';
import {
  Button,
  ButtonProps,
  IconButton,
  IconButtonProps,
} from 'react-native-paper';
import {useIsLoading} from '@/hooks';

export default function CustomButton(props: ButtonProps) {
  const {children, ...pr} = props;
  return <Button {...pr}>{children}</Button>;
}

export const ButtonWithStatus = forwardRef<
  typeof Button,
  ButtonProps & {showLoading?: boolean}
>((props, ref) => {
  const isLoading = useIsLoading();
  const {children, ...pr} = props;
  return (
    <Button
      ref={ref}
      {...pr}
      disabled={isLoading || pr.disabled}
      loading={(props.showLoading && isLoading) || pr.loading}
    >
      {children}
    </Button>
  );
});

export function IconButtonWithStatus(
  props: IconButtonProps & {showLoading?: boolean},
) {
  const isLoading = useIsLoading();

  return (
    <IconButton
      {...props}
      disabled={isLoading || props.disabled}
      loading={(props.showLoading && isLoading) || props.loading}
    />
  );
}

export function CustomIconButton(props: IconButtonProps) {
  return <IconButton {...props} />;
}
