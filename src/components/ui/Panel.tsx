import type { ReactNode } from "react";

interface PanelProps {
  title: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function Panel({ title, actions, children }: PanelProps) {
  return (
    <section className="rounded-lg border border-panel bg-cream/95 p-3 shadow-[0_2px_6px_rgba(92,61,30,.08)]">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-earth">{title}</h3>
        {actions}
      </div>
      {children}
    </section>
  );
}
