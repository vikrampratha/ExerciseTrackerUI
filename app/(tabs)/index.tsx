import { Workout, getWorkouts } from "@/services/api";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Calendar } from 'react-native-calendars';


export default function Index() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const data = await getWorkouts();
        setWorkouts(data);
      } catch (error) {
        console.error('Failed to fetch workouts:', error);
      }
    };

    fetchWorkouts();
  }, []);

  const markedDates = useMemo(() => {
    const marks: Record<string, any> = {};

    workouts.forEach(workout => {
      marks[workout.date] = {
        customStyles: {
          container: {
            borderWidth: 1.5,
            borderColor: '#2ECC71',
            borderRadius: 20,
            justifyContent: 'center'
          },
          text: {
            color: '#fff',
          },
        },
      };
    });

    return marks;
  }, [workouts]);

  return (
    <View style={styles.container}>
      <Calendar
        current={new Date().toISOString().split('T')[0]}
        maxDate={new Date().toISOString().split('T')[0]}
        markingType="custom"
        markedDates={markedDates}
        theme={{
          calendarBackground: '#25292e',
          dayTextColor: '#fff',
          monthTextColor: '#fff',
          arrowColor: '#fff',
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
  },
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#fff',
  },
});