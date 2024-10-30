import {BarChart, BarChartPropsType} from 'react-native-gifted-charts';

type DataValue = {
  value: number;
  frontColor: string;
  label: string;
};

interface Props {
  barData: Array<DataValue>;
  title?: string;
}

const CustomBar = (props: Props & BarChartPropsType) => {
  const {barData, ...rest} = props;
  return <BarChart data={barData} xAxisTextNumberOfLines={3} {...rest} />;
};

export default CustomBar;
