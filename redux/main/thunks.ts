import {createAsyncThunk} from '@reduxjs/toolkit';

import {getURL} from '@/common';

interface Expense {
  id: string;
  rest: object;
}

const DEFFERED = 0;

export const fetchIni = createAsyncThunk(
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

export const uploadExpense = createAsyncThunk(
  'expense/add',
  async ({id, ...rest}: Expense, thunkAPI) => {
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
    setTimeout(() => thunkAPI.dispatch(fetchIni()), DEFFERED);
  },
);

export const uploadIncome = createAsyncThunk(
  'income/add',
  async ({id, ...rest}: Expense, thunkAPI) => {
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
    setTimeout(() => thunkAPI.dispatch(fetchIni()), DEFFERED);
  },
);

export const handleCategory = createAsyncThunk(
  'category/upsert',
  async (payload = {}, thunkAPI) => {
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
      body: JSON.stringify({name, color: color.split('#')[1], groupId}),
    });
    data = await resp.json();
    if (data.err) throw data.err;
    // deffered fetch
    setTimeout(() => thunkAPI.dispatch(fetchIni()), DEFFERED);
    return data.d;
  },
);

export const handleDeleteCategory = createAsyncThunk(
  'category/delete',
  async (payload = {}, thunkAPI) => {
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
    setTimeout(() => thunkAPI.dispatch(fetchIni()), DEFFERED);
    return data.d;
  },
);

export const handleDeleteGroupCategory = createAsyncThunk(
  'categoryGroup/delete',
  async (payload = {}, thunkAPI) => {
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
    // deffered fetch
    setTimeout(() => thunkAPI.dispatch(fetchIni()), DEFFERED);
    return data.d;
  },
);

export const handleGroupCategory = createAsyncThunk(
  'categoryGroup/upsert',
  async (payload = {}, thunkAPI) => {
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
      body: JSON.stringify({name, color: color.split('#')[1]}),
    });
    data = await resp.json();
    if (data.err) throw data.err;
    // deffered fetch
    setTimeout(() => thunkAPI.dispatch(fetchIni()), DEFFERED);
    return data.d;
  },
);

export const uploadFile = createAsyncThunk(
  'expense/image',
  async ({file}, thunkAPI) => {
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
    setTimeout(() => thunkAPI.dispatch(fetchIni()), DEFFERED);
    return data.d;
  },
);

export const deleteExpense = createAsyncThunk(
  'expense/delete',
  async ({id}: Expense, thunkAPI) => {
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

    // deffered fetch
    setTimeout(() => thunkAPI.dispatch(fetchIni()), DEFFERED);
  },
);

export const deleteIncome = createAsyncThunk(
  'income/delete',
  async ({id}: Expense, thunkAPI) => {
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

    // deffered fetch
    setTimeout(() => thunkAPI.dispatch(fetchIni()), DEFFERED);
  },
);
