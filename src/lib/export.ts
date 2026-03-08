import type { Build, Bed, PlantCatalogItem, PlantPlacement } from "../types/global";

export interface BuildExport {
  build: Build;
  beds: Bed[];
  plantCatalog: PlantCatalogItem[];
  plantPlacements: PlantPlacement[];
}

export function downloadJson(data: BuildExport, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
