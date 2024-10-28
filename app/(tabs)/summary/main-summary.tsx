import {useState} from 'react';
import {useLocalSearchParams} from 'expo-router';
import {ScrollView, View} from 'react-native';
import {Button, IconButton, Text} from 'react-native-paper';

import {BarChart, Chip, DatePicker, PieChartBar} from '@/components';
import {lastDayOfMonth} from 'date-fns';
import {useAppSelector} from '@/hooks';
import {aggregateExpenses, selectByTimeRange} from '@/redux/main/selectors';
import {EXCLUDED_CAT, formatPrice, shortenText} from '@/common';
import _, {parseInt} from 'lodash';
import {barDataItem, pieDataItem} from 'react-native-gifted-charts';

type AggrExpense = {
  v: number;
  color: string;
  name: string;
  id: string;
};

const Summary = () => {
  const {date}: {date: string} = useLocalSearchParams();
  const isNotYear: boolean = date.split('-').length > 2;
  const [filterDates, setFilterDates] = useState<[Date, Date]>([
    new Date(date),
    lastDayOfMonth(isNotYear ? new Date(date) : new Date()),
  ]);

  const selected = useAppSelector(selectByTimeRange(filterDates));

  const [chartDisplay, setChartDisplay] = useState<string>('pie');

  const handlePieChange = (str: string) => () => setChartDisplay(str);

  const aggrExpenses = useAppSelector(aggregateExpenses(filterDates)) || [];

  const categories = aggrExpenses.map((o: any) => ({
    name: o.name,
    id: o.id,
    color: o.color,
  }));
  const [filters, setFilters] = useState(
    categories.filter((c) => !EXCLUDED_CAT.includes(c.id)),
  );

  const setCat = new Set(filters.map((o) => o.name));

  const handleRemoveFilters = () => setFilters([]);
  const handleResetFilters = () => setFilters(categories);

  const buildBarChart = (arr) => {
    return arr.map((obj) => {
      const tR: barDataItem = {
        value: obj.v,
        frontColor: obj.color,
        label: obj.name,
        spacing: 10,
        barWidth: 50,
        topLabelComponent: () => (
          <>
            <Text style={{fontSize: 8}}>
              {formatPrice(parseInt(obj.v.toString()))}
            </Text>
          </>
        ),
      };

      return tR;
    });
  };

  const buildPieChart = (arr) => {
    const max = parseInt(_.sumBy(arr, 'v'));
    const perc = (n) => ((n * 100) / max).toFixed(2);

    return _.orderBy(arr, ['v'], ['desc']).map((obj, idx) => {
      const percentage: string = perc(obj.v);
      const tR: {label: string} & pieDataItem = {
        value: obj.v,
        text: +percentage < 4 ? '' : `${percentage}%`,
        color: obj.color,
        label: obj.name,
      };

      return tR;
    });
  };

  const filteredData = aggrExpenses.filter((obj) =>
    setCat.size > 0 ? setCat.has(obj.name) : true,
  );

  const data =
    chartDisplay === 'pie'
      ? buildPieChart(filteredData)
      : buildBarChart(filteredData);

  const handleFilters = (catId: number) => () => {
    const categoryToAdd = categories.find((f) => f.id === catId);
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
        {categories.map((c) => {
          const isSelected = !!filters.find((f) => f.id === c.id);
          return (
            <Chip
              key={c.id}
              selectedColor={
                filters.find((f) => f.id === c.id)?.color || '#a6a6a6'
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
                  color: filters.find((f) => f.id === c.id)?.color || '#a6a6a6',
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
