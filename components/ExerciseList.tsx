import { NewExercise } from "@/hooks/useExerciseNames";
import { Exercise } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { prettyExerciseName } from "../utils/workoutStyles";

export type ExerciseType = "STRENGTH" | "WEIGHTED_STRENGTH" | "CARDIO";

type Props = {
  exercises: NewExercise[];
  emptyText?: string;
  onDelete?: (clientId: string) => void; 
};

export default function ExerciseList({ exercises, emptyText = "No exercises added yet.", onDelete}: Props) {
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

          {onDelete ? (
            <Pressable
              onPress={() => onDelete(ex.clientId)}
              hitSlop={10}
              style={({ pressed }) => [styles.deleteBtn, pressed && styles.pressed]}
            >
              <Ionicons name="trash-outline" size={18} color="#FF453A" />
            </Pressable>
          ) : null}
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
  deleteBtn: {
    width: 34,
    height: 34,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2C2C2E",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  pressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
});