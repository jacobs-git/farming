import type { ReactNode } from "react";

interface CanvasViewportProps {
  children: ReactNode;
}

export function CanvasViewport({ children }: CanvasViewportProps) {
  return <div className="homestead-scrollbar h-full w-full overflow-auto bg-linen/40 p-4">{children}</div>;
}
