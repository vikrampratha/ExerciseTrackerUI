import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

type DurationPickerProps = {
  minutes: number;
  onChangeMinutes: (value: number) => void;
  maxMinutes?: number;
};

export default function ExerciseDuration({
  minutes,
  onChangeMinutes,
  maxMinutes = 120,
}: DurationPickerProps) {
  const minutesArray = Array.from({ length: maxMinutes + 1 }, (_, i) => i);

  return (
    <View style={styles.container}>
      <View style={styles.pickerRow}>
        {/* Minutes Picker */}
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Duration (min)</Text>
          <Picker
            selectedValue={minutes}
            onValueChange={onChangeMinutes}
            style={Platform.OS === 'ios' ? styles.iosPicker : styles.androidPicker}
            itemStyle={Platform.OS === 'ios' ? styles.iosItem : undefined}
            mode="dropdown"
          >
            {minutesArray.map((num) => (
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
    alignItems: 'center'
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  pickerContainer: {
    width: 120,
    alignItems: 'center',
  },
  pickerLabel: {
    fontSize: 18,
    color: '#fff',
    //marginBottom: 4,
    textAlign: 'center',
    fontWeight: 600
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