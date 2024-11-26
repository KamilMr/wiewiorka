import {createAsyncThunk} from '@reduxjs/toolkit';

import {getURL} from '@/common';
import {dropMain} from '../main/mainSlice';

interface DataResponse {
  err?: string;
  d: any;
}

interface SignInCredentials {
  email: string;
  password: string;
}

export const signIn = createAsyncThunk(
  '/user/signIn',
  async ({email, password}: SignInCredentials, thunkAPI) => {
    let data: DataResponse;
    try {
      const resp = await fetch(getURL('users/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, password}),
      });
      data = await resp.json();
      if (data.err) throw data.err;
    } catch (err) {
      throw err;
    }
    return data.d;
  },
);

export const logout = createAsyncThunk('/user/logout', async (_, thunkAPI) => {
  let data: DataResponse;
  thunkAPI.dispatch(dropMain());
  try {
    const resp = await fetch(getURL('users/logout'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    data = await resp.json();
    if (data.err) throw data.err;
  } catch (err) {
    throw err;
  }
  return data.d;
});
