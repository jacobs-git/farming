import type { InputHTMLAttributes } from "react";

export function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full rounded-md border border-panel bg-cream px-2 py-1.5 text-sm text-ink shadow-[inset_0_1px_0_rgba(255,255,255,.7)] placeholder:text-dust/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage/60 ${className}`}
      {...props}
    />
  );
}
