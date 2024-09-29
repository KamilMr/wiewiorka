import {createSelector} from '@reduxjs/toolkit';
import {format} from 'date-fns';
import _ from 'lodash';

import {makeNewIdArr} from '@/common';
import {RootState} from '../store';

type Expense = {
  category: string;
  categoryId: number;
  color: string;
  date: string;
  description: string;
  exp: boolean;
  id: number;
  image: string;
  owner: string;
  price: number;
  receipt: string;
};

type Search = {
  txt: string;
  categories: Array<string>;
};

type Record = {
  category: string;
  categoryId: number;
  color: string;
  date: string;
  description: string;
  exp: boolean;
  id: number;
  image: string;
  owner: string;
  price: number;
  receipt: string;
  vat: number;
  source: string;
};

export const selectSnackbar = (state: RootState) => state.main.snackbar;
const selectExpensesAll = (state: RootState) => state.main.expenses;

const filterCat = (exp: Expense, f: Array<string>) => {
  if (!f.length) return true;
  return f.includes(exp.category);
};

const filterTxt = (exp: Expense, f: string) => {
  if (!f) return true;
  const string = exp.description + exp.category;
  return string.toLowerCase().includes(f.toLowerCase());
};

export const selectRecords = (number: number, search: Search) =>
  createSelector(
    [selectExpensesAll, selectCategories, selectIncomes],
    (expenses, categories, incomes) => {
      const {txt, categories: fc} = search;
      console.log(categories[0]);
      let tR = expenses
        .map((exp: Expense) => ({...exp, exp: true}))
        .concat(incomes)
        .map((obj: Record) => ({
          ...obj,
          description: obj.description || '',
          category: obj?.exp
            ? categories.find(({catId}) => catId === obj.categoryId).category
            : null,
          color: obj?.exp
            ? categories.find(({catId}) => catId === obj.categoryId)?.color
            : null,
        }));

      tR = tR.filter((exp: Expense) => {
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

export const selectIncomes = (state: RootState) => state.main.incomes;
export const selectExpense = (id: number) =>
  createSelector([selectCategories, selectExpensesAll], (cat, exp) => {
    const expense = exp.find((ex) => ex.id === +id);
    if (!expense) return;
    const categoryObj = cat.find((obj) => obj.catId === expense.categoryId);
    return {
      ...expense,
      category: categoryObj.category,
      catColor: categoryObj.color,
      date: format(new Date(expense.date), 'dd/MM/yyyy'),
    };
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
