import type { GameState } from "../game/simulation/types";

declare global {
  interface Window {
    __LATTICE__?: {
      getState: () => Readonly<GameState>;
      getPlayerPosition: () => Readonly<{ x: number; z: number }>;
      schema: "lattice-runtime-probe.v1";
    };
  }
}
export function installRuntimeProbe(getState: () => GameState, getPlayerPosition: () => { x: number; z: number }): void {
  window.__LATTICE__ = { schema: "lattice-runtime-probe.v1", getState, getPlayerPosition };
}
