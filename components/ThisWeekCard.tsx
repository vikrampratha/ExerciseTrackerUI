import { StyleSheet, Text, View } from "react-native";

type Props = {
  summary: Record<string, number>;
};

export default function ThisWeekCard({ summary }: Props) {
  const entries = Object.entries(summary);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>This Week</Text>

      {entries.length === 0 ? (
        <Text style={styles.empty}>No workouts</Text>
      ) : (
        entries.map(([type, count]) => (
          <Text key={type} style={styles.item}>
            {count} {type}
          </Text>
        ))
      )}
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
  item: {
    fontSize: 18,
    fontWeight: "bold",
  },
  empty: {
    fontSize: 16,
    color: "#888",
  },
});