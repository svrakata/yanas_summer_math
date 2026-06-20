"use client";

import { motion } from "framer-motion";
import {
  Footprints,
  Flame,
  Swords,
  Target,
  Sun,
  MountainSnow,
  Sparkles,
  Backpack,
  GraduationCap,
  Crown,
  Lock,
  type LucideIcon,
} from "lucide-react";
import type { Badge } from "@/lib/gamification";

const ICONS: Record<string, LucideIcon> = {
  footprints: Footprints,
  flame: Flame,
  swords: Swords,
  target: Target,
  sun: Sun,
  "mountain-snow": MountainSnow,
  sparkles: Sparkles,
  backpack: Backpack,
  "graduation-cap": GraduationCap,
  crown: Crown,
};

export function AchievementShelf({ badges }: { badges: Badge[] }) {
  const earned = badges.filter((b) => b.earned).length;
  return (
    <section className="clay p-5 sm:p-6">
      <header className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-2xl font-extrabold text-ink">Badges</h2>
        <span className="clay-pill px-3 py-1 text-sm font-extrabold text-indigo">
          {earned}/{badges.length}
        </span>
      </header>
      <div className="grid grid-cols-5 gap-2.5 sm:gap-3.5">
        {badges.map((b) => {
          const Ic = ICONS[b.icon] ?? Target;
          return (
            <motion.div
              key={b.id}
              title={`${b.name} — ${b.desc}`}
              initial={false}
              animate={b.earned ? { scale: [1, 1.12, 1] } : {}}
              transition={{ duration: 0.4 }}
              className={`flex flex-col items-center gap-1.5 rounded-2xl p-2.5 text-center ${
                b.earned ? "clay-sm" : "opacity-55"
              }`}
            >
              <span
                className="grid h-11 w-11 place-items-center rounded-full"
                style={
                  b.earned
                    ? { background: "linear-gradient(145deg,#ffcb45,#ff7a3d)", color: "#fff" }
                    : { background: "#e7e4f2", color: "#9a92b8" }
                }
              >
                {b.earned ? <Ic size={22} strokeWidth={2.5} /> : <Lock size={18} strokeWidth={2.6} />}
              </span>
              <span className={`text-[10px] font-bold leading-tight sm:text-[11px] ${b.earned ? "text-ink" : "text-inksoft"}`}>
                {b.name}
              </span>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
