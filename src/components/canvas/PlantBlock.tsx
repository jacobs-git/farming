import { memo } from "react";
import type { PlantPlacement } from "../../types/global";
import { PLANT_MIN_SIZE_IN } from "../../features/planner/planner.constants";
import { clampRectToBounds, inchesToPx, pxToInches } from "../../features/planner/planner.math";
import { snapRect } from "../../features/planner/planner.snap";
import type { ResizeHandle } from "../../features/planner/planner.drag";
import { ResizeHandles } from "./ResizeHandles";
import { SelectionOutline } from "./SelectionOutline";

interface PlantBlockProps {
  placement: PlantPlacement;
  zoom: number;
  basePxPerIn: number;
  bedWidthIn: number;
  bedHeightIn: number;
  isSelected: boolean;
  snapEnabled: boolean;
  snapStepIn: number;
  onSelect: (id: string) => void;
  onLivePatch: (id: string, patch: Partial<PlantPlacement>) => void;
  onCommitPatch: (id: string, patch: Partial<PlantPlacement>) => void;
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

export const PlantBlock = memo(function PlantBlock({
  placement,
  zoom,
  basePxPerIn,
  bedWidthIn,
  bedHeightIn,
  isSelected,
  snapEnabled,
  snapStepIn,
  onSelect,
  onLivePatch,
  onCommitPatch,
}: PlantBlockProps) {
  const isDark = (() => {
    const hex = placement.color.replace("#", "");
    if (hex.length !== 6) return false;
    const r = Number.parseInt(hex.slice(0, 2), 16);
    const g = Number.parseInt(hex.slice(2, 4), 16);
    const b = Number.parseInt(hex.slice(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance < 0.55;
  })();

  const left = inchesToPx(placement.xIn, basePxPerIn, zoom);
  const top = inchesToPx(placement.yIn, basePxPerIn, zoom);
  const width = inchesToPx(placement.widthIn, basePxPerIn, zoom);
  const height = inchesToPx(placement.heightIn, basePxPerIn, zoom);

  function startPointer(mode: "move" | "resize", event: React.PointerEvent<HTMLDivElement>, handle?: ResizeHandle) {
    event.stopPropagation();
    event.preventDefault();
    onSelect(placement.id);

    const startX = event.clientX;
    const startY = event.clientY;
    const startRect = {
      xIn: placement.xIn,
      yIn: placement.yIn,
      widthIn: placement.widthIn,
      heightIn: placement.heightIn,
    };

    const move = (moveEvent: PointerEvent) => {
      const dxIn = pxToInches(moveEvent.clientX - startX, basePxPerIn, zoom);
      const dyIn = pxToInches(moveEvent.clientY - startY, basePxPerIn, zoom);

      const nextRect =
        mode === "move"
          ? { ...startRect, xIn: startRect.xIn + dxIn, yIn: startRect.yIn + dyIn }
          : applyResizeFromHandle(handle ?? "se", startRect, dxIn, dyIn);

      const snapped = snapRect(nextRect, snapStepIn, snapEnabled);
      const clamped = clampRectToBounds(snapped, bedWidthIn, bedHeightIn, PLANT_MIN_SIZE_IN);
      onLivePatch(placement.id, clamped);
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

      const snapped = snapRect(nextRect, snapStepIn, snapEnabled);
      const clamped = clampRectToBounds(snapped, bedWidthIn, bedHeightIn, PLANT_MIN_SIZE_IN);
      onCommitPatch(placement.id, clamped);
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up, { once: true });
  }

  return (
    <div
      className="absolute select-none rounded-md border border-earth/35 text-[11px] text-ink shadow-sm transition hover:brightness-105"
      style={{ left, top, width, height, backgroundColor: placement.color, color: isDark ? "#FAF3E0" : "#2C1F0E" }}
      onPointerDown={(event) => startPointer("move", event)}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(placement.id);
      }}
    >
      <div className="planner-block-label mono-meta truncate px-1 py-0.5">{placement.label || placement.name}</div>
      <SelectionOutline selected={isSelected} />
      <ResizeHandles visible={isSelected} onPointerDown={(handle, event) => startPointer("resize", event, handle)} />
    </div>
  );
});
