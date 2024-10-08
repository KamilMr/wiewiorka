import {NativeScrollEvent, NativeSyntheticEvent} from 'react-native';
import {v4 as uniqueId} from 'uuid';

const URL = process.env.EXPO_PUBLIC_API_URL;

export const CATEGORY_LIST_ADD_EDIT_PATH = 'category-list/:param';
export const CATS_PATH = 'cats';
export const EXPENSE_ADD_EDIT_PATH = 'expense-list/:param';
export const EXPENSE_LIST_PATH = 'expense-list';
export const HOME_PATH = '/';
export const INCOME_ADD_EDIT_PATH = 'income-list/:param';
export const INCOME_LIST_PATH = 'income-list';
export const LOGIN_PATH = 'login';
export const SUMMARY_PATH = 'summary';
export const SUMMARY_CHART = 'summary/chart/:param';

export const getURL = (p = '') => {
  return `${URL}/${p}`;
};

export const formatPrice = (grosz: number) => {
  const zloty = grosz;
  return `${zloty.toFixed(2)} zł`;
};

export const makeNewIdArr = (number: number) => {
  const set = new Set();
  let num = number;

  while (num > 0) {
    const id: string = uniqueId();
    if (set.has(id)) continue;
    set.add(id);
    --num;
  }
  return Array.from(set);
};

// Function to check if the user scrolled to the bottom
export const isCloseToBottom = ({
  layoutMeasurement,
  contentOffset,
  contentSize,
}: NativeSyntheticEvent<NativeScrollEvent>['nativeEvent']): boolean => {
  return layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
};
