import { useEffect, useState } from "react";
import type { Bed, Build, PlantPlacement, Selection } from "../../types/global";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Panel } from "../ui/Panel";

interface RightInspectorProps {
  selection: Selection;
  selectedBuild: Build | null;
  selectedBed: Bed | null;
  selectedPlacement: PlantPlacement | null;
  onUpdateBuild: (id: string, patch: Partial<Build>) => void;
  onUpdateBed: (id: string, patch: Partial<Bed>) => void;
  onDeleteBed: (id: string) => void;
  onDuplicateBed: (id: string) => void;
  onUpdatePlacement: (id: string, patch: Partial<PlantPlacement>) => void;
  onDeletePlacement: (id: string) => void;
  onDeleteBuild: (id: string) => void;
}

export function RightInspector({
  selection,
  selectedBuild,
  selectedBed,
  selectedPlacement,
  onUpdateBuild,
  onUpdateBed,
  onDeleteBed,
  onDuplicateBed,
  onUpdatePlacement,
  onDeletePlacement,
  onDeleteBuild,
}: RightInspectorProps) {
  const [draft, setDraft] = useState<Record<string, string>>({});

  useEffect(() => {
    setDraft({});
  }, [selection?.type, selection?.id]);

  if (!selection) {
    return <Panel title="Inspector">Select a build, bed, or plant placement to edit.</Panel>;
  }

  if (selection.type === "build" && selectedBuild) {
    return (
      <Panel title="Build Inspector">
        <div className="space-y-3">
          <label className="block text-sm text-earth">
            Name
            <Input
              value={draft.name ?? selectedBuild.name}
              onChange={(event) => setDraft((prev) => ({ ...prev, name: event.target.value }))}
              onBlur={() => onUpdateBuild(selectedBuild.id, { name: draft.name ?? selectedBuild.name })}
            />
          </label>
          <label className="block text-sm text-earth">
            Canvas Width (in)
            <Input
              type="number"
              value={draft.canvasWidthIn ?? String(selectedBuild.canvasWidthIn)}
              onChange={(event) => setDraft((prev) => ({ ...prev, canvasWidthIn: event.target.value }))}
              onBlur={() => onUpdateBuild(selectedBuild.id, { canvasWidthIn: Number(draft.canvasWidthIn ?? selectedBuild.canvasWidthIn) })}
            />
          </label>
          <label className="block text-sm text-earth">
            Canvas Height (in)
            <Input
              type="number"
              value={draft.canvasHeightIn ?? String(selectedBuild.canvasHeightIn)}
              onChange={(event) => setDraft((prev) => ({ ...prev, canvasHeightIn: event.target.value }))}
              onBlur={() => onUpdateBuild(selectedBuild.id, { canvasHeightIn: Number(draft.canvasHeightIn ?? selectedBuild.canvasHeightIn) })}
            />
          </label>
          <label className="block text-sm text-earth">
            Background Color
            <Input
              type="color"
              value={draft.backgroundColor ?? selectedBuild.backgroundColor}
              onChange={(event) => setDraft((prev) => ({ ...prev, backgroundColor: event.target.value }))}
              onBlur={() => onUpdateBuild(selectedBuild.id, { backgroundColor: draft.backgroundColor ?? selectedBuild.backgroundColor })}
            />
          </label>
          <label className="block text-sm text-earth">
            Notes
            <textarea
              rows={3}
              className="w-full rounded-md border border-panel bg-cream px-2 py-1.5 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage/60"
              value={draft.notes ?? (selectedBuild.notes ?? "")}
              onChange={(event) => setDraft((prev) => ({ ...prev, notes: event.target.value }))}
              onBlur={() => onUpdateBuild(selectedBuild.id, { notes: draft.notes ?? selectedBuild.notes ?? "" })}
            />
          </label>
          <Button variant="danger" onClick={() => onDeleteBuild(selectedBuild.id)}>
            Delete Build
          </Button>
        </div>
      </Panel>
    );
  }

  if (selection.type === "bed" && selectedBed) {
    return (
      <Panel title="Bed Inspector">
        <div className="space-y-3">
          <label className="block text-sm text-earth">
            Name
            <Input
              value={draft.name ?? selectedBed.name}
              onChange={(event) => setDraft((prev) => ({ ...prev, name: event.target.value }))}
              onBlur={() => onUpdateBed(selectedBed.id, { name: draft.name ?? selectedBed.name })}
            />
          </label>
          <div className="grid grid-cols-2 gap-2">
            <label className="block text-sm text-earth">
              X
              <Input
                type="number"
                value={draft.xIn ?? String(selectedBed.xIn)}
                onChange={(event) => setDraft((prev) => ({ ...prev, xIn: event.target.value }))}
                onBlur={() => onUpdateBed(selectedBed.id, { xIn: Number(draft.xIn ?? selectedBed.xIn) })}
              />
            </label>
            <label className="block text-sm text-earth">
              Y
              <Input
                type="number"
                value={draft.yIn ?? String(selectedBed.yIn)}
                onChange={(event) => setDraft((prev) => ({ ...prev, yIn: event.target.value }))}
                onBlur={() => onUpdateBed(selectedBed.id, { yIn: Number(draft.yIn ?? selectedBed.yIn) })}
              />
            </label>
            <label className="block text-sm text-earth">
              Width
              <Input
                type="number"
                value={draft.widthIn ?? String(selectedBed.widthIn)}
                onChange={(event) => setDraft((prev) => ({ ...prev, widthIn: event.target.value }))}
                onBlur={() => onUpdateBed(selectedBed.id, { widthIn: Number(draft.widthIn ?? selectedBed.widthIn) })}
              />
            </label>
            <label className="block text-sm text-earth">
              Height
              <Input
                type="number"
                value={draft.heightIn ?? String(selectedBed.heightIn)}
                onChange={(event) => setDraft((prev) => ({ ...prev, heightIn: event.target.value }))}
                onBlur={() => onUpdateBed(selectedBed.id, { heightIn: Number(draft.heightIn ?? selectedBed.heightIn) })}
              />
            </label>
          </div>
          <label className="block text-sm text-earth">
            Kind
            <Input
              value={draft.kind ?? selectedBed.kind}
              onChange={(event) => setDraft((prev) => ({ ...prev, kind: event.target.value }))}
              onBlur={() => onUpdateBed(selectedBed.id, { kind: draft.kind ?? selectedBed.kind })}
            />
          </label>
          <label className="block text-sm text-earth">
            Color
            <Input
              type="color"
              value={draft.color ?? selectedBed.color}
              onChange={(event) => setDraft((prev) => ({ ...prev, color: event.target.value }))}
              onBlur={() => onUpdateBed(selectedBed.id, { color: draft.color ?? selectedBed.color })}
            />
          </label>
          <label className="block text-sm text-earth">
            Border Color
            <Input
              type="color"
              value={draft.borderColor ?? selectedBed.borderColor}
              onChange={(event) => setDraft((prev) => ({ ...prev, borderColor: event.target.value }))}
              onBlur={() => onUpdateBed(selectedBed.id, { borderColor: draft.borderColor ?? selectedBed.borderColor })}
            />
          </label>
          <label className="block text-sm text-earth">
            Notes
            <textarea
              rows={3}
              className="w-full rounded-md border border-panel bg-cream px-2 py-1.5 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage/60"
              value={draft.notes ?? (selectedBed.notes ?? "")}
              onChange={(event) => setDraft((prev) => ({ ...prev, notes: event.target.value }))}
              onBlur={() => onUpdateBed(selectedBed.id, { notes: draft.notes ?? selectedBed.notes ?? "" })}
            />
          </label>
          <div className="flex flex-wrap gap-2 pt-2">
            <Button variant="secondary" onClick={() => onDuplicateBed(selectedBed.id)}>
              Duplicate Bed
            </Button>
            <Button variant="danger" onClick={() => onDeleteBed(selectedBed.id)}>
              Delete Bed
            </Button>
          </div>
        </div>
      </Panel>
    );
  }

  if (selection.type === "placement" && selectedPlacement) {
    return (
      <Panel title="Plant Inspector">
        <div className="space-y-3">
          <label className="block text-sm text-earth">
            Name
            <Input
              value={draft.name ?? selectedPlacement.name}
              onChange={(event) => setDraft((prev) => ({ ...prev, name: event.target.value }))}
              onBlur={() => onUpdatePlacement(selectedPlacement.id, { name: draft.name ?? selectedPlacement.name })}
            />
          </label>
          <label className="block text-sm text-earth">
            Label
            <Input
              value={draft.label ?? (selectedPlacement.label ?? "")}
              onChange={(event) => setDraft((prev) => ({ ...prev, label: event.target.value }))}
              onBlur={() => onUpdatePlacement(selectedPlacement.id, { label: draft.label ?? selectedPlacement.label ?? "" })}
            />
          </label>
          <div className="grid grid-cols-2 gap-2">
            <label className="block text-sm text-earth">
              X
              <Input
                type="number"
                value={draft.xIn ?? String(selectedPlacement.xIn)}
                onChange={(event) => setDraft((prev) => ({ ...prev, xIn: event.target.value }))}
                onBlur={() => onUpdatePlacement(selectedPlacement.id, { xIn: Number(draft.xIn ?? selectedPlacement.xIn) })}
              />
            </label>
            <label className="block text-sm text-earth">
              Y
              <Input
                type="number"
                value={draft.yIn ?? String(selectedPlacement.yIn)}
                onChange={(event) => setDraft((prev) => ({ ...prev, yIn: event.target.value }))}
                onBlur={() => onUpdatePlacement(selectedPlacement.id, { yIn: Number(draft.yIn ?? selectedPlacement.yIn) })}
              />
            </label>
            <label className="block text-sm text-earth">
              Width
              <Input
                type="number"
                value={draft.widthIn ?? String(selectedPlacement.widthIn)}
                onChange={(event) => setDraft((prev) => ({ ...prev, widthIn: event.target.value }))}
                onBlur={() => onUpdatePlacement(selectedPlacement.id, { widthIn: Number(draft.widthIn ?? selectedPlacement.widthIn) })}
              />
            </label>
            <label className="block text-sm text-earth">
              Height
              <Input
                type="number"
                value={draft.heightIn ?? String(selectedPlacement.heightIn)}
                onChange={(event) => setDraft((prev) => ({ ...prev, heightIn: event.target.value }))}
                onBlur={() => onUpdatePlacement(selectedPlacement.id, { heightIn: Number(draft.heightIn ?? selectedPlacement.heightIn) })}
              />
            </label>
          </div>
          <label className="block text-sm text-earth">
            Color
            <Input
              type="color"
              value={draft.color ?? selectedPlacement.color}
              onChange={(event) => setDraft((prev) => ({ ...prev, color: event.target.value }))}
              onBlur={() => onUpdatePlacement(selectedPlacement.id, { color: draft.color ?? selectedPlacement.color })}
            />
          </label>
          <label className="block text-sm text-earth">
            Notes
            <textarea
              rows={3}
              className="w-full rounded-md border border-panel bg-cream px-2 py-1.5 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage/60"
              value={draft.notes ?? (selectedPlacement.notes ?? "")}
              onChange={(event) => setDraft((prev) => ({ ...prev, notes: event.target.value }))}
              onBlur={() => onUpdatePlacement(selectedPlacement.id, { notes: draft.notes ?? selectedPlacement.notes ?? "" })}
            />
          </label>
          <Button variant="danger" onClick={() => onDeletePlacement(selectedPlacement.id)}>
            Delete Placement
          </Button>
        </div>
      </Panel>
    );
  }

  return <Panel title="Inspector">No item selected.</Panel>;
}

