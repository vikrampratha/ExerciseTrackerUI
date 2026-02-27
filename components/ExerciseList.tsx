import ExerciseCard from "@/components/ExerciseCard";
import NewExerciseCard from "@/components/NewExerciseCard";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

type Exercise = {
  id: string;
  name: string;
};

export default function ExerciseList() {
    const [exercises, setExercises] = useState<Exercise[]>([]);

    const handleAddExercise = () => {
        const newExercise: Exercise = {
            id: Date.now().toString(),
            name: `Exercise ${exercises.length + 1}`,
        };
        setExercises(prev => [...prev, newExercise]);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Exercises:</Text>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Existing exercises */}
        {exercises.map(exercise => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
        ))}

        {/* NewExerciseCard */}
        <NewExerciseCard onPress={handleAddExercise} />
        </ScrollView>
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