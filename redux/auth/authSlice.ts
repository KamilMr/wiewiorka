import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import _ from 'lodash';

import {logout, signIn} from './thunks';
import {RootState} from '../store';

interface AuthSlice {
  name: string;
  email: string;
  token: string;
}

const emptyState: AuthSlice = {
  name: '',
  email: '',
  token: '',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState: emptyState,
  reducers: {
    dropMe: () => {
      return emptyState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.fulfilled, (state, action: PayloadAction<AuthSlice>) => {
        const {name = '', email, token} = action.payload;
        state.name = name;
        state.email = email;
        state.token = token;
      })
      .addCase(logout.pending, () => {
        return emptyState;
      })
      .addCase(signIn.rejected, (_, action) => {
        console.log('logout rejected', action.payload);
        return emptyState;
      });
  },
});

export const selectMe = (state: RootState) => state.auth;
export const selectToken = (state: RootState) => state.auth.token;

export const {dropMe} = authSlice.actions;

export {emptyState as authEmptyState};

export default authSlice.reducer;
