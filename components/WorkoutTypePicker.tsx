import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';
import { useState } from "react";
import { LayoutAnimation, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  value?: string;
  onChange?: (type: string) => void;
};

const options = ['push', 'pull', 'leg', 'upper', 'lower', 'full', 'cardio'];

export default function WorkoutTypePicker({ value, onChange }: Props) {
  const [selectedType, setSelectedType] = useState(value || options[0]);
  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (type: string) => {
    setSelectedType(type);
    setShowPicker(false);
    if (onChange) onChange(type);
  };

  const togglePicker = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowPicker(!showPicker);
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.labelRow}>
            <MaterialIcons name="directions-run" color={'#ffd33d'} size={25} />
            <Text style={styles.label}>Type</Text>
        </View>

        <TouchableOpacity
          style={styles.choiceOutline}
          onPress={togglePicker}
          activeOpacity={0.8}
        >
          <Text style={[styles.choiceText, showPicker ? styles.choiceTextActive : styles.choiceTextInactive]}>
            {selectedType.toUpperCase()}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.pickerContainer}>
      {showPicker && (
        <Picker
          selectedValue={selectedType}
          onValueChange={handleChange}
          style={styles.picker}
          itemStyle={{ fontSize: 18 }} // wheel text size
        >
          {options.map(option => (
            <Picker.Item key={option} label={option.toUpperCase()} value={option} />
          ))}
        </Picker>
      )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 25,
    backgroundColor: '#31363d',
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    marginLeft: 10,
    color: '#fff',
  },
  choiceOutline: {
    borderWidth: 1,
    borderColor: '#25292e',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#444c55',
  },
  choiceTextActive: {
    color: '#ffd33d',
  },
  choiceTextInactive: {
    color: '#fff',
  },
  choiceText: {
    fontSize: 18,
  },
  pickerContainer: {
    maxHeight: 120,
    //marginTop: 8,
    //borderWidth: 1,
    //borderColor: '#ccc',
    //borderRadius: 12,
  },
  option: {
    //paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  picker: {
    //marginTop: 8,
  },
});