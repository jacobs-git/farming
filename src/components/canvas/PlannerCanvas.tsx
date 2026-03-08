import { BASE_PX_PER_IN } from "../../features/planner/planner.constants";
import { inchesToPx } from "../../features/planner/planner.math";
import type { Bed, Build, PlantPlacement } from "../../types/global";
import { BedBlock } from "./BedBlock";
import { CanvasViewport } from "./CanvasViewport";
import { GridLayer } from "./GridLayer";

interface PlannerCanvasProps {
  build: Build;
  beds: Bed[];
  placements: PlantPlacement[];
  selectedBedId: string | null;
  selectedPlacementId: string | null;
  zoom: number;
  showGrid: boolean;
  snapEnabled: boolean;
  onClearSelection: () => void;
  onSelectBed: (id: string) => void;
  onSelectPlacement: (id: string) => void;
  onBedLivePatch: (id: string, patch: Partial<Bed>) => void;
  onBedCommitPatch: (id: string, patch: Partial<Bed>) => void;
  onPlacementLivePatch: (id: string, patch: Partial<PlantPlacement>) => void;
  onPlacementCommitPatch: (id: string, patch: Partial<PlantPlacement>) => void;
}

export function PlannerCanvas({
  build,
  beds,
  placements,
  selectedBedId,
  selectedPlacementId,
  zoom,
  showGrid,
  snapEnabled,
  onClearSelection,
  onSelectBed,
  onSelectPlacement,
  onBedLivePatch,
  onBedCommitPatch,
  onPlacementLivePatch,
  onPlacementCommitPatch,
}: PlannerCanvasProps) {
  const widthPx = inchesToPx(build.canvasWidthIn, BASE_PX_PER_IN, zoom);
  const heightPx = inchesToPx(build.canvasHeightIn, BASE_PX_PER_IN, zoom);

  return (
    <CanvasViewport>
      <div
        className="planner-surface relative rounded-md border border-panel shadow-[0_3px_10px_rgba(44,31,14,.14)]"
        style={{
          width: widthPx,
          height: heightPx,
          backgroundColor: build.backgroundColor,
        }}
        onClick={onClearSelection}
      >
        {showGrid && (
          <GridLayer widthIn={build.canvasWidthIn} heightIn={build.canvasHeightIn} zoom={zoom} basePxPerIn={BASE_PX_PER_IN} />
        )}

        {beds.map((bed) => (
          <BedBlock
            key={bed.id}
            bed={bed}
            placements={placements.filter((placement) => placement.bedId === bed.id)}
            zoom={zoom}
            basePxPerIn={BASE_PX_PER_IN}
            buildWidthIn={build.canvasWidthIn}
            buildHeightIn={build.canvasHeightIn}
            isSelected={selectedBedId === bed.id}
            selectedPlacementId={selectedPlacementId}
            snapEnabled={snapEnabled}
            onSelectBed={onSelectBed}
            onSelectPlacement={onSelectPlacement}
            onBedLivePatch={onBedLivePatch}
            onBedCommitPatch={onBedCommitPatch}
            onPlacementLivePatch={onPlacementLivePatch}
            onPlacementCommitPatch={onPlacementCommitPatch}
          />
        ))}
      </div>
    </CanvasViewport>
  );
}
