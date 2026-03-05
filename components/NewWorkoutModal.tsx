import ExerciseForm from "@/components/ExerciseForm";
import ExerciseList from "@/components/ExerciseList";
import type { NewExercise } from "@/hooks/useExerciseNames";
import { toWorkoutDTO, WorkoutDTO } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useMemo, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getWorkoutTypeColors, prettyWorkoutType } from "../utils/workoutStyles";

export type NewWorkoutType =
  | "PUSH"
  | "PULL"
  | "LEGS"
  | "UPPER_BODY"
  | "LOWER_BODY"
  | "FULL_BODY"
  | "CARDIO";

type Props = {
  visible: boolean;
  onClose: () => void;
  onConfirm: (dto: WorkoutDTO) => void;
  initialDate?: Date;
  initialType?: NewWorkoutType;
};

const TYPES: NewWorkoutType[] = [
  "PUSH",
  "PULL",
  "LEGS",
  "UPPER_BODY",
  "LOWER_BODY",
  "FULL_BODY",
  "CARDIO",
];

export default function NewWorkoutModal({
  visible,
  onClose,
  onConfirm,
  initialDate,
  initialType = "PUSH",
}: Props) {
  const insets = useSafeAreaInsets();

  const [date, setDate] = useState<Date>(initialDate ?? new Date());
  const [type, setType] = useState<NewWorkoutType>(initialType);
  const [showPicker, setShowPicker] = useState(false);

  const [exercises, setExercises] = useState<NewExercise[]>([]);
  const [showExerciseForm, setShowExerciseForm] = useState(false);

  const canSubmit = exercises.length > 0;

  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  const dateString = useMemo(() => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }, [date]);

  const handleConfirm = () => {
    const dto = toWorkoutDTO({ date: dateString, type, exercises });
    console.log("WorkoutDTO:", JSON.stringify(dto, null, 2));
    onConfirm(dto as any);
  };

  const handleClose = () => {
    setShowExerciseForm(false);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <View style={styles.sheetWrap}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.sheet}>
            {/* Header */}
            <View style={styles.header}>
              <Pressable onPress={handleClose} style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}>
                <Ionicons name="close" size={22} color="#FFFFFF" />
              </Pressable>

              <View style={styles.headerCenter}>
                <Text style={styles.headerTitle}>New Workout</Text>
              </View>
              <Pressable
                onPress={handleConfirm}
                disabled={!canSubmit}
                style={({ pressed }) => [
                    styles.iconBtn,
                    canSubmit && styles.iconBtnActive,
                    pressed && canSubmit && styles.pressed,
                ]}>
                <Ionicons
                    name="checkmark"
                    size={22}
                    color={canSubmit ? "#000000" : "#32D74B"}
                />
              </Pressable>
            </View>

            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : undefined}
              keyboardVerticalOffset={Platform.OS === "ios" ? insets.top + 20 : 0}
              style={{ flex: 1 }}
            >
              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.content}
              >
                {/* Date Section */}
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>DATE</Text>
                  {Platform.OS === "web" ? (
                    <WebDatePickerRow value={date} onChange={setDate} maximumDate={today} />
                  ) : (
                  <>
                  <Pressable
                    onPress={() => {
                        if (showExerciseForm) return;
                        setShowPicker(true);
                    }}
                    style={({ pressed }) => [
                        styles.inputRow,
                        showExerciseForm && styles.inputRowDisabled,
                        pressed && !showExerciseForm && styles.inputRowPressed]}
                  >
                    <Ionicons name="calendar-outline" size={18} color="#E5E5EA" />
                    <Text style={styles.inputText}>{dateString}</Text>
                    <Ionicons name="chevron-forward" size={18} color="#A1A1AA" />
                  </Pressable>

                  {showPicker ? (
                    <View style={styles.pickerWrap}>
                      <DateTimePicker
                        value={date}
                        mode="date"
                        display={Platform.OS === "ios" ? "spinner" : "default"}
                        onChange={(event, selected) => {
                          if (Platform.OS !== "ios") setShowPicker(false);
                          if (selected) setDate(selected);
                        }}
                        maximumDate={new Date()}
                        minimumDate={new Date(2020, 0, 1)}
                      />

                      {Platform.OS === "ios" ? (
                        <Pressable
                          onPress={() => setShowPicker(false)}
                          style={({ pressed }) => [styles.doneBtn, pressed && styles.pressed]}
                        >
                          <Text style={styles.doneBtnText}>Done</Text>
                        </Pressable>
                      ) : null}
                    </View>
                  ) : null}
                  </> )}
                </View>

                {/* Type Section */}
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>WORKOUT TYPE</Text>

                  <View style={styles.chipGrid}>
                    {TYPES.map((t) => {
                      const selected = t === type;
                      const { bg, fg } = getWorkoutTypeColors(t);

                      const chipBg = selected ? bg : fg;
                      const chipText = selected ? "#FFFFFF" : "#000000";
                      const borderColor = selected ? fg : "rgba(255,255,255,0.08)";

                      return (
                        <Pressable
                          key={t}
                          onPress={() => setType(t)}
                          style={({ pressed }) => [
                            styles.typeChip,
                            { backgroundColor: chipBg, borderColor },
                            pressed && styles.pressed,
                          ]}
                        >
                          <Text style={[styles.typeChipText, { color: chipText }]} numberOfLines={1}>
                            {prettyWorkoutType(t)}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>

                {/* Middle: + Exercise button OR ExerciseForm */}
                {!showExerciseForm ? (
                  <Pressable
                    onPress={() => {
                        setShowPicker(false);
                        setShowExerciseForm(true);
                    }}
                    style={({ pressed }) => [styles.addExerciseBig, pressed && styles.pressed]}
                  >
                    <Ionicons name="add" size={18} color="#FFFFFF" />
                    <Text style={styles.addExerciseBigText}>Exercise</Text>
                  </Pressable>
                ) : (
                  <ExerciseForm
                    visible
                    onCancel={() => setShowExerciseForm(false)}
                    onAdd={(ex) => setExercises((prev) => [...prev, ex])}
                  />
                )}

                {/* Bottom: exercise list only */}
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>EXERCISES</Text>
                  <ExerciseList 
                    exercises={exercises as any} 
                    emptyText="No exercises added yet." 
                    onDelete={(clientId) => setExercises((prev) => prev.filter((e) => e.clientId !== clientId))} />
                </View>

                <View style={{ height: 18 }} />
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </Modal>
  );
}

function toYMD(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function fromYMD(s: string) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function WebDatePickerRow({
  value,
  onChange,
  maximumDate,
}: {
  value: Date;
  onChange: (d: Date) => void;
  maximumDate: Date;
}) {
  const ymd = toYMD(value);
  const max = toYMD(maximumDate);

  return (
    <View style={styles.inputRow}>
      <Ionicons name="calendar-outline" size={18} color="#E5E5EA" />
      <Text style={styles.inputText}>{ymd}</Text>

      {/* Native browser date picker */}
      <input
        type="date"
        value={ymd}
        max={max}
        onChange={(e) => {
          const v = e.currentTarget.value;
          if (!v) return;
          onChange(fromYMD(v))
        }}
        style={{
          marginLeft: "auto",
          background: "#1C1C1E",
          color: "#FFFFFF",
          border: "1px solid rgba(255,255,255,0.10)",
          borderRadius: 999,
          padding: "8px 12px",
          fontWeight: 900,
          outline: "none",
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.55)" },
  sheetWrap: { flex: 1, justifyContent: "flex-end" },
  sheet: {
    backgroundColor: "#121214",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.45,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: -8 },
    elevation: 12,
    height: "92%",
  },

  header: { paddingTop: 12, paddingBottom: 10, paddingHorizontal: 14, flexDirection: "row", alignItems: "center" },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1C1C1E",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  iconBtnActive: {
    backgroundColor: "#32D74B",
    borderWidth: 0,
  },
  headerCenter: { flex: 1, alignItems: "center" },
  headerTitle: { color: "#FFFFFF", fontSize: 16, fontWeight: "900", letterSpacing: 0.2 },
  pressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },

  content: { paddingHorizontal: 16, paddingTop: 6, gap: 18, paddingBottom: 8 },

  section: {
    backgroundColor: "#1C1C1E",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    gap: 12,
  },

  sectionLabel: { fontSize: 12, fontWeight: "900", letterSpacing: 1, color: "#A1A1AA" },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: "#2C2C2E",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  inputRowPressed: { opacity: 0.92, transform: [{ scale: 0.99 }] },
  inputText: { flex: 1, color: "#FFFFFF", fontWeight: "800", fontSize: 14, letterSpacing: 0.2 },

  pickerWrap: {
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#2C2C2E",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center"
  },
  doneBtn: { alignSelf: "flex-end", paddingHorizontal: 14, paddingVertical: 10 },
  doneBtnText: { color: "#FFFFFF", fontWeight: "900", fontSize: 14 },

  chipGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  typeChip: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 999, borderWidth: 1 },
  typeChipText: { fontSize: 13, fontWeight: "900", letterSpacing: 0.2 },

  addExerciseBig: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: "#2C2C2E",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  addExerciseBigText: {
    color: "#FFFFFF",
    fontWeight: "900",
    letterSpacing: 0.2,
    fontSize: 14,
  },
  inputRowDisabled: {
    opacity: 0.55,
  },
});