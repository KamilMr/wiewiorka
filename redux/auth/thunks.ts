import {createAsyncThunk} from '@reduxjs/toolkit';
import {getURL} from '@/common';

interface State {
  me: {
    token: string;
  };
}

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
      console.log(data.d)
      if (data.err) throw data.err;
    } catch (err) {
      throw err;
    }
    return data.d;
  },
);
