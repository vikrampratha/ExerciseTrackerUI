import AddWorkoutModal from '@/components/AddWorkoutModal';
import CircleButton from '@/components/CircleButton';
import { api } from '@/services/api';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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

const typeColors: Record<string, string> = {
  PUSH: '#FF6B6B',
  PULL: '#4ECDC4',
  LEG: '#FFD93D',
  CARDIO: '#6A4C93',
  UPPER: '#FF9F1C',
  LOWER: '#1B998B',
  FULL: '#2EC4B6',
};

const ExerciseCard = ({ exercise }: { exercise: Exercise }) => {
  let displayText = exercise.name;
  if (exercise.sets && exercise.reps) displayText += ` ${exercise.sets}x${exercise.reps}`;
  if (exercise.weight) displayText += ` ${exercise.weight} lbs`;
  if (exercise.duration) displayText += ` ${exercise.duration} min`;

  return (
    <View style={styles.exerciseCard}>
      <Text>{displayText}</Text>
    </View>
  );
};

const WorkoutCard = ({ workout, expanded, onPress }: { workout: Workout; expanded: boolean; onPress: () => void;}) => {
  const [year, month, day] = workout.date.split('-');
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const formattedDate = `${monthNames[parseInt(month) - 1]} ${parseInt(day)}, ${year}`;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.date}>{formattedDate}</Text>
        <View style={[styles.badge, { backgroundColor: typeColors[workout.type] || '#888' }]}>
          <Text style={styles.badgeText}>{workout.type}</Text>
        </View>
      </View>

      {expanded && (
        <View style={styles.exercisesContainer}>
          {workout.exercises.map((ex, i) => (
            <ExerciseCard key={i} exercise={ex} />
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default function WorkoutsScreen() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [expandedIds, setExpandedIds] = useState<Set<string | number>>(new Set());
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  useEffect(() => {
    api.get('/workouts/recent')
      .then(res => setWorkouts(res.data))
      .catch(err => console.error(err));
  }, []);

  const toggleExpand = (id: number) => {
    setExpandedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const onAdd = () => {
    setIsModalVisible(true);
  };
  
  const onModalClose = () => {
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => 
        <WorkoutCard 
          workout={item} 
          expanded={expandedIds.has(item.id)}
          onPress={() => toggleExpand(item.id)} 
        />}
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 50,
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
    alignItems: 'center',
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
