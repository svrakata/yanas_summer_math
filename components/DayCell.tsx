"use client";

import { motion } from "framer-motion";
import { Check, Plane, Star, Sun } from "lucide-react";
import type { DayRec } from "@/lib/types";
import { DIFF } from "@/lib/dayStyle";
import { LocationIcon } from "./LocationIcon";

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
  const isTravel = day.diff === "travel";
  const isTest = day.diff === "test";
  const partial = doneCount > 0 && !done;
  const units = day.items.length || 1;

  return (
    <motion.button
      variants={{
        hidden: { opacity: 0, y: 10, scale: 0.9 },
        visible: { opacity: 1, y: 0, scale: 1 },
      }}
      onClick={onOpen}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: "spring", stiffness: 420, damping: 26 }}
      className="relative h-full w-full rounded-2xl outline-none focus-visible:ring-4 focus-visible:ring-indigo/40"
      aria-label={`${day.dow} ${day.dom} ${day.month}. ${
        done ? "Done" : isFree ? "Free day" : isTravel ? "Travel day" : `${day.count} tasks, ${s.label}`
      }. Open day.`}
    >
      {/* ---------- MOBILE face (compact: number, then location + count) ---------- */}
      <span
        className="flex h-full w-full flex-col items-center justify-center gap-1 rounded-2xl sm:hidden"
        style={{
          background: done ? s.color : s.soft,
          boxShadow: done ? `3px 4px 11px ${s.color}55` : `inset 0 0 0 1.5px ${s.ring}`,
        }}
      >
        <span
          className="font-display text-lg font-extrabold leading-none"
          style={{ color: done ? "#fff" : s.color }}
        >
          {day.dom}
        </span>
        {/* location paired with the count / state, below the number */}
        <span
          className="flex items-center gap-1 leading-none"
          style={{ color: done ? "#fff" : s.color }}
        >
          <LocationIcon trip={day.trip} size={10} />
          {done ? (
            <Check size={13} strokeWidth={3.5} />
          ) : isFree ? (
            <Sun size={12} strokeWidth={2.6} />
          ) : isTravel ? (
            <Plane size={12} strokeWidth={2.6} />
          ) : isTest ? (
            <Star size={12} strokeWidth={2.4} fill="currentColor" />
          ) : (
            <span className="tnum text-[11px] font-extrabold" style={{ opacity: partial ? 1 : 0.85 }}>
              {partial ? `${doneCount}/${units}` : day.count}
            </span>
          )}
        </span>
      </span>

      {/* ---------- DESKTOP face (rich card) ---------- */}
      <span
        className={`hidden h-full w-full flex-col rounded-2xl p-2 text-left sm:flex ${done ? "" : "clay-sm"}`}
        style={done ? { background: s.color, boxShadow: `5px 6px 14px ${s.color}40` } : undefined}
      >
        {!done && (
          <span
            className="absolute bottom-2.5 left-0 top-2.5 w-1.5 rounded-full"
            style={{ background: s.color }}
          />
        )}

        <span className="flex items-start pl-1.5">
          <span className={`font-display text-lg font-bold leading-none ${done ? "text-white" : "text-ink"}`}>
            {day.dom}
          </span>
        </span>

        <span className="mt-auto block pl-1.5">
          {done ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-white">
              <LocationIcon trip={day.trip} size={13} /> {isTravel ? "Travelled" : isFree ? "Rested" : "Done!"}
            </span>
          ) : isTravel ? (
            <>
              <span className="text-[10px] font-extrabold uppercase tracking-wide" style={{ color: s.color }}>
                Travel
              </span>
              <span className="flex items-center gap-1 text-[11px] font-bold text-inksoft">
                <span style={{ color: s.color }}>
                  <LocationIcon trip={day.trip} size={13} />
                </span>
                on the road
              </span>
            </>
          ) : isFree ? (
            <>
              <span className="text-[10px] font-extrabold uppercase tracking-wide" style={{ color: s.color }}>
                Free
              </span>
              <span className="flex items-center gap-1 text-[11px] font-bold text-inksoft">
                <span style={{ color: s.color }}>
                  <LocationIcon trip={day.trip} size={13} />
                </span>
                rest &amp; play
              </span>
            </>
          ) : (
            <>
              <span className="block text-[10px] font-extrabold uppercase tracking-wide" style={{ color: s.color }}>
                {s.label}
              </span>
              <span className="flex items-center gap-1 text-[11px] font-bold text-inksoft">
                <span style={{ color: s.color }}>
                  <LocationIcon trip={day.trip} size={13} />
                </span>
                {partial ? `${doneCount}/${units} done` : `${day.count} ${day.count === 1 ? "task" : "tasks"}`}
              </span>
              {partial && (
                <span className="mt-1 block h-1.5 w-full overflow-hidden rounded-full bg-black/10">
                  <span className="block h-full rounded-full" style={{ width: `${(doneCount / units) * 100}%`, background: s.color }} />
                </span>
              )}
            </>
          )}
        </span>
      </span>

      {/* ---------- shared TODAY indicator ---------- */}
      {isToday && (
        <>
          <span className="pointer-events-none absolute inset-0 rounded-2xl ring-[2.5px] ring-orange" />
          <span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full bg-orange ring-2 ring-white sm:hidden" />
          <span className="absolute -top-2 left-1/2 hidden -translate-x-1/2 rounded-full bg-orange px-2 py-[2px] text-[9px] font-extrabold tracking-wide text-white shadow-md sm:block">
            TODAY
          </span>
        </>
      )}
    </motion.button>
  );
}
