import _ from 'lodash';

import {AggregatedData} from './types';
import {convertDate} from '@/common';

type Axis = '1-1' | '1-0';
type PickFilter = `${string}-${string}`;

interface Expense {
  date: string;
  categoryId: number;
  price: number;
}

interface Category {
  categories: Array<{catId: number}>;
}

const decId = (str: string) => str.split('-');
const encId = (arr: [number, number]) => arr.join('-');

const groupBy = (
  data: AggregatedData,
  byTime: 'month' | 'year',
  axis: Axis,
  pickFilter: PickFilter = '0-0',
) => {
  const tR: AggregatedData = {};
  const [grCat, grSub] = decId(pickFilter);
  _.entries(data).forEach(([dateKey, obj]) => {
    dateKey = !byTime
      ? dateKey
      : byTime === 'month'
        ? convertDate(dateKey, 'yyyy-MM-dd', 'yyyy-MM')
        : convertDate(dateKey, 'yyyy-MM-dd', 'yyyy');
    const isCat = +axis.split('-')[1] > 0;
    tR[dateKey] ??= {};
    _.entries(obj).forEach(([innerId, valueArr]) => {
      const [grId, catId] = decId(innerId);
      if (isCat) {
        if (!!+grCat && +grCat !== +grId) return;
        if (!!+grSub && +grSub !== +catId) return;
        tR[dateKey][innerId] ??= [0];
        tR[dateKey][innerId][0] += valueArr[0];
      } else {
        if (!!+grCat && +grCat !== +grId) return;

        tR[dateKey][`${grId}-0`] ??= [0];
        tR[dateKey][`${grId}-0`][0] += valueArr[0];
      }
    });
  });

  return tR;
};

const searchGroup = (
  catId: number,
  categories: Record<string, Category>,
): string | undefined => {
  return _.entries(categories).find(([, obj]: [string, any]) => {
    return (
      obj.categories.findIndex(
        (catObj: {catId: number}) => catObj.catId === catId,
      ) > -1
    );
  })?.[0];
};

const aggregateData = (
  expenses: Expense[],
  categories: Record<string, Category>,
) => {
  const d = _.groupBy(expenses, 'date');

  const tR: AggregatedData = _.fromPairs(
    _.entries(d).map(([dateId, arr]) => {
      const groupedByCat = _.groupBy(arr, 'categoryId');
      const summed = _.entries(groupedByCat).map(([catId, arr]) => {
        return [
          `${searchGroup(Number(catId), categories)}-${catId}`,
          [_.sumBy(arr, 'price')],
        ];
      });
      return [dateId, _.fromPairs(summed)];
    }),
  );

  return tR;
};

const sumById = (data: AggregatedData) => {
  const tR: {[key: string]: [number]} = {};
  const values = _.values(data); // [{12:13: [2], 12-14: [2]}]
  values.forEach((obj) => {
    const catAndValue = _.entries(obj); // [[12-11, [10]]]
    catAndValue.forEach(([id, valueArr]: [string, [number]]) => {
      tR[id] ??= [0];
      tR[id][0] += valueArr[0];
    });
  });

  return tR;
};

export default aggregateData;
export {groupBy, sumById, Axis, decId, encId, PickFilter};
