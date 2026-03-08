import type { Bed } from "../../types/global";

interface BedListProps {
  beds: Bed[];
  selectedBedId: string | null;
  onSelect: (id: string) => void;
}

export function BedList({ beds, selectedBedId, onSelect }: BedListProps) {
  return (
    <div className="space-y-1">
      {beds.map((bed) => (
        <button
          key={bed.id}
          className={`w-full rounded-md border px-2 py-2 text-left text-sm transition ${
            bed.id === selectedBedId
              ? "border-loam bg-[#f3e6d5] shadow-[inset_0_0_0_1px_rgba(139,94,60,.25)]"
              : "border-panel bg-cream hover:bg-linen"
          }`}
          onClick={() => onSelect(bed.id)}
        >
          <div className="font-medium text-ink">{bed.name}</div>
          <div className="font-mono text-[11px] text-dust">
            {bed.widthIn}" x {bed.heightIn}" at ({bed.xIn}, {bed.yIn})
          </div>
        </button>
      ))}
    </div>
  );
}
