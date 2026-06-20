import { Waves, Mountain, Plane } from "lucide-react";
import type { Trip } from "@/lib/types";

const MAP = { Sea: Waves, Mountain: Mountain, Valencia: Plane } as const;

export function TripIcon({ trip, size = 14 }: { trip: Trip; size?: number }) {
  const Ic = MAP[trip];
  return <Ic size={size} strokeWidth={2.4} />;
}
