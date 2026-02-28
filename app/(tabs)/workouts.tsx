import AddWorkoutModal from '@/components/AddWorkoutModal';
import CircleButton from '@/components/CircleButton';
import WorkoutCard from '@/components/WorkoutCard';
import WorkoutFilterBar from '@/components/WorkoutFilterBar';
import { api } from '@/services/api';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

interface Exercise {
  name: string;
  sets?: number;
  reps?: number;
  weight?: number;
  duration?: number;
}

type Workout = {
  id: number;
  date: string;
  type: string;
  exercises: Exercise[];
};

export default function WorkoutsScreen() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [expandedId, setExpandedId] = useState<string | number | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  useEffect(() => {
    api.get('/workouts/recent')
      .then(res => setWorkouts(res.data))
      .catch(err => console.error(err));
  }, []);

  const toggleExpand = (id: number) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const filteredWorkouts = selectedFilter
    ? workouts.filter(w => w.type === selectedFilter)
    : workouts;

  const onAdd = () => {
    setIsModalVisible(true);
  };
  
  const onModalClose = () => {
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <WorkoutFilterBar
        selected={selectedFilter}
        onSelect={setSelectedFilter}
      />
      <FlatList
        data={filteredWorkouts}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={({ item }) => 
          <WorkoutCard 
            workout={item} 
            expanded={expandedId === item.id}
            onToggle={() => toggleExpand(item.id)}
          />
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      <View style={styles.fab}>
        <CircleButton onPress={onAdd} />
      </View>
      <AddWorkoutModal isVisible={isModalVisible} onClose={onModalClose} onConfirm={onModalClose}>
      </AddWorkoutModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
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
});
