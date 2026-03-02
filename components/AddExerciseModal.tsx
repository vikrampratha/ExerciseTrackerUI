import { Ionicons } from "@expo/vector-icons";
import { nanoid } from "nanoid/non-secure";
import React, { useMemo, useState } from "react";
import {
    ActivityIndicator,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { ExerciseName, ExerciseType, NewExercise, useExerciseNames } from "../hooks/useExerciseNames";
import { prettyExerciseName } from "../utils/workoutStyles";

type Props = {
  visible: boolean;
  onClose: () => void;
  onAdd: (exercise: NewExercise) => void;
};

export default function AddExerciseModal({ visible, onClose, onAdd }: Props) {
  const { exerciseNames, loading, error, refetch } = useExerciseNames(visible);

  const [selected, setSelected] = useState<ExerciseName | null>(null);

  // inputs stored as strings then parsed
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weightLbs, setWeightLbs] = useState("");
  const [durationMin, setDurationMin] = useState("");

  const canConfirm = useMemo(() => {
    if (!selected) return false;

    if (selected.type === "STRENGTH") {
      return isPosInt(sets) && isPosInt(reps);
    }
    if (selected.type === "WEIGHTED_STRENGTH") {
      return isPosInt(sets) && isPosInt(reps) && isPosNumber(weightLbs);
    }
    if (selected.type === "CARDIO") {
      return isPosInt(durationMin);
    }
    return false;
  }, [selected, sets, reps, weightLbs, durationMin]);

  const confirm = () => {
    if (!selected) return;

    const clientId = nanoid();

    if (selected.type === "STRENGTH") {
      onAdd({
        clientId,
        exerciseNameId: selected.id,
        name: selected.name,
        type: "STRENGTH",
        sets: parseInt(sets, 10),
        reps: parseInt(reps, 10),
      });
    } else if (selected.type === "WEIGHTED_STRENGTH") {
      onAdd({
        clientId,
        exerciseNameId: selected.id,
        name: selected.name,
        type: "WEIGHTED_STRENGTH",
        sets: parseInt(sets, 10),
        reps: parseInt(reps, 10),
        weight: parseFloat(weightLbs),
      });
    } else {
      onAdd({
        clientId,
        exerciseNameId: selected.id,
        name: selected.name,
        type: "CARDIO",
        duration: parseInt(durationMin, 10),
      });
    }

    // reset local inputs (nice UX)
    setSelected(null);
    setSets("");
    setReps("");
    setWeightLbs("");
    setDurationMin("");
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <View style={styles.sheetWrap}>
        <TouchableWithoutFeedback>
          <View style={styles.sheet}>
            <View style={styles.header}>
              <Pressable onPress={onClose} style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}>
                <Ionicons name="close" size={22} color="#FFFFFF" />
              </Pressable>

              <View style={styles.headerCenter}>
                <Text style={styles.headerTitle}>Add Exercise</Text>
              </View>

              <Pressable
                onPress={confirm}
                disabled={!canConfirm}
                style={({ pressed }) => [
                  styles.iconBtn,
                  !canConfirm && styles.iconBtnDisabled,
                  pressed && canConfirm && styles.pressed,
                ]}
              >
                <Ionicons name="checkmark" size={22} color={canConfirm ? "#FFFFFF" : "#6B7280"} />
              </Pressable>
            </View>

            <View style={styles.content}>
              <Text style={styles.sectionLabel}>EXERCISE NAME</Text>

              <View style={styles.panel}>
                {loading ? (
                  <View style={styles.centerRow}>
                    <ActivityIndicator />
                    <Text style={styles.muted}>Loading…</Text>
                  </View>
                ) : error ? (
                  <View style={styles.centerRow}>
                    <Text style={styles.muted}>{error}</Text>
                    <Pressable onPress={refetch} style={({ pressed }) => [styles.retryBtn, pressed && styles.pressed]}>
                      <Text style={styles.retryText}>Retry</Text>
                    </Pressable>
                  </View>
                ) : (
                  <ScrollView style={{ maxHeight: 220 }} showsVerticalScrollIndicator={false}>
                    {exerciseNames.map((en) => {
                      const isSelected = selected?.id === en.id;
                      return (
                        <Pressable
                          key={en.id}
                          onPress={() => setSelected(en)}
                          style={({ pressed }) => [
                            styles.nameRow,
                            isSelected && styles.nameRowSelected,
                            pressed && styles.pressed,
                          ]}
                        >
                          <Text style={[styles.nameText, isSelected && styles.nameTextSelected]}>
                            {prettyExerciseName(en.name)}
                          </Text>
                          <Text style={styles.nameType}>{en.type.replace("_", " ")}</Text>
                        </Pressable>
                      );
                    })}
                  </ScrollView>
                )}
              </View>

              <Text style={[styles.sectionLabel, { marginTop: 16 }]}>DETAILS</Text>

              <View style={styles.panel}>
                {!selected ? (
                  <Text style={styles.muted}>Select an exercise first.</Text>
                ) : (
                  <DetailsForm
                    type={selected.type}
                    sets={sets}
                    reps={reps}
                    weightLbs={weightLbs}
                    durationMin={durationMin}
                    setSets={setSets}
                    setReps={setReps}
                    setWeightLbs={setWeightLbs}
                    setDurationMin={setDurationMin}
                  />
                )}
              </View>
            </View>

            <View style={{ height: 14 }} />
          </View>
        </TouchableWithoutFeedback>
      </View>
    </Modal>
  );
}

function DetailsForm(props: {
  type: ExerciseType;
  sets: string;
  reps: string;
  weightLbs: string;
  durationMin: string;
  setSets: (v: string) => void;
  setReps: (v: string) => void;
  setWeightLbs: (v: string) => void;
  setDurationMin: (v: string) => void;
}) {
  const inputProps = {
    placeholderTextColor: "#6B7280",
    style: styles.input,
    keyboardType: "numeric" as const,
  };

  if (props.type === "STRENGTH") {
    return (
      <View style={styles.formRow}>
        <TextInput {...inputProps} placeholder="Sets" value={props.sets} onChangeText={props.setSets} />
        <TextInput {...inputProps} placeholder="Reps" value={props.reps} onChangeText={props.setReps} />
      </View>
    );
  }

  if (props.type === "WEIGHTED_STRENGTH") {
    return (
      <View style={styles.formRow}>
        <TextInput {...inputProps} placeholder="Sets" value={props.sets} onChangeText={props.setSets} />
        <TextInput {...inputProps} placeholder="Reps" value={props.reps} onChangeText={props.setReps} />
        <TextInput {...inputProps} placeholder="Weight (lb)" value={props.weightLbs} onChangeText={props.setWeightLbs} />
      </View>
    );
  }

  return (
    <View style={styles.formRow}>
      <TextInput
        {...inputProps}
        placeholder="Duration (min)"
        value={props.durationMin}
        onChangeText={props.setDurationMin}
      />
    </View>
  );
}

function isPosInt(v: string) {
  const n = Number(v);
  return Number.isInteger(n) && n > 0;
}
function isPosNumber(v: string) {
  const n = Number(v);
  return Number.isFinite(n) && n > 0;
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
  iconBtnDisabled: { opacity: 0.6 },
  headerCenter: { flex: 1, alignItems: "center" },
  headerTitle: { color: "#FFFFFF", fontSize: 16, fontWeight: "900", letterSpacing: 0.2 },

  content: { paddingHorizontal: 16, paddingTop: 6 },

  sectionLabel: { fontSize: 12, fontWeight: "900", letterSpacing: 1, color: "#A1A1AA", marginBottom: 10 },

  panel: {
    backgroundColor: "#1C1C1E",
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    gap: 10,
  },

  centerRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 8 },
  muted: { color: "#A1A1AA", fontWeight: "700" },

  retryBtn: {
    marginLeft: "auto",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "#2C2C2E",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  retryText: { color: "#FFFFFF", fontWeight: "800", fontSize: 13 },

  nameRow: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 14,
    backgroundColor: "#2C2C2E",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 8,
  },
  nameRowSelected: { backgroundColor: "#3A3A3C", borderColor: "rgba(255,255,255,0.14)" },
  nameText: { color: "#FFFFFF", fontWeight: "800", flex: 1 },
  nameTextSelected: { color: "#FFFFFF" },
  nameType: { color: "#A1A1AA", fontWeight: "800", fontSize: 12 },

  formRow: { flexDirection: "row", gap: 10, flexWrap: "wrap" },
  input: {
    minWidth: 110,
    flexGrow: 1,
    backgroundColor: "#2C2C2E",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    color: "#FFFFFF",
    fontWeight: "800",
  },

  pressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
});