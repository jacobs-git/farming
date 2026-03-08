import { apiDelete, apiGet, apiPatch, apiPost } from "../../lib/api";
import type { Bed } from "../../types/global";
import type { BedInput, BedPatch } from "./bed.types";

export function listBeds(buildId: string): Promise<Bed[]> {
  return apiGet<Bed[]>(`/beds?buildId=${encodeURIComponent(buildId)}`);
}

export function createBed(payload: BedInput): Promise<Bed> {
  return apiPost<Bed>("/beds", payload);
}

export function updateBed(id: string, payload: BedPatch): Promise<Bed> {
  return apiPatch<Bed>(`/beds/${id}`, payload);
}

export function deleteBed(id: string): Promise<{ id: string; deleted: boolean }> {
  return apiDelete<{ id: string; deleted: boolean }>(`/beds/${id}`);
}

export function duplicateBed(id: string): Promise<Bed> {
  return apiPost<Bed>(`/beds/${id}/duplicate`, {});
}
