import { useCallback, useEffect, useRef } from "react";
import { plannerStore } from "../features/planner/planner.store";

interface SaveTask {
  key: string;
  run: () => Promise<void>;
}

export function useAutosave(delayMs = 450) {
  const queueRef = useRef<Map<string, SaveTask>>(new Map());
  const timerRef = useRef<number | null>(null);

  const flush = useCallback(async () => {
    if (queueRef.current.size === 0) {
      return;
    }

    const tasks = Array.from(queueRef.current.values());
    queueRef.current.clear();
    plannerStore.setSaveState("saving");

    try {
      for (const task of tasks) {
        await task.run();
      }
      plannerStore.setSaveState("saved");
      plannerStore.setLastSavedAt(new Date().toISOString());
    } catch {
      plannerStore.setSaveState("error");
    }
  }, []);

  const schedule = useCallback(
    (key: string, run: () => Promise<void>) => {
      queueRef.current.set(key, { key, run });
      plannerStore.setSaveState("saving");

      if (timerRef.current != null) {
        window.clearTimeout(timerRef.current);
      }

      timerRef.current = window.setTimeout(() => {
        void flush();
      }, delayMs);
    },
    [delayMs, flush]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current != null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  return {
    schedule,
    flush,
  };
}
