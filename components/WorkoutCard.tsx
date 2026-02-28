import React, { useState } from 'react';
import { LayoutAnimation, Platform, StyleSheet, UIManager, View } from 'react-native';
import ExerciseRow from './ExerciseRow';
import WorkoutHeader from './WorkoutHeader';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

interface Exercise {
  name: string;
  sets?: number;
  reps?: number;
  weight?: number;
  duration?: number;
}

interface Workout {
  id: number | string;
  type: string;
  date: string; // yyyy-mm-dd
  exercises: Exercise[];
}

interface Props {
  workout: Workout;
}

export default function WorkoutCard({ workout }: Props) {
  const [expanded, setExpanded] = useState(false);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(prev => !prev);
  };

  const [year, month, day] = workout.date.split('-');
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const formattedDate = `${monthNames[parseInt(month)-1]} ${parseInt(day)}, ${year}`;

  return (
    <View style={styles.card}>
      <WorkoutHeader
        date={formattedDate}
        type={workout.type}
        expanded={expanded}
        onPress={toggle}
      />

      {expanded && (
        <View style={styles.content}>
          {workout.exercises.map((ex, i) => (
            <ExerciseRow key={i} exercise={ex} index={i} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#31363d',
    borderRadius: 14,
    paddingHorizontal: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  content: {
    borderTopWidth: 1,
    borderTopColor: '#ffd33d',
    paddingTop: 8,
    paddingBottom: 8,
  },
});