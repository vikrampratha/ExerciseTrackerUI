import { Exercise, Workout } from '@/services/api';
import { getWorkoutTypeColors, prettyExerciseName, prettyWorkoutType } from '@/utils/workoutStyles';
import React, { useMemo } from 'react';
import { LayoutAnimation, Platform, StyleSheet, Text, TouchableOpacity, UIManager, View } from 'react-native';

function formatExerciseMeta(ex: Exercise) {
  switch (ex.type) {
    case "STRENGTH":
      return `${ex.sets} × ${ex.reps}`;
    case "WEIGHTED_STRENGTH":
      return `${ex.sets} × ${ex.reps} • ${ex.weight} lb`;
    case "CARDIO":
      return `${ex.duration} min`;
    default:
      return "";
  }
}

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

interface Props {
  workout: Workout;
  expanded: boolean;
  onToggle: () => void;
}

export default function WorkoutCard({ workout, expanded, onToggle }: Props) {

  const handlePress = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onToggle();
  };

  const { bg, fg } = getWorkoutTypeColors(workout.type);
  const typeText = prettyWorkoutType(workout.type);

  const formattedDate = useMemo(() => {
    return workout.date;
  }, [workout.date]);

  const exercises = workout.exercises ?? [];

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={handlePress} style={styles.card}>
      {/* Header */}
      <View style={styles.topRow}>
        <View style={styles.left}>
          <Text style={styles.date}>{formattedDate}</Text>
          <Text style={styles.subtle}>{expanded ? "Tap to collapse" : "Tap to expand"}</Text>
        </View>

        <View style={[styles.typePill, { backgroundColor: bg }]}>
          <Text style={[styles.typePillText, { color: fg }]} numberOfLines={1}>
            {typeText}
          </Text>
        </View>
      </View>

      {/* Expanded content */}
      {expanded ? (
        <View style={styles.expandArea}>
          <View style={styles.divider} />

          <Text style={styles.sectionLabel}>EXERCISES</Text>

          {exercises.length === 0 ? (
            <Text style={styles.empty}>No exercise details for this workout.</Text>
          ) : (
            <View style={styles.exerciseList}>
              {exercises.map((ex, idx) => (
                <View key={`${String(workout.id)}-${idx}-${ex.name}`} style={styles.exerciseRow}>
                  <View style={styles.numBadge}>
                    <Text style={styles.numText}>{idx + 1}</Text>
                  </View>

                  <Text style={styles.exerciseName} numberOfLines={1}>
                    {prettyExerciseName(ex.name)}
                  </Text>

                  <Text style={styles.exerciseMeta} numberOfLines={1}>
                    {formatExerciseMeta(ex)}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1C1C1E",
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,

    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "center",
  },

  left: {
    flex: 1,
    gap: 4,
  },

  date: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  subtle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#A1A1AA",
  },

  typePill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    maxWidth: "48%",
  },

  typePillText: {
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0.2,
  },

  expandArea: {
    marginTop: 12,
  },

  divider: {
    height: 1,
    backgroundColor: "#2C2C2E",
    marginBottom: 12,
  },

  sectionLabel: {
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1,
    color: "#A1A1AA",
    marginBottom: 10,
  },

  empty: {
    fontSize: 14,
    color: "#A1A1AA",
    lineHeight: 20,
  },

  exerciseList: {
    gap: 10,
  },

  exerciseRow: {
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

  exerciseName: {
    flex: 1,
    color: "#E5E5EA",
    fontSize: 14,
    fontWeight: "700",
  },

  exerciseMeta: {
    color: "#A1A1AA",
    fontSize: 13,
    fontWeight: "700",
  },
});