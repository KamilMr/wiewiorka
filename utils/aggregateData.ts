import _ from 'lodash';
import {AggregatedData} from './types';
import {convertDate} from '@/common';

const groupBy = (
  data: AggregatedData,
  byTime: 'month' | 'year',
  byCat: '1-1' | '1-0',
) => {
  const tR: AggregatedData = {};
  _.entries(data).forEach(([dateKey, obj]) => {
    dateKey = !byTime
      ? dateKey
      : byTime === 'month'
        ? convertDate(dateKey, 'yyyy-MM-dd', 'yyyy-MM')
        : convertDate(dateKey, 'yyyy-MM-dd', 'yyyy');
    const isCat = +byCat.split('-')[1] > 0;
    if (isCat) {
      console.log('this should notwork now');
      tR[dateKey] ??= {...obj};
      _.entries(obj).forEach(([innerId, valueArr]) => {
        tR[dateKey][innerId] ??= [0];
        tR[dateKey][innerId][0] += valueArr[0];
      });
    } else {
      tR[dateKey] ??= {};
      _.entries(obj).forEach(([innerId, valueArr]) => {
        const [grId] = innerId.split('-');

        tR[dateKey][`${grId}-0`] ??= [0];
        tR[dateKey][`${grId}-0`][0] += valueArr[0];
      });
    }
  });

  return tR;
};

const aggregateData = (expenses: [], categories: {}) => {
  const searchGroup = (catId: number) => {
    return _.entries(categories).find(([, obj]: [string, any]) => {
      return (
        obj.categories.findIndex(
          (catObj: {catId: number}) => catObj.catId === catId,
        ) > -1
      );
    })?.[0];
  };
  const d = _.groupBy(expenses, 'date');

  const tR: AggregatedData = _.fromPairs(
    _.entries(d).map(([dateId, arr]) => {
      const groupedByCat = _.groupBy(arr, 'categoryId');
      const summed = _.entries(groupedByCat).map(([catId, arr]) => {
        return [`${searchGroup(+catId)}-${catId}`, [_.sumBy(arr, 'price')]];
      });
      return [dateId, _.fromPairs(summed)];
    }),
  );

  // console.log(tR);
  // console.log(groupBy(tR, 'month', '1-0'));
  return tR;
};

export default aggregateData;
export {groupBy};
