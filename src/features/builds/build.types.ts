import type { Build } from "../../types/global";

export type BuildInput = Omit<Build, "id" | "createdAt" | "updatedAt">;
export type BuildPatch = Partial<BuildInput>;
