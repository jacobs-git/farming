import { useCallback } from "react";
import { plannerStore } from "../features/planner/planner.store";
import type { Selection } from "../types/global";

export function useSelection() {
  const setSelection = useCallback((selection: Selection) => {
    plannerStore.setSelection(selection);
  }, []);

  const clearSelection = useCallback(() => {
    plannerStore.setSelection(null);
  }, []);

  return {
    setSelection,
    clearSelection,
  };
}
