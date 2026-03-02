import AddWorkoutModal from '@/components/AddWorkoutModal';
import CircleButton from '@/components/CircleButton';
import WorkoutCard from '@/components/WorkoutCard';
import WorkoutFilterBar from '@/components/WorkoutFilterBar';
import { useWorkouts } from '@/hooks/useWorkouts';
import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
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
  
  const onModalClose = () => {
    setIsModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
          <Text style={styles.kicker}>WORKOUTS</Text>
          <Text style={styles.title}>Workout History</Text>
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
      <View style={styles.fab}>
        <CircleButton onPress={onAdd} />
      </View>
      <AddWorkoutModal isVisible={isModalVisible} onClose={onModalClose} onConfirm={onModalClose}>
      </AddWorkoutModal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
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
});
