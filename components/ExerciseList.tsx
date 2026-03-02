import { NewExercise } from "@/hooks/useExerciseNames";
import { Exercise } from "@/services/api";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { prettyExerciseName } from "../utils/workoutStyles";

export type ExerciseType = "STRENGTH" | "WEIGHTED_STRENGTH" | "CARDIO";

type Props = {
  exercises: NewExercise[];
  emptyText?: string;
};

export default function ExerciseList({ exercises, emptyText = "No exercises added yet." }: Props) {
  if (exercises.length === 0) {
    return <Text style={styles.empty}>{emptyText}</Text>;
  }

  return (
    <View style={styles.list}>
      {exercises.map((ex, idx) => (
        <View key={`${ex.clientId}`} style={styles.row}>
          <View style={styles.numBadge}>
            <Text style={styles.numText}>{idx + 1}</Text>
          </View>

          <Text style={styles.name} numberOfLines={1}>
            {prettyExerciseName(ex.name)}
          </Text>

          <Text style={styles.meta} numberOfLines={1}>
            {formatMeta(ex)}
          </Text>
        </View>
      ))}
    </View>
  );
}

function formatMeta(ex: Exercise) {
  switch (ex.type) {
    case "STRENGTH":
      return `${ex.sets} × ${ex.reps}`;
    case "WEIGHTED_STRENGTH":
      return `${ex.sets} × ${ex.reps} • ${ex.weight} lb`;
    case "CARDIO":
      return `${ex.duration} min`;
  }
}

const styles = StyleSheet.create({
  list: {
    gap: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  numBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#2C2C2E",
    alignItems: "center",
    justifyContent: "center",
  },
  numText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 12,
  },
  name: {
    flex: 1,
    color: "#E5E5EA",
    fontSize: 14,
    fontWeight: "800",
  },
  meta: {
    color: "#A1A1AA",
    fontSize: 13,
    fontWeight: "700",
  },
  empty: {
    color: "#A1A1AA",
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
  },
});