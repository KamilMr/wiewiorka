import {createSlice} from '@reduxjs/toolkit';

import _ from 'lodash';
import { signIn } from './thunks';

const emptyState = () => ({
  me: {name: '', email: '', token: ''},
});

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    ...emptyState(),
  },
  reducers: {
    dropMe: () => {
      return emptyState();
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signIn.fulfilled, (state, action) => {
      const {name = '', email, token} = action.payload;
      return Object.assign(state.me, {name, email, token});
    })
  },
});

export const selectMe = (state) => state.auth.me;
export const selectToken = (state) => state.auth.me.token;

export const {dropMe} = authSlice.actions;

export {emptyState as authEmptyState};

export default authSlice.reducer;
