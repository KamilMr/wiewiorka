import {selectStatus} from '@/redux/main/selectors';
import {useDispatch, useSelector} from 'react-redux';
import type {RootState, AppDispatch} from '@/redux/store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
const useAppDispatch = useDispatch.withTypes<AppDispatch>();
const useAppSelector = useSelector.withTypes<RootState>();

const useIsLoading = () => {
  const isLoading = useAppSelector(selectStatus);
  return isLoading === 'fetching';
};

export {useIsLoading, useAppSelector, useAppDispatch};
