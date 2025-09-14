import {StyleSheet, View, Text, TextInput} from 'react-native';
import {useAppTheme} from '@/constants/theme';
import SafeScrollContainer from '@/components/SafeScrollContainer';

const KeyboardAvoidPage = () => {
  const t = useAppTheme();

  return (
    <SafeScrollContainer>
      <View style={styles.content}>
        <Text style={[styles.title, {color: t.colors.primary}]}>
          Keyboard Avoidance Test
        </Text>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, {color: t.colors.text}]}>Name</Text>
          <TextInput
            style={[
              styles.input,
              {borderColor: t.colors.border, color: t.colors.text},
            ]}
            placeholder="Enter your name"
            placeholderTextColor={t.colors.text + '80'}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, {color: t.colors.text}]}>Email</Text>
          <TextInput
            style={[
              styles.input,
              {borderColor: t.colors.border, color: t.colors.text},
            ]}
            placeholder="Enter your email"
            placeholderTextColor={t.colors.text + '80'}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, {color: t.colors.text}]}>Message</Text>
          <TextInput
            style={[
              styles.textArea,
              {borderColor: t.colors.border, color: t.colors.text},
            ]}
            placeholder="Enter your message"
            placeholderTextColor={t.colors.text + '80'}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
      </View>
    </SafeScrollContainer>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    height: 100,
  },
});

export default KeyboardAvoidPage;
