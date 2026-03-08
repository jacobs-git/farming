import { useState } from "react";
import type { Build } from "../../types/global";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

interface BuildFormProps {
  initial?: Partial<Build>;
  onSubmit: (payload: {
    name: string;
    seasonYear: number;
    canvasWidthIn: number;
    canvasHeightIn: number;
    backgroundColor: string;
    notes: string;
  }) => void;
}

export function BuildForm({ initial, onSubmit }: BuildFormProps) {
  const [name, setName] = useState(initial?.name ?? "New Garden Build");
  const [seasonYear, setSeasonYear] = useState(String(initial?.seasonYear ?? new Date().getFullYear()));
  const [canvasWidthIn, setCanvasWidthIn] = useState(String(initial?.canvasWidthIn ?? 240));
  const [canvasHeightIn, setCanvasHeightIn] = useState(String(initial?.canvasHeightIn ?? 160));
  const [backgroundColor, setBackgroundColor] = useState(initial?.backgroundColor ?? "#FAF3E0");
  const [notes, setNotes] = useState(initial?.notes ?? "");

  return (
    <form
      className="space-y-3"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({
          name,
          seasonYear: Number(seasonYear),
          canvasWidthIn: Number(canvasWidthIn),
          canvasHeightIn: Number(canvasHeightIn),
          backgroundColor,
          notes,
        });
      }}
    >
      <label className="block text-sm text-earth">
        Name
        <Input value={name} onChange={(event) => setName(event.target.value)} required />
      </label>
      <div className="grid grid-cols-3 gap-2">
        <label className="block text-sm text-earth">
          Season Year
          <Input type="number" value={seasonYear} onChange={(event) => setSeasonYear(event.target.value)} required />
        </label>
        <label className="block text-sm text-earth">
          Width (in)
          <Input type="number" value={canvasWidthIn} onChange={(event) => setCanvasWidthIn(event.target.value)} required />
        </label>
        <label className="block text-sm text-earth">
          Height (in)
          <Input type="number" value={canvasHeightIn} onChange={(event) => setCanvasHeightIn(event.target.value)} required />
        </label>
      </div>
      <label className="block text-sm text-earth">
        Background
        <Input type="color" value={backgroundColor} onChange={(event) => setBackgroundColor(event.target.value)} />
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
        <Button type="submit">Save Build</Button>
      </div>
    </form>
  );
}


