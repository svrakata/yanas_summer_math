import { Calculator, BookOpenText } from "lucide-react";
import type { ItemType } from "@/lib/types";

/** x = expression (calculation) → Calculator · t = textual (word problem) → open book */
export function TypeIcon({
  type,
  size = 12,
  className,
}: {
  type: ItemType;
  size?: number;
  className?: string;
}) {
  const Ic = type === "x" ? Calculator : BookOpenText;
  return <Ic size={size} strokeWidth={2.4} className={className} aria-hidden />;
}

export const TYPE_LABEL: Record<ItemType, string> = {
  x: "calculations",
  t: "word problems",
};
