import {configureStore, combineReducers, Store} from '@reduxjs/toolkit';
import {createMigrate, persistReducer, persistStore} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import authReducer, {authEmptyState, dropMe} from './auth/authSlice';
import mainReducer, {dropMain, mainEmptyState} from './main/mainSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  main: mainReducer,
});

const authMiddleware = (store: Store) => (next: any) => async (action: any) => {
  if (action.error?.message === 'session_not_active') {
    store.dispatch(dropMe());
    store.dispatch(dropMain());
  }
  return next(action);
};

const migrations = {
  0: (state: RootState) => {
    // migration: flush store
    return {
      ...state,
      auth: authEmptyState(),
      main: mainEmptyState(),
    };
  },
  1: (state: RootState) => {
    return {
      ...state,
      auth: authEmptyState(),
      main: mainEmptyState(),
    };
  },
  2: (state: RootState) => {
    return {
      ...state,
      auth: authEmptyState(),
      main: mainEmptyState(),
    };
  },
};

const persistConfig = {
  key: 'squirrel',
  version: 1,
  storage: AsyncStorage,
  whitelist: ['auth', 'main'],
  migrate: createMigrate(migrations, {debug: false}),
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
      // serializableCheck: {
      //   ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      // },
    }).concat(authMiddleware),
});

const persistor = persistStore(store);

export {store, persistor};
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
