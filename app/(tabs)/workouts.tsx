import AddWorkoutModal from '@/components/AddWorkoutModal';
import CircleButton from '@/components/CircleButton';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function WorkoutsScreen() {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const onAdd = () => {
    setIsModalVisible(true);
  };
  
  const onModalClose = () => {
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Workouts screen</Text>
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
});
