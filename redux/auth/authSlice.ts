import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import _ from 'lodash';

import {deleteProfilePhoto, logout, signIn, uploadProfilePhoto} from './thunks';
import {RootState} from '../store';
import {AuthSlice, ProfilePhotoUrls} from '@/types';

const emptyState = (): AuthSlice => ({
  name: '',
  email: '',
  token: '',
  avatarUrl: null,
  mediumUrl: null,
  originalUrl: null,
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
        const {
          name = '',
          email,
          token,
          id,
          houses,
          avatarUrl,
          mediumUrl,
          originalUrl,
        } = action.payload;
        state.name = name;
        state.email = email;
        state.token = token;
        state.houses = houses;
        state.id = id;
        state.avatarUrl = avatarUrl ?? null;
        state.mediumUrl = mediumUrl ?? null;
        state.originalUrl = originalUrl ?? null;
      })
      .addCase(
        uploadProfilePhoto.fulfilled,
        (state, action: PayloadAction<ProfilePhotoUrls>) => {
          state.avatarUrl = action.payload.avatarUrl;
          state.mediumUrl = action.payload.mediumUrl;
          state.originalUrl = action.payload.originalUrl;
        },
      )
      .addCase(
        deleteProfilePhoto.fulfilled,
        (state, action: PayloadAction<ProfilePhotoUrls>) => {
          state.avatarUrl = action.payload.avatarUrl;
          state.mediumUrl = action.payload.mediumUrl;
          state.originalUrl = action.payload.originalUrl;
        },
      )
      .addCase(logout.pending, () => emptyState())
      .addCase(signIn.rejected, (_, action) => emptyState());
  },
});

export const selectMe = (state: RootState) => state.auth;
export const selectToken = (state: RootState) => state.auth.token;
export const selectAvatarUrl = (state: RootState) =>
  state.auth.avatarUrl ?? null;
export const selectMediumUrl = (state: RootState) =>
  state.auth.mediumUrl ?? null;
export const selectOriginalUrl = (state: RootState) =>
  state.auth.originalUrl ?? null;

export const {dropMe} = authSlice.actions;

export {emptyState as authEmptyState};

export default authSlice.reducer;
