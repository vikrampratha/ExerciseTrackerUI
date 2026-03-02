export function prettyWorkoutType(type: string) {
  const cleaned = (type ?? "").replace(/_/g, " ").trim();
  if (!cleaned) return "Workout";

  return cleaned
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(" ");
}

export function getWorkoutTypeColors(type: string) {
  const normalized = (type ?? "").toUpperCase();

  const map: Record<
    string,
    { bg: string; fg: string }
  > = {
    PUSH: {
      bg: "#FFE5E5",
      fg: "#B00020",
    },
    PULL: {
      bg: "#E6F0FF",
      fg: "#1D4ED8",
    },
    LEGS: {
      bg: "#E8FFF1",
      fg: "#0F766E",
    },
    UPPER_BODY: {
      bg: "#FFF4E5",
      fg: "#B45309",
    },
    LOWER_BODY: {
      bg: "#E0F2FE",
      fg: "#0369A1",
    },
    FULL_BODY: {
      bg: "#F3E8FF",
      fg: "#6D28D9",
    },
    CARDIO: {
      bg: "#FFE8F0",
      fg: "#e37aa6",
    },
  };

  return (
    map[normalized] ?? {
      bg: "#E5E5EA", // neutral fallback
      fg: "#1C1C1E",
    }
  );
}