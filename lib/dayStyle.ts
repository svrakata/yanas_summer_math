import type { DayDiff, Trip } from "./types";

export const DIFF: Record<
  DayDiff,
  { label: string; color: string; soft: string; ring: string }
> = {
  // Pastel, well-separated hues. `color` = medium tone (white-readable, used on
  // completed cells); `soft` = pastel cell background; `ring` = subtle border.
  easy: { label: "Easy", color: "#34a978", soft: "#e8f7ef", ring: "#a9e2c5" }, // green — light day
  medium: { label: "Medium", color: "#a25fc9", soft: "#f4eafb", ring: "#dbbfee" }, // purple — typical day
  hard: { label: "Hard", color: "#4e8fd0", soft: "#e7f1fc", ring: "#aed2f1" }, // blue — busy day
  test: { label: "Test", color: "#d49a3d", soft: "#fbf2dd", ring: "#f1d399" }, // amber
  rest: { label: "Free", color: "#8693a8", soft: "#eef1f7", ring: "#ccd4e1" }, // slate
  travel: { label: "Travel", color: "#e07a5f", soft: "#fceae3", ring: "#f3c4b2" }, // terracotta — in transit, no tasks
  postponed: { label: "August", color: "#2fa8a0", soft: "#e2f5f2", ring: "#a9e3dc" }, // teal — Sea-trip work saved for August
};

export const TRIP: Record<
  Trip,
  { label: string; color: string; soft: string; icon: "waves" | "mountain" | "plane" }
> = {
  Sea: { label: "Sea", color: "#0f968a", soft: "#ddf4f0", icon: "waves" }, // teal
  Mountain: { label: "Mountain", color: "#7e6b52", soft: "#efe8dd", icon: "mountain" }, // stone
  Valencia: { label: "Valencia", color: "#cf6c3a", soft: "#fae8da", icon: "plane" }, // coral
};
