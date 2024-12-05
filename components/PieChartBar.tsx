import {View} from 'react-native';

import {PieChart, PieChartPropsType} from 'react-native-gifted-charts';

import Text from './CustomText';

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
  let {data, title = '', ...rest} = props;
  if (!Array.isArray(data) || data.length < 1) {
    data = [{value: 10, color: '#FFFFFF'}];
  }
  return (
    <View style={styles.container}>
      <Text>{title}</Text>
      <PieChart data={data} {...rest} />
    </View>
  );
};

export default CustomPieChart;
