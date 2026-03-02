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
    backgroundColor: "#1C1C1E",
    borderRadius: 24,
    padding: 20,
    marginLeft: 10,
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },

  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#A1A1AA",
    letterSpacing: 1,
    marginBottom: 12,
  },

  bigNumber: {
    fontSize: 40,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  primaryText: {
    fontSize: 16,
    color: "#A1A1AA",
    marginTop: 2,
  },

  divider: {
    height: 1,
    backgroundColor: "#2C2C2E",
    marginVertical: 16,
  },

  secondaryStat: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  secondaryLabel: {
    fontSize: 14,
    color: "#A1A1AA",
    fontWeight: "400",
  },
});