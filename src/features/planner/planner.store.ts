import { useSyncExternalStore } from "react";
import type { SaveState, Selection } from "../../types/global";
import { MAX_ZOOM, MIN_ZOOM } from "./planner.constants";
import type { DragState } from "./planner.drag";
import { idleDragState } from "./planner.drag";

interface PlannerState {
  zoom: number;
  showGrid: boolean;
  snapEnabled: boolean;
  selection: Selection;
  saveState: SaveState;
  lastSavedAt: string | null;
  drag: DragState;
}

const state: PlannerState = {
  zoom: 1,
  showGrid: true,
  snapEnabled: true,
  selection: null,
  saveState: "idle",
  lastSavedAt: null,
  drag: idleDragState,
};

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export const plannerStore = {
  getState: () => state,
  setZoom(zoom: number) {
    state.zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom));
    emit();
  },
  setShowGrid(showGrid: boolean) {
    state.showGrid = showGrid;
    emit();
  },
  setSnapEnabled(snapEnabled: boolean) {
    state.snapEnabled = snapEnabled;
    emit();
  },
  setSelection(selection: Selection) {
    state.selection = selection;
    emit();
  },
  setSaveState(saveState: SaveState) {
    state.saveState = saveState;
    emit();
  },
  setLastSavedAt(lastSavedAt: string | null) {
    state.lastSavedAt = lastSavedAt;
    emit();
  },
  setDrag(drag: DragState) {
    state.drag = drag;
    emit();
  },
  resetDrag() {
    state.drag = idleDragState;
    emit();
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

export function usePlannerStore<T>(selector: (value: PlannerState) => T): T {
  return useSyncExternalStore(plannerStore.subscribe, () => selector(state), () => selector(state));
}
