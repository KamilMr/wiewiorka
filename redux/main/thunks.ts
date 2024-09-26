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

export {createAsyncThunk};
