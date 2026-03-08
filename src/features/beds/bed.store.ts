import { useSyncExternalStore } from "react";
import type { Bed } from "../../types/global";

interface BedState {
  beds: Bed[];
}

const state: BedState = { beds: [] };
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export const bedStore = {
  getState: () => state,
  setBeds(beds: Bed[]) {
    state.beds = beds;
    emit();
  },
  upsertBed(bed: Bed) {
    const index = state.beds.findIndex((item) => item.id === bed.id);
    if (index >= 0) {
      state.beds[index] = bed;
    } else {
      state.beds.push(bed);
    }
    emit();
  },
  removeBed(id: string) {
    state.beds = state.beds.filter((item) => item.id !== id);
    emit();
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

export function useBedStore<T>(selector: (value: BedState) => T): T {
  return useSyncExternalStore(bedStore.subscribe, () => selector(state), () => selector(state));
}
