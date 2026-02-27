import ExercisePicker from "@/components/ExercisePicker";
import { api } from "@/services/api";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type ExerciseName = {
  id: number;
  name: string;
};

type Props = {
  onAdd: (exercise: ExerciseName) => void;
  onCancel: () => void;
};

export default function ExerciseForm({ onAdd, onCancel }: Props) {
  const [exerciseNames, setExerciseNames] = useState<ExerciseName[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseName | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExerciseNames();
  }, []);

  const fetchExerciseNames = async () => {
    try {
      const response = await api.get<ExerciseName[]>('/exerciseNames');
      setExerciseNames(response.data);
      if (response.data.length > 0) {
        setSelectedExercise(response.data[0]);
      }
    } catch (error) {
      console.error('Failed to fetch exercise names:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAdd = () => {
    if (!selectedExercise) return;
    onAdd(selectedExercise);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* <Text style={styles.label}>Name</Text> */}

      <ExercisePicker
        data={exerciseNames}
        selected={selectedExercise}
        onSelect={setSelectedExercise}
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
          <Text style={styles.addText}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    marginLeft: 10,
    color: '#fff',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 16,
    overflow: 'hidden',
  },
  picker: {
    height: 200,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#eee',
    alignItems: 'center',
  },
  addButton: {
    flex: 1,
    marginLeft: 8,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  cancelText: {
    fontWeight: '600',
  },
  addText: {
    color: '#fff',
    fontWeight: '600',
  },
});