import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {router} from 'expo-router';

import _ from 'lodash';
import {Avatar, Button, Card, IconButton, Text} from 'react-native-paper';

import {formatPrice} from '@/common';

type Costs = {
  [key: string]: number;
};

interface Props {
  income: number;
  outcome: number;
  date: string;
  costs: Costs;
}

const LeftContent = (props) => <Avatar.Icon {...props} icon="folder" />;

const SummaryCard = (props: Props) => {
  const {income, outcome, date, costs} = props;
  // the amount of costs total
  const sumCosts = _.sumBy(_.values(costs));

  const handleNavigate = (whereTo: string) => router.navigate(whereTo);
  return (
    <Card style={styles.root}>
      <Card.Title
        title={date}
        subtitle={`Saldo: ${formatPrice(income - outcome)}`}
        left={LeftContent}
      />
      <Card.Content style={{padding: 8}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <IconButton icon="arrow-down" iconColor="green" />
            <View>
              <Text>Wpłynęło netto</Text>
              <Text>
                {`${formatPrice(income - sumCosts < 0 ? 0 : income - sumCosts)} `}
              </Text>
            </View>
          </View>

          <View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <IconButton icon="arrow-up" iconColor="red" />
              <View>
                <Text>Wydano:</Text>
                <Text>{`${formatPrice(outcome - sumCosts)}`}</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={{marginTop: 8}}>
          <Text>Koszta niewliczone:</Text>
          {_.keys(costs).map((name) => (
            <Text key={name}>{`${name}: ${formatPrice(costs[name])}`}</Text>
          ))}
        </View>
      </Card.Content>
      <Card.Actions>
        <Button>Zobacz Szczegóły</Button>
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  root: {
    margin: 8,
  },
});

export default SummaryCard;
