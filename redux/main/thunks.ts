import {createAsyncThunk} from '@reduxjs/toolkit';
import type {RootState} from '../store';

import {getURL} from '@/common';
import {
  addDebt as addDebtAction,
  addDebtPayment as addDebtPaymentAction,
  removeDebtPayment as removeDebtPaymentAction,
  updateDebtPayment as updateDebtPaymentAction,
  addExchangeRate as addExchangeRateAction,
  addBidAskExchangeRate as addBidAskExchangeRateAction,
  setDebts as setDebtsAction,
} from './mainSlice';

export {fetchIni, genericSync} from './syncThunks';
export {
  handleCategory,
  handleDeleteCategory,
  addSubcategorySync,
  addSubcategoryLocal,
  updateSubcategorySync,
  updateSubcategoryLocal,
  deleteSubcategorySync,
  deleteSubcategoryLocal,
  addGroupCategorySync,
  addGroupCategoryLocal,
  updateGroupCategorySync,
  updateGroupCategoryLocal,
  deleteGroupCategorySync,
  deleteGroupCategoryLocal,
  handleDeleteGroupCategory,
  handleGroupCategory,
} from './categoryThunks';
export {
  deleteBudget,
  uploadBudget,
  createUpdateBudget,
  updateBudgetItem,
} from './budgetThunks';
export type {Budget} from './budgetThunks';
export {
  addNewExpense,
  updateExpense,
  addNewIncome,
  updateIncome,
  uploadFile,
  deleteExpense,
  deleteIncome,
  deleteExpenseLocal,
} from './transactionThunks';

/**
 * Fetches exchange rate from NBP API with daily caching
 * @param params - Currency code and optional date
 */
export const fetchExchangeRate = createAsyncThunk(
  'main/fetchExchangeRate',
  async (
    {currencyCode, date}: {currencyCode: string; date?: string},
    {dispatch, getState},
  ) => {
    const {formatDateForNBP} = await import('../../helpers/nbpApi');
    const state = getState() as RootState;

    const today = date || formatDateForNBP(new Date());

    // Check if we already have a recent rate (within last 7 days)
    // NBP API returns the last business day rate for weekends/holidays,
    // so we check for any recent cached rate instead of exact date match
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoStr = formatDateForNBP(sevenDaysAgo);

    const existingRate = state.main.exchangeRates
      .filter(
        rate =>
          rate.code.toLowerCase() === currencyCode.toLowerCase() &&
          rate.date >= sevenDaysAgoStr &&
          rate.date <= today,
      )
      .sort((a, b) => b.date.localeCompare(a.date))[0]; // Get most recent

    if (existingRate) {
      return existingRate;
    }


    const {fetchExchangeRate: fetchFromNBP} = await import(
      '../../helpers/nbpApi'
    );

    const exchangeRate = await fetchFromNBP(currencyCode, date);

    if (exchangeRate) {
      dispatch(addExchangeRateAction(exchangeRate));
      return exchangeRate;
    }

    throw new Error(`Failed to fetch exchange rate for ${currencyCode}`);
  },
);

/**
 * Fetches bid/ask exchange rates from NBP API with daily caching
 * @param params - Currency code and optional date
 */
export const fetchBidAskExchangeRate = createAsyncThunk(
  'main/fetchBidAskExchangeRate',
  async (
    {currencyCode, date}: {currencyCode: string; date?: string},
    {dispatch, getState},
  ) => {
    const {formatDateForNBP} = await import('../../helpers/nbpApi');
    const state = getState() as RootState;

    const today = date || formatDateForNBP(new Date());

    // Check if we already have a recent bid/ask rate (within last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoStr = formatDateForNBP(sevenDaysAgo);

    const existingRate = state.main.bidAskExchangeRates
      ?.filter(
        rate =>
          rate.code.toLowerCase() === currencyCode.toLowerCase() &&
          rate.date >= sevenDaysAgoStr &&
          rate.date <= today,
      )
      .sort((a, b) => b.date.localeCompare(a.date))[0]; // Get most recent

    if (existingRate) {
      return existingRate;
    }

    const {fetchBidAskExchangeRate: fetchFromNBP} = await import(
      '../../helpers/nbpApi'
    );

    const exchangeRate = await fetchFromNBP(currencyCode, date);

    if (exchangeRate) {
      dispatch(addBidAskExchangeRateAction(exchangeRate));
      return exchangeRate;
    }

    throw new Error(`Failed to fetch bid/ask exchange rate for ${currencyCode}`);
  },
);

export const fetchDebts = createAsyncThunk<any, void, {state: RootState}>(
  'debt/fetch',
  async (_, thunkAPI) => {
    const {dispatch, getState} = thunkAPI;
    const token = getState().auth.token;

    try {
      const response = await fetch(getURL('debt'), {
        headers: {Authorization: `Bearer ${token}`},
      });

      const result = await response.json();
      if (result.err) throw result.err;

      dispatch(setDebtsAction(result.d));
      return result.d;
    } catch (error) {
      throw String(error);
    }
  },
);

export const addDebtThunk = createAsyncThunk<
  any,
  {personName: string; totalAmount: number; description?: string},
  {state: RootState}
>('debt/add', async (payload, thunkAPI) => {
  const {dispatch, getState} = thunkAPI;
  const token = getState().auth.token;

  try {
    const response = await fetch(getURL('debt'), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    if (result.err) throw result.err;

    dispatch(addDebtAction({...result.d, payments: []}));
    return result.d;
  } catch (error) {
    throw error instanceof Error ? error : new Error(String(error));
  }
});

export const addDebtPaymentThunk = createAsyncThunk<
  any,
  {debtId: string; amount: number; date: string; note?: string},
  {state: RootState}
>('debt/addPayment', async ({debtId, ...paymentData}, thunkAPI) => {
  const {dispatch, getState} = thunkAPI;
  const token = getState().auth.token;

  try {
    const response = await fetch(getURL(`debt/${debtId}/payment`), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });

    const result = await response.json();
    if (result.err) throw result.err;

    dispatch(addDebtPaymentAction({debtId, payment: result.d}));
    return result.d;
  } catch (error) {
    throw error instanceof Error ? error : new Error(String(error));
  }
});

export const deleteDebtPaymentThunk = createAsyncThunk<
  any,
  {debtId: string; paymentId: string},
  {state: RootState}
>('debt/deletePayment', async ({debtId, paymentId}, thunkAPI) => {
  const {dispatch, getState} = thunkAPI;
  const token = getState().auth.token;

  try {
    const response = await fetch(getURL(`debt/${debtId}/payment/${paymentId}`), {
      method: 'DELETE',
      headers: {Authorization: `Bearer ${token}`},
    });

    const result = await response.json();
    if (result.err) throw result.err;

    dispatch(removeDebtPaymentAction({debtId, paymentId}));
    return result.d;
  } catch (error) {
    throw error instanceof Error ? error : new Error(String(error));
  }
});

export const updateDebtPaymentThunk = createAsyncThunk<
  any,
  {debtId: string; paymentId: string; amount?: number; date?: string; note?: string},
  {state: RootState}
>('debt/updatePayment', async ({debtId, paymentId, ...updates}, thunkAPI) => {
  const {dispatch, getState} = thunkAPI;
  const token = getState().auth.token;

  try {
    const response = await fetch(getURL(`debt/${debtId}/payment/${paymentId}`), {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    const result = await response.json();
    if (result.err) throw result.err;

    dispatch(updateDebtPaymentAction({debtId, payment: result.d}));
    return result.d;
  } catch (error) {
    throw error instanceof Error ? error : new Error(String(error));
  }
});
