import {configureStore} from '@reduxjs/toolkit';

import mainReducer, {
  addGroupCategoryAction,
  addSubcategoryAction,
} from './mainSlice';
import syncReducer, {addToQueue} from '../sync/syncSlice';
import {genericSync} from './syncThunks';
import {authenticatedFetch} from './api';
import type {SyncCallbackName} from '@/types';

jest.mock('immer', () =>
  jest.requireActual('../../node_modules/immer/dist/cjs/index.js'),
);

jest.mock('./api', () => ({
  authenticatedFetch: jest.fn(),
}));

jest.mock('@/utils/crashlytics', () => ({
  log: jest.fn(),
  logError: jest.fn(),
  setAttribute: jest.fn(),
}));

const mockedAuthenticatedFetch = authenticatedFetch as jest.Mock;

const createStore = () =>
  configureStore({
    reducer: {
      main: mainReducer,
      sync: syncReducer,
      auth: (state = {token: 'token'}) => state,
    },
  });

const successfulResponse = (data: unknown) => ({
  ok: true,
  status: 200,
  text: async () => JSON.stringify({d: data}),
});

describe('genericSync category callbacks', () => {
  beforeEach(() => {
    mockedAuthenticatedFetch.mockReset();
  });

  it('replaces a temporary subcategory ID and removes its queue operation', async () => {
    const store = createStore();
    store.dispatch(
      addGroupCategoryAction({id: 10, name: 'Group', color: 'red'}),
    );
    store.dispatch(
      addSubcategoryAction({
        id: 'f_subcategory',
        name: 'Temporary',
        color: 'red',
        groupId: 10,
      }),
    );
    store.dispatch(
      addToQueue({
        path: ['main', 'category'],
        method: 'POST',
        handler: 'genericSync',
        frontendId: 'f_subcategory',
        cb: 'replaceSubcategoryAction',
      }),
    );
    const operation = store.getState().sync.pendingOperations[0];
    mockedAuthenticatedFetch.mockResolvedValue(
      successfulResponse({
        id: 101,
        name: 'Server category',
        color: 'blue',
        groupId: 10,
      }),
    );

    await (store.dispatch as any)(
      genericSync({
        path: operation.path.slice(1),
        method: operation.method,
        cb: operation.cb,
        operationId: operation.id,
        frontendId: operation.frontendId,
      }),
    );

    expect(store.getState().main.categories[10].subcategories).toEqual([
      {
        id: 101,
        name: 'Server category',
        color: 'blue',
        groupId: 10,
      },
    ]);
    expect(store.getState().sync.pendingOperations).toEqual([]);
  });

  it('replaces a temporary group ID and removes its queue operation', async () => {
    const store = createStore();
    store.dispatch(
      addGroupCategoryAction({
        id: 'f_group',
        name: 'Temporary group',
        color: 'red',
      }),
    );
    store.dispatch(
      addToQueue({
        path: ['main', 'category', 'group'],
        method: 'POST',
        handler: 'genericSync',
        frontendId: 'f_group',
        cb: 'replaceGroupCategoryAction',
      }),
    );
    const operation = store.getState().sync.pendingOperations[0];
    mockedAuthenticatedFetch.mockResolvedValue(
      successfulResponse({id: 202, name: 'Server group', color: 'blue'}),
    );

    await (store.dispatch as any)(
      genericSync({
        path: operation.path.slice(1),
        method: operation.method,
        cb: operation.cb,
        operationId: operation.id,
        frontendId: operation.frontendId,
      }),
    );

    expect(store.getState().main.categories).not.toHaveProperty('f_group');
    expect(store.getState().main.categories[202]).toEqual({
      name: 'Server group',
      color: 'blue',
      subcategories: [],
    });
    expect(store.getState().sync.pendingOperations).toEqual([]);
  });

  it('keeps an operation queued when its persisted callback is unknown', async () => {
    const store = createStore();
    store.dispatch(
      addToQueue({
        path: ['main', 'category'],
        method: 'POST',
        handler: 'genericSync',
        frontendId: 'f_category',
        cb: 'replaceSubcategoryAction',
      }),
    );
    const operation = store.getState().sync.pendingOperations[0];
    mockedAuthenticatedFetch.mockResolvedValue(successfulResponse({id: 303}));

    await (store.dispatch as any)(
      genericSync({
        path: operation.path.slice(1),
        method: operation.method,
        cb: 'missingPersistedCallback' as unknown as SyncCallbackName,
        operationId: operation.id,
        frontendId: operation.frontendId,
      }),
    );

    expect(store.getState().sync.pendingOperations).toHaveLength(1);
    expect(store.getState().sync.pendingOperations[0].retryCount).toBe(1);
    expect(store.getState().sync.syncErrors[operation.id]).toContain(
      'Sync callback is not registered',
    );
  });
});
