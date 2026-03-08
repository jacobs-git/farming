import { queryAll } from "../../_shared/db";
import { badRequest, internalError, validationFailed } from "../../_shared/errors";
import { asNumber, isHexColor, nowIso, ok, parseJson, randomId, requiredString, type Env } from "../../_shared/http";
import { ensureSeedData } from "../../_shared/seed";

type CatalogInput = {
  name?: unknown;
  category?: unknown;
  defaultWidthIn?: unknown;
  defaultHeightIn?: unknown;
  defaultColor?: unknown;
  notes?: unknown;
};

const SELECT_COLS = `id, name, category, default_width_in as defaultWidthIn, default_height_in as defaultHeightIn,
                     default_color as defaultColor, notes, created_at as createdAt, updated_at as updatedAt`;

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  try {
    await ensureSeedData(env);
    const rows = await queryAll(env.DB.prepare(`SELECT ${SELECT_COLS} FROM plant_catalog ORDER BY name ASC`));
    return ok(rows);
  } catch (error) {
    return internalError(error);
  }
};

export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  try {
    const body = await parseJson<CatalogInput>(request);
    const name = requiredString(body.name, 1, 120);
    const category = typeof body.category === "string" ? body.category.trim() || null : null;
    const defaultWidthIn = asNumber(body.defaultWidthIn);
    const defaultHeightIn = asNumber(body.defaultHeightIn);
    const defaultColor = requiredString(body.defaultColor ?? "#7DB87A", 7, 7);
    const notes = typeof body.notes === "string" ? body.notes.trim() : null;

    const details: Record<string, string> = {};
    if (!name) details.name = "name is required.";
    if (defaultWidthIn == null || defaultWidthIn <= 0) details.defaultWidthIn = "defaultWidthIn must be > 0.";
    if (defaultHeightIn == null || defaultHeightIn <= 0) details.defaultHeightIn = "defaultHeightIn must be > 0.";
    if (!defaultColor || !isHexColor(defaultColor)) details.defaultColor = "defaultColor must be a hex color.";
    if (Object.keys(details).length > 0) return validationFailed(details);

    const id = randomId("plant");
    const timestamp = nowIso();
    await env.DB.prepare(
      `INSERT INTO plant_catalog (id, name, category, default_width_in, default_height_in, default_color, notes, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(id, name, category, defaultWidthIn, defaultHeightIn, defaultColor, notes, timestamp, timestamp)
      .run();

    const row = await env.DB.prepare(`SELECT ${SELECT_COLS} FROM plant_catalog WHERE id = ?`).bind(id).first();
    return ok(row, 201);
  } catch (error) {
    if (error instanceof Error && error.message === "invalid_json") return badRequest("Malformed JSON body.");
    return internalError(error);
  }
};
