export type ResizeHandle = "n" | "ne" | "e" | "se" | "s" | "sw" | "w" | "nw";

export interface DragState {
  active: boolean;
  targetType: "bed" | "placement" | null;
  targetId: string | null;
  mode: "move" | "resize";
  handle: ResizeHandle | null;
  startPointerX: number;
  startPointerY: number;
  startXIn: number;
  startYIn: number;
  startWidthIn: number;
  startHeightIn: number;
}

export const idleDragState: DragState = {
  active: false,
  targetType: null,
  targetId: null,
  mode: "move",
  handle: null,
  startPointerX: 0,
  startPointerY: 0,
  startXIn: 0,
  startYIn: 0,
  startWidthIn: 0,
  startHeightIn: 0,
};
