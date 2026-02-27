import ExerciseCard from "@/components/ExerciseCard";
import ExerciseForm from "@/components/ExerciseForm";
import NewExerciseCard from "@/components/NewExerciseCard";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

type Exercise = {
  id: string;
  exerciseNameId: number
  name: string;
};

type ExerciseName = {
  id: number;
  name: string;
};

export default function ExerciseList() {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [mode, setMode] = useState<'list' | 'form'>('list');

    const handleAddExercise = (exerciseName: ExerciseName) => {
        const newExercise: Exercise = {
            id: Date.now().toString(),
            exerciseNameId: exerciseName.id,
            name: exerciseName.name,
        };
        setExercises(prev => [...prev, newExercise]);
        setMode('list');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Exercises:</Text>
            {mode === 'list' ? (
                <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
                    {/* Existing exercises */}
                    {exercises.map(exercise => (
                        <ExerciseCard key={exercise.id} exercise={exercise} />
                    ))}
                    {/* NewExerciseCard */}
                    <NewExerciseCard onPress={() => setMode('form')} />
                </ScrollView>
            ) : (
                <ExerciseForm
                    onCancel={() => setMode('list')}
                    onAdd={(handleAddExercise)}
                />
            )}
            

        </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    backgroundColor: '#31363d',
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  label: {
    fontSize: 18,
    marginLeft: 10,
    marginBottom: 15,
    color: '#fff',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
});