import { internalError, notFound } from "../../../_shared/errors";
import { nowIso, ok, randomId, type Env } from "../../../_shared/http";

const SELECT_COLS = `id, build_id as buildId, name, kind, x_in as xIn, y_in as yIn,
                     width_in as widthIn, height_in as heightIn, color, border_color as borderColor,
                     rotation_deg as rotationDeg, notes, created_at as createdAt, updated_at as updatedAt`;

export const onRequestPost: PagesFunction<Env> = async ({ env, params }) => {
  try {
    const existing = await env.DB.prepare("SELECT * FROM beds WHERE id = ?").bind(params.id).first<Record<string, unknown>>();
    if (!existing) return notFound("bed");

    const id = randomId("bed");
    const now = nowIso();

    const nextX = Number(existing.x_in ?? 0) + 6;
    const nextY = Number(existing.y_in ?? 0) + 6;

    await env.DB.prepare(
      `INSERT INTO beds (id, build_id, name, kind, x_in, y_in, width_in, height_in, color, border_color, rotation_deg, notes, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        id,
        existing.build_id,
        `${String(existing.name)} Copy`,
        existing.kind,
        nextX,
        nextY,
        existing.width_in,
        existing.height_in,
        existing.color,
        existing.border_color,
        existing.rotation_deg ?? 0,
        existing.notes ?? null,
        now,
        now
      )
      .run();

    const row = await env.DB.prepare(`SELECT ${SELECT_COLS} FROM beds WHERE id = ?`).bind(id).first();
    return ok(row, 201);
  } catch (error) {
    return internalError(error);
  }
};
