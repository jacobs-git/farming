import { badRequest, internalError, notFound, validationFailed } from "../../_shared/errors";
import { asNumber, isHexColor, nowIso, ok, parseJson, requiredString, type Env } from "../../_shared/http";

type BuildPatchInput = {
  name?: unknown;
  seasonYear?: unknown;
  canvasWidthIn?: unknown;
  canvasHeightIn?: unknown;
  backgroundColor?: unknown;
  notes?: unknown;
};

const SELECT_SQL = `SELECT id, name, season_year as seasonYear, canvas_width_in as canvasWidthIn, canvas_height_in as canvasHeightIn,
                           background_color as backgroundColor, notes, created_at as createdAt, updated_at as updatedAt
                    FROM builds WHERE id = ?`;

export const onRequestGet: PagesFunction<Env> = async ({ env, params }) => {
  try {
    const row = await env.DB.prepare(SELECT_SQL).bind(params.id).first();
    if (!row) return notFound("build");
    return ok(row);
  } catch (error) {
    return internalError(error);
  }
};

export const onRequestPatch: PagesFunction<Env> = async ({ env, params, request }) => {
  try {
    const existing = await env.DB.prepare("SELECT id FROM builds WHERE id = ?").bind(params.id).first();
    if (!existing) return notFound("build");

    const body = await parseJson<BuildPatchInput>(request);
    const patch: Record<string, unknown> = {};
    const details: Record<string, string> = {};

    if (body.name !== undefined) {
      const name = requiredString(body.name, 1, 120);
      if (!name) details.name = "name is invalid.";
      else patch.name = name;
    }
    if (body.seasonYear !== undefined) {
      const seasonYear = asNumber(body.seasonYear);
      if (seasonYear == null || seasonYear < 2000 || seasonYear > 3000) details.seasonYear = "seasonYear is invalid.";
      else patch.season_year = Math.round(seasonYear);
    }
    if (body.canvasWidthIn !== undefined) {
      const value = asNumber(body.canvasWidthIn);
      if (value == null || value <= 0) details.canvasWidthIn = "canvasWidthIn must be > 0.";
      else patch.canvas_width_in = value;
    }
    if (body.canvasHeightIn !== undefined) {
      const value = asNumber(body.canvasHeightIn);
      if (value == null || value <= 0) details.canvasHeightIn = "canvasHeightIn must be > 0.";
      else patch.canvas_height_in = value;
    }
    if (body.backgroundColor !== undefined) {
      const value = requiredString(body.backgroundColor, 7, 7);
      if (!value || !isHexColor(value)) details.backgroundColor = "backgroundColor must be a hex color.";
      else patch.background_color = value;
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

    await env.DB.prepare(`UPDATE builds SET ${setters} WHERE id = ?`).bind(...values, params.id).run();
    const row = await env.DB.prepare(SELECT_SQL).bind(params.id).first();

    return ok(row);
  } catch (error) {
    if (error instanceof Error && error.message === "invalid_json") {
      return badRequest("Malformed JSON body.");
    }
    return internalError(error);
  }
};

export const onRequestDelete: PagesFunction<Env> = async ({ env, params }) => {
  try {
    const existing = await env.DB.prepare("SELECT id FROM builds WHERE id = ?").bind(params.id).first();
    if (!existing) return notFound("build");

    await env.DB.prepare("DELETE FROM builds WHERE id = ?").bind(params.id).run();
    return ok({ id: params.id, deleted: true });
  } catch (error) {
    return internalError(error);
  }
};
