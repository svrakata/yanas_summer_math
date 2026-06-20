import { Home, Waves, Mountain, Plane } from "lucide-react";
import type { Trip } from "@/lib/types";
import { TRIP } from "@/lib/dayStyle";

const MAP = { Sea: Waves, Mountain: Mountain, Valencia: Plane } as const;

/** Where Yana is that day: Home, or one of the trips. */
export function LocationIcon({
  trip,
  size = 13,
  className,
}: {
  trip: Trip | null;
  size?: number;
  className?: string;
}) {
  const Ic = trip ? MAP[trip] : Home;
  return <Ic size={size} strokeWidth={2.4} className={className} aria-hidden />;
}

export function locationColor(trip: Trip | null): string {
  return trip ? TRIP[trip].color : "#9a92b8"; // home = muted lilac-gray
}

export function locationLabel(trip: Trip | null): string {
  return trip ? `${TRIP[trip].label} trip` : "Home";
}
