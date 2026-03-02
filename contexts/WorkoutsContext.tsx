import { api, postWorkout, Workout, WorkoutDTO } from "@/services/api";
import { nanoid } from "nanoid/non-secure";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type WorkoutsStore = {
  workoutsRaw: Workout[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createWorkout: (dto: WorkoutDTO) => Promise<{ ok: true } | { ok: false; message: string }>;
};

const Ctx = createContext<WorkoutsStore | null>(null);

export function WorkoutsProvider({ children }: { children: React.ReactNode }) {
  const [workoutsRaw, setWorkoutsRaw] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get<Workout[]>("/getAllWorkouts");
      setWorkoutsRaw(res.data);
    } catch (e) {
      console.error(e);
      setError("Failed to load workouts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const createWorkout = useCallback(
    async (dto: WorkoutDTO) => {
      const tempId = `temp-${nanoid()}`;
      const optimistic: Workout = { ...dto, id: tempId, isOptimistic: true };

      // optimistic insert immediately
      setWorkoutsRaw((prev) => [optimistic, ...prev]);

      try {
        await postWorkout(dto);
        await refetch(); // server truth (real IDs)
        return { ok: true as const };
      } catch (e) {
        console.error(e);
        // rollback optimistic item
        setWorkoutsRaw((prev) => prev.filter((w) => w.id !== tempId));
        return { ok: false as const, message: "Failed to save workout" };
      }
    },
    [refetch]
  );

  const value = useMemo(
    () => ({ workoutsRaw, loading, error, refetch, createWorkout }),
    [workoutsRaw, loading, error, refetch, createWorkout]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useWorkoutsStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useWorkoutsStore must be used within WorkoutsProvider");
  return v;
}