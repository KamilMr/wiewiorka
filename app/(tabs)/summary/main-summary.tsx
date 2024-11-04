import {useEffect, useState} from 'react';
import {router, useLocalSearchParams} from 'expo-router';
import {ScrollView, View} from 'react-native';
import {Button, IconButton, Text} from 'react-native-paper';

import {barDataItem, pieDataItem} from 'react-native-gifted-charts';
import {format, lastDayOfMonth} from 'date-fns';
import _ from 'lodash';

import {
  aggregateExpenses,
  selectByTimeRange,
  selectCategories,
} from '@/redux/main/selectors';
import {useAppSelector} from '@/hooks';
import {BarChart, Chip, DatePicker, PieChartBar} from '@/components';
import {EXCLUDED_CAT, formatPrice, shortenText} from '@/common';
import {Axis, PickFilter, decId, groupBy, sumById} from '@/utils/aggregateData';
import {Category} from '@/redux/main/mainSlice';

type AggrExpense = {
  v: number;
  color: string;
  name: string;
  id: string;
};

const GroupCategory = ({
  axis,
  onPress,
}: {
  axis: [Axis, string];
  onPress: (axis: Axis) => void;
}) => {
  const isCat = axis[0] === '1-1';
  const handleOnPress = (axis: Axis) => () => {
    onPress?.(axis);
  };
  return (
    <View>
      <Button
        style={{height: 40, width: 140}}
        mode={'text'}
        labelStyle={{
          color: !isCat ? 'blue' : undefined,
          fontSize: 12,
        }}
        onPress={handleOnPress('1-0')}>
        Kategorie
      </Button>
      <Button
        style={{height: 40, width: 140}}
        mode={'text'}
        labelStyle={{
          color: isCat ? 'blue' : undefined,
          fontSize: 12,
        }}
        onPress={handleOnPress('1-1')}>
        Podkategorie
      </Button>
    </View>
  );
};

const Summary = () => {
  const {date}: {date: string} = useLocalSearchParams();
  const [filterDates, setFilterDates] = useState<[Date, Date]>([
    new Date(date),
    lastDayOfMonth(date.split('-').length > 2 ? new Date(date) : new Date()),
  ]);
  const [axis, setAxis] = useState<[Axis, PickFilter]>(['1-0', '0-0']);
  const [chartDisplay, setChartDisplay] = useState<string>('pie');

  // selectors
  const stateCategories = useAppSelector(selectCategories);
  const selected = useAppSelector(selectByTimeRange(filterDates));

  // grouping
  const grouped = groupBy(selected, 'month', ...axis);

  useEffect(() => {
    setFilters(
      currentGroupOrCategory.filter(
        (c: {id: number}) => !EXCLUDED_CAT.includes(c.id),
      ),
    );
  }, [axis]);

  // get used categories
  const idsOfCategories: string[] = [
    ...new Set(
      _.values(grouped)
        .map((o) => _.entries(o))
        .flat()
        .sort(([, va], [, vb]) => vb[0] - va[0])
        .map(([id, val]) => id),
    ),
  ];
  const idsGroupOrCategory: string[] = idsOfCategories.map(
    (str: string) => str.split('-')[+axis[0].split('-')[1]],
  );
  // console.log(
  //   new Set(
  //     _.values(grouped)
  //       .map((o) => _.entries(o))
  //       .flat()
  //       .sort(([, va], [, vb]) => vb[0] - va[0])
  //       .map(([id, val]) => id),
  //   ),
  // );

  const getCategoryName = (n: number, id: string) => {
    if (!id) id = axis[0] === '1-1' ? 'catId' : 'groupId';
    const cat = stateCategories.find((o) => +o[id] === n);

    return cat;
  };

  const currentGroupOrCategory: {
    name: string;
    id: number;
    type: 'category' | 'group';
    color: string;
  }[] = idsGroupOrCategory.map((n: string) => {
    const holder = axis[0] === '1-1' ? 'catId' : 'groupId';
    const cat = getCategoryName(+n, holder);
    return {
      name: cat?.[holder === 'catId' ? 'category' : 'groupName'] || 'not found',
      id: +n,
      type: holder === 'catId' ? 'category' : 'group',
      color: cat ? cat?.color || '' : '',
    };
  });

  const handlePieChange = (str: string) => () => setChartDisplay(str);

  const [filters, setFilters] = useState(
    currentGroupOrCategory.filter(
      (c: {id: number}) => !EXCLUDED_CAT.includes(c.id),
    ),
  );

  // console.log(filters.map((name) => name))
  const setCat = new Set(filters.map((o: {name: string}) => o.name));

  const handleRemoveFilters = () => setFilters([]);
  const handleResetFilters = () => setFilters(currentGroupOrCategory);

  const buildBarChart = (obj, f: Set<string>) => {
    const values = _.entries(sumById(obj));
    return values
      .map(([itemId, valueArr]) => {
        const [grId, catId] = decId(itemId);
        const isCat = +catId > 0;

        const foundCategory = stateCategories.find((o) =>
          isCat ? o.catId === +catId : o.groupId === +grId,
        );
        if (
          f.size &&
          !f.has(isCat ? foundCategory.category : foundCategory?.groupName)
        )
          return undefined;

        const value = valueArr[0];

        const tR: {id: string} & barDataItem = {
          value: value,
          id: itemId,
          frontColor: foundCategory.color,
          label: isCat
            ? foundCategory.category
            : foundCategory?.groupName || '',
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
  const buildPieChart = (obj, f: Set<string>) => {
    const values = _.entries(sumById(obj));
    const max = _.sum(values.map((arr: [number, number]) => arr[1]).flat(2));
    const perc = (n: number) => ((n * 100) / max).toFixed(2);

    // console.log(stateCategories);
    return values
      .map(([itemId, valueArr]) => {
        const [grId, catId] = decId(itemId);
        const isCat = +catId > 0;
        // console.log(grId, valueArr);

        const foundCategory = stateCategories.find((o) =>
          isCat ? o.catId === +catId : o.groupId === +grId,
        );
        if (
          f.size &&
          !f.has(isCat ? foundCategory.category : foundCategory?.groupName)
        )
          return undefined;
        // console.log(name,isCat,grId)
        const value = valueArr[0];
        const percentage: string = perc(value);
        const tR: {label: string; id: string} & pieDataItem = {
          id: itemId,
          value,
          label: isCat
            ? foundCategory.category
            : foundCategory?.groupName || '',
          text: +percentage < 4 ? '' : `${percentage}%`,
          color: foundCategory.color,
        };
        return tR;
      })
      .filter(Boolean)
      .sort((a, b) => b.value - a.value);
  };

  const data =
    chartDisplay === 'pie'
      ? buildPieChart(grouped, setCat)
      : buildBarChart(grouped, setCat);

  const handleFilters = (catId: number) => () => {
    const categoryToAdd = currentGroupOrCategory.find((f) => f.id === catId);
    if (!categoryToAdd) {
      return;
    }
    const isThere = filters.findIndex((f) => f.id === catId);
    const newState =
      isThere > -1
        ? filters.filter((f) => f.id !== catId)
        : [...filters, categoryToAdd];
    setFilters(newState);
  };

  const handleAxisChange = (ax: Axis) => {
    setAxis([ax, ax === '1-0' ? '0-0' : axis[1]]);
  };

  return (
    <ScrollView>
      <DatePicker
        value={filterDates[0]}
        label="Start"
        style={{marginBottom: 8}}
        onChange={(date = filterDates[0]) =>
          setFilterDates([date, filterDates[1]])
        }
      />
      <DatePicker
        value={filterDates[1]}
        label="Koniec"
        style={{marginBottom: 44}}
        onChange={(date = filterDates[1]) =>
          setFilterDates([filterDates[0], date])
        }
      />
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <GroupCategory axis={axis} onPress={handleAxisChange} />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <IconButton
            icon="chart-donut"
            onPress={handlePieChange('pie')}
            iconColor={chartDisplay === 'pie' ? 'blue' : undefined}
          />
          <IconButton
            icon="chart-bar"
            onPress={handlePieChange('bar')}
            iconColor={chartDisplay === 'bar' ? 'blue' : undefined}
          />
        </View>
      </View>
      {chartDisplay === 'pie' ? (
        <PieChartBar
          data={data}
          labelsPosition="onBorder"
          innerRadius={70}
          onPress={(item: {label: string; id: string}) => {
            if (axis[0] === '1-1') {
              const dates = filterDates.map((d) => format(d, 'yyyy-MM-dd'));
              let category: string | undefined;
              const cat: Category | undefined = getCategoryName(
                +decId(item.id)[1],
                'catId',
              );
              if (cat) category = cat.category;

              router.navigate({
                pathname: '/summary/list',
                params: {
                  dates,
                  category: category || '',
                },
              });
              return;
            }
            setAxis(['1-1', `${decId(item.id)[0]}-0`]);
            //else do navigation
          }}
          showText
          centerLabelComponent={() => {
            return (
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Text
                  style={{fontSize: 12, color: 'black', fontWeight: 'bold'}}>
                  {formatPrice(_.sumBy(data, 'value'))}
                </Text>
                {data.slice(0, 4).map(({label, value}) => (
                  <Text
                    key={label}
                    style={{
                      fontSize: 10,
                      color: 'black',
                    }}>{`${shortenText(label)}(${formatPrice(value)})`}</Text>
                ))}
                <Text style={{fontSize: 10, color: 'black'}}>...więcej</Text>
              </View>
            );
          }}
        />
      ) : (
        <BarChart
          barData={data}
          onPress={(item: {label: string; id: string}) => {
            if (axis[0] === '1-1') {
              const dates = filterDates.map((d) => format(d, 'yyyy-MM-dd'));
              let category: string | undefined;
              const cat: Category | undefined = getCategoryName(
                +decId(item.id)[1],
                'catId',
              );
              if (cat) category = cat.category;

              router.navigate({
                pathname: '/summary/list',
                params: {
                  dates,
                  category: category || '',
                },
              });
              return;
            }
            setAxis(['1-1', `${decId(item.id)[0]}-0`]);
          }}
        />
      )}
      <View style={{alignItems: 'center'}}>
        {axis[0] === '1-1' ? (
          <IconButton
            mode="contained"
            onPress={() => handleAxisChange('1-0')}
            icon={'arrow-left-top'}
          />
        ) : null}
      </View>

      <View
        style={{
          marginTop: 48,
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}>
        {currentGroupOrCategory.map((c) => {
          const isSelected = !!filters.find((f) => f.name === c.name);
          return (
            <Chip
              key={c.id}
              selectedColor={
                filters.find((f) => f.name === c.name)?.color || '#a6a6a6'
              }
              // rippleColor={c.color}
              mode="outlined"
              showSelectedCheck={false}
              icon={undefined}
              style={{margin: 2, maxWidth: '50%'}}
              selected={isSelected}
              onPress={handleFilters(c.id)}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: isSelected ? 600 : 400,
                  color:
                    filters.find((f) => f.name === c.name)?.color || '#a6a6a6',
                  textDecorationLine: isSelected ? undefined : 'line-through',
                }}>
                {c.name}
              </Text>
            </Chip>
          );
        })}
      </View>
      <Button
        onPress={filters.length > 0 ? handleRemoveFilters : handleResetFilters}>
        {filters.length > 0 ? 'Usuń filtry' : 'Zaznacz wszystkie'}
      </Button>
      <View style={{height: 80}} />
    </ScrollView>
  );
};

export default Summary;
