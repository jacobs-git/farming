import type { Bed, Build, PlantCatalogItem, PlantPlacement } from "../../types/global";
import { BedList } from "../lists/BedList";
import { BuildList } from "../lists/BuildList";
import { PlantCatalogList } from "../lists/PlantCatalogList";
import { PlantPlacementList } from "../lists/PlantPlacementList";
import { Button } from "../ui/Button";
import { Panel } from "../ui/Panel";

interface LeftSidebarProps {
  builds: Build[];
  activeBuildId: string | null;
  beds: Bed[];
  catalog: PlantCatalogItem[];
  placements: PlantPlacement[];
  selectedBedId: string | null;
  selectedPlacementId: string | null;
  onSelectBuild: (id: string) => void;
  onSelectBed: (id: string) => void;
  onSelectPlacement: (id: string) => void;
  onSelectCatalogItem: (item: PlantCatalogItem) => void;
  onAddBuild: () => void;
  onAddBed: () => void;
  onAddPlantType: () => void;
  onAddPlacement: () => void;
}

export function LeftSidebar({
  builds,
  activeBuildId,
  beds,
  catalog,
  placements,
  selectedBedId,
  selectedPlacementId,
  onSelectBuild,
  onSelectBed,
  onSelectPlacement,
  onSelectCatalogItem,
  onAddBuild,
  onAddBed,
  onAddPlantType,
  onAddPlacement,
}: LeftSidebarProps) {
  return (
    <div className="space-y-3">
      <Panel title="Builds" actions={<Button variant="secondary" onClick={onAddBuild}>+ Build</Button>}>
        <BuildList builds={builds} activeBuildId={activeBuildId} onSelect={onSelectBuild} />
      </Panel>

      <Panel title="Beds" actions={<Button variant="secondary" onClick={onAddBed}>+ Bed</Button>}>
        <BedList beds={beds} selectedBedId={selectedBedId} onSelect={onSelectBed} />
      </Panel>

      <Panel title="Plant Catalog" actions={<Button variant="secondary" onClick={onAddPlantType}>+ Type</Button>}>
        <PlantCatalogList items={catalog} onPick={onSelectCatalogItem} />
      </Panel>

      <Panel title="Plant Placements" actions={<Button variant="secondary" onClick={onAddPlacement}>+ Place</Button>}>
        <PlantPlacementList placements={placements} selectedPlacementId={selectedPlacementId} onSelect={onSelectPlacement} />
      </Panel>
    </div>
  );
}
