import type { PlantCatalogItem, PlantPlacement } from "../../types/global";

export type PlantCatalogInput = Omit<PlantCatalogItem, "id" | "createdAt" | "updatedAt">;
export type PlantCatalogPatch = Partial<PlantCatalogInput>;

export type PlantPlacementInput = Omit<PlantPlacement, "id" | "createdAt" | "updatedAt">;
export type PlantPlacementPatch = Partial<Omit<PlantPlacement, "id" | "buildId" | "createdAt" | "updatedAt">>;
