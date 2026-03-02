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

          // "ALL" gets a neutral style; other types use palette
          const palette =
            t === "ALL" ? { bg: "#2C2C2E", fg: "#FFFFFF" } : getWorkoutTypeColors(t as WorkoutType);

          const backgroundColor = isSelected ? palette.fg : "#2C2C2E";
          const borderColor = isSelected ? palette.fg : "#3A3A3C";
          const textColor = isSelected ? "#000000" : "#E5E5EA";

          // For ALL selected, invert a bit so it reads well
          const allSelectedTextColor = "#FFFFFF";

          const labelText = t === "ALL" ? "All" : prettyWorkoutType(t);

          return (
            <TouchableOpacity
              key={t}
              onPress={() => onSelect(t)}
              activeOpacity={0.85}
              style={[styles.chip, { backgroundColor, borderColor }]}
            >
              <Text
                style={[
                  styles.chipText,
                  { color: t === "ALL" ? (isSelected ? allSelectedTextColor : "#E5E5EA") : textColor },
                ]}
              >
                {labelText}
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
});