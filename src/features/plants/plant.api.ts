import { apiDelete, apiGet, apiPatch, apiPost } from "../../lib/api";
import type { PlantCatalogItem, PlantPlacement } from "../../types/global";
import type { PlantCatalogInput, PlantCatalogPatch, PlantPlacementInput, PlantPlacementPatch } from "./plant.types";

export function listPlantCatalog(): Promise<PlantCatalogItem[]> {
  return apiGet<PlantCatalogItem[]>("/plants/catalog");
}

export function createPlantCatalog(payload: PlantCatalogInput): Promise<PlantCatalogItem> {
  return apiPost<PlantCatalogItem>("/plants/catalog", payload);
}

export function updatePlantCatalog(id: string, payload: PlantCatalogPatch): Promise<PlantCatalogItem> {
  return apiPatch<PlantCatalogItem>(`/plants/catalog/${id}`, payload);
}

export function deletePlantCatalog(id: string): Promise<{ id: string; deleted: boolean }> {
  return apiDelete<{ id: string; deleted: boolean }>(`/plants/catalog/${id}`);
}

export function listPlantPlacements(buildId: string): Promise<PlantPlacement[]> {
  return apiGet<PlantPlacement[]>(`/plants/placements?buildId=${encodeURIComponent(buildId)}`);
}

export function createPlantPlacement(payload: PlantPlacementInput): Promise<PlantPlacement> {
  return apiPost<PlantPlacement>("/plants/placements", payload);
}

export function updatePlantPlacement(id: string, payload: PlantPlacementPatch): Promise<PlantPlacement> {
  return apiPatch<PlantPlacement>(`/plants/placements/${id}`, payload);
}

export function deletePlantPlacement(id: string): Promise<{ id: string; deleted: boolean }> {
  return apiDelete<{ id: string; deleted: boolean }>(`/plants/placements/${id}`);
}
