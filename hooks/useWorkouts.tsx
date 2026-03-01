import { api } from "@/services/api";
import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";

export type Workout = {
  id: number;
  date: string; // ISO string from backend
  type: string;
};

export function useWorkouts() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get<Workout[]>("/getAllWorkouts");
      setWorkouts(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch workouts");
    } finally {
      setLoading(false);
    }
  };

  // Auto refresh when tab becomes active (Expo Router)
  useFocusEffect(
    useCallback(() => {
      fetchWorkouts();
    }, [])
  );

  const lastWorkout = useMemo(() => {
    if (workouts.length === 0) return null;

    return workouts.reduce((latest, current) =>
      new Date(current.date) > new Date(latest.date)
        ? current
        : latest
    );
  }, [workouts]);

  return {
    workouts,
    lastWorkout,
    lastWorkoutDate: lastWorkout?.date ?? null,
    loading,
    error,
    refetch: fetchWorkouts,
  };
}