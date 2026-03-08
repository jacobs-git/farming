import { memo } from "react";
import type { Bed, PlantPlacement } from "../../types/global";
import { BED_MIN_SIZE_IN, DEFAULT_GRID_STEP_IN } from "../../features/planner/planner.constants";
import { clampRectToBounds, inchesToPx, pxToInches } from "../../features/planner/planner.math";
import { snapRect } from "../../features/planner/planner.snap";
import type { ResizeHandle } from "../../features/planner/planner.drag";
import { ResizeHandles } from "./ResizeHandles";
import { SelectionOutline } from "./SelectionOutline";
import { PlantBlock } from "./PlantBlock";

interface BedBlockProps {
  bed: Bed;
  placements: PlantPlacement[];
  zoom: number;
  basePxPerIn: number;
  buildWidthIn: number;
  buildHeightIn: number;
  isSelected: boolean;
  selectedPlacementId: string | null;
  snapEnabled: boolean;
  onSelectBed: (id: string) => void;
  onSelectPlacement: (id: string) => void;
  onBedLivePatch: (id: string, patch: Partial<Bed>) => void;
  onBedCommitPatch: (id: string, patch: Partial<Bed>) => void;
  onPlacementLivePatch: (id: string, patch: Partial<PlantPlacement>) => void;
  onPlacementCommitPatch: (id: string, patch: Partial<PlantPlacement>) => void;
}

function applyResizeFromHandle(
  handle: ResizeHandle,
  start: { xIn: number; yIn: number; widthIn: number; heightIn: number },
  dxIn: number,
  dyIn: number
) {
  let { xIn, yIn, widthIn, heightIn } = start;

  if (handle.includes("e")) widthIn = start.widthIn + dxIn;
  if (handle.includes("s")) heightIn = start.heightIn + dyIn;
  if (handle.includes("w")) {
    xIn = start.xIn + dxIn;
    widthIn = start.widthIn - dxIn;
  }
  if (handle.includes("n")) {
    yIn = start.yIn + dyIn;
    heightIn = start.heightIn - dyIn;
  }

  return { xIn, yIn, widthIn, heightIn };
}

export const BedBlock = memo(function BedBlock({
  bed,
  placements,
  zoom,
  basePxPerIn,
  buildWidthIn,
  buildHeightIn,
  isSelected,
  selectedPlacementId,
  snapEnabled,
  onSelectBed,
  onSelectPlacement,
  onBedLivePatch,
  onBedCommitPatch,
  onPlacementLivePatch,
  onPlacementCommitPatch,
}: BedBlockProps) {
  const left = inchesToPx(bed.xIn, basePxPerIn, zoom);
  const top = inchesToPx(bed.yIn, basePxPerIn, zoom);
  const width = inchesToPx(bed.widthIn, basePxPerIn, zoom);
  const height = inchesToPx(bed.heightIn, basePxPerIn, zoom);

  function startPointer(mode: "move" | "resize", event: React.PointerEvent<HTMLDivElement>, handle?: ResizeHandle) {
    event.stopPropagation();
    event.preventDefault();
    onSelectBed(bed.id);

    const startX = event.clientX;
    const startY = event.clientY;
    const startRect = {
      xIn: bed.xIn,
      yIn: bed.yIn,
      widthIn: bed.widthIn,
      heightIn: bed.heightIn,
    };

    const move = (moveEvent: PointerEvent) => {
      const dxIn = pxToInches(moveEvent.clientX - startX, basePxPerIn, zoom);
      const dyIn = pxToInches(moveEvent.clientY - startY, basePxPerIn, zoom);
      const nextRect =
        mode === "move"
          ? { ...startRect, xIn: startRect.xIn + dxIn, yIn: startRect.yIn + dyIn }
          : applyResizeFromHandle(handle ?? "se", startRect, dxIn, dyIn);

      const snapped = snapRect(nextRect, DEFAULT_GRID_STEP_IN, snapEnabled);
      const clamped = clampRectToBounds(snapped, buildWidthIn, buildHeightIn, BED_MIN_SIZE_IN);
      onBedLivePatch(bed.id, clamped);
    };

    const up = (upEvent: PointerEvent) => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);

      const dxIn = pxToInches(upEvent.clientX - startX, basePxPerIn, zoom);
      const dyIn = pxToInches(upEvent.clientY - startY, basePxPerIn, zoom);
      const nextRect =
        mode === "move"
          ? { ...startRect, xIn: startRect.xIn + dxIn, yIn: startRect.yIn + dyIn }
          : applyResizeFromHandle(handle ?? "se", startRect, dxIn, dyIn);

      const snapped = snapRect(nextRect, DEFAULT_GRID_STEP_IN, snapEnabled);
      const clamped = clampRectToBounds(snapped, buildWidthIn, buildHeightIn, BED_MIN_SIZE_IN);
      onBedCommitPatch(bed.id, clamped);
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up, { once: true });
  }

  return (
    <div
      className="soil-bed absolute select-none rounded-md border-2"
      style={{
        left,
        top,
        width,
        height,
        backgroundColor: bed.color,
        borderColor: bed.borderColor,
      }}
      onPointerDown={(event) => startPointer("move", event)}
      onClick={(event) => {
        event.stopPropagation();
        onSelectBed(bed.id);
      }}
    >
      <div className="planner-block-label mono-meta pointer-events-none absolute left-0 right-0 top-0 truncate rounded-t-md bg-black/25 px-1 py-0.5 text-[11px] font-semibold text-cream">
        {bed.name}
      </div>

      <div className="absolute inset-0">
        {placements.map((placement) => (
          <PlantBlock
            key={placement.id}
            placement={placement}
            zoom={zoom}
            basePxPerIn={basePxPerIn}
            bedWidthIn={bed.widthIn}
            bedHeightIn={bed.heightIn}
            isSelected={selectedPlacementId === placement.id}
            snapEnabled={snapEnabled}
            snapStepIn={1}
            onSelect={onSelectPlacement}
            onLivePatch={onPlacementLivePatch}
            onCommitPatch={onPlacementCommitPatch}
          />
        ))}
      </div>

      <SelectionOutline selected={isSelected} />
      <ResizeHandles visible={isSelected} onPointerDown={(handle, event) => startPointer("resize", event, handle)} />
    </div>
  );
});
