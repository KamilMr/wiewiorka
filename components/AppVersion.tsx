import {Text} from 'react-native';

const packageJson = require('../package.json');

export default function AppVersion() {
  return (
    <Text
      style={{
        fontSize: 12,
        color: '#666',
        alignSelf: 'flex-start',
        marginLeft: 4,
      }}
    >
      v{packageJson.version}
    </Text>
  );
}
