import CalendarCard from "@/components/CalendarCard";
import ThisMonthCard from "@/components/ThisMonthCard";
import ThisWeekCard from "@/components/ThisWeekCard";
import { useWorkouts } from "@/hooks/useWorkouts";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LastWorkoutCard from "../../components/LastWorkoutCard";


export default function Index() {
  const { workouts, lastWorkout, lastWorkoutDate, thisWeekSummary, thisMonthSummary, loading, error } = useWorkouts();

  if (loading) return <ActivityIndicator />;
  if (error) return <Text>{error}</Text>;

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* Last Workout */}
        <View style={styles.section}>
          <LastWorkoutCard lastWorkout={lastWorkout} />
        </View>

        {/* Calendar Section */}
        <View style={styles.section}>
          <CalendarCard workouts={workouts} />
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <ThisWeekCard summary={thisWeekSummary} />
          <ThisMonthCard monthlyCount={thisMonthSummary.monthlyCount} avgPerWeek={thisMonthSummary.avgPerWeek} />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#000000",
  },
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