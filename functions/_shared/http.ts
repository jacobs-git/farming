export interface Env {
  DB: D1Database;
}

export type ApiError = {
  code: string;
  message: string;
  details?: unknown;
};

export function ok(data: unknown, status = 200): Response {
  return new Response(JSON.stringify({ ok: true, data }), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

export function fail(status: number, code: string, message: string, details?: unknown): Response {
  const error: ApiError = { code, message, details };
  return new Response(JSON.stringify({ ok: false, error }), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

export async function parseJson<T>(request: Request): Promise<T> {
  try {
    return (await request.json()) as T;
  } catch {
    throw new Error("invalid_json");
  }
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function randomId(prefix: string): string {
  const part = Math.random().toString(36).slice(2, 10);
  const time = Date.now().toString(36);
  return `${prefix}_${time}${part}`;
}

export function isHexColor(value: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(value);
}

export function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

export function requiredString(value: unknown, min = 1, max = 120): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  if (trimmed.length < min || trimmed.length > max) {
    return null;
  }
  return trimmed;
}

export function optionalString(value: unknown, max = 1000): string | null {
  if (value == null) {
    return null;
  }
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  if (trimmed.length > max) {
    return null;
  }
  return trimmed;
}
