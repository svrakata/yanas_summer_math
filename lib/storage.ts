import type { Progress } from "./types";
import { supabase, ROW_ID } from "./supabase";

const KEY = "yana-summer-maths-v1";
export const cloudEnabled = !!supabase;

export function emptyProgress(): Progress {
  return { tasks: {}, freeDone: {}, badges: [], updatedAt: new Date(0).toISOString() };
}

export function loadLocal(): Progress | null {
  if (typeof window === "undefined") return null;
  try {
    const r = localStorage.getItem(KEY);
    return r ? (JSON.parse(r) as Progress) : null;
  } catch {
    return null;
  }
}

export function saveLocal(p: Progress) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* ignore quota errors */
  }
}

export async function loadRemote(): Promise<Progress | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("progress")
      .select("data")
      .eq("id", ROW_ID)
      .maybeSingle();
    if (error || !data) return null;
    return data.data as Progress;
  } catch {
    return null;
  }
}

export async function saveRemote(p: Progress) {
  if (!supabase) return;
  try {
    await supabase
      .from("progress")
      .upsert({ id: ROW_ID, data: p, updated_at: p.updatedAt });
  } catch {
    /* offline — localStorage keeps the data, re-syncs next change */
  }
}

export function subscribeRemote(cb: (p: Progress) => void): () => void {
  const sb = supabase;
  if (!sb) return () => {};
  const ch = sb
    .channel("progress-" + ROW_ID)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "progress", filter: `id=eq.${ROW_ID}` },
      (payload: { new?: { data?: Progress } }) => {
        const d = payload.new?.data;
        if (d) cb(d);
      },
    )
    .subscribe();
  return () => {
    sb.removeChannel(ch);
  };
}
