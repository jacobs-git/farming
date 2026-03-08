import type { ResizeHandle } from "../../features/planner/planner.drag";

interface ResizeHandlesProps {
  visible: boolean;
  onPointerDown: (handle: ResizeHandle, event: React.PointerEvent<HTMLDivElement>) => void;
}

const handles: ResizeHandle[] = ["n", "ne", "e", "se", "s", "sw", "w", "nw"];

const handleStyle: Record<ResizeHandle, string> = {
  n: "left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 cursor-n-resize",
  ne: "right-0 top-0 translate-x-1/2 -translate-y-1/2 cursor-ne-resize",
  e: "right-0 top-1/2 translate-x-1/2 -translate-y-1/2 cursor-e-resize",
  se: "bottom-0 right-0 translate-x-1/2 translate-y-1/2 cursor-se-resize",
  s: "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 cursor-s-resize",
  sw: "bottom-0 left-0 -translate-x-1/2 translate-y-1/2 cursor-sw-resize",
  w: "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-w-resize",
  nw: "left-0 top-0 -translate-x-1/2 -translate-y-1/2 cursor-nw-resize",
};

export function ResizeHandles({ visible, onPointerDown }: ResizeHandlesProps) {
  if (!visible) return null;

  return (
    <>
      {handles.map((handle) => (
        <div
          key={handle}
          className={`absolute h-3 w-3 rounded-full border border-cream bg-terracotta shadow ${handleStyle[handle]}`}
          onPointerDown={(event) => onPointerDown(handle, event)}
        />
      ))}
    </>
  );
}
