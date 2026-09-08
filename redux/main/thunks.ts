import {createAsyncThunk} from '@reduxjs/toolkit';
import type {RootState} from '../store';

import {getURL, makeRandomId} from '@/common';
import {
  addDebt as addDebtAction,
  addDebtPayment as addDebtPaymentAction,
  removeDebtPayment as removeDebtPaymentAction,
  updateDebtPayment as updateDebtPaymentAction,
  addExchangeRate as addExchangeRateAction,
  addBidAskExchangeRate as addBidAskExchangeRateAction,
  addSubcategoryAction,
  updateSubcategoryAction,
  deleteSubcategoryAction,
  addGroupCategoryAction,
  updateGroupCategoryAction,
  deleteGroupCategoryAction,
  setDebts as setDebtsAction,
} from './mainSlice';
import {addToQueue} from '../sync/syncSlice';
import {fetchIni} from './syncThunks';

export {fetchIni, genericSync} from './syncThunks';
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

const DIFFERED = 0;

export const handleCategory = createAsyncThunk<
  any,
  {
    method?: string;
    id?: string;
    name?: string;
    color?: string;
    groupId?: number;
  },
  {state: RootState}
>('category/upsert', async (payload, thunkAPI) => {
  const {token} = thunkAPI.getState().auth;

  if (!Object.keys(payload).length) return;

  const {method, id, ...rest} = payload;
  let q = 'category' + (method === 'PUT' ? `/${id}` : '');
  let data;

  const {name, color, groupId} = rest;
  let resp = await fetch(getURL(q), {
    method,
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({name, color: color?.split('#')[1] || '', groupId}),
  });
  data = await resp.json();
  if (data.err) throw data.err;
  // differed fetch
  setTimeout(() => thunkAPI.dispatch(fetchIni()), DIFFERED);
  return data.d;
});

export const handleDeleteCategory = createAsyncThunk<
  any,
  {id?: string},
  {state: RootState}
>('category/delete', async (payload, thunkAPI) => {
  const {token} = thunkAPI.getState().auth;

  if (!Object.keys(payload).length) return;

  const {id} = payload;
  let q = `category/${id}`;
  let data;

  let resp = await fetch(getURL(q), {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  data = await resp.json();
  if (data.err) throw data.err;
  // deffered fetch
  setTimeout(() => thunkAPI.dispatch(fetchIni()), DIFFERED);
  return data.d;
});

export const addSubcategorySync = createAsyncThunk<
  any,
  {
    name: string;
    color: string;
    groupId: number | string;
  },
  {state: RootState}
>('subcategory/addSync', async (payload, thunkAPI) => {
  const {dispatch, getState} = thunkAPI;

  const auth = getState().auth;
  const token = auth.token;
  const {name, color, groupId} = payload;

  const colorHex = color.split('#')[1] || 'ffffff';

  try {
    // Call API directly and wait for response
    const response = await fetch(getURL('category'), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({name, color: colorHex, groupId}),
    });

    const result = await response.json();
    if (result.err) throw result.err;

    // Add to local state with real ID from backend
    const subcategory = {
      id: result.d.id,
      name: result.d.name,
      color: result.d.color,
      groupId: result.d.groupId,
      owner: auth.name,
      ownerId: auth.houses[0],
    };

    dispatch(addSubcategoryAction(subcategory));

    return subcategory;
  } catch (error) {
    throw error instanceof Error ? error : new Error(String(error));
  }
});

export const addSubcategoryLocal = createAsyncThunk<
  any,
  {
    name: string;
    color: string;
    groupId: number | string;
  },
  {state: RootState}
>('subcategory/addLocal', async (payload, thunkAPI) => {
  const {dispatch, getState} = thunkAPI;

  const auth = getState().auth;
  const {name, color, groupId} = payload;

  // Generate frontend ID for optimistic update
  const frontendId = `f_${makeRandomId(8)}`;

  // Create temporary subcategory object
  const tempSubcategory = {
    id: frontendId,
    name,
    color: color.split('#')[1] || 'ffffff',
    groupId,
    owner: auth.name,
    ownerId: auth.houses[0],
  };

  // Immediate local update
  dispatch(addSubcategoryAction(tempSubcategory));

  // Queue sync operation
  dispatch(
    addToQueue({
      path: ['main', 'category'],
      method: 'POST',
      data: {name, color: color.split('#')[1] || 'ffffff', groupId},
      handler: 'genericSync',
      frontendId,
      cb: 'replaceSubcategoryAction',
    }),
  );

  return tempSubcategory;
});

export const updateSubcategorySync = createAsyncThunk<
  any,
  {
    id: number;
    name: string;
    color: string;
    groupId: number | string;
  },
  {state: RootState}
>('subcategory/updateSync', async (payload, thunkAPI) => {
  const {dispatch, getState} = thunkAPI;

  const token = getState().auth.token;
  const {id, name, color, groupId} = payload;

  const colorHex = color.split('#')[1] || 'ffffff';

  try {
    // Call API directly and wait for response
    const response = await fetch(getURL(`category/${id}`), {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({name, color: colorHex, groupId}),
    });

    const result = await response.json();
    if (result.err) throw result.err;

    // Update local state with response
    const subcategory = {
      id: result.d.id,
      name: result.d.name,
      color: result.d.color,
      groupId: result.d.groupId,
    };

    dispatch(updateSubcategoryAction(subcategory));

    return subcategory;
  } catch (error) {
    throw error instanceof Error ? error : new Error(String(error));
  }
});

export const updateSubcategoryLocal = createAsyncThunk<
  any,
  {
    id: number;
    name: string;
    color: string;
    groupId: number | string;
  },
  {state: RootState}
>('subcategory/updateLocal', async (payload, thunkAPI) => {
  const {dispatch} = thunkAPI;
  const {id, name, color, groupId} = payload;

  // Immediate local update
  dispatch(updateSubcategoryAction(payload));

  // Queue sync operation
  dispatch(
    addToQueue({
      path: ['main', 'category', id.toString()],
      method: 'PUT',
      data: {name, color: color.split('#')[1] || 'ffffff', groupId},
      handler: 'genericSync',
      frontendId: id.toString(),
      cb: 'replaceSubcategoryAction',
    }),
  );

  return payload;
});

export const deleteSubcategorySync = createAsyncThunk<
  any,
  string | number,
  {state: RootState}
>('subcategory/deleteSync', async (id, thunkAPI) => {
  const {dispatch, getState} = thunkAPI;

  const token = getState().auth.token;

  try {
    // Call API directly and wait for response
    const response = await fetch(getURL(`category/${id}`), {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    if (result.err) throw result.err;

    // Remove from local state after successful deletion
    dispatch(deleteSubcategoryAction(id));

    return id;
  } catch (error) {
    throw error instanceof Error ? error : new Error(String(error));
  }
});

export const deleteSubcategoryLocal = createAsyncThunk<
  any,
  string | number,
  {state: RootState}
>('subcategory/deleteLocal', async (id, thunkAPI) => {
  const {dispatch} = thunkAPI;

  // Immediate local update - remove from state
  dispatch(deleteSubcategoryAction(id));

  // Queue sync operation - let queue logic decide if it's needed
  dispatch(
    addToQueue({
      path: ['main', 'category', id.toString()],
      method: 'DELETE',
      handler: 'genericSync',
      frontendId: id.toString(),
    }),
  );

  return id;
});

export const addGroupCategorySync = createAsyncThunk<
  any,
  {
    name: string;
    color: string;
  },
  {state: RootState}
>('groupCategory/addSync', async (payload, thunkAPI) => {
  const {dispatch, getState} = thunkAPI;

  const auth = getState().auth;
  const token = auth.token;
  const {name, color} = payload;

  const colorHex = color.split('#')[1] || 'ffffff';

  try {
    // Call API directly and wait for response
    const response = await fetch(getURL('category/group'), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({name, color: colorHex}),
    });

    const result = await response.json();
    if (result.err) throw result.err;

    // Add to local state with real ID from backend
    const groupCategory = {
      id: result.d.id,
      name: result.d.name,
      color: result.d.color,
      owner: auth.name,
      ownerId: auth.houses[0],
    };

    dispatch(addGroupCategoryAction(groupCategory));

    return groupCategory;
  } catch (error) {
    throw error instanceof Error ? error : new Error(String(error));
  }
});

export const addGroupCategoryLocal = createAsyncThunk<
  any,
  {
    name: string;
    color: string;
  },
  {state: RootState}
>('groupCategory/addLocal', async (payload, thunkAPI) => {
  const {dispatch, getState} = thunkAPI;

  const auth = getState().auth;
  const {name, color} = payload;

  // Generate frontend ID for optimistic update
  const frontendId = `f_g_${makeRandomId(8)}`;

  // Create temporary group category object
  const tempGroupCategory = {
    id: frontendId,
    name,
    color: color.split('#')[1] || 'ffffff',
    owner: auth.name,
    ownerId: auth.houses[0],
  };

  // Immediate local update
  dispatch(addGroupCategoryAction(tempGroupCategory));

  // Queue sync operation
  dispatch(
    addToQueue({
      path: ['main', 'category', 'group'],
      method: 'POST',
      data: {name, color: tempGroupCategory.color},
      handler: 'genericSync',
      frontendId,
      cb: 'replaceGroupCategoryAction',
    }),
  );

  return tempGroupCategory;
});

export const updateGroupCategorySync = createAsyncThunk<
  any,
  {
    id: number | string;
    name: string;
    color: string;
  },
  {state: RootState}
>('groupCategory/updateSync', async (payload, thunkAPI) => {
  const {dispatch, getState} = thunkAPI;

  const token = getState().auth.token;
  const {id, name, color} = payload;

  const colorHex = color.split('#')[1] || 'ffffff';

  try {
    // Call API directly and wait for response
    const response = await fetch(getURL(`category/group/${id}`), {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({name, color: colorHex}),
    });

    const result = await response.json();
    if (result.err) throw result.err;

    // Update local state with response
    const groupCategory = {
      id: result.d.id,
      name: result.d.name,
      color: result.d.color,
    };

    dispatch(updateGroupCategoryAction(groupCategory));

    return groupCategory;
  } catch (error) {
    throw error instanceof Error ? error : new Error(String(error));
  }
});

export const updateGroupCategoryLocal = createAsyncThunk<
  any,
  {
    id: number | string;
    name: string;
    color: string;
  },
  {state: RootState}
>('groupCategory/updateLocal', async (payload, thunkAPI) => {
  const {dispatch} = thunkAPI;

  // Immediate local update
  dispatch(updateGroupCategoryAction(payload));

  // Queue sync operation
  dispatch(
    addToQueue({
      path: ['main', 'category', 'group', payload.id.toString()],
      method: 'PUT',
      data: {
        name: payload.name,
        color: payload.color.split('#')[1] || 'ffffff',
      },
      handler: 'genericSync',
      frontendId: payload.id.toString(),
      cb: 'replaceGroupCategoryAction',
    }),
  );

  return payload;
});

export const deleteGroupCategorySync = createAsyncThunk<
  any,
  string | number,
  {state: RootState}
>('groupCategory/deleteSync', async (id, thunkAPI) => {
  const {dispatch, getState} = thunkAPI;
  const state = getState();
  const token = state.auth.token;

  // Check if group has subcategories
  const group = state.main.categories[id];
  if (group && group.subcategories.length > 0) {
    throw new Error('HAS_SUBCATEGORIES');
  }

  try {
    // Call API directly and wait for response
    const response = await fetch(getURL(`category/group/${id}`), {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    if (result.err) throw result.err;

    // Remove from local state after successful deletion
    dispatch(deleteGroupCategoryAction(id));

    return id;
  } catch (error) {
    throw error instanceof Error ? error : new Error(String(error));
  }
});

export const deleteGroupCategoryLocal = createAsyncThunk<
  any,
  string | number,
  {state: RootState}
>('groupCategory/deleteLocal', async (id, thunkAPI) => {
  const {dispatch, getState} = thunkAPI;
  const state = getState();

  // Check if group has subcategories
  const group = state.main.categories[id];
  if (group && group.subcategories.length > 0) {
    throw new Error('HAS_SUBCATEGORIES');
  }

  // Immediate local update - remove from state
  dispatch(deleteGroupCategoryAction(id));

  // Queue sync operation - let queue logic decide if it's needed
  dispatch(
    addToQueue({
      path: ['main', 'category', 'group', id.toString()],
      method: 'DELETE',
      handler: 'genericSync',
      frontendId: id.toString(),
    }),
  );

  return id;
});

export const handleDeleteGroupCategory = createAsyncThunk<
  any,
  {id?: string},
  {state: RootState}
>('categoryGroup/delete', async (payload, thunkAPI) => {
  const {token} = thunkAPI.getState().auth;

  if (!Object.keys(payload).length) return;

  const {id} = payload;
  let q = `category/group/${id}`;
  let data;

  let resp = await fetch(getURL(q), {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  data = await resp.json();
  if (data.err) throw data.err;
  // differed fetch
  setTimeout(() => thunkAPI.dispatch(fetchIni()), DIFFERED);
  return data.d;
});

export const handleGroupCategory = createAsyncThunk<
  any,
  {method?: string; id?: string; name?: string; color?: string},
  {state: RootState}
>('categoryGroup/upsert', async (payload, thunkAPI) => {
  const {token} = thunkAPI.getState().auth;

  if (!Object.keys(payload).length) return;

  const {method = '', id, ...rest} = payload;
  let q = 'category/group' + (method === 'PUT' ? `/${id}` : '');
  let data;

  const {name, color = '#FFFFFF'} = rest;
  let resp = await fetch(getURL(q), {
    method,
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({name, color: color?.split('#')[1] || ''}),
  });
  data = await resp.json();
  if (data.err) throw data.err;
  // differed fetch
  setTimeout(() => thunkAPI.dispatch(fetchIni()), DIFFERED);
  return data.d;
});

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
