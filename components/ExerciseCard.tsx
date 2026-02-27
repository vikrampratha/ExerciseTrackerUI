import { StyleSheet, Text, View } from "react-native";

type Props = {
  exercise: {
    id: string;
    name: string;
  };
};

export default function ExerciseCard({ exercise }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{exercise.name}</Text>
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