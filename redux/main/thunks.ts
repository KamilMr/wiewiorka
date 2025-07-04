import {createAsyncThunk} from '@reduxjs/toolkit';
import {RootState, AppStore} from '../store';

import {getURL} from '@/common';
import {Expense, Income} from '@/types';

const DIFFERED = 0;

export const fetchIni = createAsyncThunk<any, void, {state: RootState}>(
  'ini/fetchIni',
  async (
    _,
    thunkAPI,
  ) => {
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

export interface Budget {
  id?: string;
  amount: number;
  date: string;
  categoryId?: number;
  groupId?: number;
}

export const uploadExpense = createAsyncThunk<any, {id?: string; rest: Expense}, {state: RootState}>(
  'expense/add',
  async (
    {id, ...rest},
    thunkAPI,
  ) => {
    const token = thunkAPI.getState().auth.token;
    let data;
    const path = 'expenses' + (id ? `/${id}` : '');
    let resp = await fetch(getURL(path), {
      method: id ? 'PUT' : 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-type': 'application/json',
      },
      body: JSON.stringify(rest),
    });
    data = await resp.json();
    if (data.err) throw data.err;
    // deffered fetch
    setTimeout(() => thunkAPI.dispatch(fetchIni()), DIFFERED);
  },
);

export const uploadIncome = createAsyncThunk<any, {id?: string; rest: Income}, {state: RootState}>(
  'income/add',
  async (
    {id, ...rest},
    thunkAPI,
  ) => {
    const token = thunkAPI.getState().auth.token;

    let data;
    const path = 'income' + (id ? `/${id}` : '');
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

    // deffered fetch
    setTimeout(() => thunkAPI.dispatch(fetchIni()), DIFFERED);
  },
);

export const handleCategory = createAsyncThunk<any, {
  method?: string;
  id?: string;
  name?: string;
  color?: string;
  groupId?: number;
}, {state: RootState}>(
  'category/upsert',
  async (
    payload,
    thunkAPI,
  ) => {
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
  },
);

export const handleDeleteCategory = createAsyncThunk<any, {id?: string}, {state: RootState}>(
  'category/delete',
  async (
    payload,
    thunkAPI,
  ) => {
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
  },
);

export const handleDeleteGroupCategory = createAsyncThunk<any, {id?: string}, {state: RootState}>(
  'categoryGroup/delete',
  async (
    payload,
    thunkAPI,
  ) => {
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
  },
);

export const handleGroupCategory = createAsyncThunk<any, {method?: string; id?: string; name?: string; color?: string}, {state: RootState}>(
  'categoryGroup/upsert',
  async (
    payload,
    thunkAPI,
  ) => {
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
  },
);

export const uploadFile = createAsyncThunk<any, {file: any}, {state: RootState}>(
  'expense/image',
  async (
    {file}: {file: any},
    thunkAPI,
  ) => {
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
  },
);

export const deleteExpense = createAsyncThunk<any, {id?: string}, {state: RootState}>(
  'expense/delete',
  async (
    id,
    thunkAPI,
  ) => {
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
  },
);

export const deleteIncome = createAsyncThunk<any, {id?: string}, {state: RootState}>(
  'income/delete',
  async (
    id,
    thunkAPI,
  ) => {
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
  },
);

export const uploadBudget = createAsyncThunk<any, Budget, {state: RootState}>(
  'budget/upload',
  async (
    {id, ...rest}: Budget,
    thunkAPI,
  ): Promise<void> => {
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