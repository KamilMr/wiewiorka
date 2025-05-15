import {createSelector} from '@reduxjs/toolkit';
import {format, formatDate, isAfter, isBefore, isSameDay} from 'date-fns';
import _ from 'lodash';

import {EXCLUDED_CAT, dh, makeNewIdArr, normalize} from '@/common';
import {RootState} from '../store';
import {Category, Expense, Income, Subcategory} from './mainSlice';
import {BudgetMainSlice, BudgetCardItem} from '@/utils/types';
import {SummaryCardProps} from '@/components/SummaryCard';

export type Search = {
  txt: string;
  categories: Array<string>;
  dates?: [string, string];
};

export const selectSnackbar = (state: RootState) => state.main.snackbar;
const selectExpensesAll = (state: RootState) => state.main.expenses;

const filterCat = (exp: Expense, f: Array<string>) => {
  if (!f.length) return true;
  return f.includes(exp.category);
};

const filterTxt = (exp: any, f: string) => {
  if (!f) return true;
  const string = ['description', 'category', 'source', 'date'].reduce(
    (pv, cv) => {
      if (cv === 'date') return pv + format(new Date(exp.date), 'dd/MM/yyyy');
      return pv + exp[cv] + '';
    },
    '',
  );
  return normalize(string.toLowerCase()).includes(normalize(f.toLowerCase()));
};

export const selectRecords = (number: number, search: Search) =>
  createSelector(
    [selectExpensesAll, selectCategories, selectIncomes],
    (expenses, categories, incomes) => {
      const {txt: searchedTxt, categories: fc, dates} = search;
      const isValidArr =
        Array.isArray(dates) &&
        dates.length === 2 &&
        dates.every((d: string) => typeof d === 'string' && Boolean(d));
      let tR = expenses
        .map((exp: Expense): Expense & {exp: true} => ({...exp, exp: true}))
        .concat(incomes)
        .filter((item: Expense | Income) => {
          if (!isValidArr || !dates) return true;
          const d = new Date(item.date);
          const ds = new Date(dates[0]);
          const de = new Date(dates[1]);

          return dh.isBetweenDates(d, ds, de);
        })
        .map((obj: Expense & {exp: true}) => {
          const catObj = obj?.exp
            ? categories.find(({id}: {catId: number}) => id === obj.categoryId)
            : null;

          return {
            ...obj,
            description: obj.description || '',
            category: catObj?.name ?? '',
            color: catObj?.color ?? '',
          };
        });

      tR = tR.filter((record: Expense & Income) => {
        return filterTxt(record, searchedTxt) && filterCat(record, fc);
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
    const categoryObj = cat.find((obj) => obj.id === expense.categoryId);
    return {
      ...expense,
      category: categoryObj.name,
      catColor: categoryObj.color,
      date: format(new Date(expense.date), 'dd/MM/yyyy'),
    };
  });

export const selectIncome = (id: string | number) =>
  createSelector([selectIncomes], (inc) => {
    const income = inc.find((inc) => inc.id === +id);
    if (!income) return;
    return income;
  });

export const selectCategories = createSelector(
  [(state) => state.main.categories],
  (cat) => {
    const arr = Object.entries(cat);
    return arr.reduce((pv: Array<Subcategory>, [key, cv]: [string, any]) => {
      if (!cv.subcategories) cv.subcategories = [];
      const subcategories: Array<Subcategory> = [...cv.subcategories].map(
        (obj) => ({
          ...obj,
          groupName: cv.name,
          color: `#${obj.color || '#FFFFFF'}`,
        }),
      );
      if (Array.isArray(pv)) pv.push(...subcategories);
      return pv;
    }, []);
  },
);

export const selectCategory = (id: number | null) =>
  createSelector([selectCategories], (categories) => {
    return id ? categories.find((cat) => cat.id === id) : undefined;
  });

export const selectMainCategories = createSelector(
  [(state) => state.main.categories],
  (cat: Record<string, Category>) => {
    const arr = Object.entries(cat);
    return arr.reduce(
      (pv: Array<Array<string>>, [key, cv]: [string, Category]) => {
        const categories: [string, string] = [cv.name, key];
        if (Array.isArray(pv)) pv.push(categories);
        return pv;
      },
      [],
    );
  },
);

export const selectComparison = (number1or12: number | string) =>
  createSelector([selectIncomes, selectExpensesAll], (income, expenses): SummaryCardProps[] => {
    const pattern: string = +number1or12 === 1 ? 'MM/yyyy' : 'yyyy';
    const calPrice = (price: number, vat: number = 0): number =>
      price - price * (vat / 100);

    /** {
      2023: {income, date, outcome}
      11/2023: {income, date, outcome}
     }*/
    const tR: any = {};
    income.forEach((obj) => {
      const {date, price, vat} = obj;
      const fd: string = format(new Date(date), pattern);
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
      tR[fd].costs[owner] += EXCLUDED_CAT.includes(categoryId) ? price : 0;
    });

    const arr = Object.values(tR);
    const ids = makeNewIdArr(arr.length);
    arr.forEach((object, idx) => (object.id = ids[idx]));
    return _.orderBy(arr, ['year', 'month'], ['desc', 'desc']);
  });

export const selectSources = (state: RootState) => {
  return state.main.sources[state.auth.name];
};

export const selectByTimeRange = (dates: [Date, Date]) => {
  return createSelector([(state) => state.main._aggregated], (data) => {
    if (dates?.length === 2)
      return _.pickBy(data, (_, date) =>
        dh.isBetweenDates(new Date(date), dates[0], dates[1]),
      );
    else return data;
  });
};

export const selectStatus = (state: RootState) => state.main.status;

export const selectBudgets = (
  yearMonth = formatDate(new Date(), 'yyyy-MM-dd'),
) =>
  createSelector(
    [
      (state) => state.main.budgets,
      selectCategories,
      selectExpensesAll,
      selectMainCategories,
    ],
    (budgets: BudgetMainSlice[], categories, expenses, mainCat) => {
      const [year, month] = yearMonth.split('-');
      // console.log('categories', categories[0]);
      const filteredExpense = expenses.filter((exp: Expense) => {
        const [expYear, expMonth] = exp.date.split('-');

        return year === expYear && month === expMonth;
      });

      const tR: BudgetCardItem[] = budgets.length ? budgets : []
        .filter((b) => {
          const {yearMonth} = b;
          const [budgetYear, budgetMonth] = yearMonth.split('-');
          if (year !== budgetYear || month !== budgetMonth) return;

          return true;
        })
        .map((budget) => {
          const {categoryId, amount, groupId, yearMonth} = budget;
          const isGroup = groupId !== null;
          const item: BudgetCardItem = {
            id: budget.id,
            budgetedName: isGroup
              ? categories.find((cat: Subcategory) => +cat.groupId === +groupId)
                  ?.groupName || ''
              : //@ts-ignore
                categories.find((cat: Subcategory) => +cat.id === +categoryId)
                  ?.name || '',
            allocated: +amount,
            amount: filteredExpense.reduce(
              (prevExp: number, currExp: Expense) => {
                if (isGroup) {
                  const cat = categories.find(
                    (cat: Subcategory) => cat.id === currExp.categoryId,
                  );
                  if (cat.groupId === groupId) prevExp += currExp.price;
                } else if (currExp.categoryId === categoryId)
                  prevExp += currExp.price;

                return prevExp;
              },
              0,
            ),
          };

          return item;
        });

      return tR;
    },
  );
