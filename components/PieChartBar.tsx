import {View} from 'react-native';
import {PieChart, PieChartPropsType} from 'react-native-gifted-charts';
import {Text} from 'react-native-paper';

type DataValue = {
  value: number;
  frontColor: string;
  label: string;
};

interface Props {
  title?: string;
}

const CustomBar = (props: Props & PieChartPropsType) => {
  const {data, title = '', ...rest} = props;
  return (
    <View style={{alignItems: 'center'}}>
      <Text>{title}</Text>
      <PieChart data={data} donut {...rest} />
    </View>
  );
};

export default CustomBar;
