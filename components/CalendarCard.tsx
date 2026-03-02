import { getWorkoutTypeColors } from "@/utils/workoutStyles";
import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";

type Workout = {
  date: string;
  type: string;
};

type Props = {
  workouts: Workout[];
};

export default function CalendarCard({ workouts }: Props) {

  const markedDates = useMemo(() => {
    const marks: Record<string, any> = {};

    workouts.forEach((w) => {
        const { bg } = getWorkoutTypeColors(w.type);
        marks[w.date] = {
            customStyles: {
                container: {
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: bg,
                },
                text: {
                    color: "#FFFFFF",
                    fontWeight: "700",
                    fontSize: 12,
                },
            },
        };
    });

    return marks;
  }, [workouts]);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.label}>ACTIVITY</Text>
        </View>

        <Text style={styles.chip}>
          {workouts.length}{" "}
          <Text style={styles.chipSub}>total</Text>
        </Text>
      </View>

      <View style={styles.calendarWrap}>
        <Calendar
            markingType="custom"
            markedDates={markedDates}
            hideExtraDays
            theme={{
                backgroundColor: "transparent",
                calendarBackground: "transparent",

                textMonthFontSize: 20,
                // textMonthFontWeight: "700",

                // textDayFontSize: 12,
                // textDayFontWeight: "600",

                // textDayHeaderFontSize: 10,
                // textDayHeaderFontWeight: "600",

                monthTextColor: "#FFFFFF",
                dayTextColor: "#FFFFFF",
                textSectionTitleColor: "#A1A1AA",
                textDisabledColor: "#52525B",
                todayTextColor: "#FF3B30",
                arrowColor: "#FFFFFF",
            } as any}

            style={{ paddingTop: 0, paddingBottom: 0 }}
            />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1C1C1E",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#A1A1AA",
    letterSpacing: 1,
  },

  title: {
    marginTop: 6,
    fontSize: 20,
    fontWeight: "700",
    color: "#1C1C1E",
  },

  chip: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
    backgroundColor: "#2C2C2E",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },

  chipSub: {
    fontSize: 12,
    fontWeight: "500",
    color: "#A1A1AA",
  },

  calendarWrap: {
    borderRadius: 18,
    backgroundColor: "#2C2C2E",
    padding: 10,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  footer: {
    marginTop: 12,
    fontSize: 14,
    color: "#6E6E73",
  },
});