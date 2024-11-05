import {View} from 'react-native';

import {PieChart, PieChartPropsType} from 'react-native-gifted-charts';

import {Text} from '.';

interface Props {
  title?: string;
}

import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});

const CustomPieChart = (props: Props & PieChartPropsType) => {
  const {data, title = '', ...rest} = props;
  return (
    <View style={styles.container}>
      <Text>{title}</Text>
      <PieChart data={data} {...rest} />
    </View>
  );
};

export default CustomPieChart;
