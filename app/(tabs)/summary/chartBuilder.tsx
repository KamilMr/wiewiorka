import {barDataItem, pieDataItem} from 'react-native-gifted-charts';

import {Text} from '@/components';

import {Subcategory} from '@/redux/main/mainSlice';
import {decId, sumById} from '@/utils/aggregateData';
import _ from 'lodash';
import { formatPrice } from '@/common';
type GroupedValue = number[];
interface GroupedType {
  [key: string]: {[key: string]: GroupedValue};
}

export const buildBarChart = (
  obj,
  f: Set<string>,
  categories: Subcategory[],
) => {
  const values = _.entries(sumById(obj));
  return values
    .map(([itemId, valueArr]) => {
      const [grId, catId] = decId(itemId);
      const isCat = +catId > 0;

      const foundCategory = categories.find((o) =>
        isCat ? o.id === +catId : o.groupId === +grId,
      );
      if (
        f.size &&
        !f.has(isCat ? foundCategory.name : foundCategory?.groupName)
      )
        return undefined;

      const value = valueArr[0];

      const tR: {id: string} & barDataItem = {
        value: value,
        id: itemId,
        frontColor: foundCategory.color,
        label: isCat ? foundCategory.name : foundCategory?.groupName || '',
        spacing: 10,
        barWidth: 50,
        topLabelComponent: () => (
          <Text style={{fontSize: 8}}>
            {formatPrice(_.parseInt(value.toString()))}
          </Text>
        ),
      };

      return tR;
    })
    .filter(Boolean)
    .sort((a, b) => b.value - a.value);
};

export const buildPieChart = (
  obj: GroupedType,
  f: Set<string>,
  categories: Subcategory[],
) => {
  const values = _.entries(sumById(obj));
  const max = _.sum(values.map((arr) => arr[1]).flat(2));
  const perc = (n: number) => ((n * 100) / max).toFixed(2);

  const tR = values
    .map(([itemId, valueArr]) => {
      const [grId, catId] = decId(itemId);
      const isCat = +catId > 0;

      const foundCategory = categories.find((categoryObj: Subcategory) =>
        isCat ? categoryObj.id === +catId : categoryObj.groupId === +grId,
      );
      if (
        f.size &&
        !f.has(isCat ? foundCategory?.name : foundCategory?.groupName)
      )
        return undefined;
      const value = valueArr[0];
      const percentage: string = perc(value);
      const tR: {label: string; id: string} & pieDataItem = {
        id: itemId,
        value,
        label: isCat ? foundCategory.name : foundCategory?.groupName || '',
        text: +percentage < 4 ? '' : `${percentage}%`,
        color: foundCategory.color,
      };
      return tR;
    })
    .filter(Boolean)
    .sort((a, b) => b.value - a.value);
  return tR;
};
