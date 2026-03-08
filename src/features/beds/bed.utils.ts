export function createDefaultBedInput(buildId: string) {
  return {
    buildId,
    name: "New Bed",
    kind: "raised",
    xIn: 12,
    yIn: 12,
    widthIn: 48,
    heightIn: 24,
    color: "#8B5E3C",
    borderColor: "#5C3D1E",
    rotationDeg: 0,
    notes: "",
  };
}
