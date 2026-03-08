import { useSyncExternalStore } from "react";
import type { PlantCatalogItem, PlantPlacement } from "../../types/global";

interface PlantState {
  catalog: PlantCatalogItem[];
  placements: PlantPlacement[];
}

const state: PlantState = {
  catalog: [],
  placements: [],
};

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export const plantStore = {
  getState: () => state,
  setCatalog(catalog: PlantCatalogItem[]) {
    state.catalog = catalog;
    emit();
  },
  setPlacements(placements: PlantPlacement[]) {
    state.placements = placements;
    emit();
  },
  upsertCatalogItem(item: PlantCatalogItem) {
    const index = state.catalog.findIndex((existing) => existing.id === item.id);
    if (index >= 0) state.catalog[index] = item;
    else state.catalog.push(item);
    state.catalog.sort((a, b) => a.name.localeCompare(b.name));
    emit();
  },
  removeCatalogItem(id: string) {
    state.catalog = state.catalog.filter((item) => item.id !== id);
    emit();
  },
  upsertPlacement(placement: PlantPlacement) {
    const index = state.placements.findIndex((existing) => existing.id === placement.id);
    if (index >= 0) state.placements[index] = placement;
    else state.placements.push(placement);
    emit();
  },
  removePlacement(id: string) {
    state.placements = state.placements.filter((item) => item.id !== id);
    emit();
  },
  removePlacementsForBed(bedId: string) {
    state.placements = state.placements.filter((item) => item.bedId !== bedId);
    emit();
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

export function usePlantStore<T>(selector: (value: PlantState) => T): T {
  return useSyncExternalStore(plantStore.subscribe, () => selector(state), () => selector(state));
}
