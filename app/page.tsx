"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PartyPopper, RotateCcw, Sparkles } from "lucide-react";
import { DAYS, MONTHS, TOTAL_DAYS, TOTAL_TASKS, todayISO } from "@/lib/calendarData";
import type { DayRec } from "@/lib/types";
import { computeStats, evalBadges, dayDone } from "@/lib/gamification";
import { useProgress } from "@/lib/useProgress";
import { burst, bigBurst } from "@/lib/confetti";
import { HeroHud } from "@/components/HeroHud";
import { AchievementShelf } from "@/components/AchievementShelf";
import { MonthSection } from "@/components/MonthSection";
import { DayModal } from "@/components/DayModal";
import { SyncBadge } from "@/components/SyncBadge";

interface Toast {
  id: string;
  text: string;
}

export default function Home() {
  const { progress, status, ready, toggleTask, setDayComplete, reset } = useProgress();
  const stats = useMemo(() => computeStats(progress), [progress]);
  const badges = useMemo(() => evalBadges(progress, stats), [progress, stats]);
  const today = todayISO();

  const [selected, setSelected] = useState<DayRec | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const doneRef = useRef<Set<string>>(new Set());
  const levelRef = useRef(stats.level);
  const badgeRef = useRef<Set<string>>(new Set());
  const inited = useRef(false);

  function push(text: string) {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }

  // Detect newly completed days / level-ups / badge unlocks → celebrate.
  useEffect(() => {
    if (!ready) return;
    const nowDone = new Set(DAYS.filter((d) => dayDone(d, progress)).map((d) => d.date));
    const nowBadges = badges.filter((b) => b.earned).map((b) => b.id);

    if (!inited.current) {
      doneRef.current = nowDone;
      levelRef.current = stats.level;
      badgeRef.current = new Set(nowBadges);
      inited.current = true;
      return;
    }

    let newly = 0;
    nowDone.forEach((d) => {
      if (!doneRef.current.has(d)) newly++;
    });
    if (newly > 0) {
      burst();
      push(`Day done! +${newly} ⭐`);
    }
    doneRef.current = nowDone;

    if (stats.level > levelRef.current) {
      bigBurst();
      push(`Level up — you're a ${stats.levelName}!`);
    }
    levelRef.current = stats.level;

    nowBadges.forEach((id) => {
      if (!badgeRef.current.has(id)) {
        const b = badges.find((x) => x.id === id);
        if (b) {
          bigBurst();
          push(`Badge unlocked: ${b.name}!`);
        }
      }
    });
    badgeRef.current = new Set(nowBadges);
  }, [progress, ready, stats, badges]);

  function handleReset() {
    if (window.confirm("Reset all of Yana's progress? This can't be undone.")) reset();
  }

  return (
    <main className="safe-x mx-auto flex max-w-5xl flex-col gap-5 px-3 py-6 pt-[max(1.5rem,env(safe-area-inset-top))] sm:gap-6 sm:px-4 sm:py-10">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl font-extrabold leading-none text-ink sm:text-5xl">
            Yana&rsquo;s Summer Maths
          </h1>
          <p className="mt-2 font-semibold text-inksoft">Tick a day, grow your kitten, beat the summer! 🐾</p>
        </div>
        <SyncBadge status={status} />
      </header>

      <HeroHud stats={stats} />
      <AchievementShelf badges={badges} />

      {MONTHS.map((m) => (
        <MonthSection
          key={m.mi}
          name={m.name}
          days={DAYS.filter((d) => d.mi === m.mi)}
          progress={progress}
          today={today}
          onOpenDay={setSelected}
        />
      ))}

      <footer className="clay-sm flex flex-wrap items-center justify-between gap-3 px-5 py-4">
        <p className="flex items-center gap-2 text-sm font-bold text-inksoft">
          <Sparkles size={16} className="text-violet" strokeWidth={2.6} />
          {stats.tasksDone} of {TOTAL_TASKS} tasks &middot; {stats.daysDone} of {TOTAL_DAYS} days &middot; keep going, you&rsquo;ve got this!
        </p>
        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-inksoft transition-colors hover:text-rose"
        >
          <RotateCcw size={14} strokeWidth={2.6} /> Reset
        </button>
      </footer>

      <AnimatePresence>
        {selected && (
          <DayModal
            day={selected}
            progress={progress}
            onToggleTask={toggleTask}
            onSetDayComplete={setDayComplete}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex flex-col items-center gap-2 px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 26, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 320, damping: 22 }}
              className="clay flex items-center gap-2 px-4 py-2.5 font-display font-bold text-ink"
            >
              <PartyPopper size={18} className="text-orange" strokeWidth={2.6} /> {t.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </main>
  );
}
