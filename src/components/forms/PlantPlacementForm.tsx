import { useMemo, useState } from "react";
import type { Bed, PlantCatalogItem, PlantPlacement } from "../../types/global";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";

interface PlantPlacementFormProps {
  beds: Bed[];
  catalog: PlantCatalogItem[];
  initial?: Partial<PlantPlacement>;
  defaultBuildId: string;
  onSubmit: (payload: {
    buildId: string;
    bedId: string;
    plantCatalogId: string | null;
    name: string;
    xIn: number;
    yIn: number;
    widthIn: number;
    heightIn: number;
    color: string;
    label: string;
    notes: string;
  }) => void;
}

export function PlantPlacementForm({ beds, catalog, initial, defaultBuildId, onSubmit }: PlantPlacementFormProps) {
  const defaultBedId = initial?.bedId ?? beds[0]?.id ?? "";
  const [bedId, setBedId] = useState(defaultBedId);
  const [plantCatalogId, setPlantCatalogId] = useState(initial?.plantCatalogId ?? "");
  const [name, setName] = useState(initial?.name ?? "Plant Block");
  const [xIn, setXIn] = useState(String(initial?.xIn ?? 1));
  const [yIn, setYIn] = useState(String(initial?.yIn ?? 1));
  const [widthIn, setWidthIn] = useState(String(initial?.widthIn ?? 12));
  const [heightIn, setHeightIn] = useState(String(initial?.heightIn ?? 12));
  const [color, setColor] = useState(initial?.color ?? "#7DB87A");
  const [label, setLabel] = useState(initial?.label ?? "");
  const [notes, setNotes] = useState(initial?.notes ?? "");

  const selectedCatalog = useMemo(() => catalog.find((item) => item.id === plantCatalogId), [catalog, plantCatalogId]);

  return (
    <form
      className="space-y-3"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({
          buildId: defaultBuildId,
          bedId,
          plantCatalogId: plantCatalogId || null,
          name,
          xIn: Number(xIn),
          yIn: Number(yIn),
          widthIn: Number(widthIn),
          heightIn: Number(heightIn),
          color: selectedCatalog?.defaultColor ?? color,
          label,
          notes,
        });
      }}
    >
      <label className="block text-sm text-earth">
        Bed
        <Select value={bedId} onChange={(event) => setBedId(event.target.value)} required>
          {beds.map((bed) => (
            <option key={bed.id} value={bed.id}>
              {bed.name}
            </option>
          ))}
        </Select>
      </label>
      <label className="block text-sm text-earth">
        Plant Type
        <Select value={plantCatalogId ?? ""} onChange={(event) => setPlantCatalogId(event.target.value)}>
          <option value="">Custom</option>
          {catalog.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </Select>
      </label>
      <label className="block text-sm text-earth">
        Name
        <Input value={name} onChange={(event) => setName(event.target.value)} required />
      </label>
      <div className="grid grid-cols-4 gap-2">
        <label className="block text-sm text-earth">
          X
          <Input type="number" value={xIn} onChange={(event) => setXIn(event.target.value)} />
        </label>
        <label className="block text-sm text-earth">
          Y
          <Input type="number" value={yIn} onChange={(event) => setYIn(event.target.value)} />
        </label>
        <label className="block text-sm text-earth">
          W
          <Input type="number" value={widthIn} onChange={(event) => setWidthIn(event.target.value)} />
        </label>
        <label className="block text-sm text-earth">
          H
          <Input type="number" value={heightIn} onChange={(event) => setHeightIn(event.target.value)} />
        </label>
      </div>
      <label className="block text-sm text-earth">
        Label
        <Input value={label ?? ""} onChange={(event) => setLabel(event.target.value)} />
      </label>
      <label className="block text-sm text-earth">
        Color
        <Input type="color" value={selectedCatalog?.defaultColor ?? color} onChange={(event) => setColor(event.target.value)} disabled={!!selectedCatalog} />
      </label>
      <label className="block text-sm text-earth">
        Notes
        <textarea
          className="w-full rounded-md border border-panel bg-cream px-2 py-1.5 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage/60"
          rows={3}
          value={notes ?? ""}
          onChange={(event) => setNotes(event.target.value)}
        />
      </label>
      <div className="flex justify-end">
        <Button type="submit">Save Placement</Button>
      </div>
    </form>
  );
}


