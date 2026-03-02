import NewWorkoutModal from '@/components/NewWorkoutModal';
import WorkoutCard from '@/components/WorkoutCard';
import WorkoutFilterBar from '@/components/WorkoutFilterBar';
import { useWorkouts } from '@/hooks/useWorkouts';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WorkoutsScreen() {
  const { workouts, loading, error, types, selectedType, selectType } = useWorkouts();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const data = useMemo(() => workouts, [workouts]);

  const toggleExpanded = useCallback((id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  // collapse expanded card when filter changes
  React.useEffect(() => {
    setExpandedId(null);
  }, [selectedType]);

  const onAdd = () => {
    setIsModalVisible(true);
  };
  
  const onClose = () => {
    setIsModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Text style={styles.kicker}>WORKOUTS</Text>
          <Text style={styles.title}>Workout History</Text>
        </View>
        <Pressable onPress={onAdd} style={({ pressed }) => [styles.addBtn, pressed && styles.addBtnPressed]}>
          <Ionicons name="add" size={30} color="#FFFFFF" />
          <Text style={styles.addBtnText}>Add</Text>
        </Pressable>
        </View>
      </View>

      <WorkoutFilterBar
        types={types}
        selectedType={selectedType}
        onSelect={selectType}
      />
      {loading ? (
          <View style={styles.center}>
            <ActivityIndicator />
          </View>
        ) : error ? (
          <View style={styles.center}>
            <Text style={styles.error}>{error}</Text>
          </View>
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const id = item.id;
              const expanded = expandedId === id;

              return (
                <WorkoutCard
                  workout={item}
                  expanded={expanded}
                  onToggle={() => toggleExpanded(id)}
                />
              );
            }}
          />
        )}
      <NewWorkoutModal 
        visible={isModalVisible}
        onClose={onClose}
        onConfirm={onClose} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  headerLeft: {
    flex: 1,
    gap: 6,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    alignItems: 'center',
    left: 0,
    right: 0,
  },
  text: {
    color: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%'
  },
  type: {
    fontSize: 16,
    fontWeight: '600',
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  badgeText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    //alignItems: 'center',
  },
  exercisesContainer: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
  },
  exerciseCard: {
    backgroundColor: '#f9f9f9',
    padding: 8,
    borderRadius: 8,
    marginBottom: 6,
  },
  header: {
    paddingTop: 8,
    paddingBottom: 14,
    gap: 6,
  },
  kicker: {
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1.2,
    color: "#A1A1AA",
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  list: {
    paddingTop: 8,
    paddingBottom: 30,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  error: {
    color: "#FFFFFF",
    opacity: 0.85,
    fontWeight: "700",
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#1C1C1E",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },

  addBtnPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },

  addBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
});
