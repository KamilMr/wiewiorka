import {View, StyleSheet} from 'react-native';
import {useAppTheme} from '@/constants/theme';

export default function IncomeSummary() {
  const t = useAppTheme();

  return (
    <View style={[styles.container, {backgroundColor: t.colors.background}]}>
      {/* Add your income summary content here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 16,
  },
});