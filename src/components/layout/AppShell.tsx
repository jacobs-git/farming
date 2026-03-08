import type { ReactNode } from "react";

interface AppShellProps {
  topBar: ReactNode;
  leftSidebar: ReactNode;
  center: ReactNode;
  rightInspector: ReactNode;
  statusBar: ReactNode;
}

export function AppShell({ topBar, leftSidebar, center, rightInspector, statusBar }: AppShellProps) {
  return (
    <div className="flex h-screen w-screen flex-col bg-parchment text-ink">
      <header className="border-b border-panel bg-cream px-3 py-2 shadow-[0_1px_0_rgba(255,255,255,.6)]">{topBar}</header>
      <div className="grid min-h-0 flex-1 grid-cols-[280px_1fr_320px] gap-3 p-3">
        <aside className="homestead-scrollbar min-h-0 overflow-y-auto rounded-lg border border-panel bg-linen/75 p-3">{leftSidebar}</aside>
        <main className="min-h-0 overflow-hidden rounded-lg border border-panel bg-cream/90">{center}</main>
        <aside className="homestead-scrollbar min-h-0 overflow-y-auto rounded-lg border border-panel bg-linen/75 p-3">{rightInspector}</aside>
      </div>
      <footer className="border-t border-panel bg-cream px-3 py-2">{statusBar}</footer>
    </div>
  );
}
