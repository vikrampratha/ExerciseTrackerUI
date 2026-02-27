import DatePicker from '@/components/DatePicker';
import ExerciseList from '@/components/ExerciseList';
import WorkoutTypePicker from '@/components/WorkoutTypePicker';
import { postWorkout } from '@/services/api';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { PropsWithChildren, useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

type Props = PropsWithChildren<{
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}>;

export default function AddWorkoutModal({ isVisible, onClose, onConfirm }: Props) {
    const insets = useSafeAreaInsets();

    const [date, setDate] = useState(new Date());
    const [type, setType] = useState<string>('PUSH');
    const [exercises, setExercises] = useState<Exercise[]>([]);

    useEffect(() => {
        if (!isVisible) {
            resetState();
        }
    }, [isVisible]);
    
    const resetState = () => {
        setDate(new Date());
        setType('PUSH');
        setExercises([]);
    };

    const handleAddExercise = (exercise: Exercise) => {
        setExercises(prev => [...prev, exercise]);
    };

    const handleSubmitWorkout = async () => {
        const formattedDate = date.toLocaleDateString('en-CA');

        const mapExerciseToDTO = (exercise: Exercise) => ({
            name: exercise.name,
            sets: exercise.sets,
            reps: exercise.reps,
            weight: exercise.weight,
            duration: exercise.duration,
        });

        const cleanDTO = (dto: any) =>
            Object.fromEntries(Object.entries(dto).filter(([_, value]) => value !== undefined)
        );

        const payload = {
            date: formattedDate,
            type: type,
            exercises: exercises.map(e => cleanDTO(mapExerciseToDTO(e))),
        };
        console.log(payload);
        try {
            const result = await postWorkout(payload);
            console.log('Workout saved:', result);
        } catch (error) {
            console.error('Error posting workout:', error);
        }
    }

    return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      {/* Dark Overlay */}
      <Pressable style={styles.overlay} onPress={onClose} />

      {/* Bottom Sheet */}
      <View
        style={[
          styles.container,
          { paddingBottom: insets.bottom },
        ]}
      >
        {/* Top Row */}
        <View style={styles.topRow}>
          <TouchableOpacity
            style={styles.circleButton}
            onPress={onClose}
          >
            <MaterialIcons name="close" size={22} color="#750705" />
          </TouchableOpacity>

          <Text style={styles.title}>New Workout</Text>

          <TouchableOpacity
            style={[styles.circleButton, styles.confirmButton]}
            onPress={handleSubmitWorkout}
          >
            <MaterialIcons name="check" size={22} color="#046420" />
          </TouchableOpacity>
        </View>
        <DatePicker
            value={date}
            onChange={setDate}
        ></DatePicker>
        <WorkoutTypePicker
            value={type}
            onChange={type => setType(type)}
        />
        <ExerciseList
            exercises={exercises}
            onAddExercise={handleAddExercise}
        >
        </ExerciseList>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },

  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '95%',
    backgroundColor: '#25292e',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  circleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#db5d5d',
    justifyContent: 'center',
    alignItems: 'center',
  },

  confirmButton: {
    backgroundColor: '#04e273',
  },

  handle: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 15,
  },

  title: {
    fontSize: 20,
    color: '#fff',
  },
});