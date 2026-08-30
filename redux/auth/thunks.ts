import {createAsyncThunk} from '@reduxjs/toolkit';

import {getURL} from '@/common';
import {ProfilePhotoUploadFile, ProfilePhotoUrls} from '@/types';
import {dropMain, setSnackbar} from '../main/mainSlice';
import {RootState} from '../store';
import {logError, log, setUserId, setAttribute} from '@/utils/crashlytics';

interface DataResponse<T = any> {
  err?: string;
  d: T;
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
      if (data.err) throw new Error(data.err);
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      log('signIn: Authentication failed');
      logError(errorObj, 'signIn');
      throw errorObj;
    }

    // Set user context for Crashlytics on successful login
    if (data.d?.id) {
      setUserId(data.d.id);
      if (data.d.houses?.[0]) setAttribute('houseId', data.d.houses[0]);
      log('signIn: User authenticated successfully');
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

export const uploadProfilePhoto = createAsyncThunk<
  ProfilePhotoUrls,
  ProfilePhotoUploadFile,
  {state: RootState}
>('/user/uploadProfilePhoto', async (file, {getState}) => {
  const data = new FormData();
  data.append('photo', file as unknown as Blob);

  const resp = await fetch(getURL('users/profile-photo'), {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${getState().auth.token}`,
    },
    body: data,
  });
  const response: DataResponse<ProfilePhotoUrls> = await resp.json();
  if (response.err) throw new Error(response.err);

  return response.d;
});

export const deleteProfilePhoto = createAsyncThunk<
  ProfilePhotoUrls,
  void,
  {state: RootState}
>('/user/deleteProfilePhoto', async (_, {getState}) => {
  const resp = await fetch(getURL('users/profile-photo'), {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getState().auth.token}`,
    },
  });
  const response: DataResponse<ProfilePhotoUrls> = await resp.json();
  if (response.err) throw new Error(response.err);

  return response.d;
});

export const logout = createAsyncThunk('/user/logout', async (_, thunkAPI) => {
  let data: DataResponse;
  log('logout: User logging out');
  thunkAPI.dispatch(dropMain());
  try {
    const resp = await fetch(getURL('users/logout'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    data = await resp.json();
    if (data.err) throw new Error(data.err);
  } catch (err) {
    const errorObj = err instanceof Error ? err : new Error(String(err));
    log('logout: Logout request failed');
    logError(errorObj, 'logout');
    throw errorObj;
  }

  // Clear user context on logout
  setUserId('');
  log('logout: User logged out successfully');

  return data.d;
});
