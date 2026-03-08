export function createDefaultPlantCatalogInput() {
  return {
    name: "New Plant",
    category: "",
    defaultWidthIn: 12,
    defaultHeightIn: 12,
    defaultColor: "#7DB87A",
    notes: "",
  };
}

export function createDefaultPlacementInput(buildId: string, bedId: string) {
  return {
    buildId,
    bedId,
    plantCatalogId: null,
    name: "Plant Block",
    xIn: 1,
    yIn: 1,
    widthIn: 12,
    heightIn: 12,
    color: "#7DB87A",
    label: "Plant",
    notes: "",
  };
}
