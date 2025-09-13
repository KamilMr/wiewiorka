import {createAsyncThunk} from '@reduxjs/toolkit';
import {RootState} from '../store';

import {getURL, makeNewIdArr, printJsonIndent} from '@/common';
import {Expense, Income} from '@/types';
import {
  addBudgets as addBudgetsAction,
  updateBudget as updateBudgetAction,
  addExpense as addExpenseAction,
  updateExpense as updateExpenseAction,
  addIncome as addIncomeAction,
  updateIncome as updateIncomeAction,
  replaceBudget as replaceBudgetAction,
  replaceExpense as replaceExpenseAction,
  replaceIncome as replaceIncomeAction,
  deleteBudget as deleteBudgetAction,
} from './mainSlice';
import {
  addToQueue,
  removeFromQueue,
  setSyncError,
  incrementRetryCount,
  setSyncingStatus,
  setOperationStatus,
} from '../sync/syncSlice';
import {SYNC_CONFIG} from '@/constants/theme';
import _, {omit} from 'lodash';

const DIFFERED = 0;

const mainSliceReducers = {
  deleteBudget: deleteBudgetAction,
  addBudgets: addBudgetsAction,
  updateBudget: updateBudgetAction,
  addExpense: addExpenseAction,
  updateExpense: updateExpenseAction,
  addIncome: addIncomeAction,
  updateIncome: updateIncomeAction,
  replaceBudget: replaceBudgetAction,
  replaceExpense: replaceExpenseAction,
  replaceIncome: replaceIncomeAction,
};

export interface Budget {
  id?: string;
  amount: number;
  date: string;
  categoryId?: number;
  groupId?: number;
}

export const deleteBudget = createAsyncThunk<
  any,
  {id: string},
  {state: RootState}
>('budget/delete', async ({id}, thunkAPI) => {
  const {dispatch, getState} = thunkAPI;

  // Check if there are actions waiting in sync queue for this budget frontendId
  const state = getState();
  const pendingOps = state.sync.pendingOperations || [];

  // Remove any pending operations for this budget (check frontendId and budget path)
  const opsToRemove = pendingOps.filter(
    op => op.path?.includes('budget') && op.frontendId === id,
  );

  // Remove the operations from queue
  opsToRemove.forEach(op => {
    dispatch(removeFromQueue(op.id));
  });

  // Update local state immediately
  dispatch(deleteBudgetAction({id}));

  // Queue for sync - DELETE request
  dispatch(
    addToQueue({
      path: ['main', 'budget', id],
      method: 'DELETE',
      handler: 'genericSync',
      data: {},
      cb: 'deleteBudget',
      frontendId: id,
    }),
  );
});

export const uploadBudget = createAsyncThunk<any, Budget, {state: RootState}>(
  'budget/updateBudget',
  async ({id, ...rest}: Budget, thunkAPI): Promise<void> => {
    const token = thunkAPI.getState().auth.token;

    let data;
    const path = 'budget' + (id ? `/${id}` : '');
    let resp = await fetch(getURL(path), {
      method: id ? 'PATCH' : 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-type': 'application/json',
      },
      body: JSON.stringify(rest),
    });
    data = await resp.json();
    if (data.err) throw data.err;
    setTimeout(() => thunkAPI.dispatch(fetchIni()), DIFFERED);
  },
);

export const createUpdateBudget = createAsyncThunk<
  any,
  Budget[],
  {state: RootState}
>(
  'budget/createUpdateBudget',
  async (budgets: Budget[], thunkAPI): Promise<void> => {
    const {dispatch} = thunkAPI;

    // Create budgets with frontend IDs
    const budgetsWithFrontendIds = budgets.map(budget => ({
      ...budget,
      id: budget.id ?? `f_b-${makeNewIdArr(2).join('-')}`,
      isNew: !budget.id,
    }));

    printJsonIndent(
      'uploadMultiBudgets: Budgets with frontend IDs:',
      budgetsWithFrontendIds,
    );

    // Add to local state immediately
    const newBudgets = budgetsWithFrontendIds.filter(budget => budget.isNew);
    const existingBudgets = budgetsWithFrontendIds.filter(
      budget => !budget.isNew,
    );

    if (newBudgets.length > 0) {
      dispatch(
        addBudgetsAction(
          newBudgets.map(budget =>
            _.pick(budget, ['amount', 'categoryId', 'date', 'id']),
          ),
        ),
      );
    }

    existingBudgets.forEach(budget => {
      dispatch(
        updateBudgetAction({
          id: budget.id,
          ..._.pick(budget, ['amount', 'categoryId', 'date']),
        }),
      );
    });

    // Queue for sync
    budgetsWithFrontendIds.forEach(budget => {
      const tR: {
        path: string[];
        method: 'POST' | 'PATCH';
        handler: string;
        data: any;
        cb: string;
        frontendId: string;
      } = {
        path: ['main', 'budget'],
        method: 'POST',
        handler: 'genericSync',
        data: _.pick(
          budget,
          budget.isNew ? ['amount', 'categoryId', 'date'] : ['amount'],
        ),
        cb: 'replaceBudget',
        frontendId: budget.id,
      };
      if (!budget.isNew) {
        tR.path.push(budget.id);
        tR.method = 'PATCH';
      }
      dispatch(addToQueue(tR));
    });
  },
);

export const updateBudgetItem = createAsyncThunk<
  any,
  {id: string; changes: Partial<Budget>},
  {state: RootState}
>('budget/update', async ({id, changes}, thunkAPI) => {
  const {dispatch} = thunkAPI;

  // Update local state immediately
  dispatch(updateBudgetAction({id, ...changes}));

  // Queue for sync
  dispatch(
    addToQueue({
      path: ['main', 'budget', id],
      method: 'PATCH',
      handler: 'genericSync',
      data: changes,
      cb: 'replaceBudget',
      frontendId: id,
    }),
  );
});

export const fetchIni = createAsyncThunk<any, void, {state: RootState}>(
  'ini/fetchIni',
  async (_, thunkAPI) => {
    const token = thunkAPI.getState().auth.token;
    let data;
    let resp = await fetch(getURL('ini'), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    data = await resp.json();
    if (data.err) throw data.err;
    return data.d;
  },
);

export const addNewExpense = createAsyncThunk<
  any,
  Expense & {frontendId?: string | number},
  {state: RootState}
>('expense/save', async (expense, thunkAPI) => {
  const {dispatch} = thunkAPI;

  // Editing existing expense
  const frontendId = `f_${makeNewIdArr(1)[0]}`;
  dispatch(addExpenseAction([{...expense, id: frontendId}]));

  dispatch(
    addToQueue({
      path: ['main', 'expenses'],
      method: 'POST',
      handler: 'genericSync',
      data: expense,
      cb: 'replaceExpense',
      frontendId: frontendId,
    }),
  );
});

export const updateExpense = createAsyncThunk<any, Expense, {state: RootState}>(
  'expense/save',
  async (expense, thunkAPI) => {
    const {dispatch} = thunkAPI;

    // Editing existing expense
    dispatch(updateExpenseAction(expense));

    dispatch(
      addToQueue({
        path: ['main', 'expenses', expense.id.toString()],
        method: 'PUT',
        handler: 'genericSync',
        data: expense,
      }),
    );
  },
);

export const addNewIncome = createAsyncThunk<
  any,
  Income & {frontendId?: string | number},
  {state: RootState}
>('income/save', async (income, thunkAPI) => {
  const {dispatch, getState} = thunkAPI;

  const auth = getState().auth;

  const incomeWithAuth = {
    ...income,
    ownerId: auth.id || 0,
    houseId: auth.houses?.[0] || '',
    owner: auth.name || '',
  };

  const frontendId = `f_${makeNewIdArr(1)[0]}`;
  dispatch(addIncomeAction([{...incomeWithAuth, id: frontendId}]));

  dispatch(
    addToQueue({
      path: ['main', 'income'],
      method: 'POST',
      handler: 'genericSync',
      data: income,
      cb: 'replaceIncome',
      frontendId: frontendId,
    }),
  );
});

export const updateIncome = createAsyncThunk<any, Income, {state: RootState}>(
  'income/update',
  async (income, thunkAPI) => {
    const {dispatch} = thunkAPI;

    dispatch(
      updateIncomeAction({
        ...income,
        ownerId: '',
        houseId: '',
        owner: '',
      }),
    );

    dispatch(
      addToQueue({
        path: ['main', 'income', income.id.toString()],
        method: 'PATCH',
        handler: 'genericSync',
        data: omit(income, 'id'),
      }),
    );
  },
);

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

export const uploadFile = createAsyncThunk<
  any,
  {file: any},
  {state: RootState}
>('expense/image', async ({file}: {file: any}, thunkAPI) => {
  const token = thunkAPI.getState().auth.token;
  let data;
  const path = 'expenses/image';
  let resp = await fetch(getURL(path), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: file,
  });
  data = await resp.json();

  if (data.err) throw data;
  // deffered fetch
  setTimeout(() => thunkAPI.dispatch(fetchIni()), DIFFERED);
  return data.d;
});

export const deleteExpense = createAsyncThunk<
  any,
  {id?: string},
  {state: RootState}
>('expense/delete', async (id, thunkAPI) => {
  const token = thunkAPI.getState().auth.token;

  let data;
  const path = 'expenses' + (id ? `/${id}` : '');
  let resp = await fetch(getURL(path), {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  data = await resp.json();
  if (data.err) throw data.err;

  // differed fetch
  setTimeout(() => thunkAPI.dispatch(fetchIni()), DIFFERED);
});

export const deleteIncome = createAsyncThunk<
  any,
  {id?: string},
  {state: RootState}
>('income/delete', async (id, thunkAPI) => {
  const token = thunkAPI.getState().auth.token;

  let data;
  const path = 'income' + (id ? `/${id}` : '');
  let resp = await fetch(getURL(path), {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  data = await resp.json();
  if (data.err) throw data.err;

  // differed fetch
  setTimeout(() => thunkAPI.dispatch(fetchIni()), DIFFERED);
});

export const genericSync = createAsyncThunk<
  any,
  {
    path: string[];
    method: 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    data?: any;
    cb?: string;
    operationId: string;
    frontendId?: string;
  },
  {state: RootState}
>(
  'sync/generic',
  async ({path, method, data, cb, operationId, frontendId}, thunkAPI) => {
    const token = thunkAPI.getState().auth.token;
    const {dispatch} = thunkAPI;

    try {
      dispatch(setOperationStatus({operationId, status: 'processing'}));
      const endpoint = path.join('/');

      const response = await fetch(getURL(endpoint), {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined,
      });

      const result = await response.json();
      if (result.err) throw result.err;

      if (cb) {
        const [callbackName, param] = cb.split(':');
        if (callbackName === 'fetchIni')
          setTimeout(() => dispatch(fetchIni()), DIFFERED);

        if (mainSliceReducers[cb])
          dispatch(
            mainSliceReducers[cb]({
              frontendId,
              resp: result.d,
            }),
          );
      }

      dispatch(removeFromQueue(operationId));

      return result.d;
    } catch (error) {
      dispatch(incrementRetryCount({operationId, maxRetries: SYNC_CONFIG.MAX_RETRIES}));
      dispatch(setSyncError({operationId, error: String(error)}));

      return {error: true, message: String(error)};
    }
  },
);
