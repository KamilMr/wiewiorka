import {Stack} from 'expo-router';

const StackLayout = () => {
  return (
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen name="expense" options={{title: 'Dodaj Wydatek'}} />
      <Stack.Screen name="income" options={{title: 'Dodaj Wpływy'}} />
    </Stack>
  );
};

export default StackLayout;
