"use client";

import { motion } from "framer-motion";
import { Check, Star, Sun } from "lucide-react";
import type { DayRec } from "@/lib/types";
import { DIFF } from "@/lib/dayStyle";

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
  const isTest = day.diff === "test";
  const partial = doneCount > 0 && !done;

  return (
    <motion.button
      variants={{
        hidden: { opacity: 0, y: 10, scale: 0.9 },
        visible: { opacity: 1, y: 0, scale: 1 },
      }}
      onClick={onOpen}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 420, damping: 26 }}
      className="relative flex flex-col items-center justify-center gap-0.5 rounded-2xl outline-none focus-visible:ring-4 focus-visible:ring-indigo/40"
      style={{
        background: done ? s.color : s.soft,
        boxShadow: done
          ? `3px 4px 11px ${s.color}55`
          : `inset 0 0 0 1.5px ${s.ring}`,
      }}
      aria-label={`${day.dow} ${day.dom} ${day.month}. ${
        done ? "Done" : isFree ? "Free day" : `${day.count} tasks, ${s.label}`
      }. Open day.`}
    >
      <span
        className="font-display text-lg font-extrabold leading-none"
        style={{ color: done ? "#fff" : s.color }}
      >
        {day.dom}
      </span>

      {done ? (
        <Check size={15} strokeWidth={3.5} className="text-white" />
      ) : isFree ? (
        <Sun size={13} strokeWidth={2.6} style={{ color: s.color }} />
      ) : isTest ? (
        <Star size={13} strokeWidth={2.4} style={{ color: s.color }} fill={s.color} />
      ) : (
        <span
          className="tnum text-[11px] font-extrabold leading-none"
          style={{ color: s.color, opacity: partial ? 1 : 0.7 }}
        >
          {partial ? `${doneCount}/${day.items.length}` : day.count}
        </span>
      )}

      {isToday && (
        <>
          <span className="pointer-events-none absolute inset-0 rounded-2xl ring-[2.5px] ring-orange" />
          <span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full bg-orange ring-2 ring-white" />
        </>
      )}
    </motion.button>
  );
}
