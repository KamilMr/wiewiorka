import {useState} from 'react';
import {useLocalSearchParams} from 'expo-router';
import {ScrollView, View} from 'react-native';
import {Button, IconButton, Text} from 'react-native-paper';

import {barDataItem, pieDataItem} from 'react-native-gifted-charts';
import {lastDayOfMonth} from 'date-fns';
import _, {parseInt} from 'lodash';

import {
  aggregateExpenses,
  selectByTimeRange,
  selectCategories,
} from '@/redux/main/selectors';
import {useAppSelector} from '@/hooks';
import {BarChart, Chip, DatePicker, PieChartBar} from '@/components';
import {EXCLUDED_CAT, formatPrice, shortenText} from '@/common';
import {Axis, groupBy, sumById} from '@/utils/aggregateData';

type AggrExpense = {
  v: number;
  color: string;
  name: string;
  id: string;
};

const buildBarChart = (arr) => {
  return arr.map((obj) => {
    const tR: barDataItem = {
      value: obj.v,
      frontColor: obj.color,
      label: obj.name,
      spacing: 10,
      barWidth: 50,
      topLabelComponent: () => (
        <Text style={{fontSize: 8}}>
          {formatPrice(parseInt(obj.v.toString()))}
        </Text>
      ),
    };

    return tR;
  });
};

const Summary = () => {
  const {date}: {date: string} = useLocalSearchParams();
  const stateCategories = useAppSelector(selectCategories);
  const isNotYear: boolean = date.split('-').length > 2;
  const [filterDates, setFilterDates] = useState<[Date, Date]>([
    new Date(date),
    lastDayOfMonth(isNotYear ? new Date(date) : new Date()),
  ]);
  const [axis, setAxis] = useState<Axis>('1-0');
  const [chartDisplay, setChartDisplay] = useState<string>('pie');

  const selected = useAppSelector(selectByTimeRange(filterDates));
  const grouped = groupBy(selected, 'month', axis);

  // get used categories
  const idsOfCategories: string[] = _.values(grouped)
    .map((o) => _.keys(o))
    .flat();
  const idsGroupOrCategory: string[] = idsOfCategories.map(
    (str: string) => str.split('-')[+axis.split('-')[1]],
  );
  const currentGroupOrCategory: {
    name: string;
    id: number;
    type: 'category' | 'group';
    color: string;
  }[] = idsGroupOrCategory.map((n: string) => {
    const holer = axis === '1-1' ? 'catId' : 'groupId';
    const cat = stateCategories.find((o) => +o[holer] === +n);
    return {
      name: cat?.[holer === 'catId' ? 'category' : 'groupName'] || 'not found',
      id: +n,
      type: holer === 'catId' ? 'category' : 'group',
      color: cat ? cat?.color || '' : '',
    };
  });

  const handlePieChange = (str: string) => () => setChartDisplay(str);

  const [filters, setFilters] = useState(
    currentGroupOrCategory.filter((c: {id: number}) => !EXCLUDED_CAT.includes(c.id)),
  );

  const setCat = new Set(filters.map((o: {name: string}) => o.name));

  const handleRemoveFilters = () => setFilters([]);
  const handleResetFilters = () => setFilters(currentGroupOrCategory);

  const buildPieChart = (obj, setFilter) => {
    const values = _.entries(sumById(obj));
    // console.log(values)
    const max = _.sum(values.map((arr: [number, number]) => arr[1]).flat(2));
    const perc = (n: number) => ((n * 100) / max).toFixed(2);
    //
    // console.log(stateCategories);
    return values
      .map(([itemId, valueArr]) => {
        const [grId, catId] = itemId.split('-');
        const isCat = +catId > 0;
        // console.log(grId, valueArr);

        const foundCategory = stateCategories.find((o) =>
          isCat ? o.catId === +catId : o.groupId === +grId,
        );
        // console.log(name,isCat,grId)
        const value = valueArr[0];
        const percentage: string = perc(value);
        const tR: {label: string} & pieDataItem = {
          value,
          label: isCat
            ? foundCategory.category
            : foundCategory?.groupName || '',
          text: +percentage < 4 ? '' : `${percentage}%`,
          // color: name.color,
        };
        return tR;
      })
      .sort((a, b) => b.value - a.value);
  };

  const data =
    chartDisplay === 'pie'
      ? buildPieChart(grouped, setCat)
      : buildBarChart(selected, setCat);

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
      <View style={{flexDirection: 'row', alignSelf: 'flex-end'}}>
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
      {chartDisplay === 'pie' ? (
        <PieChartBar
          data={data}
          labelsPosition="onBorder"
          innerRadius={70}
          onPress={(item) => {
            if (axis === '1-0') setAxis('1-1');
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
        <BarChart barData={data} />
      )}

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
                  color: filters.find((f) => f.name === c.name)?.color || '#a6a6a6',
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
