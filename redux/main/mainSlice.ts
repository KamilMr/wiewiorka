import {createSlice} from '@reduxjs/toolkit';

import _ from 'lodash';
import {format} from 'date-fns';

import {
  deleteExpense,
  deleteIncome,
  fetchIni,
  handleCategory,
  handleDeleteCategory,
  handleDeleteGroupCategory,
  handleGroupCategory,
  uploadExpense,
  uploadFile,
  uploadIncome,
} from './thunks';
import aggregateDataByDay from '../../utils/aggregateData';
import {MainSlice, Income, Expense} from '@/types';

const emptyState = (): MainSlice => ({
  status: 'idle',
  expenses: [],
  budgets: [],
  incomes: [],
  categories: {},
  sources: {},
  _aggregated: {},
  snackbar: {
    open: false,
    type: 'success',
    msg: '',
  },
});

const mainSlice = createSlice({
  name: 'main',
  initialState: emptyState(),
  reducers: {
    startLoading: (state, action) => {
      state.status = 'fetching'
    },
    stopLoading: (state) => {
      state.status = 'idle';
    },
    setSnackbar: (state, action) => {
      let {open = false, type = '', msg = '', setTime} = action.payload || {};
      if (msg) open = true;
      state.snackbar = {type, msg, open, time: setTime};
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
    dropMain: () => emptyState(),
    removeExpense: (state, action) => {
      state.expenses = state.expenses.filter(
        (exp) => exp.id !== action.payload,
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIni.fulfilled, (state, action) => {
        let {expenses, income, categories} = action.payload;
        expenses = expenses.map((ex: Expense) => ({
          ...ex,
          date: format(ex.date, 'yyyy-MM-dd'),
        }));
        state.budgets = action.payload.budgets || [];
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
        //
        state._aggregated = aggregateDataByDay(expenses, categories);
      })
      .addCase(fetchIni.rejected, (state, action) => {
        state.snackbar.open = true;
        state.snackbar.type = 'error';
        state.snackbar.msg = action.error.message ?? 'Coś poszło nie tak';
      })
      .addCase(handleCategory.rejected, (state, action) => {
        state.snackbar.open = true;
        state.snackbar.type = 'error';
        state.snackbar.msg = action.error.message ?? 'Coś poszło nie tak';
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.snackbar.open = true;
        state.snackbar.type = 'error';
        state.snackbar.msg = action.error.message ?? 'Coś poszło nie tak';
      })
      .addCase(uploadExpense.fulfilled, (state, action) => {
        state.snackbar.open = true;
        state.snackbar.type = 'info';
        state.snackbar.msg = 'Zapisano wydatek';
      })
      .addCase(uploadExpense.rejected, (state, action) => {
        state.snackbar.open = true;
        state.snackbar.type = 'error';
        state.snackbar.msg = action.error.message ?? 'Coś poszło nie tak';
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.snackbar.open = true;
        state.snackbar.type = 'info';
        state.snackbar.msg = 'Usunięto wydatek';
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.snackbar.open = true;
        state.snackbar.type = 'info';
        state.snackbar.msg = action.error.message ?? 'Coś poszło nie tak';
      })
      .addCase(uploadIncome.fulfilled, (state, action) => {
        state.snackbar.open = true;
        state.snackbar.type = 'info';
        state.snackbar.msg = 'Zapisano wpływ';
      })
      .addCase(uploadIncome.rejected, (state, action) => {
        state.snackbar.open = true;
        state.snackbar.type = 'error';
        state.snackbar.msg = action.error.message ?? 'Coś poszło nie tak';
      })
      .addCase(deleteIncome.fulfilled, (state, action) => {
        state.snackbar.open = true;
        state.snackbar.type = 'info';
        state.snackbar.msg = 'Usunięto wpływ';
      })
      .addCase(deleteIncome.rejected, (state, action) => {
        state.snackbar.open = true;
        state.snackbar.type = 'info';
        state.snackbar.msg = action.error.message ?? 'Coś poszło nie tak';
      })
      .addCase(handleGroupCategory.rejected, (state, action) => {
        state.snackbar.open = true;
        state.snackbar.type = 'error';
        state.snackbar.msg = action.error.message ?? 'Coś poszło nie tak';
      })
      .addCase(handleDeleteCategory.rejected, (state, action) => {
        state.snackbar.open = true;
        state.snackbar.type = 'error';
        state.snackbar.msg = action.error.message ?? 'Coś poszło nie tak';
      })
      .addCase(handleDeleteGroupCategory.rejected, (state, action) => {
        state.snackbar.open = true;
        state.snackbar.type = 'error';
        state.snackbar.msg = action.error.message ?? 'Coś poszło nie tak';
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
  startLoading,
  stopLoading,
  updateExpense,
} = mainSlice.actions;

export {emptyState as mainEmptyState};

export default mainSlice.reducer;
