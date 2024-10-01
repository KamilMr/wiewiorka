import {useEffect} from 'react';

import {Snackbar} from 'react-native-paper';

import {useAppDispatch, useAppSelector} from '@/hooks';
import {selectSnackbar} from '@/redux/main/selectors';
import {setSnackbar} from '@/redux/main/mainSlice';

const CustomSnackBar = () => {
  const dispatch = useAppDispatch();
  let {open: visible, type = '', msg} = useAppSelector(selectSnackbar);

  if (typeof msg !== 'string') msg = '';

  const onDismissSnackBar = () => dispatch(setSnackbar({open: false}));

  useEffect(() => {
    const id = setTimeout(() => {
      dispatch(setSnackbar({}));
    }, 4000);

    return () => {
      clearTimeout(id);
    };
  }, [visible, type, msg, dispatch]);

  return (
    <Snackbar
      visible={visible}
      onDismiss={onDismissSnackBar}
      action={{
        label: 'Undo',
        onPress: () => {
          onDismissSnackBar();
        },
      }}>
      {msg}
    </Snackbar>
  );
};

export default CustomSnackBar;
