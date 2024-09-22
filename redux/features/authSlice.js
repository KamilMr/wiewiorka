import {createSlice} from '@reduxjs/toolkit';

import _ from 'lodash';

const emptyState = () => ({
  me: {
    id: '',
    name: '',
    surname: '',
    email: '',
  },
  token: '',
});

export const authSlice = createSlice({
  name: 'auth',
  initialState: emptyState(),
  reducers: {
    setAuth: (state, action) => {
      const {token, user} = action.payload;
      state.me = _.merge(state.me, user);
      if (token) state.token = token;
    },
    dropAuth: () => {
      return emptyState();
    },
  },
});

export const selectMe = state => state.auth.me;
export const selectToken = state => state.auth.token;

export const {
  dropAuth,
  setAuth,
} = authSlice.actions;

export {emptyState as authEmptyState};

export default authSlice.reducer;
