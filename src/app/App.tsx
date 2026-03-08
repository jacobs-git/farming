import { useEffect, useMemo, useState } from "react";
import { PlannerCanvas } from "../components/canvas/PlannerCanvas";
import { BedForm } from "../components/forms/BedForm";
import { BuildForm } from "../components/forms/BuildForm";
import { PlantPlacementForm } from "../components/forms/PlantPlacementForm";
import { PlantTypeForm } from "../components/forms/PlantTypeForm";
import { AppShell } from "../components/layout/AppShell";
import { LeftSidebar } from "../components/layout/LeftSidebar";
import { RightInspector } from "../components/layout/RightInspector";
import { StatusBar } from "../components/layout/StatusBar";
import { TopBar } from "../components/layout/TopBar";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { createBed, deleteBed, duplicateBed, listBeds, updateBed } from "../features/beds/bed.api";
import { bedStore, useBedStore } from "../features/beds/bed.store";
import { createDefaultBedInput } from "../features/beds/bed.utils";
import { createBuild, deleteBuild, listBuilds, updateBuild } from "../features/builds/build.api";
import { buildStore, useBuildStore } from "../features/builds/build.store";
import { createDefaultBuildInput } from "../features/builds/build.utils";
import {
  createPlantCatalog,
  createPlantPlacement,
  deletePlantCatalog,
  deletePlantPlacement,
  listPlantCatalog,
  listPlantPlacements,
  updatePlantCatalog,
  updatePlantPlacement,
} from "../features/plants/plant.api";
import { plantStore, usePlantStore } from "../features/plants/plant.store";
import { createDefaultPlacementInput, createDefaultPlantCatalogInput } from "../features/plants/plant.utils";
import { plannerStore, usePlannerStore } from "../features/planner/planner.store";
import { useAutosave } from "../hooks/useAutosave";
import { useToast } from "../hooks/useToast";
import type { Bed, Build, PlantCatalogItem, PlantPlacement } from "../types/global";

export function App() {
  const builds = useBuildStore((state) => state.builds);
  const activeBuildId = useBuildStore((state) => state.activeBuildId);
  const beds = useBedStore((state) => state.beds);
  const catalog = usePlantStore((state) => state.catalog);
  const placements = usePlantStore((state) => state.placements);

  const zoom = usePlannerStore((state) => state.zoom);
  const showGrid = usePlannerStore((state) => state.showGrid);
  const snapEnabled = usePlannerStore((state) => state.snapEnabled);
  const selection = usePlannerStore((state) => state.selection);
  const saveState = usePlannerStore((state) => state.saveState);
  const lastSavedAt = usePlannerStore((state) => state.lastSavedAt);

  const [modal, setModal] = useState<"build" | "bed" | "plantType" | "placement" | null>(null);
  const [placementSeed, setPlacementSeed] = useState<Partial<PlantPlacement> | null>(null);
  const [editingPlantType, setEditingPlantType] = useState<PlantCatalogItem | null>(null);
  const { schedule } = useAutosave();
  const toast = useToast();

  const activeBuild = useMemo(() => builds.find((build) => build.id === activeBuildId) ?? null, [builds, activeBuildId]);

  const selectedBedId = selection?.type === "bed" ? selection.id : null;
  const selectedPlacementId = selection?.type === "placement" ? selection.id : null;

  const selectedBed = useMemo(() => beds.find((bed) => bed.id === selectedBedId) ?? null, [beds, selectedBedId]);
  const selectedPlacement = useMemo(
    () => placements.find((placement) => placement.id === selectedPlacementId) ?? null,
    [placements, selectedPlacementId]
  );

  function openPlacementModal() {
    if (!activeBuildId) return;
    if (activeBeds.length === 0) {
      toast.push("Create a bed first.");
      return;
    }
    setPlacementSeed(null);
    setModal("placement");
  }

  useEffect(() => {
    void (async () => {
      try {
        buildStore.setLoading(true);
        const [buildRows, plantRows] = await Promise.all([listBuilds(), listPlantCatalog()]);
        buildStore.setBuilds(buildRows);
        plantStore.setCatalog(plantRows);

        const firstId = buildStore.getState().activeBuildId;
        if (firstId) {
          const [bedRows, placementRows] = await Promise.all([listBeds(firstId), listPlantPlacements(firstId)]);
          bedStore.setBeds(bedRows);
          plantStore.setPlacements(placementRows);
          plannerStore.setSelection({ type: "build", id: firstId });
        }
      } catch (error) {
        toast.push(error instanceof Error ? error.message : "Failed to load app data");
      } finally {
        buildStore.setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!activeBuildId) {
      bedStore.setBeds([]);
      plantStore.setPlacements([]);
      return;
    }

    void (async () => {
      try {
        const [bedRows, placementRows] = await Promise.all([listBeds(activeBuildId), listPlantPlacements(activeBuildId)]);
        bedStore.setBeds(bedRows);
        plantStore.setPlacements(placementRows);
      } catch (error) {
        toast.push(error instanceof Error ? error.message : "Failed to load build data");
      }
    })();
  }, [activeBuildId]);

  function patchBedLocal(id: string, patch: Partial<Bed>) {
    const current = bedStore.getState().beds.find((item) => item.id === id);
    if (!current) return;
    bedStore.upsertBed({ ...current, ...patch });
  }

  function patchPlacementLocal(id: string, patch: Partial<PlantPlacement>) {
    const current = plantStore.getState().placements.find((item) => item.id === id);
    if (!current) return;
    plantStore.upsertPlacement({ ...current, ...patch });
  }

  function patchBuildLocal(id: string, patch: Partial<Build>) {
    const current = buildStore.getState().builds.find((item) => item.id === id);
    if (!current) return;
    buildStore.upsertBuild({ ...current, ...patch });
  }

  async function handleCreateBuild(payload: {
    name: string;
    seasonYear: number;
    canvasWidthIn: number;
    canvasHeightIn: number;
    backgroundColor: string;
    notes: string;
  }) {
    try {
      const created = await createBuild(payload);
      buildStore.upsertBuild(created);
      buildStore.setActiveBuildId(created.id);
      plannerStore.setSelection({ type: "build", id: created.id });
      setModal(null);
      toast.push("Build created.");
    } catch (error) {
      toast.push(error instanceof Error ? error.message : "Failed to create build");
    }
  }

  async function handleCreateBed(payload: {
    name: string;
    kind: string;
    xIn: number;
    yIn: number;
    widthIn: number;
    heightIn: number;
    color: string;
    borderColor: string;
    notes: string;
  }) {
    if (!activeBuildId) return;
    try {
      const created = await createBed({ buildId: activeBuildId, rotationDeg: 0, ...payload });
      bedStore.upsertBed(created);
      plannerStore.setSelection({ type: "bed", id: created.id });
      setModal(null);
    } catch (error) {
      toast.push(error instanceof Error ? error.message : "Failed to create bed");
    }
  }

  async function handleCreatePlantType(payload: {
    name: string;
    category: string;
    defaultWidthIn: number;
    defaultHeightIn: number;
    defaultColor: string;
    notes: string;
  }) {
    try {
      if (editingPlantType) {
        const saved = await updatePlantCatalog(editingPlantType.id, payload);
        plantStore.upsertCatalogItem(saved);
      } else {
        const created = await createPlantCatalog(payload);
        plantStore.upsertCatalogItem(created);
      }
      setEditingPlantType(null);
      setModal(null);
    } catch (error) {
      toast.push(error instanceof Error ? error.message : "Failed to create plant type");
    }
  }

  async function handleCreatePlacement(payload: {
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
  }) {
    try {
      const created = await createPlantPlacement(payload);
      plantStore.upsertPlacement(created);
      plannerStore.setSelection({ type: "placement", id: created.id });
      setModal(null);
      setPlacementSeed(null);
    } catch (error) {
      toast.push(error instanceof Error ? error.message : "Failed to create placement");
    }
  }

  function handleUpdateBuild(id: string, patch: Partial<Build>) {
    patchBuildLocal(id, patch);
    schedule(`build:${id}`, async () => {
      const saved = await updateBuild(id, {
        name: patch.name,
        seasonYear: patch.seasonYear,
        canvasWidthIn: patch.canvasWidthIn,
        canvasHeightIn: patch.canvasHeightIn,
        backgroundColor: patch.backgroundColor,
        notes: patch.notes,
      });
      buildStore.upsertBuild(saved);
    });
  }

  function handleUpdateBed(id: string, patch: Partial<Bed>) {
    patchBedLocal(id, patch);
    schedule(`bed:${id}`, async () => {
      const saved = await updateBed(id, {
        name: patch.name,
        kind: patch.kind,
        xIn: patch.xIn,
        yIn: patch.yIn,
        widthIn: patch.widthIn,
        heightIn: patch.heightIn,
        color: patch.color,
        borderColor: patch.borderColor,
        rotationDeg: patch.rotationDeg,
        notes: patch.notes,
      });
      bedStore.upsertBed(saved);
    });
  }

  function handleUpdatePlacement(id: string, patch: Partial<PlantPlacement>) {
    patchPlacementLocal(id, patch);
    schedule(`placement:${id}`, async () => {
      const saved = await updatePlantPlacement(id, {
        bedId: patch.bedId,
        plantCatalogId: patch.plantCatalogId,
        name: patch.name,
        xIn: patch.xIn,
        yIn: patch.yIn,
        widthIn: patch.widthIn,
        heightIn: patch.heightIn,
        color: patch.color,
        label: patch.label,
        notes: patch.notes,
      });
      plantStore.upsertPlacement(saved);
    });
  }

  async function handleDeleteBuild(id: string) {
    if (!window.confirm("Delete this build and all related beds/placements?")) return;
    try {
      await deleteBuild(id);
      buildStore.removeBuild(id);
      plannerStore.setSelection(null);
      toast.push("Build deleted.");
    } catch (error) {
      toast.push(error instanceof Error ? error.message : "Failed to delete build");
    }
  }

  async function handleDeleteBed(id: string) {
    if (!window.confirm("Delete this bed?")) return;
    try {
      await deleteBed(id);
      bedStore.removeBed(id);
      plantStore.removePlacementsForBed(id);
      plannerStore.setSelection(null);
    } catch (error) {
      toast.push(error instanceof Error ? error.message : "Failed to delete bed");
    }
  }

  async function handleDuplicateBed(id: string) {
    try {
      const duplicated = await duplicateBed(id);
      bedStore.upsertBed(duplicated);
      plannerStore.setSelection({ type: "bed", id: duplicated.id });
    } catch (error) {
      toast.push(error instanceof Error ? error.message : "Failed to duplicate bed");
    }
  }

  async function handleDeletePlacement(id: string) {
    if (!window.confirm("Delete this plant placement?")) return;
    try {
      await deletePlantPlacement(id);
      plantStore.removePlacement(id);
      plannerStore.setSelection(null);
    } catch (error) {
      toast.push(error instanceof Error ? error.message : "Failed to delete placement");
    }
  }

  async function handleDeleteCatalogItem(id: string) {
    if (!window.confirm("Delete this plant type?")) return;
    try {
      await deletePlantCatalog(id);
      plantStore.removeCatalogItem(id);
      toast.push("Plant type deleted.");
    } catch (error) {
      toast.push(error instanceof Error ? error.message : "Failed to delete plant type");
    }
  }

  function openPlantTypeEditor(item: PlantCatalogItem) {
    setEditingPlantType(item);
    setModal("plantType");
  }

  const activeBeds = useMemo(() => beds.filter((bed) => bed.buildId === activeBuildId), [beds, activeBuildId]);
  const activePlacements = useMemo(
    () => placements.filter((placement) => placement.buildId === activeBuildId),
    [placements, activeBuildId]
  );

  if (!activeBuild) {
    return (
      <div className="flex h-screen items-center justify-center bg-parchment">
        <div className="rounded-xl border border-panel bg-cream p-8 text-center shadow-[0_10px_24px_rgba(44,31,14,.12)]">
          <h1 className="font-display text-3xl text-earth">Garden Planner</h1>
          <p className="mt-2 text-sm text-dust">Create your first shared build to start mapping beds and plant blocks.</p>
          <Button className="mt-5" onClick={() => setModal("build")}>
          Create Your First Build
          </Button>
        </div>

        <Modal open={modal === "build"} title="Create Build" onClose={() => setModal(null)}>
          <BuildForm initial={createDefaultBuildInput()} onSubmit={handleCreateBuild} />
        </Modal>
      </div>
    );
  }

  return (
    <>
      <AppShell
        topBar={
          <TopBar
            onAddBuild={() => setModal("build")}
            onAddBed={() => setModal("bed")}
            onAddPlantType={() => {
              setEditingPlantType(null);
              setModal("plantType");
            }}
            onAddPlacement={openPlacementModal}
            zoom={zoom}
            onZoomChange={(next) => plannerStore.setZoom(next)}
            showGrid={showGrid}
            onToggleGrid={(next) => plannerStore.setShowGrid(next)}
            snapEnabled={snapEnabled}
            onToggleSnap={(next) => plannerStore.setSnapEnabled(next)}
            saveState={saveState}
          />
        }
        leftSidebar={
          <LeftSidebar
            builds={builds}
            activeBuildId={activeBuildId}
            beds={activeBeds}
            catalog={catalog}
            placements={activePlacements}
            selectedBedId={selectedBedId}
            selectedPlacementId={selectedPlacementId}
            onSelectBuild={(id) => {
              buildStore.setActiveBuildId(id);
              plannerStore.setSelection({ type: "build", id });
            }}
            onSelectBed={(id) => plannerStore.setSelection({ type: "bed", id })}
            onSelectPlacement={(id) => plannerStore.setSelection({ type: "placement", id })}
            onSelectCatalogItem={openPlantTypeEditor}
            onAddBuild={() => {
              setEditingPlantType(null);
              setModal("build");
            }}
            onAddBed={() => setModal("bed")}
            onAddPlantType={() => {
              setEditingPlantType(null);
              setModal("plantType");
            }}
            onAddPlacement={openPlacementModal}
          />
        }
        center={
          <PlannerCanvas
            build={activeBuild}
            beds={activeBeds}
            placements={activePlacements}
            selectedBedId={selectedBedId}
            selectedPlacementId={selectedPlacementId}
            zoom={zoom}
            showGrid={showGrid}
            snapEnabled={snapEnabled}
            onClearSelection={() => plannerStore.setSelection(null)}
            onSelectBed={(id) => plannerStore.setSelection({ type: "bed", id })}
            onSelectPlacement={(id) => plannerStore.setSelection({ type: "placement", id })}
            onBedLivePatch={patchBedLocal}
            onBedCommitPatch={handleUpdateBed}
            onPlacementLivePatch={patchPlacementLocal}
            onPlacementCommitPatch={handleUpdatePlacement}
          />
        }
        rightInspector={
          <RightInspector
            selection={selection}
            selectedBuild={selection?.type === "build" ? activeBuild : null}
            selectedBed={selectedBed}
            selectedPlacement={selectedPlacement}
            onUpdateBuild={handleUpdateBuild}
            onUpdateBed={handleUpdateBed}
            onDeleteBed={handleDeleteBed}
            onDuplicateBed={handleDuplicateBed}
            onUpdatePlacement={handleUpdatePlacement}
            onDeletePlacement={handleDeletePlacement}
            onDeleteBuild={handleDeleteBuild}
          />
        }
        statusBar={
          <StatusBar
            saveState={saveState}
            lastSavedAt={lastSavedAt}
            message={toast.messages.at(-1)?.text || "One shared public workspace"}
          />
        }
      />

      <Modal open={modal === "build"} title="Create Build" onClose={() => setModal(null)}>
        <BuildForm initial={createDefaultBuildInput()} onSubmit={handleCreateBuild} />
      </Modal>

      <Modal open={modal === "bed"} title="Create Bed" onClose={() => setModal(null)}>
        <BedForm initial={createDefaultBedInput(activeBuild.id)} onSubmit={handleCreateBed} />
      </Modal>

      <Modal
        open={modal === "plantType"}
        title={editingPlantType ? "Edit Plant Type" : "Create Plant Type"}
        onClose={() => {
          setEditingPlantType(null);
          setModal(null);
        }}
      >
        <PlantTypeForm
          initial={editingPlantType ?? createDefaultPlantCatalogInput()}
          onSubmit={handleCreatePlantType}
        />
        {editingPlantType ? (
          <div className="mt-3 flex justify-end">
            <Button
              variant="danger"
              onClick={async () => {
                await handleDeleteCatalogItem(editingPlantType.id);
                setEditingPlantType(null);
                setModal(null);
              }}
            >
              Delete Plant Type
            </Button>
          </div>
        ) : null}
      </Modal>

      <Modal open={modal === "placement"} title="Create Plant Placement" onClose={() => setModal(null)}>
        <PlantPlacementForm
          beds={activeBeds}
          catalog={catalog}
          defaultBuildId={activeBuild.id}
          initial={placementSeed ?? createDefaultPlacementInput(activeBuild.id, activeBeds[0]?.id ?? "")}
          onSubmit={handleCreatePlacement}
        />
      </Modal>

      <div className="pointer-events-none fixed bottom-4 right-4 z-50 space-y-2">
        {toast.messages.map((message) => (
          <div key={message.id} className="rounded-md border border-panel bg-earth px-3 py-2 text-xs text-cream shadow">
            {message.text}
          </div>
        ))}
      </div>
    </>
  );
}
