import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { PropsWithChildren, useState } from "react";
import { LayoutAnimation, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = PropsWithChildren<{
  value: Date;
  onChange: (date: Date) => void;
}>;     

export default function DatePicker({ value, onChange }: Props) {
    const today = new Date();
    const [selectedDate, setSelectedDate] = useState(today);
    const [isLabelPressed, setIsLabelPressed] = useState(false);
    const [showPicker, setShowPicker] = useState(false);

    const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        if (event.type === 'set' && selectedDate) {
            setSelectedDate(selectedDate);
        }
    };

    const togglePicker = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsLabelPressed(!isLabelPressed);
        setShowPicker(!showPicker);
    };

    const isSameDay = (a: Date, b: Date) =>
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate();

    const formatDisplayDate = (date: Date) => {
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        if (isSameDay(date, today)) return 'Today';
        if (isSameDay(date, yesterday)) return 'Yesterday';

        return date.toLocaleDateString('en-US', { dateStyle: 'medium' });
    };

    return (
    <View style={styles.container}>
      {/* Inline Row */}
      <View style={styles.row}>
        <View style={styles.labelRow}>
            <MaterialIcons name="calendar-month" color={'#ffd33d'} size={25} />
            <Text style={styles.label}>Date</Text>
        </View>

        <TouchableOpacity
          style={styles.dateOutline}
          onPress={togglePicker}
          activeOpacity={0.8}
        >
          <Text style={[styles.dateText, isLabelPressed ? styles.dateTextActive : styles.dateTextInactive]}>
            {formatDisplayDate(selectedDate)}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Inline Calendar */}
      <View style={styles.calendarContainer}>
        {showPicker && (
            <DateTimePicker
            value={selectedDate}
            mode="date"
            display="inline"
            maximumDate={today}
            onChange={handleChange}
            style={styles.picker}
            />
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
  dateOutline: {
    borderWidth: 1,
    borderColor: '#25292e',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#444c55',
  },
  dateTextActive: {
    color: '#ffd33d',
  },
  dateTextInactive: {
    color: '#fff',
  },
  dateText: {
    fontSize: 18,
  },
  calendarContainer: {
    width: '100%',
    alignItems: 'center',
  },
  picker: {
    //marginTop: 12,
  },
});