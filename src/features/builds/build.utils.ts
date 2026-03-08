import type { Build } from "../../types/global";

export function createDefaultBuildInput(overrides?: Partial<Build>) {
  const year = new Date().getFullYear();
  return {
    name: "My Garden 2026",
    seasonYear: year,
    canvasWidthIn: 240,
    canvasHeightIn: 160,
    backgroundColor: "#FAF3E0",
    notes: "",
    ...overrides,
  };
}
