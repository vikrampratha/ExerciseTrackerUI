import { StyleSheet, Text, View } from "react-native";

type ExerciseType = 'STRENGTH' | 'WEIGHTED_STRENGTH' | 'CARDIO';

type Exercise = {
  id: string;
  exerciseNameId: number
  name: string;
  type: ExerciseType;

  sets?: number;
  reps?: number;
  weight?: number;
  duration?: number;
};

type Props = {
  exercise: Exercise
};

export default function ExerciseCard({ exercise }: Props) {
  const formatExerciseDisplay = (exercise: Exercise) => {
    switch (exercise.type) {
        case 'STRENGTH':
        return `${exercise.name} ${exercise.sets}x${exercise.reps}`;

        case 'WEIGHTED_STRENGTH':
        return `${exercise.name} ${exercise.sets}x${exercise.reps} ${exercise.weight} lbs`;

        case 'CARDIO':
        return `${exercise.name} ${exercise.duration} min`;

        default:
        return exercise.name;
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{formatExerciseDisplay(exercise)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#444c55',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ffd33d',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff'
  },
});