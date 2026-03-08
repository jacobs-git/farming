import { fail } from "./http";

export function methodNotAllowed(): Response {
  return fail(405, "method_not_allowed", "Method not allowed.");
}

export function notFound(entity = "resource"): Response {
  return fail(404, "not_found", `${entity} not found.`);
}

export function badRequest(message = "Invalid request payload.", details?: unknown): Response {
  return fail(400, "bad_request", message, details);
}

export function validationFailed(details: unknown): Response {
  return fail(422, "validation_error", "Validation failed.", details);
}

export function internalError(error: unknown): Response {
  const message = error instanceof Error ? error.message : "Unknown server error";
  return fail(500, "internal_error", message);
}
