import {StyleSheet, View, Text} from 'react-native';
import {useState} from 'react';
import {useAppTheme} from '@/constants/theme';
import {EnhancedPriceInput} from '@/components/EnhancedPriceInput';
import SafeScrollContainer from '@/components/SafeScrollContainer';

const ShowReelPage = () => {
  const t = useAppTheme();

  // V2 component state
  const [priceV2, setPriceV2] = useState('200');
  const [exchangeRate, setExchangeRate] = useState(4.34);

  return (
    <SafeScrollContainer
      style={[styles.root, {backgroundColor: t.colors.white}]}
    >
      <View>
        <Text style={styles.title}>Show Reel</Text>

        <Text style={styles.content}>Testing Enhanced Price Input</Text>
        <EnhancedPriceInput
          value={priceV2}
          onValueChange={(v): void => {
            setPriceV2(v[0]);
          }}
          defaultCurrency="PLN"
          availableCurrencies={['EUR', 'USD']}
          exchangeRate={exchangeRate}
          onExchangeRateChange={setExchangeRate}
          label="Cena"
        />
      </View>
    </SafeScrollContainer>
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
