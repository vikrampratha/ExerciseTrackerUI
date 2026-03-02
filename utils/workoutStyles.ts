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

export function prettyExerciseName(name: string) {
  if (!name) return "";

  return name
    .toLowerCase()
    .split("_")
    .map((word) => {
      if (word.length <= 2) return word.toUpperCase(); // e.g. Db -> DB
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

export function getWorkoutTypeColors(type: string) {
  const normalized = (type ?? "").toUpperCase();

  const map: Record<
    string,
    { bg: string; fg: string }
  > = {
    PUSH: {
      fg: "#FFE5E5",
      bg: "#B00020",
    },
    PULL: {
      fg: "#E6F0FF",
      bg: "#1D4ED8",
    },
    LEGS: {
      fg: "#E8FFF1",
      bg: "#0F766E",
    },
    UPPER_BODY: {
      fg: "#FFF4E5",
      bg: "#B45309",
    },
    LOWER_BODY: {
      fg: "#E0F2FE",
      bg: "#0369A1",
    },
    FULL_BODY: {
      fg: "#F3E8FF",
      bg: "#6D28D9",
    },
    CARDIO: {
      fg: "#FFE8F0",
      bg: "#e37aa6",
    },
  };

  return (
    map[normalized] ?? {
      fg: "#E5E5EA", // neutral fallback
      bg: "#1C1C1E",
    }
  );
}