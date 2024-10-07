import {BarChart} from 'react-native-gifted-charts';

type DataValue = {
  value: number;
  frontColor: string;
  label: string;
};

interface Props {
  barData: Array<DataValue>;
  title: string;
}

const CustomBar = (props: Props) => {
  const {barData, title = ''} = props;
  return <BarChart data={barData} 
xAxisTextNumberOfLines={3} 
  />;
};

export default CustomBar;
