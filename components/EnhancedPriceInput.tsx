import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  TextInput as RNTextInput,
} from 'react-native';
import {IconButton, Button} from 'react-native-paper';
import {isNaN} from 'lodash';

import CustomModal from '@/components/CustomModal';
import CustomTextInput from '@/components/CustomTextInput';
import {SelectRadioButtons} from '@/components/addnew/SelectRadioButtons';
import {Text} from '@/components';
import {printJsonIndent} from '@/common';
import {sizes, useAppTheme} from '@/constants/theme';

interface RenderExchangeRateProps {
  editingRate: boolean;
  rateValue: string;
  setRateValue: (value: string) => void;
  exchangeRate: number;
  currencySymbols: Record<string, string>;
  handleRatePress: () => void;
  handleRateSubmit: () => void;
  handleRateBlur: () => void;
  theme: any;
  baseCurrency: [string, string];
  targetCurrency: [string, string] | null;
}

const RenderExchangeRate: React.FC<RenderExchangeRateProps> = ({
  editingRate,
  rateValue,
  setRateValue,
  exchangeRate,
  currencySymbols,
  handleRatePress,
  handleRateSubmit,
  handleRateBlur,
  theme,
  baseCurrency,
  targetCurrency,
}) => {
  if (editingRate) {
    return (
      <View style={styles.rateEditContainer}>
        <RNTextInput
          value={rateValue}
          onChangeText={setRateValue}
          onSubmitEditing={handleRateSubmit}
          onBlur={handleRateBlur}
          keyboardType="numeric"
          autoFocus
          style={[styles.rateEditInput, {color: theme.colors.onBackground}]}
        />
      </View>
    );
  }

  // Only show rate in enhanced mode when we have target currency
  if (!targetCurrency) return null;

  const fromCurrency = targetCurrency[1];
  const toCurrency = baseCurrency[1];
  const fromSymbol = currencySymbols[fromCurrency] || fromCurrency;
  const toSymbol = currencySymbols[toCurrency] || toCurrency;

  return (
    <Pressable onPress={handleRatePress} style={styles.rateContainer}>
      <Text style={styles.rateText}>
        {fromSymbol}1 = {exchangeRate.toFixed(2)} {toSymbol}
      </Text>
    </Pressable>
  );
};

interface EnhancedPriceInputProps {
  value: string;
  onValueChange: (value: string) => void;
  defaultCurrency?: string;
  availableCurrencies?: string[];
  exchangeRate?: number;
  onExchangeRateChange?: (rate: number) => void;
  label?: string;
  style?: any;
  disabled?: boolean;
}

const currencySymbols: Record<string, string> = {
  PLN: 'zł',
  EUR: '€',
  USD: '$',
  GBP: '£',
};

export const EnhancedPriceInput: React.FC<EnhancedPriceInputProps> = ({
  value,
  onValueChange,
  defaultCurrency = 'PLN',
  availableCurrencies = ['EUR'],
  exchangeRate = 1,
  onExchangeRateChange,
  label = 'Cena',
  style,
  disabled = false,
}) => {
  const theme = useAppTheme();
  const [baseCurrency, setBaseCurrency] = useState<[string, string]>([
    value,
    defaultCurrency,
  ]);
  const [targetCurrency, setTargetCurrency] = useState<null | [string, string]>(
    null,
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRate, setEditingRate] = useState(false);
  const [rateValue, setRateValue] = useState(exchangeRate.toString());
  const [swap, setSwap] = useState(false);

  const isEnhancedMode = targetCurrency !== null;
  const allCurrencies = [defaultCurrency, ...availableCurrencies];
  const currentSymbol = currencySymbols[baseCurrency[1]] || baseCurrency;
  const displayTargetSymbol = targetCurrency
    ? currencySymbols[targetCurrency[1]] || targetCurrency
    : '';
  printJsonIndent({
    baseCurrency,
    targetCurrency,
    editingRate,
    rateValue,
  });

  const handleRatePress = () => {
    setEditingRate(true);
    setRateValue(exchangeRate.toString());
  };

  const handleRateSubmit = () => {
    const newRate = parseFloat(rateValue) || exchangeRate;
    onExchangeRateChange?.(newRate);
    setEditingRate(false);

    // Recalculate values with new rate when in enhanced mode
    if (!targetCurrency) return;

    const baseValue = parseFloat(baseCurrency[0]) || 0;
    if (baseValue <= 0) return;
    const newTargetValue = (baseValue / newRate).toFixed(2);
    setTargetCurrency([newTargetValue, targetCurrency[1]]);
  };

  const handleRateBlur = () => handleRateSubmit();

  const handleCurrencySelect = (currency: string) => {
    if (currency === baseCurrency[1]) {
      setTargetCurrency(null);
      setSwap(false);
    } else
      // Selected different currency - go to enhanced mode
      setTargetCurrency([
        (baseCurrency[0] / exchangeRate).toFixed(2),
        currency,
      ]);

    setModalVisible(false);
  };

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);
  const handleCurrencySwap = () => setSwap(!swap);

  // Prepare currency options for radio buttons
  const currencyOptions = allCurrencies.map(currency => ({
    label: `${currency} (${currencySymbols[currency] || currency})`,
    value: currency,
  }));

  const handleBasePriceChange = (value: string) => {
    onValueChange?.([value, value * rateValue]);
    setBaseCurrency([value, baseCurrency[1]]);
    if (targetCurrency) {
      let nv = (+value / +rateValue).toFixed(2);
      if (isNaN(+nv)) return (nv = '0.00');
      setTargetCurrency([nv, targetCurrency[1]]);
    }
  };

  const handleTargetPriceChange = price => {
    const nbase = (+rateValue * price).toFixed(2);
    setBaseCurrency([nbase, baseCurrency[1]]);
    setTargetCurrency([price, targetCurrency![1]]);
  };

  return (
    <View style={[styles.container, style]}>
      {!isEnhancedMode ? (
        // Normal Mode: Single input with currency selector
        <View
          style={[
            styles.normalInputContainer,
            {borderColor: theme.colors.outline},
          ]}
        >
          <View style={styles.normalInput}>
            <View style={styles.inputSection}>
              <CustomTextInput
                value={baseCurrency[0]}
                onChangeText={handleBasePriceChange}
                keyboardType="numeric"
                disabled={disabled}
                mode="flat"
                style={styles.singleInput}
                underlineColor="transparent"
                underlineColorAndroid={'transparent'}
                activeUnderlineColor="transparent"
                cursorColor="black"
              />
            </View>

            <View style={styles.currencySection}>
              <Button
                mode="text"
                onPress={showModal}
                style={styles.currencyButton}
                labelStyle={styles.currencyButtonText}
              >
                {currentSymbol}
              </Button>
            </View>
          </View>
        </View>
      ) : (
        // Enhanced Mode: Dual input with conversion
        <>
          <View
            style={[
              styles.unifiedInputContainer,
              {borderColor: theme.colors.outline},
            ]}
          >
            <View style={styles.unifiedInput}>
              <View
                style={{
                  flexDirection: swap ? 'row-reverse' : 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '85%',
                }}
              >
                {/*Left section*/}
                <View style={styles.inputWithSymbol}>
                  <CustomTextInput
                    value={baseCurrency[0]}
                    onChangeText={handleBasePriceChange}
                    keyboardType="numeric"
                    readOnly={swap ? true : false}
                    mode="flat"
                    style={styles.leftInput}
                    underlineColor="transparent"
                    underlineColorAndroid={'transparent'}
                    activeUnderlineColor="transparent"
                    cursorColor="black"
                  />
                  <View>
                    <Text style={styles.symbolText}>{currentSymbol}</Text>
                  </View>
                </View>

                {/*center section*/}
                <IconButton
                  icon="swap-horizontal"
                  size={20}
                  style={styles.swapButton}
                  onPress={handleCurrencySwap}
                />

                {/*Right section*/}
                <View style={styles.inputWithSymbol}>
                  <CustomTextInput
                    value={targetCurrency[0]}
                    onChangeText={handleTargetPriceChange}
                    mode="flat"
                    readOnly={!swap ? true : false}
                    underlineColor="transparent"
                    underlineColorAndroid={'white'}
                    activeUnderlineColor="transparent"
                    style={styles.rightInput}
                    cursorColor="black"
                  />
                  <View>
                    <Text style={styles.symbolText}>{displayTargetSymbol}</Text>
                  </View>
                </View>
              </View>

              {/*Right Right section*/}
              <Button
                mode="text"
                onPress={showModal}
                style={styles.enhancedCurrencyButton}
                labelStyle={styles.currencyButtonText}
              >
                {displayTargetSymbol}
              </Button>
            </View>
          </View>

          <View style={styles.rateRow}>
            <View style={styles.rateWrapper}>
              <RenderExchangeRate
                editingRate={editingRate}
                rateValue={rateValue}
                setRateValue={setRateValue}
                exchangeRate={exchangeRate}
                currencySymbols={currencySymbols}
                handleRatePress={handleRatePress}
                handleRateSubmit={handleRateSubmit}
                handleRateBlur={handleRateBlur}
                theme={theme}
                baseCurrency={baseCurrency}
                targetCurrency={targetCurrency}
              />
            </View>
          </View>
        </>
      )}
      <CustomModal
        visible={modalVisible}
        onDismiss={hideModal}
        title="Wybierz walutę"
        content={
          <SelectRadioButtons
            items={currencyOptions}
            selected={targetCurrency ? targetCurrency[1] : baseCurrency[1]}
            onSelect={handleCurrencySelect}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: sizes.lg,
  },
  normalInputContainer: {
    borderWidth: 1,
    borderRadius: sizes.sm,
    backgroundColor: '#ffffff',
    paddingVertical: sizes.sm,
    paddingHorizontal: sizes.md,
    minHeight: 56,
    justifyContent: 'center',
  },
  normalInput: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputSection: {
    flex: 1,
  },
  currencySection: {
    marginLeft: sizes.sm,
  },
  singleInput: {
    backgroundColor: 'transparent',
    fontSize: 20,
  },
  currencyButton: {
    minWidth: 40,
    paddingHorizontal: sizes.sm,
  },
  currencyButtonText: {
    fontSize: 24,
  },
  rightInputWithButton: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  enhancedCurrencyButton: {
    minWidth: 30,
    marginRight: sizes.lg,
  },
  unifiedInputContainer: {
    borderWidth: 1,
    borderRadius: sizes.lg,
    paddingVertical: sizes.sm,
    paddingHorizontal: sizes.md,
    minHeight: 56,
    justifyContent: 'center',
  },
  unifiedInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  leftSection: {
    flex: 1,
  },
  centerSection: {
    paddingHorizontal: sizes.sm,
    justifyContent: 'center',
  },
  rightSection: {
    flex: 1,
  },
  leftInput: {
    fontSize: 20,
    marginVertical: 0,
    backgroundColor: 'transparent',
  },
  rightInput: {
    fontSize: 20,
    marginVertical: 0,
    backgroundColor: 'transparent',
  },
  swapButton: {
    margin: 0,
  },
  rateRow: {
    alignItems: 'flex-end',
    marginTop: sizes.sm,
  },
  rateWrapper: {
    alignItems: 'flex-end',
  },
  rateContainer: {
    paddingVertical: sizes.sm,
  },
  rateText: {
    fontSize: 12,
    color: '#666',
    textDecorationLine: 'underline',
  },
  rateEditContainer: {
    width: 100,
  },
  rateEditInput: {
    fontSize: 12,
    textAlign: 'right',
    paddingVertical: sizes.sm,
    paddingHorizontal: sizes.sm,
    backgroundColor: '#f0f0f0',
    borderRadius: sizes.sm,
  },
  inputWithSymbol: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  symbolText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
});
