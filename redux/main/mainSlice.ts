import {createSlice} from '@reduxjs/toolkit';

import _ from 'lodash';
import {format} from 'date-fns';

import aggregateDataByDay from '../../utils/aggregateData';
import {MainSlice, Income, Expense} from '@/types';
import {printJsonIndent} from '@/common';

const emptyState = (): MainSlice => ({
  status: 'idle',
  expenses: [],
  budgets: [],
  incomes: [],
  categories: {},
  sources: {},
  _aggregated: {},
  devMode: false,
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
      state.status = 'fetching';
    },
    stopLoading: state => {
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
      const expense = action.payload;
      const expIdx = state.expenses.findIndex(ex => ex.id === expense.id);
      if (expIdx !== -1) {
        state.expenses[expIdx] = {
          ...expense,
          date: format(expense.date, 'yyyy-MM-dd'),
        };
      }
    },
    addIncome: (state, action) => {
      state.incomes = [
        ...state.incomes,
        ...action.payload.map((inc: Income) => ({
          ...inc,
          date: format(inc.date, 'yyyy-MM-dd'),
        })),
      ];
    },
    addBudgets: (state, action) => {
      printJsonIndent('addBudgets called with:', action.payload);
      state.budgets = [
        ...state.budgets,
        ...action.payload.map((budget: any) => ({
          ...budget,
          yearMonth: budget.date
            ? format(budget.date, 'yyyy-MM-dd')
            : budget.yearMonth,
        })),
      ];
      printJsonIndent('addBudgets: New budgets state:', state.budgets);
    },
    updateBudget: (state, action) => {
      const {id, ...data} = action.payload;
      const budgetIndex = state.budgets.findIndex(budget => budget.id === id);
      if (budgetIndex !== -1) {
        state.budgets[budgetIndex] = {
          ...state.budgets[budgetIndex],
          ...data,
        };
      }
    },
    deleteBudget: (state, action) => {
      const {id} = action.payload;
      const budgetIndex = state.budgets.findIndex(budget => budget.id === id);
      if (budgetIndex !== -1) {
        state.budgets.splice(budgetIndex, 1);
      }
    },
    updateIncome: (state, action) => {
      const income = action.payload;
      const incIdx = state.incomes.findIndex(inc => inc.id === income.id);
      if (incIdx !== -1) {
        state.incomes[incIdx] = {
          ...income,
          date: format(income.date, 'yyyy-MM-dd'),
        };
      }
    },
    dropMain: () => emptyState(),
    toggleDevMode: state => {
      state.devMode = !state.devMode;
    },
    clearDevMode: state => {
      state.devMode = false;
    },
    removeExpense: (state, action) => {
      state.expenses = state.expenses.filter(
        exp => exp.id.toString() !== action.payload,
      );
    },
    removeIncome: (state, action) => {
      state.incomes = state.incomes.filter(
        inc => inc.id.toString() !== action.payload,
      );
    },
    replaceExpense: (state, action) => {
      const {frontendId, resp} = action.payload;
      const expenseIndex = state.expenses.findIndex(
        exp => exp.id === frontendId,
      );
      if (expenseIndex !== -1) {
        state.expenses[expenseIndex] = {
          ...state.expenses[expenseIndex],
          ...resp,
        }; // TODO: use object.asign
      }
    },
    replaceIncome: (state, action) => {
      const {frontendId, resp} = action.payload;
      const incomeIndex = state.incomes.findIndex(inc => inc.id === frontendId);
      if (incomeIndex !== -1) {
        state.incomes[incomeIndex] = {...state.incomes[incomeIndex], ...resp};
      }
    },
    replaceBudget: (state, action) => {
      const {frontendId, resp} = action.payload;
      printJsonIndent('replaceBudget called with:', {frontendId, resp});

      if (Array.isArray(resp)) {
        // Remove all budgets with matching frontendId prefix
        state.budgets = state.budgets.filter(
          budget => !budget.id.startsWith(frontendId),
        );
        // Add the new budgets from server with proper yearMonth field
        const transformedBudgets = resp.map((budget: any) => ({
          ...budget,
          yearMonth: budget.date
            ? budget.date.substring(0, 7)
            : budget.yearMonth,
        }));
        state.budgets = [...state.budgets, ...transformedBudgets];
        printJsonIndent(
          'Replaced multiple budgets, new budget count:',
          state.budgets.length,
        );
      } else {
        const budgetIndex = state.budgets.findIndex(
          budget => budget.id === frontendId,
        );
        if (budgetIndex !== -1) {
          const transformedBudget = {
            ...resp,
            yearMonth: resp.date ? resp.date.substring(0, 7) : resp.yearMonth,
          };
          state.budgets[budgetIndex] = {
            ...state.budgets[budgetIndex],
            ...transformedBudget,
          };
          console.log('Replaced single budget at index:', budgetIndex);
        }
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase('ini/fetchIni/fulfilled', (state, action) => {
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
      .addCase('ini/fetchIni/rejected', (state, action) => {
        state.snackbar.open = true;
        state.snackbar.type = 'error';
        state.snackbar.msg = action.error.message ?? 'Coś poszło nie tak';
      });
  },
});

export const {
  addBudgets,
  addExpense,
  addIncome,
  clearDevMode,
  deleteBudget,
  dropMain,
  initState,
  removeExpense,
  removeIncome,
  replaceBudget,
  replaceExpense,
  replaceIncome,
  setSnackbar,
  startLoading,
  stopLoading,
  toggleDevMode,
  updateBudget,
  updateExpense,
  updateIncome,
} = mainSlice.actions;

export {emptyState as mainEmptyState};

export default mainSlice.reducer;
