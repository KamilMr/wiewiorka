import { ThemedView } from "@/components/ThemedView";
import { Text } from "react-native-paper";
import { router } from 'expo-router';

const Login = () => {
  const { signIn } = { signIn: () => { } };
  return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text
        style={{ color: 'black' }}
        onPress={() => {
          signIn();
          // Navigate after signing in. You may want to tweak this to ensure sign-in is
          // successful before navigating.
          router.replace('/');
        }}>
        Sign In
      </Text>
    </ThemedView>
  );
}

export default Login;
