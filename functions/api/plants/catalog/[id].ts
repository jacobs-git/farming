import { badRequest, internalError, notFound, validationFailed } from "../../../_shared/errors";
import { asNumber, isHexColor, nowIso, ok, parseJson, requiredString, type Env } from "../../../_shared/http";

type CatalogPatchInput = {
  name?: unknown;
  category?: unknown;
  defaultWidthIn?: unknown;
  defaultHeightIn?: unknown;
  defaultColor?: unknown;
  notes?: unknown;
};

const SELECT_COLS = `id, name, category, default_width_in as defaultWidthIn, default_height_in as defaultHeightIn,
                     default_color as defaultColor, notes, created_at as createdAt, updated_at as updatedAt`;

export const onRequestPatch: PagesFunction<Env> = async ({ env, params, request }) => {
  try {
    const existing = await env.DB.prepare("SELECT id FROM plant_catalog WHERE id = ?").bind(params.id).first();
    if (!existing) return notFound("plant catalog item");

    const body = await parseJson<CatalogPatchInput>(request);
    const patch: Record<string, unknown> = {};
    const details: Record<string, string> = {};

    if (body.name !== undefined) {
      const value = requiredString(body.name, 1, 120);
      if (!value) details.name = "name is invalid.";
      else patch.name = value;
    }
    if (body.category !== undefined) {
      patch.category = typeof body.category === "string" ? body.category.trim() || null : null;
    }
    if (body.defaultWidthIn !== undefined) {
      const value = asNumber(body.defaultWidthIn);
      if (value == null || value <= 0) details.defaultWidthIn = "defaultWidthIn must be > 0.";
      else patch.default_width_in = value;
    }
    if (body.defaultHeightIn !== undefined) {
      const value = asNumber(body.defaultHeightIn);
      if (value == null || value <= 0) details.defaultHeightIn = "defaultHeightIn must be > 0.";
      else patch.default_height_in = value;
    }
    if (body.defaultColor !== undefined) {
      const value = requiredString(body.defaultColor, 7, 7);
      if (!value || !isHexColor(value)) details.defaultColor = "defaultColor must be a hex color.";
      else patch.default_color = value;
    }
    if (body.notes !== undefined) {
      patch.notes = typeof body.notes === "string" ? body.notes.trim() : null;
    }

    if (Object.keys(details).length > 0) return validationFailed(details);
    if (Object.keys(patch).length === 0) return badRequest("No changes provided.");

    patch.updated_at = nowIso();
    const cols = Object.keys(patch);
    const setters = cols.map((col) => `${col} = ?`).join(", ");
    const values = cols.map((col) => patch[col]);

    await env.DB.prepare(`UPDATE plant_catalog SET ${setters} WHERE id = ?`).bind(...values, params.id).run();
    const row = await env.DB.prepare(`SELECT ${SELECT_COLS} FROM plant_catalog WHERE id = ?`).bind(params.id).first();
    return ok(row);
  } catch (error) {
    if (error instanceof Error && error.message === "invalid_json") return badRequest("Malformed JSON body.");
    return internalError(error);
  }
};

export const onRequestDelete: PagesFunction<Env> = async ({ env, params }) => {
  try {
    const existing = await env.DB.prepare("SELECT id FROM plant_catalog WHERE id = ?").bind(params.id).first();
    if (!existing) return notFound("plant catalog item");

    await env.DB.prepare("DELETE FROM plant_catalog WHERE id = ?").bind(params.id).run();
    return ok({ id: params.id, deleted: true });
  } catch (error) {
    return internalError(error);
  }
};
