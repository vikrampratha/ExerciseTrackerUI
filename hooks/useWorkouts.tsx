import { api } from "@/services/api";
import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";

export type WorkoutType =
  | "PUSH"
  | "PULL"
  | "LEGS"
  | "UPPER_BODY"
  | "LOWER_BODY"
  | "FULL_BODY"
  | "CARDIO";

export type Exercise = {
  name: string;
  sets?: number;
  reps?: number;
  weight?: number;
  duration?: number;
}
export type Workout = {
  id: number;
  date: string;
  type: string;
  exercises: Exercise[];
};

export type WorkoutFilterType = "ALL" | WorkoutType;

export function useWorkouts() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<WorkoutFilterType>("ALL");

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

  const types: WorkoutFilterType[] = useMemo(
    () => ["ALL", "PUSH", "PULL", "LEGS", "UPPER_BODY", "LOWER_BODY", "FULL_BODY", "CARDIO"],
    []
  );

  const filteredWorkouts = useMemo(() => {
    if (selectedType === "ALL") return workouts;
    return workouts.filter((w) => w.type === selectedType);
  }, [workouts, selectedType]);

  const sortedWorkouts = useMemo(() => {
    return [...filteredWorkouts].sort((a, b) => {
      const ta = new Date(a.date + "T00:00:00").getTime();
      const tb = new Date(b.date + "T00:00:00").getTime();
      return tb - ta;
    });
  }, [filteredWorkouts]);

  const selectType = useCallback((t: WorkoutFilterType) => {
    setSelectedType(t);
  }, []);

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
    workouts: sortedWorkouts,
    lastWorkout,
    lastWorkoutDate: lastWorkout?.date ?? null,
    thisWeekSummary,
    thisMonthSummary,
    loading,
    error,
    refetch: fetchWorkouts,
    types,
    selectedType,
    selectType
  };
}