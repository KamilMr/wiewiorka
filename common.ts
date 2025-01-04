import {formatDate, isAfter, isBefore, isSameDay, parse} from 'date-fns';
import {NativeScrollEvent, NativeSyntheticEvent} from 'react-native';
import uniqueId from 'react-native-uuid';

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

export const EXCLUDED_CAT = [];

const getURL = (p = '') => {
  return `${URL}/${p}`;
};

const formatPrice = (grosz: number) => {
  const zloty = grosz;
  return `${zloty.toFixed(2)} zł`;
};

const makeNewIdArr = (number: number) => {
  const set = new Set();
  let num = number;

  while (num > 0) {
    const id: string | number[] = uniqueId.v4();
    if (set.has(id)) continue;
    set.add(id);
    --num;
  }
  return Array.from(set);
};

// Function to check if the user scrolled to the bottom
const isCloseToBottom = ({
  layoutMeasurement,
  contentOffset,
  contentSize,
}: NativeSyntheticEvent<NativeScrollEvent>['nativeEvent']): boolean => {
  return layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
};

const dh = {
  isBetweenDates: (d, s, e) =>
    (isBefore(d, e) && isAfter(d, s)) || isSameDay(d, s) || isSameDay(d, e),
};

const convertDate = (
  str: string,
  format: string = 'dd/MM/yyyy',
  newformat: string = 'yyyy-MM-dd',
): string => {
  return formatDate(parse(str, format, new Date()), newformat);
};

const shortenText = (text: string, maxLength: number = 10) => {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

/**
 * Replace Polish diacritics with their English counterparts
 * */
const normalize = (str: string): string => {
  const map = 'ąćęłńóśźż';
  const norm = 'acelnoszz';

  return str.replace(/./g, (c) => {
    const isUpper = c === c.toUpperCase();
    const idx = map.indexOf(c.toLowerCase());

    return idx === -1 ? c : isUpper ? norm[idx].toUpperCase() : norm[idx];
  });
};

export {
  convertDate,
  dh,
  formatPrice,
  getURL,
  isCloseToBottom,
  makeNewIdArr,
  normalize,
  shortenText,
};
