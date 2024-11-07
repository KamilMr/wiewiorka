import {createSlice} from '@reduxjs/toolkit';

import _ from 'lodash';
import {format} from 'date-fns';

import {
  deleteExpense,
  deleteIncome,
  fetchIni,
  handleCategory,
  uploadExpense,
  uploadFile,
  uploadIncome,
} from './thunks';
import aggregateDataByDay from '../../utils/aggregateData';
import {AggregatedData} from '@/utils/types';

type Snackbar = {
  open: boolean;
  type: string;
  msg: string;
};

export type Income = {
  date: string;
  id: number;
  owner: string;
  price: number;
  source: string;
  valt: number;
};

export type Expense = {
  category: string;
  categoryId: number;
  date: string;
  description: string;
  id: number;
  image: string;
  owner: string;
  price: number;
  receipt: string;
  exp: boolean;
};

export interface Category {
  catId: number;
  category: string;
  color: string;
}

export interface Group {
  categories: Category[];
  groupName: string;
}

export interface MainSlice {
  status: 'idle' | 'fetching';
  expenses: Array<Expense>;
  incomes: Array<Income>;
  categories: {[key: number]: Group};
  _aggregated: AggregatedData;
  sources: {[key: string]: string[]};
  snackbar: Snackbar;
}

const emptyState: MainSlice = {
  status: 'idle',
  expenses: [],
  incomes: [],
  categories: {},
  sources: {},
  _aggregated: {},
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
    setStatus: (state, action) => {
      state.status = action.payload;
    },
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
      state.sources = action.payload.income.reduce(
        (pv: {[key: string]: string[]}, cv: Income) => {
          pv[cv.owner] ??= [];
          if (!pv[cv.owner].includes(cv.source)) pv[cv.owner].push(cv.source);
          return pv;
        },
        {},
      );
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

      state.sources = action.payload.income.reduce(
        (pv: {[key: string]: string[]}, cv: Income) => {
          pv[cv.owner] ??= [];
          if (!pv[cv.owner].includes(cv.source)) pv[cv.owner].push(cv.source);
          return pv;
        },
        {},
      );
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
      .addCase(fetchIni.pending, (state, action) => {
        state.status = 'fetching';
      })
      .addCase(fetchIni.fulfilled, (state, action) => {
        state.status = 'idle';
        let {expenses, income, categories} = action.payload;
        expenses = expenses.map((ex: Expense) => ({
          ...ex,
          date: format(ex.date, 'yyyy-MM-dd'),
        }));
        state.expenses = expenses;
        state.categories = categories;
        state.incomes = income.map((inc: Income) => ({
          ...inc,
          date: format(inc.date, 'yyyy-MM-dd'),
        }));

        state.sources = income.reduce(
          (pv: {[key: string]: string[]}, cv: Income) => {
            pv[cv.owner] ??= [];
            if (!pv[cv.owner].includes(cv.source)) pv[cv.owner].push(cv.source);
            return pv;
          },
          {},
        );

        state._aggregated = aggregateDataByDay(expenses, categories);
      })
      .addCase(fetchIni.rejected, (state, action) => {
        state.snackbar.open = true;
        state.snackbar.type = 'error';
        state.snackbar.msg = action.error.message || 'Coś poszło nie tak';
        state.status = 'idle';
      })
      .addCase(handleCategory.rejected, (state, action) => {
        state.snackbar.open = true;
        state.snackbar.type = 'error';
        state.snackbar.msg = action.error.message;
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.snackbar.open = true;
        state.snackbar.type = 'error';
        state.snackbar.msg = action.error.message || 'Coś poszło nie tak';
      })
      .addCase(uploadExpense.fulfilled, (state, action) => {
        state.snackbar.open = true;
        state.snackbar.type = 'info';
        state.snackbar.msg = 'Zapisano wydatek';
      })
      .addCase(uploadExpense.rejected, (state, action) => {
        state.snackbar.open = true;
        state.snackbar.type = 'error';
        state.snackbar.msg = action.error.message || 'Coś poszło nie tak';
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.snackbar.open = true;
        state.snackbar.type = 'info';
        state.snackbar.msg = 'Usunięto wydatek';
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.snackbar.open = true;
        state.snackbar.type = 'info';
        state.snackbar.msg = action.error.message || 'Coś poszło nie tak';
      })
      .addCase(uploadIncome.fulfilled, (state, action) => {
        state.snackbar.open = true;
        state.snackbar.type = 'info';
        state.snackbar.msg = 'Zapisano wpływ';
      })
      .addCase(uploadIncome.rejected, (state, action) => {
        state.snackbar.open = true;
        state.snackbar.type = 'error';
        state.snackbar.msg = action.error.message;
      })
      .addCase(deleteIncome.fulfilled, (state, action) => {
        state.snackbar.open = true;
        state.snackbar.type = 'info';
        state.snackbar.msg = 'Usunięto wpływ';
      })
      .addCase(deleteIncome.rejected, (state, action) => {
        state.snackbar.open = true;
        state.snackbar.type = 'info';
        state.snackbar.msg = action.error.message || 'Coś poszło nie tak';
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
  setStatus,
  updateExpense,
} = mainSlice.actions;

export {emptyState as mainEmptyState};

export default mainSlice.reducer;
