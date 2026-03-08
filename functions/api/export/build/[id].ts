import { queryAll } from "../../../_shared/db";
import { internalError, notFound } from "../../../_shared/errors";
import { ok, type Env } from "../../../_shared/http";
import { ensureSeedData } from "../../../_shared/seed";

export const onRequestGet: PagesFunction<Env> = async ({ env, params }) => {
  try {
    await ensureSeedData(env);
    const build = await env.DB.prepare(
      `SELECT id, name, season_year as seasonYear, canvas_width_in as canvasWidthIn, canvas_height_in as canvasHeightIn,
              background_color as backgroundColor, notes, created_at as createdAt, updated_at as updatedAt
       FROM builds WHERE id = ?`
    )
      .bind(params.id)
      .first();

    if (!build) return notFound("build");

    const beds = await queryAll(
      env.DB.prepare(
        `SELECT id, build_id as buildId, name, kind, x_in as xIn, y_in as yIn, width_in as widthIn, height_in as heightIn,
                color, border_color as borderColor, rotation_deg as rotationDeg, notes, created_at as createdAt, updated_at as updatedAt
         FROM beds WHERE build_id = ? ORDER BY created_at ASC`
      ).bind(params.id)
    );

    const plantPlacements = await queryAll(
      env.DB.prepare(
        `SELECT id, build_id as buildId, bed_id as bedId, plant_catalog_id as plantCatalogId, name,
                x_in as xIn, y_in as yIn, width_in as widthIn, height_in as heightIn, color, label, notes,
                created_at as createdAt, updated_at as updatedAt
         FROM plant_placements WHERE build_id = ? ORDER BY created_at ASC`
      ).bind(params.id)
    );

    const plantCatalog = await queryAll(
      env.DB.prepare(
        `SELECT id, name, category, default_width_in as defaultWidthIn, default_height_in as defaultHeightIn,
                default_color as defaultColor, notes, created_at as createdAt, updated_at as updatedAt
         FROM plant_catalog ORDER BY name ASC`
      )
    );

    return ok({ build, beds, plantPlacements, plantCatalog });
  } catch (error) {
    return internalError(error);
  }
};
