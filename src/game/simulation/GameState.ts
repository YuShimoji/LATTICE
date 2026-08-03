import { ROSTER } from "../content/roster";
import { playerCanFillNode, TRIANGLE_NODES } from "../content/formations";
import type { Formation, FormationEvaluation, GameState, PlayerRole } from "./types";

export function createInitialGameState(): GameState {
  const selectedPlayerIds = ROSTER.slice(0, 6).map((player) => player.id);
  return {
    selectedPlayerIds,
    formationAssignments: [...selectedPlayerIds, null],
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
    return {
      ...state,
      selectedPlayerIds: state.selectedPlayerIds.filter((id) => id !== playerId),
      formationAssignments: state.formationAssignments.map((id) => id === playerId ? null : id),
    };
  }
  if (state.selectedPlayerIds.length >= 7) return state;
  const formationAssignments = [...state.formationAssignments];
  const emptyIndex = formationAssignments.findIndex((id) => id === null);
  if (emptyIndex >= 0) formationAssignments[emptyIndex] = playerId;
  return { ...state, selectedPlayerIds: [...state.selectedPlayerIds, playerId], formationAssignments };
}

export function setFormation(state: GameState, formation: Formation): GameState {
  if (state.gatePowered) return state;
  return { ...state, formation };
}

export function swapFormationAssignments(state: GameState, firstIndex: number, secondIndex: number): GameState {
  if (state.gatePowered || firstIndex === secondIndex) return state;
  if (!TRIANGLE_NODES[firstIndex] || !TRIANGLE_NODES[secondIndex]) return state;
  const formationAssignments = [...state.formationAssignments];
  [formationAssignments[firstIndex], formationAssignments[secondIndex]] = [
    formationAssignments[secondIndex] ?? null,
    formationAssignments[firstIndex] ?? null,
  ];
  return { ...state, formationAssignments };
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
  if (state.selectedPlayerIds.length === 7 && state.formation === "Triangle") {
    const assigned = state.formationAssignments.filter((id): id is string => id !== null);
    const assignmentMatchesRoster = assigned.length === 7
      && new Set(assigned).size === 7
      && assigned.every((id) => state.selectedPlayerIds.includes(id));
    if (!assignmentMatchesRoster) {
      reasons.push("Place every registered player on one Triangle node.");
    } else {
      TRIANGLE_NODES.forEach((node, index) => {
        const player = ROSTER.find((candidate) => candidate.id === state.formationAssignments[index]);
        if (player && !playerCanFillNode(player, node)) {
          reasons.push(`${node.label} requires ${node.requiredRole}.`);
        }
      });
    }
  }
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
    case "configure-team": return "Register seven players and wire a regulation Triangle";
    case "reach-gate": return "Follow the restored line to the energy gate";
    case "meet-echo": return "Listen to the registered echo";
    case "complete": return "Route restored · the Empty League remembers your club";
  }
}
