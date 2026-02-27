import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { PropsWithChildren, useState } from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = PropsWithChildren<{
  value: Date;
  onChange: (date: Date) => void;
}>;     

export default function DatePicker({ value, onChange }: Props) {
    const [showPicker, setShowPicker] = useState(false);

    const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        if (event.type === 'set' && selectedDate) {
            onChange(selectedDate);

            if (Platform.OS === 'ios') {
                setShowPicker(false);
            }
        }
    };

    return (
        <View style={styles.section}>
        <Text style={styles.label}>Date</Text>

        <TouchableOpacity
            style={styles.inputRow}
            onPress={() => setShowPicker(!showPicker)}
            activeOpacity={0.7}
        >
            <Text style={styles.dateText}>
                {value.toLocaleDateString('en-US', {
                    dateStyle: 'medium',
                })}
            </Text>
            <MaterialIcons name="chevron-right" size={22} color="#999" />
        </TouchableOpacity>

        {showPicker && (
            <DateTimePicker
                value={value}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleChange}
                style={{ marginTop: 10 }}
            />
        )}
        </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 25,
  },

  label: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 8,
  },

  inputRow: {
    backgroundColor: '#25292e', // iOS grouped background
    padding: 14,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  dateText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
});