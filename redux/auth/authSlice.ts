import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import _ from 'lodash';

import {logout, signIn} from './thunks';
import {RootState} from '../store';
import {AuthSlice} from '@/types';

const emptyState = (): AuthSlice => ({
  name: '',
  email: '',
  token: '',
});

export const authSlice = createSlice({
  name: 'auth',
  initialState: emptyState(),
  reducers: {
    dropMe: () => emptyState(),
  },
  extraReducers: builder => {
    builder
      .addCase(signIn.fulfilled, (state, action: PayloadAction<AuthSlice>) => {
        const {name = '', email, token, id, houses} = action.payload;
        state.name = name;
        state.email = email;
        state.token = token;
        state.houses = houses;
        state.id = id;
      })
      .addCase(logout.pending, () => emptyState())
      .addCase(signIn.rejected, (_, action) => emptyState());
  },
});

export const selectMe = (state: RootState) => state.auth;
export const selectToken = (state: RootState) => state.auth.token;

export const {dropMe} = authSlice.actions;

export {emptyState as authEmptyState};

export default authSlice.reducer;
