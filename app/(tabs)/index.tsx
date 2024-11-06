import {SafeAreaView} from 'react-native-safe-area-context';

import {Text} from '@/components';
import {View} from 'react-native';
import {useAppTheme} from '@/constants/theme';

const Home = () => {
  const t = useAppTheme();
  return (
    <SafeAreaView style={{backgroundColor: t.colors.white}}>
      <View
        style={{
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: t.colors.white,
        }}>
        <Text>Tu coś będzie.</Text>
      </View>
    </SafeAreaView>
  );
};

export default Home;
