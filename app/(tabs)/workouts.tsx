import AddWorkoutModal from '@/components/AddWorkoutModal';
import CircleButton from '@/components/CircleButton';
import { api } from '@/services/api';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

type Workout = {
  id: number;
  date: string;
  type: string;
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

const WorkoutCard = ({ workout }: { workout: Workout }) => {
  const [year, month, day] = workout.date.split('-');
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const formattedDate = `${monthNames[parseInt(month) - 1]} ${parseInt(day)}, ${year}`;

  return (
    <View style={styles.card}>
      <Text style={styles.date}>{formattedDate}</Text>
      <View style={[styles.badge, { backgroundColor: typeColors[workout.type] || '#888' }]}>
        <Text style={styles.badgeText}>{workout.type}</Text>
      </View>
    </View>
  );
};

export default function WorkoutsScreen() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  useEffect(() => {
    api.get('/workouts/recent')
      .then(res => setWorkouts(res.data))
      .catch(err => console.error(err));
  }, []);

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
        renderItem={({ item }) => <WorkoutCard workout={item} />}
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
});
