import type { PlantCatalogItem } from "../../types/global";

interface PlantCatalogListProps {
  items: PlantCatalogItem[];
  onPick: (item: PlantCatalogItem) => void;
}

export function PlantCatalogList({ items, onPick }: PlantCatalogListProps) {
  return (
    <div className="space-y-1">
      {items.map((item) => (
        <button
          key={item.id}
          className="w-full rounded-md border border-panel bg-cream px-2 py-2 text-left text-sm transition hover:bg-linen"
          onClick={() => onPick(item)}
        >
          <div className="font-medium text-ink">{item.name}</div>
          <div className="font-mono text-[11px] text-dust">
            {item.defaultWidthIn}" x {item.defaultHeightIn}"
          </div>
        </button>
      ))}
    </div>
  );
}
