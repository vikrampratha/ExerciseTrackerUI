import CalendarCard from "@/components/CalendarCard";
import ThisMonthCard from "@/components/ThisMonthCard";
import ThisWeekCard from "@/components/ThisWeekCard";
import { useAuth } from "@/contexts/AuthContext";
import { useWorkouts } from "@/hooks/useWorkouts";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LastWorkoutCard from "../../components/LastWorkoutCard";


export default function Index() {
  const { workouts, lastWorkout, thisWeekSummary, thisMonthSummary, loading, error } = useWorkouts();
  const { signOut } = useAuth();

  if (loading) return <ActivityIndicator />;
  if (error) return <Text>{error}</Text>;

  const logout = async () => {
    await signOut();
    router.replace("/(auth)/login");
  }
  
  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Text style={styles.kicker}>DASHBOARD</Text>
          <Text style={styles.title}>Workout Summary</Text>
        </View>
        <Pressable
          onPress={logout}
          style={({ pressed }) => [
            styles.profileBtn,
            pressed && styles.pressed,
          ]}>
          <Ionicons name="person-outline" size={30} color="#FFFFFF" />
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* Last Workout */}
        <View style={styles.section}>
          <LastWorkoutCard lastWorkout={lastWorkout} />
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <ThisWeekCard summary={thisWeekSummary} />
          <ThisMonthCard monthlyCount={thisMonthSummary.monthlyCount} avgPerWeek={thisMonthSummary.avgPerWeek} />
        </View>

        {/* Calendar Section */}
        <View style={styles.section}>
          <CalendarCard workouts={workouts} />
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
  headerRow: {
    paddingTop: 8,
    paddingBottom: 18,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },

  headerLeft: {
    flex: 1,
    gap: 6,
  },

  kicker: {
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1.2,
    color: "#A1A1AA",
  },

  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  profileBtn: {
    width: 60,
    height: 60,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1C1C1E",
    borderColor: "#32D74B",
    borderWidth: 2,

    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});