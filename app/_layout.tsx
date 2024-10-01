import 'react-native-reanimated';
import {useEffect} from 'react';
import {Stack} from 'expo-router';
import {useFonts} from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {Provider as PaperProvider} from 'react-native-paper';

import {store, persistor} from '@/redux/store';
import {paperTheme} from '@/constants/theme';
import CustomSnackBar from '@/components/Snackbar';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <PaperProvider theme={paperTheme}>
          <Stack>
            <Stack.Screen name="sign-in" options={{headerShown: false}} />
            <Stack.Screen name="(tabs)" options={{headerShown: false}} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <CustomSnackBar />
        </PaperProvider>
      </PersistGate>
    </Provider>
  );
};
export default RootLayout;
