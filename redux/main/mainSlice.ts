import {createSlice} from '@reduxjs/toolkit';

import _ from 'lodash';

import {fetchIni, handleCategory, uploadExpense, uploadFile} from './thunks';
import {format} from 'date-fns';

type Snackbar = {
  open: boolean;
  type: string;
  msg: string;
};

type Income = {
  date: string;
  id: number;
  owner: string;
  price: number;
  source: string;
  valt: number;
};

export type Expense = {
  category: string;
  date: string;
  description: string;
  id: number;
  image: string;
  owner: string;
  price: number;
  receipt: string;
  exp: boolean;
};
interface Category {
  catId: number;
  category: string;
  color: string;
}

interface Group {
  categories: Category[];
  groupName: string;
}

interface MainSlice {
  expenses: Array<Expense>;
  incomes: Array<Income>;
  categories: {[key: number]: Group};
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
      state.expenses = action.payload.expenses.map((ex: Expense) => ({
        ...ex,
        date: format(ex.date, 'yyyy-MM-dd'),
      }));
      state.categories = action.payload.categories;
      state.incomes = action.payload.income;
    },
    addExpense: (state, action) => {
      state.expenses = [
        ...state.expenses,
        ...action.payload.map((ex: Expense) => ({
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
        ...exp.map((ex: Expense) => ({
          ...ex,
          date: format(ex.date, 'yyyy-MM-dd'),
        })),
      ];
    },
    addIncome: (state, action) => {
      if (!action.payload?.length) return;
      state.incomes = action.payload.map((inc: Income) => ({
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
        state.expenses = action.payload.expenses.map((ex: Expense) => ({
          ...ex,
          date: format(ex.date, 'yyyy-MM-dd'),
        }));
        state.categories = action.payload.categories;
        state.incomes = action.payload.income.map((inc: Income) => ({
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
      .addCase(uploadFile.rejected, (state, action) => {
        state.snackbar.open = true;
        state.snackbar.type = 'error';
        state.snackbar.msg = action.error.message;
      })
      .addCase(uploadExpense.rejected, (state, action) => {
        console.log('rejected expense', action.error);
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
