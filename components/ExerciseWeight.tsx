import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

type WeightPickerProps = {
  weight: number; // e.g., 123.5
  onChangeWeight: (value: number) => void;
  maxWeight?: number; // optional, default 500
};

export default function WeightPicker({
  weight,
  onChangeWeight,
  maxWeight = 500,
}: WeightPickerProps) {
  const integerPart = Math.floor(weight);
  const decimalPart = Math.round((weight - integerPart) * 10);

  const integers = Array.from({ length: maxWeight + 1 }, (_, i) => i); // 0 to maxWeight
  const decimals = Array.from({ length: 10 }, (_, i) => i); // 0-9

  const handleIntegerChange = (value: number) => {
    onChangeWeight(value + decimalPart / 10);
  };

  const handleDecimalChange = (value: number) => {
    onChangeWeight(integerPart + value / 10);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Weight</Text>
      <View style={styles.pickerRow}>
        {/* Integer Picker */}
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>lbs</Text>
          <Picker
            selectedValue={integerPart}
            onValueChange={handleIntegerChange}
            style={Platform.OS === 'ios' ? styles.iosPicker : styles.androidPicker}
            itemStyle={Platform.OS === 'ios' ? styles.iosItem : undefined}
            mode="dropdown"
          >
            {integers.map((num) => (
              <Picker.Item key={num} label={num.toString()} value={num} />
            ))}
          </Picker>
        </View>

        {/* Decimal Picker */}
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>.0</Text>
          <Picker
            selectedValue={decimalPart}
            onValueChange={handleDecimalChange}
            style={Platform.OS === 'ios' ? styles.iosPicker : styles.androidPicker}
            itemStyle={Platform.OS === 'ios' ? styles.iosItem : undefined}
            mode="dropdown"
          >
            {decimals.map((num) => (
              <Picker.Item key={num} label={num.toString()} value={num} />
            ))}
          </Picker>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  label: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center'
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pickerContainer: {
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  pickerLabel: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
    textAlign: 'center',
  },
  iosPicker: {
    height: 120,
    width: '100%',
  },
  iosItem: {
    fontSize: 18,
    height: 120,
  },
  androidPicker: {
    height: 50,
    width: '100%',
  },
});