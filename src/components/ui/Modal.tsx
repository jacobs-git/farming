import type { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ open, title, onClose, children }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-earth/40 p-4 backdrop-blur-[1.5px]" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-xl border border-panel bg-cream p-4 shadow-[0_10px_30px_rgba(44,31,14,.22)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-display text-2xl font-semibold text-earth">{title}</h3>
          <button className="rounded border border-panel px-2 py-1 text-xs font-semibold text-dust hover:bg-linen" onClick={onClose}>
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
