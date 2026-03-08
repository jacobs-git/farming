interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

export function Toggle({ label, checked, onChange }: ToggleProps) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-earth">
      <span
        className={`relative inline-flex h-6 w-10 items-center rounded-full border transition ${
          checked ? "border-forest bg-sage" : "border-panel bg-linen"
        }`}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="peer sr-only"
        />
        <span
          className={`absolute h-4 w-4 rounded-full bg-cream shadow transition ${checked ? "left-5" : "left-1"}`}
        />
      </span>
      <span>{label}</span>
    </label>
  );
}
