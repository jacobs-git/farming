import { badRequest, internalError, notFound, validationFailed } from "../../_shared/errors";
import { asNumber, isHexColor, nowIso, ok, parseJson, requiredString, type Env } from "../../_shared/http";

type BedPatchInput = {
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

export const onRequestPatch: PagesFunction<Env> = async ({ env, params, request }) => {
  try {
    const existing = await env.DB.prepare("SELECT id FROM beds WHERE id = ?").bind(params.id).first();
    if (!existing) return notFound("bed");

    const body = await parseJson<BedPatchInput>(request);
    const patch: Record<string, unknown> = {};
    const details: Record<string, string> = {};

    if (body.name !== undefined) {
      const value = requiredString(body.name, 1, 120);
      if (!value) details.name = "name is invalid.";
      else patch.name = value;
    }
    if (body.kind !== undefined) {
      const value = requiredString(body.kind, 1, 60);
      if (!value) details.kind = "kind is invalid.";
      else patch.kind = value;
    }
    if (body.xIn !== undefined) {
      const value = asNumber(body.xIn);
      if (value == null || value < 0) details.xIn = "xIn must be >= 0.";
      else patch.x_in = value;
    }
    if (body.yIn !== undefined) {
      const value = asNumber(body.yIn);
      if (value == null || value < 0) details.yIn = "yIn must be >= 0.";
      else patch.y_in = value;
    }
    if (body.widthIn !== undefined) {
      const value = asNumber(body.widthIn);
      if (value == null || value <= 0) details.widthIn = "widthIn must be > 0.";
      else patch.width_in = value;
    }
    if (body.heightIn !== undefined) {
      const value = asNumber(body.heightIn);
      if (value == null || value <= 0) details.heightIn = "heightIn must be > 0.";
      else patch.height_in = value;
    }
    if (body.color !== undefined) {
      const value = requiredString(body.color, 7, 7);
      if (!value || !isHexColor(value)) details.color = "color must be a hex color.";
      else patch.color = value;
    }
    if (body.borderColor !== undefined) {
      const value = requiredString(body.borderColor, 7, 7);
      if (!value || !isHexColor(value)) details.borderColor = "borderColor must be a hex color.";
      else patch.border_color = value;
    }
    if (body.rotationDeg !== undefined) {
      const value = asNumber(body.rotationDeg);
      if (value == null) details.rotationDeg = "rotationDeg is invalid.";
      else patch.rotation_deg = value;
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

    await env.DB.prepare(`UPDATE beds SET ${setters} WHERE id = ?`).bind(...values, params.id).run();
    const row = await env.DB.prepare(`SELECT ${SELECT_COLS} FROM beds WHERE id = ?`).bind(params.id).first();
    return ok(row);
  } catch (error) {
    if (error instanceof Error && error.message === "invalid_json") return badRequest("Malformed JSON body.");
    return internalError(error);
  }
};

export const onRequestDelete: PagesFunction<Env> = async ({ env, params }) => {
  try {
    const existing = await env.DB.prepare("SELECT id FROM beds WHERE id = ?").bind(params.id).first();
    if (!existing) return notFound("bed");

    await env.DB.prepare("DELETE FROM beds WHERE id = ?").bind(params.id).run();
    return ok({ id: params.id, deleted: true });
  } catch (error) {
    return internalError(error);
  }
};
