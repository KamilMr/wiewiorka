import {createAsyncThunk} from '@reduxjs/toolkit';

import {getURL} from '@/common';
import {dropMain, setSnackbar} from '../main/mainSlice';

interface DataResponse {
  err?: string;
  d: any;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface SignUpCredentials {
  email: string;
  password: string;
  name: string;
  surname?: string;
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

export const signup = createAsyncThunk(
  '/user/signup',
  async ({email, password, name, surname}: SignUpCredentials, thunkAPI) => {
    let data: DataResponse;
    const resp = await fetch(getURL('users/signup'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({email, password, name, surname}),
    });
    data = await resp.json();
    if (data.err) {
      const [key, ...string] = data.err.split(' ');
      const newKey = {name: 'imię', email: 'email', password: 'hasło'}[key];
      thunkAPI.dispatch(
        setSnackbar({
          msg: `${newKey} ${string.join(' ')}`,
          type: 'error',
          setTime: 3000,
        }),
      );
      throw data.err;
    }
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
