import { Ionicons } from "@expo/vector-icons";
import { nanoid } from "nanoid/non-secure";
import React, { useMemo, useState } from "react";
import { Keyboard, Platform, Pressable, StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";

import ExerciseSelectModal from "@/components/ExerciseSelectModal";
import type { ExerciseName, ExerciseType, NewExercise } from "@/hooks/useExerciseNames";
import { prettyExerciseName } from "@/utils/workoutStyles";

type Props = {
  visible: boolean;
  onCancel: () => void;
  onAdd: (exercise: NewExercise) => void;
};

export default function ExerciseForm({ visible, onCancel, onAdd }: Props) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedName, setSelectedName] = useState<ExerciseName | null>(null);

  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weightLbs, setWeightLbs] = useState("");
  const [durationMin, setDurationMin] = useState("");

  const canAdd = useMemo(() => {
    if (!selectedName) return false;
    if (selectedName.type === "STRENGTH") return isPosInt(sets) && isPosInt(reps);
    if (selectedName.type === "WEIGHTED_STRENGTH")
      return isPosInt(sets) && isPosInt(reps) && isPosNumber(weightLbs);
    if (selectedName.type === "CARDIO") return isPosInt(durationMin);
    return false;
  }, [selectedName, sets, reps, weightLbs, durationMin]);

  const reset = () => {
    setSelectedName(null);
    setSets("");
    setReps("");
    setWeightLbs("");
    setDurationMin("");
  };

  const handleCancel = () => {
    Keyboard.dismiss();
    reset();
    onCancel();
  };

  const handleAdd = () => {
    if (!selectedName) return;

    const clientId = nanoid();
    let ex: NewExercise;

    if (selectedName.type === "STRENGTH") {
      ex = {
        clientId,
        exerciseNameId: selectedName.id,
        name: selectedName.name,
        type: "STRENGTH",
        sets: parseInt(sets, 10),
        reps: parseInt(reps, 10),
      };
    } else if (selectedName.type === "WEIGHTED_STRENGTH") {
      ex = {
        clientId,
        exerciseNameId: selectedName.id,
        name: selectedName.name,
        type: "WEIGHTED_STRENGTH",
        sets: parseInt(sets, 10),
        reps: parseInt(reps, 10),
        weight: parseFloat(weightLbs),
      };
    } else {
      ex = {
        clientId,
        exerciseNameId: selectedName.id,
        name: selectedName.name,
        type: "CARDIO",
        duration: parseInt(durationMin, 10),
      };
    }

    Keyboard.dismiss();
    onAdd(ex);
    reset();
    onCancel();
  };

  if (!visible) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.label}>EXERCISE</Text>

      <Pressable
        onPress={() => setPickerOpen(true)}
        style={({ pressed }) => [styles.selectRow, pressed && styles.pressed]}
      >
        <Ionicons name="fitness-outline" size={18} color="#E5E5EA" />
        <Text style={styles.selectRowText} numberOfLines={1}>
          {selectedName ? prettyExerciseName(selectedName.name) : "Select exercise…"}
        </Text>
        <Ionicons name="chevron-forward" size={18} color="#A1A1AA" />
      </Pressable>

      <Text style={[styles.label, { marginTop: 12 }]}>DETAILS</Text>

      <View style={styles.detailsRow}>
        {!selectedName ? (
          <Text style={styles.muted}>Choose an exercise to enter details.</Text>
        ) : (
          <DetailsInputs
            type={selectedName.type}
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

      <View style={styles.actionsRow}>
        <Pressable onPress={handleCancel} style={({ pressed }) => [styles.btnGhost, pressed && styles.pressed]}>
          <Text style={styles.btnGhostText}>Cancel</Text>
        </Pressable>

        <Pressable
          onPress={handleAdd}
          disabled={!canAdd}
          style={({ pressed }) => [
            styles.btnPrimary,
            !canAdd && styles.btnDisabled,
            pressed && canAdd && styles.pressed,
          ]}
        >
          <Ionicons name="add" size={18} color={canAdd ? "#FFFFFF" : "#6B7280"} />
          <Text style={[styles.btnPrimaryText, { color: canAdd ? "#FFFFFF" : "#6B7280" }]}>
            Add
          </Text>
        </Pressable>
      </View>

      <ExerciseSelectModal
        visible={pickerOpen}
        onClose={() => setPickerOpen(false)}
        selectedId={selectedName?.id ?? null}
        onSelect={(en) => {
          setSelectedName(en);
          setSets("");
          setReps("");
          setWeightLbs("");
          setDurationMin("");
        }}
      />
    </View>
  );
}

function NumericTextInput(props: TextInputProps) {
  if (Platform.OS !== "web") {
    // iOS/Android: identical behavior + appearance
    return <TextInput {...props} />;
  }

  // Web: RN TextInput inside Modal/overlays can be non-typeable depending on layering.
  // Use a real input while preserving styling & controlled value.
  const {
    value,
    onChangeText,
    placeholder,
    style,
    keyboardType,
    ...rest
  } = props;

  const inputMode =
    keyboardType === "decimal-pad" ? "decimal" : "numeric";

  // @ts-ignore - web-only element
  return (
    <input
      value={(value ?? "") as string}
      placeholder={placeholder as string | undefined}
      inputMode={inputMode}
      onChange={(e) => onChangeText?.(e.currentTarget.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          (e.currentTarget as HTMLInputElement).blur();
          Keyboard.dismiss();
          // @ts-ignore
          rest.onSubmitEditing?.(e);
        }
      }}
      style={{
        background: (style as any)?.backgroundColor ?? "#2C2C2E",
        borderRadius: (style as any)?.borderRadius ?? 14,
        border: `1px solid ${(style as any)?.borderColor ?? "rgba(255,255,255,0.08)"}`,
        padding: "10px 12px",
        color: (style as any)?.color ?? "#FFFFFF",
        fontWeight: (style as any)?.fontWeight ?? 800,
        minWidth: (style as any)?.minWidth ?? 110,
        flexGrow: (style as any)?.flexGrow ?? 1,
        outline: "none",
        fontSize: 16,
      }}
    />
  );
}

function DetailsInputs(props: {
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
  const base = {
    placeholderTextColor: "#6B7280",
    style: styles.input,
    keyboardType: "number-pad" as const,
    returnKeyType: "done" as const,
    blurOnSubmit: true,
    onSubmitEditing: Keyboard.dismiss,
  };

  if (props.type === "STRENGTH") {
    return (
      <>
        <NumericTextInput {...base} placeholder="Sets" value={props.sets} onChangeText={props.setSets} />
        <NumericTextInput {...base} placeholder="Reps" value={props.reps} onChangeText={props.setReps} />
      </>
    );
  }

  if (props.type === "WEIGHTED_STRENGTH") {
    return (
      <>
        <NumericTextInput {...base} placeholder="Sets" value={props.sets} onChangeText={props.setSets} />
        <NumericTextInput {...base} placeholder="Reps" value={props.reps} onChangeText={props.setReps} />
        <NumericTextInput
          {...base}
          placeholder="Weight (lb)"
          value={props.weightLbs}
          onChangeText={props.setWeightLbs}
          keyboardType="decimal-pad"
        />
      </>
    );
  }

  return (
    <NumericTextInput
      {...base}
      placeholder="Duration (min)"
      value={props.durationMin}
      onChangeText={props.setDurationMin}
    />
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
  card: {
    backgroundColor: "#1C1C1E",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    gap: 10,
  },

  label: {
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1,
    color: "#A1A1AA",
  },

  selectRow: {
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
  selectRowText: {
    flex: 1,
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 14,
    letterSpacing: 0.2,
  },

  detailsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    alignItems: "center",
  },

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

  muted: {
    color: "#A1A1AA",
    fontWeight: "700",
  },

  actionsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 6,
  },

  btnGhost: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2C2C2E",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  btnGhostText: {
    color: "#E5E5EA",
    fontWeight: "900",
    letterSpacing: 0.2,
  },

  btnPrimary: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  btnPrimaryText: {
    fontWeight: "900",
    letterSpacing: 0.2,
  },
  btnDisabled: {
    opacity: 0.6,
  },

  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});