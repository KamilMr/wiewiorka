import * as React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {router} from 'expo-router';

import _ from 'lodash';
import {Avatar, Card, IconButton, Text} from 'react-native-paper';

import {formatPrice} from '@/common';

type Costs = {
  [key: string]: number;
};

export interface SummaryCardProps {
  id: string;
  income: number;
  outcome: number;
  date: string;
  costs: Costs;
  icon?: string;
}

const LeftContent = (props: {icon: string}) => (
  <Avatar.Icon {...props} icon={props.icon} />
);

const SummaryCard = (props: Omit<SummaryCardProps, 'id'>) => {
  const {income, outcome, date, costs, icon = ''} = props;
  // the amount of costs total
  const sumCosts = _.sumBy(_.values(costs));

  const handleNavigate = (date: string) => () =>
    router.navigate({pathname: '/summary/chart-details', params: {date}});

  return (
    <Card style={styles.root}>
      <Card.Title
        title={date}
        subtitle={`Saldo: ${formatPrice(income - outcome)}`}
        left={icon ? () => <LeftContent icon={icon} /> : undefined}
      />
      <Card.Content style={{padding: 8}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16}}>
          <TouchableOpacity
            onPress={() => router.navigate('/income-summary')}
            style={styles.buttonContainer}
          >
            <View style={[styles.buttonContent, {backgroundColor: 'rgba(0, 255, 0, 0.1)'}]}>
              <IconButton icon="arrow-down" iconColor="green" />
              <View>
                <Text>Wpłynęło netto</Text>
                <Text>
                  {`${formatPrice(income - sumCosts < 0 ? 0 : income - sumCosts)} `}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleNavigate(date.split('/').reverse().join('-') + '-01')}
            style={styles.buttonContainer}
          >
            <View style={[styles.buttonContent, {backgroundColor: 'rgba(255, 0, 0, 0.1)'}]}>
              <IconButton icon="arrow-up" iconColor="red" />
              <View>
                <Text>Wydano:</Text>
                <Text>{`${formatPrice(outcome - sumCosts)}`}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        {/* <View style={{marginTop: 8}}>
          <Text>Koszta niewliczone:</Text>
          {_.keys(costs).map((name) => (
            <Text key={name}>{`${name}: ${formatPrice(costs[name])}`}</Text>
          ))}
        </View> */}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  root: {
    margin: 8,
  },
  buttonContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    width: '45%',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
  },
});

export default SummaryCard;
