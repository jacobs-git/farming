import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  children: ReactNode;
}

const variantClass: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "border border-forest bg-sage text-cream shadow-sm hover:bg-forest",
  secondary: "border border-straw bg-cream text-ink shadow-sm hover:bg-linen",
  danger: "border border-[#a9502b] bg-terracotta text-cream shadow-sm hover:bg-[#ab592f]",
  ghost: "border border-dashed border-panel bg-transparent text-earth hover:bg-cream/70",
};

export function Button({ variant = "primary", className = "", children, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-semibold tracking-tight transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage/60 disabled:cursor-not-allowed disabled:opacity-60 ${variantClass[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
