import { StyleSheet, Text, View } from "react-native";

type Props = {
  monthlyCount: number;
  avgPerWeek: number;
};

export default function ThisMonthCard({ monthlyCount, avgPerWeek }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>This Month</Text>

      <Text style={styles.stat}>
        {monthlyCount} workout{monthlyCount !== 1 ? "s" : ""}
      </Text>

      <Text style={styles.subStat}>
        Avg {avgPerWeek} per week
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    elevation: 3,
    marginVertical: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  stat: {
    fontSize: 22,
    fontWeight: "bold",
  },
  subStat: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
});