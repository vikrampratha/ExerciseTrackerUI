import { WorkoutType } from '@/hooks/useWorkouts';
import axios from 'axios';

export type Exercise = {
  name: string;
  type?: string;
  sets?: number;
  reps?: number;
  weight?: number;
  duration?: number;
}

export type Workout = {
  id: string | number; // allowing string id for for easy tempId creation for optimistic updates
  date: string;
  type: string;
  exercises: Exercise[];
  isOptimistic?: boolean;
};

export type WorkoutDTO = {
  date: string;
  type: WorkoutType;
  exercises: Array<
    | { name: string; sets: number; reps: number }
    | { name: string; sets: number; reps: number; weight: number }
    | { name: string; duration: number }
  >;
};

export function toWorkoutDTO(payload: {
  date: string;
  type: WorkoutType;
  exercises: Exercise[];
}) {
  return {
    date: payload.date,
    type: payload.type,
    exercises: payload.exercises.map((ex) => {
      switch (ex.type) {
        case "STRENGTH":
          return { name: ex.name, sets: ex.sets, reps: ex.reps };
        case "WEIGHTED_STRENGTH":
          return { name: ex.name, sets: ex.sets, reps: ex.reps, weight: ex.weight };
        case "CARDIO":
          return { name: ex.name, duration: ex.duration };
      }
    }),
  };
}

export const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

export const postWorkout = async (payload: WorkoutDTO) => {
  const response = await api.post('/createWorkout', payload);
  return response.data;
};

export const getWorkouts = async () => {
    const response = await api.get<Workout[]>('getAllWorkouts');
    return response.data;
}