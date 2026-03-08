import { queryAll } from "../../_shared/db";
import { badRequest, internalError, validationFailed } from "../../_shared/errors";
import { asNumber, isHexColor, nowIso, ok, parseJson, randomId, requiredString, type Env } from "../../_shared/http";
import { ensureSeedData } from "../../_shared/seed";

type BuildInput = {
  name?: unknown;
  seasonYear?: unknown;
  canvasWidthIn?: unknown;
  canvasHeightIn?: unknown;
  backgroundColor?: unknown;
  notes?: unknown;
};

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  try {
    await ensureSeedData(env);
    const rows = await queryAll(
      env.DB.prepare(
        `SELECT id, name, season_year as seasonYear, canvas_width_in as canvasWidthIn, canvas_height_in as canvasHeightIn,
                background_color as backgroundColor, notes, created_at as createdAt, updated_at as updatedAt
         FROM builds
         ORDER BY updated_at DESC`
      )
    );
    return ok(rows);
  } catch (error) {
    return internalError(error);
  }
};

export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  try {
    const body = await parseJson<BuildInput>(request);
    const name = requiredString(body.name, 1, 120);
    const seasonYear = asNumber(body.seasonYear);
    const canvasWidthIn = asNumber(body.canvasWidthIn);
    const canvasHeightIn = asNumber(body.canvasHeightIn);
    const backgroundColor = requiredString(body.backgroundColor, 7, 7);
    const notes = typeof body.notes === "string" ? body.notes.trim() : null;

    const details: Record<string, string> = {};
    if (!name) details.name = "Name is required.";
    if (seasonYear == null || seasonYear < 2000 || seasonYear > 3000) details.seasonYear = "seasonYear is invalid.";
    if (canvasWidthIn == null || canvasWidthIn <= 0) details.canvasWidthIn = "canvasWidthIn must be > 0.";
    if (canvasHeightIn == null || canvasHeightIn <= 0) details.canvasHeightIn = "canvasHeightIn must be > 0.";
    if (!backgroundColor || !isHexColor(backgroundColor)) details.backgroundColor = "backgroundColor must be a hex color.";
    if (Object.keys(details).length > 0) return validationFailed(details);

    const id = randomId("build");
    const timestamp = nowIso();

    await env.DB.prepare(
      `INSERT INTO builds (id, name, season_year, canvas_width_in, canvas_height_in, background_color, notes, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(id, name, Math.round(seasonYear as number), canvasWidthIn, canvasHeightIn, backgroundColor, notes, timestamp, timestamp)
      .run();

    const created = await env.DB.prepare(
      `SELECT id, name, season_year as seasonYear, canvas_width_in as canvasWidthIn, canvas_height_in as canvasHeightIn,
              background_color as backgroundColor, notes, created_at as createdAt, updated_at as updatedAt
       FROM builds WHERE id = ?`
    )
      .bind(id)
      .first();

    return ok(created, 201);
  } catch (error) {
    if (error instanceof Error && error.message === "invalid_json") {
      return badRequest("Malformed JSON body.");
    }
    return internalError(error);
  }
};
