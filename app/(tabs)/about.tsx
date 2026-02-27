import CircleButton from '@/components/CircleButton';
import { StyleSheet, Text, View } from 'react-native';

const onAdd = () => {
  //TODO
};

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>About screen</Text>
      <View style={styles.fab}>
        <CircleButton onPress={onAdd} />
      </View>
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
