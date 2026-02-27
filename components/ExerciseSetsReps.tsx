import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

type SetsRepsProps = {
  sets: number;
  reps: number;
  onChangeSets: (value: number) => void;
  onChangeReps: (value: number) => void;
  maxSets?: number; 
  maxReps?: number;
};

export default function ExerciseSetsReps({
  sets,
  reps,
  onChangeSets,
  onChangeReps,
  maxSets = 20,
  maxReps = 50,
}: SetsRepsProps) {
  const setsArray = Array.from({ length: maxSets }, (_, i) => i + 1);
  const repsArray = Array.from({ length: maxReps }, (_, i) => i + 1);

  return (
    <View style={styles.container}>
      <View style={styles.pickerRow}>
        {/* Sets Picker */}
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Sets</Text>
          <Picker
            selectedValue={sets}
            onValueChange={onChangeSets}
            style={Platform.OS === 'ios' ? styles.iosPicker : styles.androidPicker}
            itemStyle={Platform.OS === 'ios' ? styles.iosItem : undefined}
            mode="dropdown"
          >
            {setsArray.map((num) => (
              <Picker.Item key={num} label={num.toString()} value={num} />
            ))}
          </Picker>
        </View>

        {/* Reps Picker */}
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Reps</Text>
          <Picker
            selectedValue={reps}
            onValueChange={onChangeReps}
            style={Platform.OS === 'ios' ? styles.iosPicker : styles.androidPicker}
            itemStyle={Platform.OS === 'ios' ? styles.iosItem : undefined}
            mode="dropdown"
          >
            {repsArray.map((num) => (
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
    marginTop: 10,
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pickerContainer: {
    flex: 1,
    marginRight: 8,
  },
  pickerLabel: {
    fontSize: 18,
    color: '#fff',
    //marginBottom: 4,
    textAlign: 'center',
    fontWeight: 600
  },
  iosPicker: {
    height: 100, // iOS wheel size
  },
  iosItem: {
    fontSize: 18,
    height: 100,
  },
  androidPicker: {
    height: 50,
    width: '100%',
  },
});