import { useState } from "react";
import type { PlantCatalogItem } from "../../types/global";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

interface PlantTypeFormProps {
  initial?: Partial<PlantCatalogItem>;
  onSubmit: (payload: {
    name: string;
    category: string;
    defaultWidthIn: number;
    defaultHeightIn: number;
    defaultColor: string;
    notes: string;
  }) => void;
}

export function PlantTypeForm({ initial, onSubmit }: PlantTypeFormProps) {
  const [name, setName] = useState(initial?.name ?? "New Plant");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [defaultWidthIn, setDefaultWidthIn] = useState(String(initial?.defaultWidthIn ?? 12));
  const [defaultHeightIn, setDefaultHeightIn] = useState(String(initial?.defaultHeightIn ?? 12));
  const [defaultColor, setDefaultColor] = useState(initial?.defaultColor ?? "#7DB87A");
  const [notes, setNotes] = useState(initial?.notes ?? "");

  return (
    <form
      className="space-y-3"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({
          name,
          category,
          defaultWidthIn: Number(defaultWidthIn),
          defaultHeightIn: Number(defaultHeightIn),
          defaultColor,
          notes,
        });
      }}
    >
      <label className="block text-sm text-earth">
        Name
        <Input value={name} onChange={(event) => setName(event.target.value)} required />
      </label>
      <label className="block text-sm text-earth">
        Category
        <Input value={category ?? ""} onChange={(event) => setCategory(event.target.value)} />
      </label>
      <div className="grid grid-cols-3 gap-2">
        <label className="block text-sm text-earth">
          Width
          <Input type="number" value={defaultWidthIn} onChange={(event) => setDefaultWidthIn(event.target.value)} />
        </label>
        <label className="block text-sm text-earth">
          Height
          <Input type="number" value={defaultHeightIn} onChange={(event) => setDefaultHeightIn(event.target.value)} />
        </label>
        <label className="block text-sm text-earth">
          Color
          <Input type="color" value={defaultColor} onChange={(event) => setDefaultColor(event.target.value)} />
        </label>
      </div>
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
        <Button type="submit">Save Plant Type</Button>
      </div>
    </form>
  );
}


