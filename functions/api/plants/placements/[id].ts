import { badRequest, internalError, notFound, validationFailed } from "../../../_shared/errors";
import { asNumber, isHexColor, nowIso, ok, parseJson, requiredString, type Env } from "../../../_shared/http";

type PlacementPatchInput = {
  bedId?: unknown;
  plantCatalogId?: unknown;
  name?: unknown;
  xIn?: unknown;
  yIn?: unknown;
  widthIn?: unknown;
  heightIn?: unknown;
  color?: unknown;
  label?: unknown;
  notes?: unknown;
};

const SELECT_COLS = `id, build_id as buildId, bed_id as bedId, plant_catalog_id as plantCatalogId, name,
                     x_in as xIn, y_in as yIn, width_in as widthIn, height_in as heightIn,
                     color, label, notes, created_at as createdAt, updated_at as updatedAt`;

function clampPlacement(x: number, y: number, width: number, height: number, bedWidth: number, bedHeight: number) {
  const clampedWidth = Math.min(width, bedWidth);
  const clampedHeight = Math.min(height, bedHeight);
  const maxX = Math.max(0, bedWidth - clampedWidth);
  const maxY = Math.max(0, bedHeight - clampedHeight);
  return {
    x: Math.max(0, Math.min(x, maxX)),
    y: Math.max(0, Math.min(y, maxY)),
    width: Math.max(1, clampedWidth),
    height: Math.max(1, clampedHeight),
  };
}

export const onRequestPatch: PagesFunction<Env> = async ({ env, params, request }) => {
  try {
    const existing = await env.DB.prepare("SELECT * FROM plant_placements WHERE id = ?").bind(params.id).first<Record<string, unknown>>();
    if (!existing) return notFound("plant placement");

    const body = await parseJson<PlacementPatchInput>(request);
    const details: Record<string, string> = {};

    let bedId = String(existing.bed_id);
    if (body.bedId !== undefined) {
      const parsed = requiredString(body.bedId, 1, 120);
      if (!parsed) details.bedId = "bedId is invalid.";
      else bedId = parsed;
    }

    const name = body.name !== undefined ? requiredString(body.name, 1, 120) : String(existing.name);
    if (!name) details.name = "name is invalid.";

    const xIn = body.xIn !== undefined ? asNumber(body.xIn) : Number(existing.x_in);
    const yIn = body.yIn !== undefined ? asNumber(body.yIn) : Number(existing.y_in);
    const widthIn = body.widthIn !== undefined ? asNumber(body.widthIn) : Number(existing.width_in);
    const heightIn = body.heightIn !== undefined ? asNumber(body.heightIn) : Number(existing.height_in);

    if (xIn == null || xIn < 0) details.xIn = "xIn must be >= 0.";
    if (yIn == null || yIn < 0) details.yIn = "yIn must be >= 0.";
    if (widthIn == null || widthIn <= 0) details.widthIn = "widthIn must be > 0.";
    if (heightIn == null || heightIn <= 0) details.heightIn = "heightIn must be > 0.";

    let color = String(existing.color);
    if (body.color !== undefined) {
      const value = requiredString(body.color, 7, 7);
      if (!value || !isHexColor(value)) details.color = "color must be a hex color.";
      else color = value;
    }

    if (Object.keys(details).length > 0) return validationFailed(details);

    const bed = await env.DB.prepare("SELECT id, build_id, width_in, height_in FROM beds WHERE id = ?").bind(bedId).first<Record<string, unknown>>();
    if (!bed) return badRequest("bedId does not exist.");
    if (String(bed.build_id) !== String(existing.build_id)) return badRequest("bedId must belong to same build.");

    const clamped = clampPlacement(
      xIn as number,
      yIn as number,
      widthIn as number,
      heightIn as number,
      Number(bed.width_in),
      Number(bed.height_in)
    );

    const plantCatalogId =
      body.plantCatalogId !== undefined
        ? typeof body.plantCatalogId === "string" && body.plantCatalogId.trim()
          ? body.plantCatalogId
          : null
        : existing.plant_catalog_id ?? null;

    const label = body.label !== undefined ? (typeof body.label === "string" ? body.label.trim() : null) : existing.label ?? null;
    const notes = body.notes !== undefined ? (typeof body.notes === "string" ? body.notes.trim() : null) : existing.notes ?? null;

    await env.DB.prepare(
      `UPDATE plant_placements
       SET bed_id = ?, plant_catalog_id = ?, name = ?, x_in = ?, y_in = ?, width_in = ?, height_in = ?,
           color = ?, label = ?, notes = ?, updated_at = ?
       WHERE id = ?`
    )
      .bind(
        bedId,
        plantCatalogId,
        name,
        clamped.x,
        clamped.y,
        clamped.width,
        clamped.height,
        color,
        label,
        notes,
        nowIso(),
        params.id
      )
      .run();

    const row = await env.DB.prepare(`SELECT ${SELECT_COLS} FROM plant_placements WHERE id = ?`).bind(params.id).first();
    return ok(row);
  } catch (error) {
    if (error instanceof Error && error.message === "invalid_json") return badRequest("Malformed JSON body.");
    return internalError(error);
  }
};

export const onRequestDelete: PagesFunction<Env> = async ({ env, params }) => {
  try {
    const existing = await env.DB.prepare("SELECT id FROM plant_placements WHERE id = ?").bind(params.id).first();
    if (!existing) return notFound("plant placement");

    await env.DB.prepare("DELETE FROM plant_placements WHERE id = ?").bind(params.id).run();
    return ok({ id: params.id, deleted: true });
  } catch (error) {
    return internalError(error);
  }
};
