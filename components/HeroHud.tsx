"use client";

import { motion } from "framer-motion";
import { Star, Flame, ListChecks } from "lucide-react";
import type { Stats } from "@/lib/gamification";
import { Mascot } from "./Mascot";
import { ProgressRing } from "./ProgressRing";
import { Counter } from "./Counter";

function StatChip({
  icon,
  value,
  label,
  color,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  color: string;
}) {
  return (
    <div className="clay-sm flex items-center gap-2.5 px-3.5 py-2.5">
      <span className="grid h-9 w-9 place-items-center rounded-full text-white" style={{ background: color }}>
        {icon}
      </span>
      <span className="leading-none">
        <span className="font-display text-2xl font-extrabold text-ink">
          <Counter value={value} />
        </span>
        <span className="block text-[11px] font-bold uppercase tracking-wide text-inksoft">{label}</span>
      </span>
    </div>
  );
}

export function HeroHud({ stats }: { stats: Stats }) {
  const xpPct = Math.max(0, Math.min(1, stats.xpIntoLevel / stats.xpForLevel));
  return (
    <div className="clay p-5 sm:p-7">
      <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-center lg:gap-8">
        {/* mascot + level */}
        <div className="flex items-center gap-4">
          <Mascot stage={stats.mascotStage} size={108} />
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wide text-inksoft">Level {stats.level}</div>
            <div className="font-display text-2xl font-extrabold leading-tight text-ink">{stats.levelName}</div>
            <div className="mt-1.5 h-2.5 w-40 overflow-hidden rounded-full bg-indigo/15">
              <motion.div
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg,#5a4be7,#9b40f0)" }}
                animate={{ width: `${xpPct * 100}%` }}
                transition={{ type: "spring", stiffness: 70, damping: 16 }}
              />
            </div>
            <div className="mt-1 text-[11px] font-bold text-inksoft">
              {stats.nextLevelName
                ? `${stats.xpForLevel - stats.xpIntoLevel} XP to ${stats.nextLevelName}`
                : "Max level — champion! 👑"}
            </div>
          </div>
        </div>

        {/* big progress ring */}
        <div className="lg:ml-2">
          <ProgressRing pct={stats.pctDays} size={138} stroke={15}>
            <div>
              <div className="font-display text-3xl font-extrabold leading-none text-ink">
                <Counter value={Math.round(stats.pctDays * 100)} />%
              </div>
              <div className="mt-0.5 text-[11px] font-bold text-inksoft">
                {stats.daysDone}/{stats.totalDays} days
              </div>
            </div>
          </ProgressRing>
        </div>

        {/* stat chips */}
        <div className="grid w-full grid-cols-3 gap-2.5 lg:ml-auto lg:w-auto lg:grid-cols-1">
          <StatChip icon={<Star size={18} strokeWidth={2.6} />} value={stats.stars} label="stars" color="#d98613" />
          <StatChip icon={<Flame size={18} strokeWidth={2.6} />} value={stats.streak} label="day streak" color="#ff7a3d" />
          <StatChip icon={<ListChecks size={18} strokeWidth={2.6} />} value={stats.tasksDone} label="tasks" color="#16a36a" />
        </div>
      </div>
    </div>
  );
}
