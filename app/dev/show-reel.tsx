import {StyleSheet, View, Text} from 'react-native';
import {useAppTheme} from '@/constants/theme';

const ShowReelPage = () => {
  const t = useAppTheme();

  return (
    <View style={[styles.root, {backgroundColor: t.colors.white}]}>
      <Text style={styles.title}>Show Reel</Text>
      <Text style={styles.content}>
        This is the show reel page for testing various UI components and
        animations.
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

export default ShowReelPage;
