import {createSlice} from '@reduxjs/toolkit';

import _ from 'lodash';

import {fetchIni, handleCategory, uploadExpense} from './thunks';
import {format} from 'date-fns';

type Snackbar = {
  open: boolean;
  type: string;
  msg: string;
};

// TODO: write propper types 
interface MainSlice {
  expenses: Array<{[key: string]: any}>;
  incomes: Array<{[key: string]: any}>;
  categories: {[key: string]: any};
  snackbar: Snackbar;
}

const emptyState: MainSlice = {
  expenses: [],
  incomes: [],
  categories: {},
  snackbar: {
    open: false,
    type: 'success',
    msg: '',
  },
};

const mainSlice = createSlice({
  name: 'main',
  initialState: emptyState,
  reducers: {
    setSnackbar: (state, action) => {
      let {open = false, type = '', msg = ''} = action.payload || {};
      if (msg) open = true;
      // state.snackbar.open = open;
      // state.snackbar.msg = msg;
      // state.snackbar.type = type;
      state.snackbar = {type, msg, open};
    },
    initState: (state, action) => {
      state.expenses = action.payload.expenses.map((ex) => ({
        ...ex,
        date: format(ex.date, 'yyyy-MM-dd'),
      }));
      state.categories = action.payload.categories;
      state.incomes = action.payload.income;
    },
    addExpense: (state, action) => {
      state.expenses = [
        ...state.expenses,
        ...action.payload.map((ex) => ({
          ...ex,
          date: format(ex.date, 'yyyy-MM-dd'),
        })),
      ];
    },
    updateExpense: (state, action) => {
      const exp = action.payload;
      const expIdx = state.expenses.findIndex((ex) => ex.id === exp[0].id);
      const stateNew = state.expenses.slice();
      stateNew.splice(expIdx, 1);

      state.expenses = [
        ...stateNew,
        ...exp.map((ex) => ({
          ...ex,
          date: format(ex.date, 'yyyy-MM-dd'),
        })),
      ];
    },
    addIncome: (state, action) => {
      if (!action.payload?.length) return;
      state.incomes = action.payload.map((inc) => ({
        ...inc,
        date: format(inc.date, 'yyyy-MM-dd'),
      }));
    },
    dropMain: () => {
      return emptyState;
    },
    removeExpense: (state, action) => {
      state.expenses = state.expenses.filter(
        (exp) => exp.id !== action.payload,
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIni.fulfilled, (state, action) => {
        state.expenses = action.payload.expenses.map((ex) => ({
          ...ex,
          date: format(ex.date, 'yyyy-MM-dd'),
        }));
        state.categories = action.payload.categories;
        state.incomes = action.payload.income.map((inc) => ({
          ...inc,
          date: format(inc.date, 'yyyy-MM-dd'),
        }));
        state.snackbar.open = true;
        state.snackbar.type = 'success';
        state.snackbar.msg = 'Pobrano dane';
      })
      .addCase(fetchIni.rejected, (state, action) => {
        state.snackbar.open = true;
        state.snackbar.type = 'error';
        state.snackbar.msg = action.error.message;
      })
      .addCase(handleCategory.rejected, (state, action) => {
        state.snackbar.open = true;
        state.snackbar.type = 'error';
        state.snackbar.msg = action.error.message;
      })
      .addCase(uploadExpense.rejected, (state, action) => {
        console.log('rejected expense', action.payload);
      });
  },
});

export const {
  addExpense,
  addIncome,
  dropMain,
  initState,
  removeExpense,
  setSnackbar,
  updateExpense,
} = mainSlice.actions;

export {emptyState as mainEmptyState};

export default mainSlice.reducer;
