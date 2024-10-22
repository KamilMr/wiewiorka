import {View} from 'react-native';
import {PieChart, PieChartPropsType} from 'react-native-gifted-charts';
import {Text} from 'react-native-paper';

type DataValue = {
  value: number;
  frontColor: string;
  label: string;
};

interface Props {
  barData: Array<DataValue>;
  title?: string;
}

const CustomBar = (props: Props & PieChartPropsType) => {
  const {barData, title = '', ...rest} = props;
  return (
    <View style={{alignItems: 'center'}}>
      <Text>{title}</Text>
      <PieChart data={barData} {...rest} showText />
    </View>
  );
};

export default CustomBar;
