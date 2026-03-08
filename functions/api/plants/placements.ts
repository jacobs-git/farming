import { queryAll } from "../../_shared/db";
import { badRequest, internalError, validationFailed } from "../../_shared/errors";
import { asNumber, isHexColor, nowIso, ok, parseJson, randomId, requiredString, type Env } from "../../_shared/http";
import { ensureSeedData } from "../../_shared/seed";

type PlacementInput = {
  buildId?: unknown;
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

export const onRequestGet: PagesFunction<Env> = async ({ env, request }) => {
  try {
    await ensureSeedData(env);
    const url = new URL(request.url);
    const buildId = url.searchParams.get("buildId");
    if (!buildId) return badRequest("buildId query param is required.");

    const rows = await queryAll(
      env.DB.prepare(`SELECT ${SELECT_COLS} FROM plant_placements WHERE build_id = ? ORDER BY created_at ASC`).bind(buildId)
    );
    return ok(rows);
  } catch (error) {
    return internalError(error);
  }
};

export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  try {
    const body = await parseJson<PlacementInput>(request);
    const buildId = requiredString(body.buildId, 1, 120);
    const bedId = requiredString(body.bedId, 1, 120);
    const plantCatalogId = typeof body.plantCatalogId === "string" && body.plantCatalogId.trim() ? body.plantCatalogId : null;
    const name = requiredString(body.name, 1, 120);
    const xIn = asNumber(body.xIn);
    const yIn = asNumber(body.yIn);
    const widthIn = asNumber(body.widthIn);
    const heightIn = asNumber(body.heightIn);
    const color = requiredString(body.color ?? "#7DB87A", 7, 7);
    const label = typeof body.label === "string" ? body.label.trim() : null;
    const notes = typeof body.notes === "string" ? body.notes.trim() : null;

    const details: Record<string, string> = {};
    if (!buildId) details.buildId = "buildId is required.";
    if (!bedId) details.bedId = "bedId is required.";
    if (!name) details.name = "name is required.";
    if (xIn == null || xIn < 0) details.xIn = "xIn must be >= 0.";
    if (yIn == null || yIn < 0) details.yIn = "yIn must be >= 0.";
    if (widthIn == null || widthIn <= 0) details.widthIn = "widthIn must be > 0.";
    if (heightIn == null || heightIn <= 0) details.heightIn = "heightIn must be > 0.";
    if (!color || !isHexColor(color)) details.color = "color must be a hex color.";
    if (Object.keys(details).length > 0) return validationFailed(details);

    const bed = await env.DB.prepare("SELECT id, build_id, width_in, height_in FROM beds WHERE id = ?").bind(bedId).first<Record<string, unknown>>();
    if (!bed) return badRequest("bedId does not exist.");
    if (String(bed.build_id) !== buildId) return badRequest("bedId does not belong to buildId.");

    const clamped = clampPlacement(
      xIn as number,
      yIn as number,
      widthIn as number,
      heightIn as number,
      Number(bed.width_in),
      Number(bed.height_in)
    );

    const id = randomId("placement");
    const timestamp = nowIso();

    await env.DB.prepare(
      `INSERT INTO plant_placements (
        id, build_id, bed_id, plant_catalog_id, name, x_in, y_in, width_in, height_in, color, label, notes, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        id,
        buildId,
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
        timestamp,
        timestamp
      )
      .run();

    const row = await env.DB.prepare(`SELECT ${SELECT_COLS} FROM plant_placements WHERE id = ?`).bind(id).first();
    return ok(row, 201);
  } catch (error) {
    if (error instanceof Error && error.message === "invalid_json") return badRequest("Malformed JSON body.");
    return internalError(error);
  }
};
