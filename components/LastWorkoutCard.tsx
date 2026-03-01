import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  lastWorkoutDate: string | null;
};

export default function LastWorkoutCard({ lastWorkoutDate }: Props) {
  const calculateDaysAgo = () => {
    if (!lastWorkoutDate) return null;

    const today = new Date();
    const lastDate = new Date(lastWorkoutDate);

    const diffTime = today.getTime() - lastDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  const daysAgo = calculateDaysAgo();

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Last Worked Out</Text>
      <Text style={styles.content}>
        {daysAgo === null
          ? "No workouts yet"
          : daysAgo === 0
          ? "Today 💪"
          : daysAgo === 1
          ? "Yesterday"
          : `${daysAgo} days ago`}
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
  content: {
    fontSize: 20,
    fontWeight: "bold",
  },
});