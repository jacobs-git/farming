import { formatTimeLabel } from "../../lib/time";
import type { SaveState } from "../../types/global";

interface StatusBarProps {
  saveState: SaveState;
  lastSavedAt: string | null;
  message?: string;
}

export function StatusBar({ saveState, lastSavedAt, message }: StatusBarProps) {
  const label =
    saveState === "saving"
      ? "Saving changes..."
      : saveState === "saved"
        ? `Saved at ${formatTimeLabel(lastSavedAt)}`
        : saveState === "error"
          ? "Save failed"
          : "Ready";

  return (
    <div className="flex items-center justify-between text-xs text-dust">
      <span className="rounded-full border border-panel bg-linen px-2 py-1 font-mono text-[11px] text-earth">{label}</span>
      <span className="font-medium">{message ?? "Garden Planner MVP"}</span>
    </div>
  );
}
