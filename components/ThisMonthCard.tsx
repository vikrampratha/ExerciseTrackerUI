import { StyleSheet, Text, View } from "react-native";

type Props = {
  monthlyCount: number;
  avgPerWeek: number;
};

export default function ThisMonthCard({ monthlyCount, avgPerWeek }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>THIS MONTH</Text>

      <Text style={styles.bigNumber}>{monthlyCount}</Text>
      <Text style={styles.primaryText}>
        Workout{monthlyCount !== 1 ? "s" : ""}
      </Text>

      <View style={styles.divider} />

      <Text style={styles.secondaryStat}>
        {avgPerWeek} <Text style={styles.secondaryLabel}>/ week</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    borderRadius: 24,
    padding: 20,
    marginLeft: 10,

    // Subtle depth
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#8E8E93",
    letterSpacing: 1,
    marginBottom: 12,
  },

  bigNumber: {
    fontSize: 40,
    fontWeight: "700",
    color: "#000",
  },

  primaryText: {
    fontSize: 16,
    color: "#6E6E73",
    marginTop: 2,
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E5EA",
    marginVertical: 16,
  },

  secondaryStat: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },

  secondaryLabel: {
    fontSize: 14,
    color: "#8E8E93",
    fontWeight: "400",
  },
});