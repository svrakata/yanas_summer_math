"use client";

import { motion } from "framer-motion";
import type { DayRec, Progress } from "@/lib/types";
import { dayDone, dayDoneCount } from "@/lib/gamification";
import { DOW_LABELS, mondayIndex } from "@/lib/calendarData";
import { ProgressRing } from "./ProgressRing";
import { DayCell } from "./DayCell";

export function MonthSection({
  name,
  days,
  progress,
  today,
  onOpenDay,
}: {
  name: string;
  days: DayRec[];
  progress: Progress;
  today: string;
  onOpenDay: (d: DayRec) => void;
}) {
  const offset = mondayIndex(days[0].date);
  const done = days.filter((d) => dayDone(d, progress)).length;
  const pct = done / days.length;

  return (
    <section className="clay p-3 sm:p-6">
      <header className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-3xl font-extrabold text-ink">{name}</h2>
        <div className="flex items-center gap-2.5">
          <ProgressRing pct={pct} size={50} stroke={7}>
            <span className="font-display text-[11px] font-bold text-indigo">{Math.round(pct * 100)}%</span>
          </ProgressRing>
          <div className="text-right text-[11px] font-bold leading-tight text-inksoft">
            {done}/{days.length}
            <br />
            days
          </div>
        </div>
      </header>

      <div className="mb-1.5 grid grid-cols-7 gap-1.5 sm:gap-2">
        {DOW_LABELS.map((d) => (
          <div key={d} className="text-center text-[10px] font-bold uppercase tracking-wide text-inksoft sm:text-[11px]">
            {d}
          </div>
        ))}
      </div>

      <motion.div
        className="grid grid-cols-7 gap-1.5 sm:gap-2"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{ visible: { transition: { staggerChildren: 0.012 } } }}
      >
        {Array.from({ length: offset }).map((_, i) => (
          <div key={"b" + i} />
        ))}
        {days.map((d) => (
          <DayCell
            key={d.date}
            day={d}
            done={dayDone(d, progress)}
            doneCount={dayDoneCount(d, progress)}
            isToday={d.date === today}
            onOpen={() => onOpenDay(d)}
          />
        ))}
      </motion.div>
    </section>
  );
}
