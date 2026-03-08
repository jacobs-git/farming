import type { PlantPlacement } from "../../types/global";

interface PlantPlacementListProps {
  placements: PlantPlacement[];
  selectedPlacementId: string | null;
  onSelect: (id: string) => void;
}

export function PlantPlacementList({ placements, selectedPlacementId, onSelect }: PlantPlacementListProps) {
  return (
    <div className="space-y-1">
      {placements.map((placement) => (
        <button
          key={placement.id}
          className={`w-full rounded-md border px-2 py-2 text-left text-sm transition ${
            placement.id === selectedPlacementId
              ? "border-sprout bg-[#ecf6ea] shadow-[inset_0_0_0_1px_rgba(125,184,122,.3)]"
              : "border-panel bg-cream hover:bg-linen"
          }`}
          onClick={() => onSelect(placement.id)}
        >
          <div className="font-medium text-ink">{placement.label || placement.name}</div>
          <div className="font-mono text-[11px] text-dust">
            {placement.widthIn}" x {placement.heightIn}"
          </div>
        </button>
      ))}
    </div>
  );
}
