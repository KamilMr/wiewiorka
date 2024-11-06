import {colorNames} from '@/constants/theme';
import Svg, {Circle, Ellipse, Path} from 'react-native-svg';

export const CircleIcon = ({
  fillInner = 'none',
  fillOuter = 'none', // No fill for an empty circle
  width = 35,
  height = 35,
  ...rest
}) => (
  <Svg width={width} height={height} viewBox="0 0 35 35" {...rest}>
    <Path
      d="M34 17.5C34 27.165 26.3888 35 17 35C7.61116 35 0 27.165 0 17.5C0 7.83502 7.61116 0 17 0C26.3888 0 34 7.83502 34 17.5Z"
      fill={fillOuter}
    />
    <Path
      d="M28 17.4572C28 23.2562 23.0751 27.9572 17 27.9572C10.9249 27.9572 6 23.2562 6 17.4572C6 11.6582 10.9249 6.95719 17 6.95719C23.0751 6.95719 28 11.6582 28 17.4572Z"
      fill={fillInner}
    />
  </Svg>
);
