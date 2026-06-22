"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Check, X, Sun, Home, Plane } from "lucide-react";
import type { DayRec, Progress } from "@/lib/types";
import { DIFF, TRIP } from "@/lib/dayStyle";
import { dayDone } from "@/lib/gamification";
import { TripIcon } from "./TripIcon";

export function DayModal({
  day,
  progress,
  onToggleTask,
  onSetDayComplete,
  onClose,
}: {
  day: DayRec;
  progress: Progress;
  onToggleTask: (date: string, idx: number) => void;
  onSetDayComplete: (day: DayRec, complete: boolean) => void;
  onClose: () => void;
}) {
  const s = DIFF[day.diff];
  const doneSet = new Set(progress.tasks[day.date] ?? []);
  const allDone = dayDone(day, progress);
  const isTravel = day.diff === "travel";
  const isFree = day.items.length === 0 && !isTravel;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const weekday = new Date(day.date + "T00:00:00").toLocaleDateString("en-GB", { weekday: "long" });

  return (
    <motion.div
      className="fixed inset-0 z-50 grid place-items-center p-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={`${weekday} ${day.dom} ${day.month}`}
        className="clay relative z-10 flex max-h-full w-full max-w-md flex-col overflow-y-auto overscroll-contain p-5 sm:p-6"
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 10 }}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="clay-sm absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-full text-inksoft transition-transform hover:scale-105 active:scale-95"
        >
          <X size={20} strokeWidth={2.6} />
        </button>

        <div className="mb-1 text-sm font-bold text-inksoft">{weekday}</div>
        <h3 className="font-display text-3xl font-extrabold leading-none text-ink">
          {day.dom} {day.month}
        </h3>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span
            className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-extrabold text-white"
            style={{ background: s.color }}
          >
            {s.label}
          </span>
          {day.trip ? (
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold text-white"
              style={{ background: TRIP[day.trip].color }}
            >
              <TripIcon trip={day.trip} size={13} /> {TRIP[day.trip].label} trip
            </span>
          ) : (
            <span className="clay-pill inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-inksoft">
              <Home size={13} strokeWidth={2.6} /> Home day
            </span>
          )}
        </div>

        {isTravel ? (
          <div className="mt-5 rounded-2xl bg-cream/70 p-5 text-center">
            <Plane size={40} className="mx-auto" style={{ color: s.color }} strokeWidth={2.4} />
            <p className="mt-2 font-display text-xl font-bold text-ink">Travel day!</p>
            <p className="text-sm font-semibold text-inksoft">On the road today — no maths. ✈️</p>
          </div>
        ) : isFree ? (
          <div className="mt-5 rounded-2xl bg-cream/70 p-5 text-center">
            <Sun size={40} className="mx-auto text-gold" strokeWidth={2.4} />
            <p className="mt-2 font-display text-xl font-bold text-ink">Free day!</p>
            <p className="text-sm font-semibold text-inksoft">No maths today — rest &amp; play. ☀</p>
          </div>
        ) : (
          <>
            <div className="mt-4 mb-1 flex items-center justify-between text-sm font-bold text-inksoft">
              <span>Today&rsquo;s tasks</span>
              <span>
                {doneSet.size}/{day.items.length} done
              </span>
            </div>
            <ul className="flex flex-col gap-2">
              {day.items.map((it, idx) => {
                const checked = doneSet.has(idx);
                return (
                  <li key={idx}>
                    <button
                      onClick={() => onToggleTask(day.date, idx)}
                      className={`flex w-full items-center gap-3 rounded-2xl p-2.5 text-left transition-colors ${
                        checked ? "" : "clay-sm"
                      }`}
                      style={checked ? { background: s.soft } : undefined}
                    >
                      <span
                        className="grid h-7 w-7 flex-none place-items-center rounded-full border-2 transition-all"
                        style={{
                          borderColor: s.color,
                          background: checked ? s.color : "transparent",
                        }}
                      >
                        {checked && <Check size={16} strokeWidth={3.5} className="text-white" />}
                      </span>
                      <span className="flex-1">
                        <span className={`font-display text-base font-bold ${checked ? "text-ink/60 line-through" : "text-ink"}`}>
                          {it.test ? it.r : `p.${it.p} #${it.r}`}
                        </span>
                      </span>
                      <span className="flex-none rounded-full bg-black/5 px-2 py-0.5 text-[11px] font-bold text-inksoft">
                        {it.test ? "test" : `${it.n} ${it.n === 1 ? "task" : "tasks"}`}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </>
        )}

        <button
          onClick={() => onSetDayComplete(day, !allDone)}
          className={`mt-5 flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3.5 font-display text-lg font-extrabold text-white transition-transform active:scale-[0.98] ${
            allDone ? "bg-mint" : "bg-orange"
          }`}
          style={{ boxShadow: `0 8px 18px ${allDone ? "#16a36a55" : "#ff7a3d55"}` }}
        >
          {allDone ? (
            <>
              <Check size={20} strokeWidth={3} />{" "}
              {isTravel ? "Safe travels!" : isFree ? "Rested!" : "Day complete!"} (tap to undo)
            </>
          ) : isTravel ? (
            <>
              <Plane size={20} strokeWidth={2.6} /> I travelled today
            </>
          ) : isFree ? (
            <>
              <Sun size={20} strokeWidth={2.6} /> I rested today
            </>
          ) : (
            <>
              <Check size={20} strokeWidth={3} /> Mark whole day done
            </>
          )}
        </button>
      </motion.div>
    </motion.div>
  );
}
