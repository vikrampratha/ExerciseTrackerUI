import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type Props = {
  onPress: () => void;
};

export default function NewExerciseCard({ onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.inner}>
        <MaterialIcons name="add" size={48} color="#ffd33d" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 120,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#ffd33d',
    borderStyle: 'dashed',
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#444c55',
  },
  inner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});