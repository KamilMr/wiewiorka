import {useEffect} from 'react';

import {Snackbar} from 'react-native-paper';
import {View} from 'react-native';

import {useAppDispatch, useAppSelector} from '@/hooks';
import {selectSnackbar} from '@/redux/main/selectors';
import {setSnackbar} from '@/redux/main/mainSlice';

const CustomSnackBar = () => {
  const dispatch = useAppDispatch();
  let {
    open: visible,
    type = '',
    msg,
    time = 1500,
  } = useAppSelector(selectSnackbar);

  if (typeof msg !== 'string') msg = '';

  const onDismissSnackBar = () => dispatch(setSnackbar({open: false}));

  useEffect(() => {
    const id = setTimeout(() => {
      dispatch(setSnackbar({}));
    }, time);

    return () => {
      clearTimeout(id);
    };
  }, [visible, type, msg, dispatch]);

  return (
    <Snackbar
      visible={visible}
      style={{bottom: 60}}
      onDismiss={onDismissSnackBar}
      action={{
        label: 'Zamknij',
        onPress: () => {
          onDismissSnackBar();
        },
      }}
    >
      {msg}
    </Snackbar>
  );
};

export default CustomSnackBar;
