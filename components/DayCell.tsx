"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { DayRec } from "@/lib/types";
import { DIFF, TRIP } from "@/lib/dayStyle";
import { TripIcon } from "./TripIcon";

export function DayCell({
  day,
  done,
  doneCount,
  isToday,
  onOpen,
}: {
  day: DayRec;
  done: boolean;
  doneCount: number;
  isToday: boolean;
  onOpen: () => void;
}) {
  const s = DIFF[day.diff];
  const isFree = day.diff === "rest";
  const units = day.items.length || 1;
  const partial = doneCount > 0 && !done;

  return (
    <motion.button
      variants={{
        hidden: { opacity: 0, y: 14, scale: 0.9 },
        visible: { opacity: 1, y: 0, scale: 1 },
      }}
      onClick={onOpen}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.93 }}
      transition={{ type: "spring", stiffness: 420, damping: 26 }}
      className={`group relative flex min-h-[80px] w-full flex-col rounded-2xl p-2 text-left outline-none focus-visible:ring-4 focus-visible:ring-indigo/40 ${
        done ? "" : "clay-sm"
      }`}
      style={done ? { background: s.color, boxShadow: `5px 6px 14px ${s.color}40` } : undefined}
      aria-label={`${day.dow} ${day.dom} ${day.month}. ${
        done ? "Done" : isFree ? "Free day" : `${day.count} tasks`
      }. Open day.`}
    >
      {!done && (
        <span className="absolute bottom-2.5 left-0 top-2.5 w-1.5 rounded-full" style={{ background: s.color }} />
      )}

      <div className="flex items-start justify-between pl-1.5">
        <span className={`font-display text-lg font-bold leading-none ${done ? "text-white" : "text-ink"}`}>
          {day.dom}
        </span>
        {day.trip ? (
          <span style={{ color: done ? "rgba(255,255,255,.92)" : TRIP[day.trip].color }}>
            <TripIcon trip={day.trip} size={15} />
          </span>
        ) : (
          <span className="mt-1 h-2.5 w-2.5 rounded-full" style={{ background: done ? "rgba(255,255,255,.85)" : s.color }} />
        )}
      </div>

      <div className="mt-auto pl-1.5">
        {done ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-white">
            <Check size={13} strokeWidth={3.5} /> {isFree ? "Rested" : "Done!"}
          </span>
        ) : isFree ? (
          <>
            <span className="text-[10px] font-extrabold uppercase tracking-wide" style={{ color: s.color }}>
              Free
            </span>
            <div className="text-[11px] font-bold text-inksoft">rest &amp; play</div>
          </>
        ) : (
          <>
            <span className="text-[10px] font-extrabold uppercase tracking-wide" style={{ color: s.color }}>
              {s.label}
            </span>
            <div className="text-[11px] font-bold text-inksoft">
              {partial ? `${doneCount}/${units} done` : `${day.count} ${day.count === 1 ? "task" : "tasks"}`}
            </div>
            {partial && (
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-black/10">
                <div className="h-full rounded-full" style={{ width: `${(doneCount / units) * 100}%`, background: s.color }} />
              </div>
            )}
          </>
        )}
      </div>

      {isToday && (
        <>
          <span className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-orange/80" />
          <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-orange px-2 py-[2px] text-[9px] font-extrabold tracking-wide text-white shadow-md">
            TODAY
          </span>
        </>
      )}
    </motion.button>
  );
}
