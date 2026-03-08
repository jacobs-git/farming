import { useCallback } from "react";

export interface PointerDragOptions {
  onMove: (event: PointerEvent) => void;
  onUp?: (event: PointerEvent) => void;
}

export function usePointerDrag(options: PointerDragOptions) {
  return useCallback(
    (downEvent: React.PointerEvent<HTMLElement>) => {
      const element = downEvent.currentTarget;
      element.setPointerCapture(downEvent.pointerId);

      const handleMove = (event: PointerEvent) => {
        options.onMove(event);
      };

      const handleUp = (event: PointerEvent) => {
        element.releasePointerCapture(downEvent.pointerId);
        window.removeEventListener("pointermove", handleMove);
        window.removeEventListener("pointerup", handleUp);
        options.onUp?.(event);
      };

      window.addEventListener("pointermove", handleMove);
      window.addEventListener("pointerup", handleUp, { once: true });
    },
    [options]
  );
}
