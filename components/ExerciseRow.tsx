import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Exercise {
  name: string;
  sets?: number;
  reps?: number;
  weight?: number;
  duration?: number;
}

interface Props {
  exercise: Exercise;
  index: number;
}

export default function ExerciseRow({ exercise, index }: Props) {
  const middleText =
    exercise.duration
      ? `${exercise.duration} minutes`
      : `${exercise.sets} sets ${exercise.reps} reps`;

  return (
    <View style={styles.row}>
      {/* Number Circle */}
      <View style={styles.numberCircle}>
        <Text style={styles.numberText}>{index + 1}</Text>
      </View>

      {/* Exercise Name */}
      <Text style={styles.name}>{exercise.name}</Text>

      {/* Middle Text */}
      <Text style={styles.middle}>{middleText}</Text>

      {/* Weight */}
      <Text style={styles.weight}>
        {exercise.weight ? `${exercise.weight} lbs` : ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  numberCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  numberText: {
    color: '#ffd33d',
    fontSize: 12,
    fontWeight: '600',
  },
  name: {
    flex: 1,
    fontSize: 15,
    color: '#fff'
  },
  middle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    color: '#fff',
  },
  weight: {
    width: 70,
    textAlign: 'right',
    fontSize: 14,
    fontWeight: '500',
    color: '#fff'
  },
});