import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { getWorkoutTypeColors, prettyWorkoutType } from "../utils/workoutStyles";

type Props = {
  summary: Record<string, number>;
};

type Row = { type: string; count: number };

export default function ThisWeekCard({ summary }: Props) {
  const rows: Row[] = useMemo(() => {
    return Object.entries(summary)
      .map(([type, count]) => ({ type, count }))
      .filter((r) => r.count > 0)
      .sort((a, b) => (b.count !== a.count ? b.count - a.count : a.type.localeCompare(b.type)))
      .slice(0, 4);
  }, [summary]);

  const total = useMemo(() => rows.reduce((acc, r) => acc + r.count, 0), [rows]);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.label}>THIS WEEK</Text>
        <Text style={styles.totalPill}>
          {total} <Text style={styles.totalPillSub}>total</Text>
        </Text>
      </View>

      <View style={styles.divider} />

      {rows.length === 0 ? (
        <Text style={styles.empty}>No workouts yet</Text>
      ) : (
        <View>
          {rows.map((r, idx) => {
            const { bg, fg } = getWorkoutTypeColors(r.type);

            return (
              <View key={r.type}>
                <View style={styles.row}>
                  <View style={[styles.typePill, { backgroundColor: bg }]}>
                    <Text style={[styles.typePillText, { color: fg }]} numberOfLines={1}>
                      {prettyWorkoutType(r.type)}
                    </Text>
                  </View>

                  <View style={styles.countPill}>
                    <Text style={styles.countText}>{r.count}</Text>
                  </View>
                </View>

                {idx < rows.length - 1 ? <View style={styles.rowDivider} /> : null}
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#8E8E93",
    letterSpacing: 1,
  },

  totalPill: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1C1C1E",
    backgroundColor: "#E5E5EA",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    overflow: "hidden",
  },
  totalPillSub: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6E6E73",
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E5EA",
    marginVertical: 14,
  },

  empty: {
    fontSize: 16,
    color: "#6E6E73",
    lineHeight: 22,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    gap: 12,
  },

  typePill: {
    maxWidth: "70%",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
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

  countPill: {
    minWidth: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  countText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1C1C1E",
  },

  rowDivider: {
    height: 1,
    backgroundColor: "#E5E5EA",
    opacity: 0.6,
  },
});