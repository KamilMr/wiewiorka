import {StyleSheet, View, Text} from 'react-native';
import {useAppTheme} from '@/constants/theme';

const DropdownPage = () => {
  const t = useAppTheme();

  return (
    <View style={[styles.root, {backgroundColor: t.colors.white}]}>
      <Text style={styles.title}>Dropdown</Text>
      <Text style={styles.content}>
        This is the dropdown page for testing dropdown components and
        interactions.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default DropdownPage;
