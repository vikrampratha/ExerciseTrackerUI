import CalendarCard from "@/components/CalendarCard";
import ThisMonthCard from "@/components/ThisMonthCard";
import ThisWeekCard from "@/components/ThisWeekCard";
import { useWorkouts } from "@/hooks/useWorkouts";
import { useMemo } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import LastWorkoutCard from "../../components/LastWorkoutCard";


export default function Index() {
  const { workouts, lastWorkoutDate, thisWeekSummary, thisMonthSummary, loading, error } = useWorkouts();

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

  /* return (
    <View style={styles.container}>
      <LastWorkoutCard lastWorkoutDate={lastWorkoutDate} />
      <ThisWeekCard summary={thisWeekSummary} />
      <ThisMonthCard monthlyCount={thisMonthSummary.monthlyCount} avgPerWeek={thisMonthSummary.avgPerWeek} />
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
  ); */
  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      {/* Calendar Section */}
      <View style={styles.section}>
        <CalendarCard workouts={workouts} />
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <ThisWeekCard summary={thisWeekSummary} />
        <ThisMonthCard monthlyCount={thisMonthSummary.monthlyCount} avgPerWeek={thisMonthSummary.avgPerWeek} />
      </View>

      {/* Last Workout */}
      <View style={styles.section}>
        <LastWorkoutCard lastWorkoutDate={lastWorkoutDate} />
      </View>

    </ScrollView>
  );
}

/* const styles = StyleSheet.create({
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
}); */

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 12,
  },
  calendarCard: {
    backgroundColor: "#F2F2F7",
    borderRadius: 28,
    padding: 20,
    marginBottom: 20,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#8E8E93",
    letterSpacing: 1,
    marginBottom: 10,
  },
});