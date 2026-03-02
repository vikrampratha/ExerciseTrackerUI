import { api } from "@/services/api";
import { useCallback, useEffect, useState } from "react";

export type ExerciseType = "STRENGTH" | "WEIGHTED_STRENGTH" | "CARDIO";

export type ExerciseName = {
  id: number;
  name: string;
  type: ExerciseType;
};

export type NewExercise =
  | { clientId: string; exerciseNameId: number; name: string; type: "STRENGTH"; sets: number; reps: number }
  | { clientId: string; exerciseNameId: number; name: string; type: "WEIGHTED_STRENGTH"; sets: number; reps: number; weight: number }
  | { clientId: string; exerciseNameId: number; name: string; type: "CARDIO"; duration: number };

export function useExerciseNames(enabled: boolean) {
  const [exerciseNames, setExerciseNames] = useState<ExerciseName[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExerciseNames = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get<ExerciseName[]>("/exerciseNames");
      setExerciseNames(res.data);
    } catch (e) {
      console.error(e);
      setError("Failed to load exercise names");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (enabled) fetchExerciseNames();
  }, [enabled, fetchExerciseNames]);

  return { exerciseNames, loading, error, refetch: fetchExerciseNames };
}