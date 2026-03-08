import { useState } from "react";
import type { Bed } from "../../types/global";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";

interface BedFormProps {
  initial?: Partial<Bed>;
  onSubmit: (payload: {
    name: string;
    kind: string;
    xIn: number;
    yIn: number;
    widthIn: number;
    heightIn: number;
    color: string;
    borderColor: string;
    notes: string;
  }) => void;
}

export function BedForm({ initial, onSubmit }: BedFormProps) {
  const [name, setName] = useState(initial?.name ?? "New Bed");
  const [kind, setKind] = useState(initial?.kind ?? "raised");
  const [xIn, setXIn] = useState(String(initial?.xIn ?? 12));
  const [yIn, setYIn] = useState(String(initial?.yIn ?? 12));
  const [widthIn, setWidthIn] = useState(String(initial?.widthIn ?? 48));
  const [heightIn, setHeightIn] = useState(String(initial?.heightIn ?? 24));
  const [color, setColor] = useState(initial?.color ?? "#8B5E3C");
  const [borderColor, setBorderColor] = useState(initial?.borderColor ?? "#5C3D1E");
  const [notes, setNotes] = useState(initial?.notes ?? "");

  return (
    <form
      className="space-y-3"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({
          name,
          kind,
          xIn: Number(xIn),
          yIn: Number(yIn),
          widthIn: Number(widthIn),
          heightIn: Number(heightIn),
          color,
          borderColor,
          notes,
        });
      }}
    >
      <label className="block text-sm text-earth">
        Name
        <Input value={name} onChange={(event) => setName(event.target.value)} required />
      </label>
      <label className="block text-sm text-earth">
        Kind
        <Select value={kind} onChange={(event) => setKind(event.target.value)}>
          <option value="raised">Raised</option>
          <option value="in_ground">In-ground</option>
          <option value="container">Container</option>
        </Select>
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
      <div className="grid grid-cols-2 gap-2">
        <label className="block text-sm text-earth">
          Fill Color
          <Input type="color" value={color} onChange={(event) => setColor(event.target.value)} />
        </label>
        <label className="block text-sm text-earth">
          Border Color
          <Input type="color" value={borderColor} onChange={(event) => setBorderColor(event.target.value)} />
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
        <Button type="submit">Save Bed</Button>
      </div>
    </form>
  );
}


