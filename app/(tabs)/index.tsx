import { useWorkouts } from "@/hooks/useWorkouts";
import { useMemo } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Calendar } from 'react-native-calendars';
import LastWorkoutCard from "../../components/LastWorkoutCard";


export default function Index() {
  // const lastWorkoutDate = "2026-02-25";
  // const [workouts, setWorkouts] = useState<Workout[]>([]);
  const { workouts, lastWorkoutDate, loading, error } = useWorkouts();

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

  if (loading) return <ActivityIndicator />;
  if (error) return <Text>{error}</Text>;

  return (
    <View style={styles.container}>
      <LastWorkoutCard lastWorkoutDate={lastWorkoutDate} />
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