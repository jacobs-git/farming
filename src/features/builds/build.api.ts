import { apiDelete, apiGet, apiPatch, apiPost } from "../../lib/api";
import type { Build, Bed, PlantCatalogItem, PlantPlacement } from "../../types/global";
import type { BuildInput, BuildPatch } from "./build.types";

export function listBuilds(): Promise<Build[]> {
  return apiGet<Build[]>("/builds");
}

export function getBuild(id: string): Promise<Build> {
  return apiGet<Build>(`/builds/${id}`);
}

export function createBuild(payload: BuildInput): Promise<Build> {
  return apiPost<Build>("/builds", payload);
}

export function updateBuild(id: string, payload: BuildPatch): Promise<Build> {
  return apiPatch<Build>(`/builds/${id}`, payload);
}

export function deleteBuild(id: string): Promise<{ id: string; deleted: boolean }> {
  return apiDelete<{ id: string; deleted: boolean }>(`/builds/${id}`);
}

export function exportBuild(id: string): Promise<{ build: Build; beds: Bed[]; plantCatalog: PlantCatalogItem[]; plantPlacements: PlantPlacement[] }> {
  return apiGet(`/export/build/${id}`);
}
