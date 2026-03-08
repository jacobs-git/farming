import type { Bed } from "../../types/global";

export type BedInput = Omit<Bed, "id" | "createdAt" | "updatedAt">;
export type BedPatch = Partial<Omit<Bed, "id" | "buildId" | "createdAt" | "updatedAt">>;
