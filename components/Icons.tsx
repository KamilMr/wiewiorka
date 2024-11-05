import {colorNames} from '@/constants/theme';
import Svg, {Circle} from 'react-native-svg';

export const CircleIcon = ({
  fill = 'none', // No fill for an empty circle
  stroke = colorNames.softLavender, // Color for the outline
  strokeWidth = 2, // Width of the outline
  width = 35,
  height = 35,
  ...rest
}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 35 35"
    fill="none"
    {...rest} // Spread any other props
  >
    <Circle
      cx="17.5"
      cy="17.5"
      r="16.5" // Reduced radius slightly to fit inside SVG bounds with stroke
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
    />
  </Svg>
);
