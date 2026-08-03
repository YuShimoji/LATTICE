export type PlayerRole = "Anchor" | "Relayer" | "Runner" | "Breaker" | "Warden" | "Conductor" | "Wild";

export type Formation = "Triangle" | "Spear" | "Ring";

export type MissionPhase = "reach-terminal" | "configure-team" | "reach-gate" | "meet-echo" | "complete";

export interface PlayerProfile {
  id: string;
  name: string;
  primaryRole: PlayerRole;
  secondaryRole?: PlayerRole;
  note: string;
}
export interface FormationEvaluation {
  valid: boolean;
  reasons: string[];
}

export interface GameState {
  selectedPlayerIds: string[];
  formation: Formation | null;
  gatePowered: boolean;
  conversationCompleted: boolean;
  phase: MissionPhase;
}
