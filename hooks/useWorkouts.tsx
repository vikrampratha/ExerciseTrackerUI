import { api } from "@/services/api";
import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";

export type Workout = {
  id: number;
  date: string;
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

  const thisWeekSummary = useMemo(() => {
    const now = new Date();

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const grouped: Record<string, number> = {};

    workouts.forEach(workout => {
        // Force local parsing
        const workoutDate = new Date(workout.date + "T00:00:00");
        if (workoutDate >= startOfWeek) {
            const type = workout.type.toUpperCase();
            grouped[type] = (grouped[type] || 0) + 1;
        }
    });

    return grouped;
  }, [workouts]);

const thisMonthSummary = useMemo(() => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const workoutsThisMonth = workouts.filter(workout => {
    const date = new Date(workout.date + "T00:00:00");
    return (
      date.getFullYear() === currentYear &&
      date.getMonth() === currentMonth
    );
  });

  const monthlyCount = workoutsThisMonth.length;
  const dayOfMonth = now.getDate();
  const weeksElapsed = Math.ceil(dayOfMonth / 7);

  const avgPerWeek =
    weeksElapsed > 0
      ? +(monthlyCount / weeksElapsed).toFixed(1)
      : 0;

  return {
    monthlyCount,
    avgPerWeek,
  };
}, [workouts]);

  return {
    workouts,
    lastWorkout,
    lastWorkoutDate: lastWorkout?.date ?? null,
    thisWeekSummary,
    thisMonthSummary,
    loading,
    error,
    refetch: fetchWorkouts,
  };
}