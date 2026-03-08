import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
}

export function Badge({ children }: BadgeProps) {
  return <span className="rounded-full border border-panel bg-linen px-2 py-0.5 font-mono text-[11px] text-earth">{children}</span>;
}
