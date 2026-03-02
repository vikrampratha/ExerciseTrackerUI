import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { getWorkoutTypeColors, prettyWorkoutType } from "../utils/workoutStyles";

type Workout = {
  date: string;
  type: string;
};

type Props = {
  lastWorkout: Workout | null;
};

export default function LastWorkoutCard({ lastWorkout }: Props) {
  const display = useMemo(() => {
    if (!lastWorkout) {
      return {
        hero: "—",
        subInline: "",
        typeText: null as string | null,
        typeBg: "#E5E5EA",
        typeFg: "#6E6E73",
      };
    }

    const last = new Date(lastWorkout.date + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffMs = today.getTime() - last.getTime();
    const days = Math.max(Math.floor(diffMs / (1000 * 60 * 60 * 24)), 0);

    const { bg, fg } = getWorkoutTypeColors(lastWorkout.type);

    if (days === 0) {
      return {
        hero: "Today",
        subInline: "",
        typeText: prettyWorkoutType(lastWorkout.type),
        typeBg: bg,
        typeFg: fg,
      };
    }

    if (days === 1) {
      return {
        hero: "Yesterday",
        subInline: "",
        typeText: prettyWorkoutType(lastWorkout.type),
        typeBg: bg,
        typeFg: fg,
      };
    }

    return {
      hero: String(days),
      subInline: ` days ago`,
      typeText: prettyWorkoutType(lastWorkout.type),
      typeBg: bg,
      typeFg: fg,
    };
  }, [lastWorkout]);

  const heroIsNumber = /^\d+$/.test(display.hero);

  return (
    <View style={styles.card}>
      <Text style={styles.label}>LAST WORKED OUT</Text>

      <View style={styles.heroRow}>
        <View style={styles.heroInline}>
          <Text
            style={[
              styles.hero,
              heroIsNumber ? styles.heroNumber : styles.heroWord,
            ]}
          >
            {display.hero}
          </Text>

          {display.subInline ? (
            <Text style={styles.inlineSub}>{display.subInline}</Text>
          ) : null}
        </View>

        {display.typeText ? (
          <View style={[styles.typePill, { backgroundColor: display.typeBg }]}>
            <Text
              style={[styles.typePillText, { color: display.typeFg }]}
              numberOfLines={1}
            >
              {display.typeText}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#F2F2F7",
    borderRadius: 24,
    padding: 20,

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

  heroRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  heroInline: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
    flexShrink: 1,
  },

  hero: {
    color: "#1C1C1E",
    fontWeight: "700",
  },

  heroNumber: {
    fontSize: 42,
  },

  heroWord: {
    fontSize: 30,
  },

  inlineSub: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6E6E73",
  },

  typePill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    maxWidth: "52%",

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  typePillText: {
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
});