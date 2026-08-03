import type { PlayerProfile, PlayerRole } from "../simulation/types";

export interface FormationNodeDefinition {
  readonly id: string;
  readonly label: string;
  readonly shortLabel: string;
  readonly requiredRole: PlayerRole | null;
  readonly xPercent: number;
  readonly yPercent: number;
}

export const TRIANGLE_NODES: readonly FormationNodeDefinition[] = [
  { id: "apex", label: "Apex Runner", shortLabel: "APEX", requiredRole: "Runner", xPercent: 50, yPercent: 10 },
  { id: "left-channel", label: "Left Channel", shortLabel: "LEFT", requiredRole: "Runner", xPercent: 20, yPercent: 38 },
  { id: "right-channel", label: "Right Channel", shortLabel: "RIGHT", requiredRole: null, xPercent: 80, yPercent: 38 },
  { id: "junction", label: "Relay Junction", shortLabel: "RELAY", requiredRole: "Relayer", xPercent: 50, yPercent: 48 },
  { id: "left-brace", label: "Left Brace", shortLabel: "BRACE L", requiredRole: null, xPercent: 28, yPercent: 78 },
  { id: "foundation", label: "Foundation Anchor", shortLabel: "ANCHOR", requiredRole: "Anchor", xPercent: 50, yPercent: 90 },
  { id: "right-brace", label: "Right Brace", shortLabel: "BRACE R", requiredRole: null, xPercent: 72, yPercent: 78 },
];

export const TRIANGLE_LINKS: readonly (readonly [number, number])[] = [
  [0, 1], [0, 2], [0, 3], [1, 3], [2, 3], [1, 4], [2, 6], [3, 4], [3, 5], [3, 6], [4, 5], [5, 6],
];

export function playerCanFillNode(player: PlayerProfile, node: FormationNodeDefinition): boolean {
  return node.requiredRole === null
    || player.primaryRole === node.requiredRole
    || player.secondaryRole === node.requiredRole;
}
