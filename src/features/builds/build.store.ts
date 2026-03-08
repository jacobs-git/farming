import { useSyncExternalStore } from "react";
import type { Build } from "../../types/global";

interface BuildState {
  builds: Build[];
  activeBuildId: string | null;
  loading: boolean;
}

const state: BuildState = {
  builds: [],
  activeBuildId: null,
  loading: false,
};

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function setState(partial: Partial<BuildState>) {
  Object.assign(state, partial);
  emit();
}

export const buildStore = {
  getState: () => state,
  setBuilds(builds: Build[]) {
    state.builds = builds;
    if (!state.activeBuildId && builds.length > 0) {
      state.activeBuildId = builds[0].id;
    }
    emit();
  },
  setActiveBuildId(activeBuildId: string | null) {
    setState({ activeBuildId });
  },
  setLoading(loading: boolean) {
    setState({ loading });
  },
  upsertBuild(build: Build) {
    const index = state.builds.findIndex((item) => item.id === build.id);
    if (index >= 0) {
      state.builds[index] = build;
    } else {
      state.builds.unshift(build);
    }
    if (!state.activeBuildId) {
      state.activeBuildId = build.id;
    }
    emit();
  },
  removeBuild(id: string) {
    state.builds = state.builds.filter((item) => item.id !== id);
    if (state.activeBuildId === id) {
      state.activeBuildId = state.builds[0]?.id ?? null;
    }
    emit();
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

export function useBuildStore<T>(selector: (value: BuildState) => T): T {
  return useSyncExternalStore(buildStore.subscribe, () => selector(state), () => selector(state));
}
