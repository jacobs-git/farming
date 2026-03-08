interface SelectionOutlineProps {
  selected: boolean;
}

export function SelectionOutline({ selected }: SelectionOutlineProps) {
  if (!selected) return null;
  return <div className="selected-outline pointer-events-none absolute inset-0 rounded-md" />;
}
