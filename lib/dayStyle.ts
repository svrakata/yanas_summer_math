import type { DayDiff, Trip } from "./types";

export const DIFF: Record<
  DayDiff,
  { label: string; color: string; soft: string; ring: string }
> = {
  easy: { label: "Easy", color: "#16a36a", soft: "#e4f7ed", ring: "#9fe3c2" },
  hard: { label: "Hard", color: "#5a4be7", soft: "#eae7fd", ring: "#bcb2fa" },
  mixed: { label: "Mixed", color: "#9b40f0", soft: "#f4e8fe", ring: "#ddb6fb" },
  test: { label: "Test", color: "#d98613", soft: "#fdf0db", ring: "#f6cd8d" },
  rest: { label: "Free", color: "#73809c", soft: "#eef1f7", ring: "#cfd6e4" },
};

export const TRIP: Record<
  Trip,
  { label: string; color: string; soft: string; icon: "waves" | "mountain" | "plane" }
> = {
  Sea: { label: "Sea", color: "#0d9c8c", soft: "#d8f5f0", icon: "waves" },
  Mountain: { label: "Mountain", color: "#7a6c5f", soft: "#efe9e2", icon: "mountain" },
  Valencia: { label: "Valencia", color: "#1f9fe0", soft: "#dbeffb", icon: "plane" },
};
