import {configureStore, combineReducers, Store} from '@reduxjs/toolkit';
import {createMigrate, persistReducer, persistStore} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import authReducer, {authEmptyState, dropMe} from './auth/authSlice';
import mainReducer, {
  dropMain,
  mainEmptyState,
  startLoading,
  stopLoading,
} from './main/mainSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  main: mainReducer,
});

const authMiddleware = (store: Store) => (next: any) => async (action: any) => {
  if (['session_not_active', 'not_auth'].includes(action.error?.message)) {
    store.dispatch(dropMe());
    store.dispatch(dropMain());
  }
  return next(action);
};

const setLoadingStatusMiddleware =
  (store: Store) => (next: any) => async (action: any) => {
    if (action.type.endsWith('/pending')) {
      store.dispatch(startLoading(''));
    } else if (
      action.type.endsWith('/fulfilled') ||
      action.type.endsWith('/rejected')
    ) {
      store.dispatch(stopLoading(''));
    }
    return next(action);
  };

const migrations = {
  4: (state: RootState) => {
    return {
      ...state,
      auth: authEmptyState(),
      main: mainEmptyState(),
    };
  },
};

const persistConfig = {
  key: 'squirrel',
  version: 4,
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
    }).concat([authMiddleware, setLoadingStatusMiddleware]),
});

const persistor = persistStore(store);

export {store, persistor};
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
