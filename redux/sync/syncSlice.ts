import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {SyncSlice, SyncOperation} from '@/types';
import {makeRandomId} from '@/common';
import {SYNC_CONFIG} from '@/constants/theme';
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
        Omit<
          SyncOperation,
          | 'id'
          | 'timestamp'
          | 'retryCount'
          | 'status'
          | 'lastAttempt'
          | 'nextRetryAt'
        >
      >,
    ) => {
      const operation: SyncOperation = {
        ...action.payload,
        id: `sync_${makeRandomId(8)}`,
        timestamp: Date.now(),
        retryCount: 0,
        status: 'pending',
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

    incrementRetryCount: (
      state,
      action: PayloadAction<{operationId: string; maxRetries?: number}>,
    ) => {
      const operation = state.pendingOperations.find(
        op => op.id === action.payload.operationId,
      );
      if (!operation) return;
      operation.retryCount += 1;
      operation.lastAttempt = Date.now();

      const maxRetries = action.payload.maxRetries || SYNC_CONFIG.MAX_RETRIES;

      if (operation.retryCount >= maxRetries) {
        operation.status = 'failed';
        operation.nextRetryAt = undefined;
      } else {
        operation.status = 'retrying';
        // Fixed 3-minute delay for all retries
        const delay = SYNC_CONFIG.RETRY_DELAY;

        operation.nextRetryAt = Date.now() + delay;
        // reload it to trigger useEffect that will do the check
        state.shouldReload = !state.shouldReload;
      }
    },

    setOperationStatus: (
      state,
      action: PayloadAction<{
        operationId: string;
        status: SyncOperation['status'];
      }>,
    ) => {
      const operation = state.pendingOperations.find(
        op => op.id === action.payload.operationId,
      );
      if (!operation) return;
      operation.status = action.payload.status;
      if (action.payload.status === 'processing')
        operation.lastAttempt = Date.now();
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
  setOperationStatus,
  setShouldReload,
  setSyncError,
  setSyncingStatus,
} = syncSlice.actions;

export {emptyState as syncEmptyState};

export default syncSlice.reducer;
