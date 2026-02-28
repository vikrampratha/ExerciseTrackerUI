import axios from 'axios';

export interface Workout {
  id: number;
  date: string;
  type: string;
  //exercises: Exercise[];
};

export const api = axios.create({
  baseURL: 'http://192.168.1.151:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

export const postWorkout = async (payload: any) => {
  const response = await api.post('/createWorkout', payload);
  return response.data;
};

export const getWorkouts = async () => {
    const response = await api.get<Workout[]>('getAllWorkouts');
    return response.data;
}