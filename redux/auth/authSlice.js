import {createSlice} from '@reduxjs/toolkit';

import _ from 'lodash';
import {logout, signIn} from './thunks';

const emptyState = () => ({
  name: '',
  email: '',
  token: '',
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
    builder
      .addCase(signIn.fulfilled, (state, action) => {
        const {name = '', email, token} = action.payload;
        console.log(name, email);
        state.name = name;
        state.email = email;
        state.token = token;
        // Object.assign(state.auth, {name, email, token});
      })
      .addCase(signIn.rejected, (state, action) => {
        console.log('rejected', action.payload);
      })
      .addCase(logout.fulfilled, () => {
        return emptyState();
      })
      .addCase(logout.rejected, () => {
        return emptyState();
      });
  },
});

export const selectMe = (state) => state.auth;
export const selectToken = (state) => state.auth.token;

export const {dropMe} = authSlice.actions;

export {emptyState as authEmptyState};

export default authSlice.reducer;
