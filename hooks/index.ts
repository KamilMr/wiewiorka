import {selectStatus} from '@/redux/main/selectors';
import {useDispatch, useSelector, TypedUseSelectorHook, useStore} from 'react-redux';
import type {AppStore, RootState, AppDispatch} from '@/redux/store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
const useAppDispatch = useDispatch.withTypes<AppDispatch>();
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
const useAppStore: () => AppStore = useStore;

const useIsLoading = () => {
  const isLoading = useAppSelector(selectStatus);
  return isLoading === 'fetching';
};

export {useIsLoading, useAppSelector, useAppDispatch, useAppStore};
