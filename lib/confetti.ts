import confetti from "canvas-confetti";

const COLORS = ["#5a4be7", "#ff7a3d", "#16a36a", "#d98613", "#9b40f0", "#1f9fe0"];

export function burst(x = 0.5, y = 0.5) {
  if (typeof window === "undefined") return;
  confetti({ particleCount: 90, spread: 75, origin: { x, y }, colors: COLORS, scalar: 0.9 });
}

export function bigBurst() {
  if (typeof window === "undefined") return;
  const base = { spread: 90, colors: COLORS, ticks: 220 };
  confetti({ ...base, particleCount: 140, startVelocity: 45, origin: { y: 0.45 } });
  confetti({ ...base, particleCount: 70, angle: 60, origin: { x: 0, y: 0.7 } });
  confetti({ ...base, particleCount: 70, angle: 120, origin: { x: 1, y: 0.7 } });
}
