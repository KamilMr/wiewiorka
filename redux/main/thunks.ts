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
