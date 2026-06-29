"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { DayRec, Progress } from "./types";
import {
  cloudEnabled,
  emptyProgress,
  loadLocal,
  loadRemote,
  saveLocal,
  saveRemote,
  subscribeRemote,
} from "./storage";

export type SyncStatus = "loading" | "cloud" | "local" | "saving";

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(() => emptyProgress());
  const [status, setStatus] = useState<SyncStatus>("loading");
  const [ready, setReady] = useState(false);
  const latest = useRef(progress);
  latest.current = progress;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let alive = true;
    const local = loadLocal();
    if (local) setProgress(local);

    (async () => {
      const remote = await loadRemote();
      if (!alive) return;
      if (remote && (!local || remote.updatedAt > local.updatedAt)) {
        setProgress(remote);
        saveLocal(remote);
      } else if (local && cloudEnabled) {
        saveRemote(local);
      }
      setStatus(cloudEnabled ? "cloud" : "local");
      setReady(true);
    })();

    const unsub = subscribeRemote((remote) => {
      if (!alive) return;
      if (remote.updatedAt > latest.current.updatedAt) {
        setProgress(remote);
        saveLocal(remote);
      }
    });
    return () => {
      alive = false;
      unsub();
    };
  }, []);

  const commit = useCallback((next: Progress) => {
    next.updatedAt = new Date().toISOString();
    setProgress(next);
    saveLocal(next);
    if (cloudEnabled) {
      setStatus("saving");
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(async () => {
        await saveRemote(next);
        setStatus("cloud");
      }, 600);
    }
  }, []);

  const toggleTask = useCallback(
    (date: string, idx: number) => {
      const cur = latest.current;
      const set = new Set(cur.tasks[date] ?? []);
      if (set.has(idx)) set.delete(idx);
      else set.add(idx);
      commit({
        ...cur,
        tasks: { ...cur.tasks, [date]: [...set].sort((a, b) => a - b) },
      });
    },
    [commit],
  );

  const setDayComplete = useCallback(
    (day: DayRec, complete: boolean) => {
      const cur = latest.current;
      if (day.items.length === 0) {
        commit({ ...cur, freeDone: { ...cur.freeDone, [day.date]: complete } });
      } else {
        const all = complete ? day.items.map((_, i) => i) : [];
        commit({ ...cur, tasks: { ...cur.tasks, [day.date]: all } });
      }
    },
    [commit],
  );

  const recordBadges = useCallback(
    (ids: string[]) => {
      const cur = latest.current;
      const have = new Set(cur.badges ?? []);
      const add = ids.filter((id) => !have.has(id));
      if (add.length === 0) return;
      commit({ ...cur, badges: [...(cur.badges ?? []), ...add] });
    },
    [commit],
  );

  const reset = useCallback(() => commit(emptyProgress()), [commit]);

  return { progress, status, ready, toggleTask, setDayComplete, reset, recordBadges, cloudEnabled };
}
