import { DEFAULT_GRID_STEP_IN } from "../../features/planner/planner.constants";
import { inchesToPx } from "../../features/planner/planner.math";

interface GridLayerProps {
  widthIn: number;
  heightIn: number;
  zoom: number;
  basePxPerIn: number;
  gridStepIn?: number;
}

export function GridLayer({ widthIn, heightIn, zoom, basePxPerIn, gridStepIn = DEFAULT_GRID_STEP_IN }: GridLayerProps) {
  const widthPx = inchesToPx(widthIn, basePxPerIn, zoom);
  const heightPx = inchesToPx(heightIn, basePxPerIn, zoom);
  const cellPx = Math.max(8, inchesToPx(gridStepIn, basePxPerIn, zoom));

  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        width: widthPx,
        height: heightPx,
        backgroundImage:
          "linear-gradient(to right, rgba(139, 94, 60, 0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(139, 94, 60, 0.2) 1px, transparent 1px)",
        backgroundSize: `${cellPx}px ${cellPx}px`,
      }}
    />
  );
}
