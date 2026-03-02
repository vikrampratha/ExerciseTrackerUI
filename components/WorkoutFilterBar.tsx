import { WorkoutFilterType, WorkoutType } from '@/hooks/useWorkouts';
import { getWorkoutTypeColors, prettyWorkoutType } from '@/utils/workoutStyles';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  types: WorkoutFilterType[];
  selectedType: WorkoutFilterType;
  onSelect: (t: WorkoutFilterType) => void;
};


export default function WorkoutFilterBar({ types, selectedType, onSelect }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>FILTER</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {types.map((t) => {
          const isSelected = selectedType === t;

          if (t === "ALL") {
            return (
              <TouchableOpacity
                key={t}
                onPress={() => onSelect(t)}
                activeOpacity={0.85}
                style={[
                  styles.chip,
                  isSelected ? styles.allSelected : styles.allUnselected,
                  {borderColor: "#E5E5EA"}
                ]}
              >
                <Text style={[styles.chipText, { color: isSelected ? "#E5E5EA": "#000000" }]}>
                  All
                </Text>
              </TouchableOpacity>
            );
          }

          const { bg, fg } = getWorkoutTypeColors(t as WorkoutType);
          const backgroundColor = isSelected ? bg : fg;
          const textColor = isSelected ? fg: "#000000";
          const borderColor = isSelected ? fg : "rgba(255,255,255,0.08)";

          return (
            <TouchableOpacity
              key={t}
              onPress={() => onSelect(t)}
              activeOpacity={0.85}
              style={[styles.chip, { backgroundColor, borderColor }]}
            >
              <Text style={[styles.chipText, { color: textColor }]}>
                {prettyWorkoutType(t)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <Text style={styles.hint}>
        {selectedType === "ALL" ? "Showing all workouts" : `Filtered: ${prettyWorkoutType(selectedType)}`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1,
    color: "#A1A1AA",
    marginBottom: 10,
  },
  row: {
    gap: 10,
    paddingRight: 4,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  hint: {
    marginTop: 10,
    fontSize: 12,
    color: "#A1A1AA",
  },
  allSelected: {
    backgroundColor: "#2C2C2E",
    borderColor: "rgba(255,255,255,0.10)",
  },
  allUnselected: {
    backgroundColor: "#FFFFFF",
    borderColor: "#FFFFFF",
  },
});