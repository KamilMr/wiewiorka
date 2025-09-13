import {selectStatus} from '@/redux/main/selectors';
import {
  useDispatch,
  useSelector,
  TypedUseSelectorHook,
  useStore,
} from 'react-redux';
import type {AppStore, RootState, AppDispatch} from '@/redux/store';
import {selectOperations} from '@/redux/sync/syncSlice';
import {useEffect, useState} from 'react';
import * as mainThunks from '@/redux/main/thunks';
import {useNetInfo} from '@react-native-community/netinfo';
import {printJsonIndent} from '@/common';

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
  const dispatch = useAppDispatch();
  const con = useNetInfo();

  const [reload, setReload] = useState(0);

  useEffect(() => {
    if (!con.isConnected) return;
    let timerId: ReturnType<typeof setTimeout> | undefined;

    if (operations.length === 0) return;

    let nextOperation;

    let next;
    if ((next = operations.find(o => o.status === 'pending')))
      nextOperation = next;
    else if (
      (next = operations
        .filter(o => o.status === 'retrying' && o.nextRetryAt !== undefined)
        .sort((a, b) => a.nextRetryAt! - b.nextRetryAt!)[0])
    ) {
      const canRun = Date.now() - next.nextRetryAt!;
      if (canRun > 0) {
        if (timerId) clearTimeout(timerId);
        nextOperation = next;
      } else {
        timerId = setTimeout(() => {
          setReload(x => x + 1);
        }, Math.abs(canRun));
      }
    }

    if (!nextOperation) return;

    const {
      handler: handlerKey,
      path,
      data,
      method,
      id,
      cb,
      frontendId,
    } = nextOperation;

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

    return () => {
      clearTimeout(timerId);
    };
  }, [operations, con.isConnected, dispatch, reload]);
};

const useDev = () => {
  return useAppSelector(state => state.main.devMode);
};

export {
  useSync,
  useIsLoading,
  useAppSelector,
  useAppDispatch,
  useAppStore,
  useDev,
};
