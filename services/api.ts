import axios from 'axios';

export const api = axios.create({
  //baseURL: 'http://localhost:8080',
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