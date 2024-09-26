import {createSlice, createAsyncThunk, createSelector} from '@reduxjs/toolkit';

import {getURL, makeNewIdArr} from '@/common';
import _ from 'lodash';

import {fetchIni} from './thunks';
import {format} from 'date-fns';

const emptyState = () => ({
  expenses: [],
  incomes: [],
  categories: {},
  snackbar: {
    open: false,
    type: 'success',
    msg: '',
  },
});

export const handleCategory = createAsyncThunk(
  'handleCategory',
  async (payload = {}, thunkAPI) => {
    const {token} = thunkAPI.getState().me;

    if (!Object.keys(payload).length) return;

    const {method, id, ...rest} = payload;
    let q = 'category' + (method === 'PUT' ? `/${id}` : '');
    let data;
    try {
      let resp = await fetch(getURL(q), {
        method,
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(rest),
      });
      data = await resp.json();
      if (data.err) throw data.err;
      thunkAPI.dispatch(fetchIni());
    } catch (err) {
      throw err;
    }
    return data.d;
  },
);

const mainSlice = createSlice({
  name: 'main',
  initialState: emptyState(),
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
      return emptyState();
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

export const selectSnackbar = (state) => state.main.snackbar;
const selectExpensesAll = (state) => state.main.expenses;

export const selectRecords = (number, search) =>
  createSelector(
    [selectExpensesAll, selectCategories, selectIncomes],
    (expenses, categories, incomes) => {
      const filterTxt = (exp, f) => {
        if (!f) return true;
        return exp.description.toLowerCase().includes(f.toLowerCase());
      };

      const filterCat = (exp, f) => {
        if (!f.length) return true;
        return f.includes(exp.category);
      };
      const {txt, categories: fc} = search;
      console.log(categories)
      let tR = expenses
        .map((exp) => ({...exp, exp: true}))
        .concat(incomes)
        .map((obj) => ({
          ...obj,
          category: obj?.exp
            ? categories.find(({catId}) => catId === obj.categoryId).category
            : null,
          color: obj?.exp
            ? categories.find(({catId}) => catId === obj.categoryId)?.color
            : null,
        }));

      tR= tR.filter((exp) => {
        return filterTxt(exp, txt) && filterCat(exp, fc);
      });
      return _.chain(tR)
        .sortBy(['date'])
        .reverse()
        .slice(0, number)
        .map((obj) => ({
          ...obj,
          date: format(new Date(obj.date), 'dd/MM/yyyy'),
        }))
        .groupBy('date') // Group by the formatted date
        .value();
    },
  );

export const selectIncomes = (state) => state.main.incomes;
export const selectExpense = (id) =>
  createSelector([selectCategories, selectExpensesAll], (cat, exp) => {
    const expense = exp.find((ex) => ex.id === +id);
    if (!expense) return;
    const category = cat.find((obj) => obj.catId === +id)?.category || '';
    return {...expense, category};
  });

export const selectIncome = (id) =>
  createSelector([selectIncomes], (inc) => {
    const income = inc.find((inc) => inc.id === +id);
    if (!income) return;
    return income;
  });

export const selectCategories = createSelector(
  [(state) => state.main.categories],
  (cat) => {
    const arr = Object.entries(cat);
    return arr.reduce((pv, [key, cv]) => {
      const categories = [...cv.categories].map((obj) => ({
        ...obj,
        groupId: key,
      }));
      if (Array.isArray(pv)) pv.push(...categories);
      return pv;
    }, []);
  },
);

export const selectMainCategories = createSelector(
  [(state) => state.categories],
  (cat) => {
    const arr = Object.entries(cat);
    return arr.reduce((pv, [key, cv]) => {
      const categories = [cv.groupName, key];
      if (Array.isArray(pv)) pv.push(categories);
      return pv;
    }, []);
  },
);

export const selectComparison = (num) =>
  createSelector([selectIncomes, selectExpensesAll], (income, expenses) => {
    const pattern = +num === 1 ? 'MM/yyyy' : 'yyyy';
    const calPrice = (price, vat = 0) => price - price * (vat / 100);

    /** {
      2023: {income, date, outcome}
      11/2023: {income, date, outcome}
     }*/
    const tR = {};
    income.forEach((obj) => {
      const {date, price, vat} = obj;
      const fd = format(new Date(date), pattern);
      if (!tR[fd]) tR[fd] = {income: 0, date: fd, outcome: 0, costs: {}};

      tR[fd].income += calPrice(price, vat);
      tR[fd].month = +fd.split('/')[0];
      tR[fd].year = +fd.split('/')[1];
    });

    // console.log(expenses);
    expenses.forEach(({date, price, owner, categoryId}) => {
      const fd = format(new Date(date), pattern);
      if (!tR[fd]) tR[fd] = {income: 0, date: fd, outcome: 0, costs: {}};
      tR[fd].outcome += price;
      tR[fd].costs[owner] ??= 0;
      tR[fd].costs[owner] += [72, 83].includes(categoryId) ? price : 0;
    });

    const arr = Object.values(tR);
    const ids = makeNewIdArr(arr.length);
    arr.forEach((ob, idx) => (ob.id = ids[idx]));
    // console.log(_.orderBy(arr, ['year', 'month'], ['desc', 'desc']))
    return _.orderBy(arr, ['year', 'month'], ['desc', 'desc']);
  });

/** @param {string} date=MM/yyyy*/
export const aggregateExpenses = (agrDates = [new Date(), new Date()]) =>
  createSelector(
    [selectCategories, selectExpensesAll],
    (categories, expenses) => {
      const [startDate, endDate] = agrDates;

      const tR = {};
      expenses.forEach(({date, price, categoryId}) => {
        if (!dh.isBetweenDates(date, startDate, endDate)) return;
        const cat = categories.find((c) => c.catId === categoryId);
        tR[categoryId] ??= {
          v: 0,
          name: cat.category,
          color: '#' + cat.color,
        };

        tR[categoryId].v += price;
      });

      return _.orderBy(
        _.omitBy(tR, (c) => c.v === 0),
        ['v'],
        ['desc'],
      );
    },
  );

export default mainSlice.reducer;
