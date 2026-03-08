import type { Build } from "../../types/global";
import { Badge } from "../ui/Badge";

interface BuildListProps {
  builds: Build[];
  activeBuildId: string | null;
  onSelect: (id: string) => void;
}

export function BuildList({ builds, activeBuildId, onSelect }: BuildListProps) {
  return (
    <div className="space-y-1">
      {builds.map((build) => (
        <button
          key={build.id}
          className={`w-full rounded-md border px-2 py-2 text-left text-sm transition ${
            build.id === activeBuildId
              ? "border-sage bg-[#f0f4ea] shadow-[inset_0_0_0_1px_rgba(107,143,94,.22)]"
              : "border-panel bg-cream hover:bg-linen"
          }`}
          onClick={() => onSelect(build.id)}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium text-ink">{build.name}</span>
            <Badge>{build.seasonYear}</Badge>
          </div>
        </button>
      ))}
    </div>
  );
}
