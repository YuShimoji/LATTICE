import { ROSTER } from "../content/roster";
import type { Formation, FormationEvaluation, GameState, PlayerRole } from "./types";

export function createInitialGameState(): GameState {
  return {
    selectedPlayerIds: ROSTER.slice(0, 6).map((player) => player.id),
    formation: null,
    gatePowered: false,
    conversationCompleted: false,
    phase: "reach-terminal",
  };
}
export function markTerminalReached(state: GameState): GameState {
  if (state.gatePowered) return state;
  return { ...state, phase: "configure-team" };
}

export function togglePlayerRegistration(state: GameState, playerId: string): GameState {
  if (!ROSTER.some((player) => player.id === playerId) || state.gatePowered) return state;

  const selected = state.selectedPlayerIds.includes(playerId);
  if (selected) {
    return { ...state, selectedPlayerIds: state.selectedPlayerIds.filter((id) => id !== playerId) };
  }
  if (state.selectedPlayerIds.length >= 7) return state;
  return { ...state, selectedPlayerIds: [...state.selectedPlayerIds, playerId] };
}

export function setFormation(state: GameState, formation: Formation): GameState {
  if (state.gatePowered) return state;
  return { ...state, formation };
}

function countRole(state: GameState, role: PlayerRole): number {
  return state.selectedPlayerIds.reduce((count, id) => {
    const player = ROSTER.find((candidate) => candidate.id === id);
    return count + (player?.primaryRole === role || player?.secondaryRole === role ? 1 : 0);
  }, 0);
}

export function evaluateFormation(state: GameState): FormationEvaluation {
  const reasons: string[] = [];
  if (state.selectedPlayerIds.length !== 7) reasons.push(`Register 7 players (${state.selectedPlayerIds.length}/7).`);
  if (state.formation !== "Triangle") reasons.push("Platform 06 accepts TRIANGLE only.");
  if (countRole(state, "Anchor") < 1) reasons.push("Assign at least one Anchor.");
  if (countRole(state, "Relayer") < 1) reasons.push("Assign at least one Relayer.");
  if (countRole(state, "Runner") < 2) reasons.push("Assign at least two Runners.");
  return { valid: reasons.length === 0, reasons };
}

export function activateGate(state: GameState): GameState {
  if (!evaluateFormation(state).valid) return state;
  return { ...state, gatePowered: true, phase: "reach-gate" };
}

export function markEchoReached(state: GameState): GameState {
  if (!state.gatePowered || state.conversationCompleted) return state;
  return { ...state, phase: "meet-echo" };
}

export function completeConversation(state: GameState): GameState {
  if (!state.gatePowered) return state;
  return { ...state, conversationCompleted: true, phase: "complete" };
}

export function objectiveFor(state: GameState): string {
  switch (state.phase) {
    case "reach-terminal": return "Reach the abandoned league terminal";
    case "configure-team": return "Register seven players and form a Triangle";
    case "reach-gate": return "Follow the restored line to the energy gate";
    case "meet-echo": return "Listen to the registered echo";
    case "complete": return "Route restored · the Empty League remembers your club";
  }
}
