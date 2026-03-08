import { queryAll } from "../../_shared/db";
import { badRequest, internalError, validationFailed } from "../../_shared/errors";
import { asNumber, isHexColor, nowIso, ok, parseJson, randomId, requiredString, type Env } from "../../_shared/http";
import { ensureSeedData } from "../../_shared/seed";

type BedInput = {
  buildId?: unknown;
  name?: unknown;
  kind?: unknown;
  xIn?: unknown;
  yIn?: unknown;
  widthIn?: unknown;
  heightIn?: unknown;
  color?: unknown;
  borderColor?: unknown;
  rotationDeg?: unknown;
  notes?: unknown;
};

const SELECT_COLS = `id, build_id as buildId, name, kind, x_in as xIn, y_in as yIn,
                     width_in as widthIn, height_in as heightIn, color, border_color as borderColor,
                     rotation_deg as rotationDeg, notes, created_at as createdAt, updated_at as updatedAt`;

export const onRequestGet: PagesFunction<Env> = async ({ env, request }) => {
  try {
    await ensureSeedData(env);
    const url = new URL(request.url);
    const buildId = url.searchParams.get("buildId");
    if (!buildId) return badRequest("buildId query param is required.");

    const rows = await queryAll(
      env.DB.prepare(`SELECT ${SELECT_COLS} FROM beds WHERE build_id = ? ORDER BY created_at ASC`).bind(buildId)
    );
    return ok(rows);
  } catch (error) {
    return internalError(error);
  }
};

export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  try {
    const body = await parseJson<BedInput>(request);
    const buildId = requiredString(body.buildId, 1, 120);
    const name = requiredString(body.name, 1, 120);
    const kind = requiredString(body.kind ?? "raised", 1, 60);
    const xIn = asNumber(body.xIn);
    const yIn = asNumber(body.yIn);
    const widthIn = asNumber(body.widthIn);
    const heightIn = asNumber(body.heightIn);
    const color = requiredString(body.color ?? "#8B5E3C", 7, 7);
    const borderColor = requiredString(body.borderColor ?? "#5C3D1E", 7, 7);
    const rotationDeg = asNumber(body.rotationDeg ?? 0) ?? 0;
    const notes = typeof body.notes === "string" ? body.notes.trim() : null;

    const details: Record<string, string> = {};
    if (!buildId) details.buildId = "buildId is required.";
    if (!name) details.name = "name is required.";
    if (!kind) details.kind = "kind is required.";
    if (xIn == null || xIn < 0) details.xIn = "xIn must be >= 0.";
    if (yIn == null || yIn < 0) details.yIn = "yIn must be >= 0.";
    if (widthIn == null || widthIn <= 0) details.widthIn = "widthIn must be > 0.";
    if (heightIn == null || heightIn <= 0) details.heightIn = "heightIn must be > 0.";
    if (!color || !isHexColor(color)) details.color = "color must be a hex color.";
    if (!borderColor || !isHexColor(borderColor)) details.borderColor = "borderColor must be a hex color.";
    if (Object.keys(details).length > 0) return validationFailed(details);

    const buildExists = await env.DB.prepare("SELECT id FROM builds WHERE id = ?").bind(buildId).first();
    if (!buildExists) return badRequest("buildId does not exist.");

    const id = randomId("bed");
    const timestamp = nowIso();

    await env.DB.prepare(
      `INSERT INTO beds (id, build_id, name, kind, x_in, y_in, width_in, height_in, color, border_color, rotation_deg, notes, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(id, buildId, name, kind, xIn, yIn, widthIn, heightIn, color, borderColor, rotationDeg, notes, timestamp, timestamp)
      .run();

    const row = await env.DB.prepare(`SELECT ${SELECT_COLS} FROM beds WHERE id = ?`).bind(id).first();
    return ok(row, 201);
  } catch (error) {
    if (error instanceof Error && error.message === "invalid_json") return badRequest("Malformed JSON body.");
    return internalError(error);
  }
};
