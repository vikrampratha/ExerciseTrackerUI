import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ExerciseName, useExerciseNames } from "../hooks/useExerciseNames";
import { prettyExerciseName } from "../utils/workoutStyles";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelect: (exerciseName: ExerciseName) => void;
  selectedId?: number | null;
};

export default function ExerciseSelectModal({ visible, onClose, onSelect, selectedId }: Props) {
  const { exerciseNames, loading, error, refetch } = useExerciseNames(visible);
  const [query, setQuery] = useState("");

  const translateX = useRef(new Animated.Value(420)).current;

  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (visible) {
      translateX.setValue(420);
      Animated.timing(translateX, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, translateX]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return exerciseNames;
    return exerciseNames.filter((e) => prettyExerciseName(e.name).toLowerCase().includes(q));
  }, [exerciseNames, query]);

  const closeAnimated = () => {
    Animated.timing(translateX, {
      toValue: 420,
      duration: 180,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) onClose();
    });
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={closeAnimated}>
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={closeAnimated}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      {/* Right sheet */}
      <Animated.View style={[styles.panel,{ paddingTop: insets.top + 12, transform: [{ translateX }] },]}>
        <View style={styles.header}>
          <Pressable onPress={closeAnimated} style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}>
            <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
          </Pressable>

          <Text style={styles.title}>Select Exercise</Text>

          <View style={{ width: 40 }} />
        </View>

        {/* Search */}
        <View style={styles.searchRow}>
          <Ionicons name="search" size={16} color="#A1A1AA" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search exercises…"
            placeholderTextColor="#6B7280"
            style={styles.searchInput}
          />
          {query.length > 0 ? (
            <Pressable onPress={() => setQuery("")} style={({ pressed }) => [styles.clearIcon, pressed && styles.pressed]}>
              <Ionicons name="close-circle" size={18} color="#A1A1AA" />
            </Pressable>
          ) : null}
        </View>

        {/* List */}
        <View style={styles.listWrap}>
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
          ) : filtered.length === 0 ? (
            <Text style={styles.muted}>No matches.</Text>
          ) : (
            <View style={{ gap: 10 }}>
              {filtered.map((en) => {
                const isSelected = selectedId != null && en.id === selectedId;
                return (
                  <Pressable
                    key={en.id}
                    onPress={() => {
                      onSelect(en);
                      closeAnimated();
                    }}
                    style={({ pressed }) => [
                      styles.row,
                      isSelected && styles.rowSelected,
                      pressed && styles.pressed,
                    ]}
                  >
                    <View style={{ flex: 1, gap: 4 }}>
                      <Text style={styles.rowTitle} numberOfLines={1}>
                        {prettyExerciseName(en.name)}
                      </Text>
                      <Text style={styles.rowSub}>{en.type.replace("_", " ")}</Text>
                    </View>

                    {isSelected ? (
                      <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                    ) : (
                      <Ionicons name="chevron-forward" size={18} color="#A1A1AA" />
                    )}
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.55)",
  },

  panel: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: "92%",
    maxWidth: 420,
    backgroundColor: "#121214",
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,

    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 24,
    shadowOffset: { width: -10, height: 0 },
    elevation: 18,

    //paddingTop: 16,
    paddingHorizontal: 14,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingBottom: 12,
  },

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

  title: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 0.2,
  },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: "#1C1C1E",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    marginBottom: 12,
  },

  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    fontWeight: "800",
  },

  clearIcon: { padding: 2 },

  listWrap: {
    flex: 1,
    paddingTop: 6,
  },

  row: {
    backgroundColor: "#1C1C1E",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  rowSelected: {
    borderColor: "rgba(255,255,255,0.22)",
    backgroundColor: "#2C2C2E",
  },

  rowTitle: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 14,
  },

  rowSub: {
    color: "#A1A1AA",
    fontWeight: "800",
    fontSize: 12,
  },

  centerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
  },

  muted: {
    color: "#A1A1AA",
    fontWeight: "700",
  },

  retryBtn: {
    marginLeft: "auto",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "#2C2C2E",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  retryText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 13,
  },

  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});