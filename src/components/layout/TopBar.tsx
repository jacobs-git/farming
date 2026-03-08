import { ZOOM_STEP } from "../../features/planner/planner.constants";
import type { SaveState } from "../../types/global";
import { Button } from "../ui/Button";
import { Toggle } from "../ui/Toggle";

interface TopBarProps {
  onAddBuild: () => void;
  onAddBed: () => void;
  onAddPlantType: () => void;
  onAddPlacement: () => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  showGrid: boolean;
  onToggleGrid: (next: boolean) => void;
  snapEnabled: boolean;
  onToggleSnap: (next: boolean) => void;
  saveState: SaveState;
}

function saveStateLabel(saveState: SaveState): string {
  if (saveState === "saving") return "Saving...";
  if (saveState === "saved") return "Saved";
  if (saveState === "error") return "Save failed";
  return "Idle";
}

export function TopBar({
  onAddBuild,
  onAddBed,
  onAddPlantType,
  onAddPlacement,
  zoom,
  onZoomChange,
  showGrid,
  onToggleGrid,
  snapEnabled,
  onToggleSnap,
  saveState,
}: TopBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex min-w-[270px] items-center gap-3">
        <div>
          <div className="font-display text-2xl font-semibold text-earth">Garden Planner</div>
          <div className="font-mono text-[11px] uppercase tracking-wide text-dust">Homestead Workspace</div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-panel bg-linen/70 px-2 py-2">
        <Button onClick={onAddBuild}>Add Build</Button>
        <Button onClick={onAddBed} variant="secondary">
          Add Bed
        </Button>
        <Button onClick={onAddPlantType} variant="secondary">
          Add Plant Type
        </Button>
        <Button onClick={onAddPlacement} variant="secondary">
          Add Placement
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-panel bg-linen/70 px-2 py-2">
        <div className="flex items-center gap-1 rounded-md border border-panel bg-cream px-1 py-1">
          <Button variant="secondary" onClick={() => onZoomChange(zoom - ZOOM_STEP)}>
            -
          </Button>
          <span className="mono-meta w-16 text-center text-xs font-medium">{Math.round(zoom * 100)}%</span>
          <Button variant="secondary" onClick={() => onZoomChange(zoom + ZOOM_STEP)}>
            +
          </Button>
          <Button variant="ghost" onClick={() => onZoomChange(1)}>
            Reset
          </Button>
        </div>
        <Toggle label="Grid" checked={showGrid} onChange={onToggleGrid} />
        <Toggle label="Snap" checked={snapEnabled} onChange={onToggleSnap} />
        <span className="rounded-full border border-panel bg-cream px-2 py-1 font-mono text-[11px] text-earth">
          {saveStateLabel(saveState)}
        </span>
      </div>
    </div>
  );
}
