import { useWorkoutsStore } from "@/contexts/WorkoutsContext";
import { useCallback, useMemo, useState } from "react";

export type WorkoutType =
  | "PUSH"
  | "PULL"
  | "LEGS"
  | "UPPER_BODY"
  | "LOWER_BODY"
  | "FULL_BODY"
  | "CARDIO";

export type WorkoutFilterType = "ALL" | WorkoutType;

export function useWorkouts() {
  const { workoutsRaw, loading, error, refetch, createWorkout } = useWorkoutsStore();

  const [selectedType, setSelectedType] = useState<WorkoutFilterType>("ALL");

  const types: WorkoutFilterType[] = useMemo(
    () => ["ALL", "PUSH", "PULL", "LEGS", "UPPER_BODY", "LOWER_BODY", "FULL_BODY", "CARDIO"],
    []
  );

  const filteredWorkouts = useMemo(() => {
    if (selectedType === "ALL") return workoutsRaw;
    return workoutsRaw.filter((w) => w.type === selectedType);
  }, [workoutsRaw, selectedType]);

  const sortedWorkouts = useMemo(() => {
    return [...filteredWorkouts].sort((a, b) => {
      const ta = new Date(a.date + "T00:00:00").getTime();
      const tb = new Date(b.date + "T00:00:00").getTime();
      return tb - ta;
    });
  }, [filteredWorkouts]);

  const selectType = useCallback((t: WorkoutFilterType) => setSelectedType(t), []);

  const lastWorkout = useMemo(() => {
    if (workoutsRaw.length === 0) return null;
    return workoutsRaw.reduce((latest, current) => {
      const a = new Date(current.date + "T00:00:00").getTime();
      const b = new Date(latest.date + "T00:00:00").getTime();
      return a > b ? current : latest;
    });
  }, [workoutsRaw]);

  const thisWeekSummary = useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const grouped: Record<string, number> = {};
    workoutsRaw.forEach((w) => {
      const d = new Date(w.date + "T00:00:00");
      if (d >= startOfWeek) grouped[w.type] = (grouped[w.type] || 0) + 1;
    });
    return grouped;
  }, [workoutsRaw]);

  const thisMonthSummary = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const workoutsThisMonth = workoutsRaw.filter((w) => {
      const d = new Date(w.date + "T00:00:00");
      return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
    });

    const monthlyCount = workoutsThisMonth.length;
    const dayOfMonth = now.getDate();
    const weeksElapsed = Math.ceil(dayOfMonth / 7);
    const avgPerWeek = weeksElapsed > 0 ? +(monthlyCount / weeksElapsed).toFixed(1) : 0;

    return { monthlyCount, avgPerWeek };
  }, [workoutsRaw]);

  return {
    workouts: sortedWorkouts,          
    workoutsRaw,                       
    lastWorkout,
    lastWorkoutDate: lastWorkout?.date ?? null,
    thisWeekSummary,
    thisMonthSummary,
    loading,
    error,
    refetch,
    createWorkout,                     
    types,
    selectedType,
    selectType,
  };
}