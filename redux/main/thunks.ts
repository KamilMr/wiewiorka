import {createAsyncThunk} from '@reduxjs/toolkit';

import {getURL} from '@/common';

export const fetchIni = createAsyncThunk(
  'ini/fetchIni',
  async (_, thunkAPI) => {
    const token = thunkAPI.getState().auth.token;
    let data;
    try {
      let resp = await fetch(getURL('ini'), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      data = await resp.json();
      console.log(data.err);
      if (data.err) throw data.err;
    } catch (err) {
      throw err;
    }
    return data.d;
  },
);

interface Expense {
  id: string;
  rest: object;
}

export const uploadExpense = createAsyncThunk(
  'expense/add',
  async ({id, ...rest}: Expense, thunkAPI) => {
    const token = thunkAPI.getState().auth.token;
    console.log(rest);
    let data;
    const path = 'expenses' + (id ? `/${id}` : '');
    try {
      let resp = await fetch(getURL(path), {
        method: id ? 'PUT' : 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-type': 'application/json',
        },
        body: JSON.stringify(rest),
      });
      data = await resp.json();
      if (data.err) throw data;
    } catch (err) {
      console.log(err);
      throw err;
    }
    await thunkAPI.dispatch(fetchIni());
  },
);

export const uploadIncome= createAsyncThunk(
  'income/add',
  async ({id, ...rest}: Expense, thunkAPI) => {
    const token = thunkAPI.getState().auth.token;

    let data;
    const path = 'income' + (id ? `/${id}` : '');
    try {
      let resp = await fetch(getURL(path), {
        method: id ? 'PATCH' : 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-type': 'application/json',
        },
        body: JSON.stringify(rest),
      });
      data = await resp.json();
      if (data.err) throw data;
    } catch (err) {
      console.log(err);
      throw err;
    }
    await thunkAPI.dispatch(fetchIni());
  },
);

export const handleCategory = createAsyncThunk(
  'handleCategory',
  async (payload = {}, thunkAPI) => {
    const {token} = thunkAPI.getState().me;

    if (!Object.keys(payload).length) return;

    const {method, id, ...rest} = payload;
    let q = 'category' + (method === 'PUT' ? `/${id}` : '');
    let data;
    try {
      let resp = await fetch(getURL(q), {
        method,
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(rest),
      });
      data = await resp.json();
      if (data.err) throw data.err;
      thunkAPI.dispatch(fetchIni());
    } catch (err) {
      throw err;
    }
    return data.d;
  },
);

export const uploadFile = createAsyncThunk(
  'expense/image',
  async ({file}, thunkAPI) => {
    const token = thunkAPI.getState().auth.token;
    let data;
    const path = 'expenses/image';
    try {
      let resp = await fetch(getURL(path), {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: file,
      });
      console.log('response', resp)
      data = await resp.json();
      console.log('ds',data)
      if (data.err) throw data;
    } catch (err) {
      console.log(err);
      throw err;
    }
    await thunkAPI.dispatch(fetchIni());
    return data.d;
  },
);
