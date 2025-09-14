import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  TextInput as RNTextInput,
} from 'react-native';
import {IconButton} from 'react-native-paper';

import {Text} from '@/components';
import CustomTextInput from '@/components/CustomTextInput';
import {sizes, useAppTheme} from '@/constants/theme';

interface EnhancedPriceInputV2Props {
  value: string;
  onValueChange: (value: string) => void;
  fromCurrency?: string;
  toCurrency?: string;
  fromSymbol?: string;
  toSymbol?: string;
  exchangeRate?: number;
  onExchangeRateChange?: (rate: number) => void;
  label?: string;
  style?: any;
  disabled?: boolean;
}

export const EnhancedPriceInputV2: React.FC<EnhancedPriceInputV2Props> = ({
  value,
  onValueChange,
  fromCurrency = 'PLN',
  toCurrency = 'USD',
  fromSymbol = 'zł',
  toSymbol = '$',
  exchangeRate = 4.34,
  onExchangeRateChange,
  label = 'Cena',
  style,
  disabled = false,
}) => {
  const theme = useAppTheme();
  const [editingRate, setEditingRate] = useState(false);
  const [rateValue, setRateValue] = useState(exchangeRate.toString());

  const getConvertedValue = (): string => {
    const numValue = parseFloat(value) || 0;
    if (numValue === 0) return '0';
    const converted = numValue / exchangeRate;
    return converted.toFixed(2);
  };

  const handleRatePress = () => {
    setEditingRate(true);
    setRateValue(exchangeRate.toString());
  };

  const handleRateSubmit = () => {
    const newRate = parseFloat(rateValue) || exchangeRate;
    onExchangeRateChange?.(newRate);
    setEditingRate(false);
  };

  const handleRateBlur = () => {
    handleRateSubmit();
  };

  const renderExchangeRate = () => {
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

    return (
      <Pressable onPress={handleRatePress} style={styles.rateContainer}>
        <Text style={styles.rateText}>
          {toSymbol}1 = {exchangeRate.toFixed(2)} {fromSymbol}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.unifiedInputContainer,
          {borderColor: theme.colors.outline},
        ]}
      >
        <View style={styles.unifiedInput}>
          <View style={styles.leftSection}>
            <CustomTextInput
              label={`${label} (${fromSymbol})`}
              value={value}
              onChangeText={onValueChange}
              keyboardType="numeric"
              disabled={disabled}
              mode="flat"
              style={styles.leftInput}
              underlineColor="transparent"
              underlineColorAndroid={'transparent'}
              activeUnderlineColor="transparent"
              cursorColor="black"
            />
          </View>

          <View style={styles.centerSection}>
            <IconButton
              icon="swap-horizontal"
              size={20}
              style={styles.swapButton}
              disabled
            />
          </View>

          <View style={styles.rightSection}>
            <CustomTextInput
              label={`Price (${toSymbol})`}
              value={getConvertedValue()}
              mode="flat"
              readOnly
              underlineColor="transparent"
              underlineColorAndroid={'white'}
              activeUnderlineColor="transparent"
              style={styles.rightInput}
            />
          </View>
        </View>
      </View>

      <View style={styles.rateRow}>
        <View style={styles.rateWrapper}>{renderExchangeRate()}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: sizes.lg,
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
    marginVertical: 0,
    backgroundColor: 'transparent',
  },
  rightInput: {
    marginVertical: 0,
    backgroundColor: 'transparent',
  },
  swapButton: {
    margin: 0,
    opacity: 0.6,
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
});
