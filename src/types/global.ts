export type EntityId = string;

export interface Build {
  id: EntityId;
  name: string;
  seasonYear: number;
  canvasWidthIn: number;
  canvasHeightIn: number;
  backgroundColor: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Bed {
  id: EntityId;
  buildId: EntityId;
  name: string;
  kind: string;
  xIn: number;
  yIn: number;
  widthIn: number;
  heightIn: number;
  color: string;
  borderColor: string;
  rotationDeg: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PlantCatalogItem {
  id: EntityId;
  name: string;
  category: string | null;
  defaultWidthIn: number;
  defaultHeightIn: number;
  defaultColor: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PlantPlacement {
  id: EntityId;
  buildId: EntityId;
  bedId: EntityId;
  plantCatalogId: EntityId | null;
  name: string;
  xIn: number;
  yIn: number;
  widthIn: number;
  heightIn: number;
  color: string;
  label: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export type Selection =
  | { type: "build"; id: EntityId }
  | { type: "bed"; id: EntityId }
  | { type: "placement"; id: EntityId }
  | null;

export type SaveState = "idle" | "saving" | "saved" | "error";

export interface BootstrapPayload {
  builds: Build[];
  activeBuild: Build | null;
  beds: Bed[];
  plantCatalog: PlantCatalogItem[];
  plantPlacements: PlantPlacement[];
}
