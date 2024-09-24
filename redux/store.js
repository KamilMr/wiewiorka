import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  createMigrate,
  persistReducer,
  persistStore,
} from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";

import authReducer, { authEmptyState } from "./auth/authSlice";
import mainReducer, { mainEmptyState } from "./main/mainSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  main: mainReducer,
});

const migrations = {
  0: (state) => {
    // migration: flush store
    return {
      ...state,
      auth: authEmptyState(),
      main: mainEmptyState(),
    };
  },
};

const persistConfig = {
  key: "squirrel",
  version: 0,
  storage: AsyncStorage,
  whitelist: ["auth", "main"],
  migrate: createMigrate(migrations, { debug: false }),
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

const persistor = persistStore(store);

export { store, persistor };
