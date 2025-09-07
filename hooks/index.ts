import {selectStatus} from '@/redux/main/selectors';
import {
  useDispatch,
  useSelector,
  TypedUseSelectorHook,
  useStore,
} from 'react-redux';
import type {AppStore, RootState, AppDispatch} from '@/redux/store';
import {
  selectOperations,
  selectShouldReload,
  clearShouldReload,
} from '@/redux/sync/syncSlice';
import {useEffect} from 'react';
import * as mainThunks from '@/redux/main/thunks';
import {useNetInfo} from '@react-native-community/netinfo';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
const useAppDispatch = useDispatch.withTypes<AppDispatch>();
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
const useAppStore: () => AppStore = useStore;

const useIsLoading = () => {
  const isLoading = useAppSelector(selectStatus);
  return isLoading === 'fetching';
};

const handler = {
  main: mainThunks,
};

const useSync = () => {
  const operations = useAppSelector(selectOperations);
  const shouldReload = useAppSelector(selectShouldReload);
  const dispatch = useAppDispatch();
  const con = useNetInfo();

  useEffect(() => {
    if (!con.isConnected) return;

    if (operations.length === 0 && shouldReload) {
      dispatch(mainThunks.fetchIni()).then(() => {
        dispatch(clearShouldReload());
      });
      return;
    }

    if (operations.length === 0) return;

    const {
      handler: handlerKey,
      path,
      data,
      method,
      id,
      cb,
      frontendId,
    } = operations[0];

    if (handlerKey === 'genericSync') {
      const handlerThunks = handler[path[0] as keyof typeof handler];

      if (handlerThunks) {
        const thunk = handlerThunks.genericSync;

        if (thunk) {
          dispatch(
            thunk({
              path: path.slice(1),
              method,
              data,
              cb,
              operationId: id,
              frontendId,
            }),
          );
        }
      }
    }
  }, [operations.length, con.isConnected, dispatch, shouldReload]);
};

export {useSync, useIsLoading, useAppSelector, useAppDispatch, useAppStore};
