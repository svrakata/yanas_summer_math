import { Cloud, CloudOff, Loader2, RefreshCw } from "lucide-react";
import type { SyncStatus } from "@/lib/useProgress";

export function SyncBadge({ status }: { status: SyncStatus }) {
  const map = {
    loading: { Icon: Loader2, label: "Loading…", spin: true },
    saving: { Icon: RefreshCw, label: "Saving…", spin: true },
    cloud: { Icon: Cloud, label: "Synced", spin: false },
    local: { Icon: CloudOff, label: "On this device", spin: false },
  } as const;
  const { Icon, label, spin } = map[status];
  return (
    <span className="clay-pill inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-inksoft">
      <Icon size={14} className={spin ? "animate-spin" : ""} strokeWidth={2.4} />
      {label}
    </span>
  );
}
