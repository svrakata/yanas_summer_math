"use client";

import { CalendarClock } from "lucide-react";
import { POSTPONED } from "@/lib/calendarData";
import type { PostponedTask } from "@/lib/types";

const TEAL = "#2fa8a0";

/**
 * "Saved for August" — the Sea-trip tasks that were pulled off the holiday days
 * and are waiting to be rescheduled into August (by hand, with Yana). Purely a
 * planning list; nothing here is auto-distributed.
 */
export function PostponedPanel() {
  if (POSTPONED.length === 0) return null;

  const total = POSTPONED.reduce((s, t) => s + t.n, 0);
  const groups = new Map<string, PostponedTask[]>();
  for (const t of POSTPONED) {
    const g = groups.get(t.from) ?? [];
    g.push(t);
    groups.set(t.from, g);
  }
  const dates = [...groups.keys()].sort();
  const label = (iso: string, dow: string) => `${dow} ${parseInt(iso.slice(8, 10), 10)} Jul`;

  return (
    <section className="clay p-5 sm:p-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full text-white" style={{ background: TEAL }}>
            <CalendarClock size={20} strokeWidth={2.6} />
          </span>
          <div>
            <h2 className="font-display text-xl font-extrabold text-ink">Saved for August 🗓️</h2>
            <p className="text-sm font-semibold text-inksoft">
              Your sea-holiday tasks are parked safely — you&rsquo;ll give them new August days together. Nothing is lost.
            </p>
          </div>
        </div>
        <span className="clay-pill px-3 py-1 text-sm font-extrabold" style={{ color: TEAL }}>
          {total} tasks · {dates.length} days
        </span>
      </header>

      <div className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {dates.map((dt) => {
          const items = groups.get(dt)!;
          return (
            <div key={dt} className="clay-sm p-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wide" style={{ color: TEAL }}>
                  {label(dt, items[0].dow)}
                </span>
                <span className="text-[11px] font-bold text-inksoft">{items.reduce((s, t) => s + t.n, 0)} tasks</span>
              </div>
              <ul className="mt-1.5 space-y-0.5">
                {items.map((t, i) => (
                  <li key={i} className="text-sm font-semibold text-ink">
                    p.{t.p} <span className="text-inksoft">#{t.r}</span>
                    <span className="ml-1 text-[11px] font-bold text-inksoft">({t.n})</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
