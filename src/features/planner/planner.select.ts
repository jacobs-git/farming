import type { Selection } from "../../types/global";

export function isSelected(selection: Selection, type: "bed" | "placement", id: string): boolean {
  return !!selection && selection.type === type && selection.id === id;
}
