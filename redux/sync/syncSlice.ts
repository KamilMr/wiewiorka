import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {SyncSlice, SyncOperation} from '@/types';
import {makeRandomId} from '@/common';
import {RootState} from '../store';

const emptyState = (): SyncSlice => ({
  pendingOperations: [],
  isSyncing: false,
  lastSyncTimestamp: null,
  syncErrors: {},
  shouldReload: false,
});

const syncSlice = createSlice({
  name: 'sync',
  initialState: emptyState(),
  reducers: {
    addToQueue: (
      state,
      action: PayloadAction<
        Omit<SyncOperation, 'id' | 'timestamp' | 'retryCount'>
      >,
    ) => {
      const operation: SyncOperation = {
        ...action.payload,
        id: `sync_${makeRandomId(8)}`,
        timestamp: Date.now(),
        retryCount: 0,
      };

      console.log(
        '📋 Adding operation to sync queue:',
        JSON.stringify(operation, null, 2),
      );

      // Check if operation already exists to avoid duplicates
      const existingIndex = state.pendingOperations.findIndex(
        op => op.frontendId === action.payload.frontendId,
      );

      if (existingIndex >= 0) {
        // Update existing operation instead of adding duplicate
        console.log(
          '🔄 Updating existing operation instead of adding duplicate',
        );
        state.pendingOperations[existingIndex] = operation;
      } else {
        console.log('➕ Adding new operation to queue');
        state.pendingOperations.push(operation);
      }

      console.log(
        `📊 Queue now has ${state.pendingOperations.length} operations:`,
        state.pendingOperations.map(op => `${op.method} ${op.path.join('/')}`),
      );
    },

    removeFromQueue: (state, action: PayloadAction<string>) => {
      console.log('🗑️ Removing operation from queue:', action.payload);
      state.pendingOperations = state.pendingOperations.filter(
        op => op.id !== action.payload,
      );
      // Remove associated error if exists
      delete state.syncErrors[action.payload];
      console.log(
        `📊 Queue now has ${state.pendingOperations.length} operations remaining`,
      );
    },

    clearQueue: state => {
      state.pendingOperations = [];
      state.syncErrors = {};
    },

    setSyncingStatus: (state, action: PayloadAction<boolean>) => {
      state.isSyncing = action.payload;
    },

    setLastSyncTimestamp: (state, action: PayloadAction<number>) => {
      state.lastSyncTimestamp = action.payload;
    },

    incrementRetryCount: (state, action: PayloadAction<string>) => {
      const operation = state.pendingOperations.find(
        op => op.id === action.payload,
      );
      if (operation) {
        operation.retryCount += 1;
      }
    },

    setSyncError: (
      state,
      action: PayloadAction<{operationId: string; error: string}>,
    ) => {
      state.syncErrors[action.payload.operationId] = action.payload.error;
    },

    clearSyncError: (state, action: PayloadAction<string>) => {
      delete state.syncErrors[action.payload];
    },

    setShouldReload: state => {
      state.shouldReload = true;
    },

    clearShouldReload: state => {
      state.shouldReload = false;
    },

    dropSync: () => emptyState(),
  },
});

export const selectOperations = (state: RootState) =>
  state.sync.pendingOperations;

export const selectShouldReload = (state: RootState) => state.sync.shouldReload;

export const {
  addToQueue,
  clearQueue,
  clearShouldReload,
  clearSyncError,
  dropSync,
  incrementRetryCount,
  removeFromQueue,
  setLastSyncTimestamp,
  setShouldReload,
  setSyncError,
  setSyncingStatus,
} = syncSlice.actions;

export {emptyState as syncEmptyState};

export default syncSlice.reducer;
