import { describe, expect, it } from "vitest";
import {
  activateGate,
  completeConversation,
  createInitialGameState,
  evaluateFormation,
  setFormation,
  swapFormationAssignments,
  togglePlayerRegistration,
} from "../src/game/simulation/GameState";

describe("FP-00 formation contract", () => {
  it("starts with six of eight persistent players and an offline gate", () => {
    const state = createInitialGameState();
    expect(state.selectedPlayerIds).toHaveLength(6);
    expect(state.gatePowered).toBe(false);
    expect(evaluateFormation(state).valid).toBe(false);
  });

  it("requires the same seven players to occupy compatible Triangle nodes", () => {
    let state = createInitialGameState();
    state = togglePlayerRegistration(state, "kestrel");
    state = setFormation(state, "Triangle");

    expect(evaluateFormation(state).valid).toBe(false);
    expect(evaluateFormation(state).reasons).toContain("Apex Runner requires Runner.");
    state = swapFormationAssignments(state, 0, 2);
    state = swapFormationAssignments(state, 1, 3);
    state = swapFormationAssignments(state, 2, 5);
    expect(evaluateFormation(state)).toEqual({ valid: true, reasons: [] });
    state = activateGate(state);
    expect(state.gatePowered).toBe(true);
    expect(state.phase).toBe("reach-gate");
  });

  it("does not consume or duplicate registered players", () => {
    let state = createInitialGameState();
    state = togglePlayerRegistration(state, "kestrel");
    state = togglePlayerRegistration(state, "mira");
    expect(state.selectedPlayerIds).toHaveLength(7);
    expect(new Set(state.selectedPlayerIds).size).toBe(7);
    expect(state.formationAssignments.filter((id) => id !== null)).toHaveLength(7);
    expect(new Set(state.formationAssignments.filter((id) => id !== null)).size).toBe(7);
  });

  it("rejects invalid or locked slot swaps without mutating formation authority", () => {
    const initial = createInitialGameState();
    expect(swapFormationAssignments(initial, -1, 2)).toBe(initial);
    expect(swapFormationAssignments(initial, 0, 0)).toBe(initial);

    let committed = togglePlayerRegistration(initial, "kestrel");
    committed = setFormation(committed, "Triangle");
    committed = swapFormationAssignments(committed, 0, 2);
    committed = swapFormationAssignments(committed, 1, 3);
    committed = swapFormationAssignments(committed, 2, 5);
    committed = activateGate(committed);
    expect(swapFormationAssignments(committed, 0, 1)).toBe(committed);
  });

  it("does not complete the echo conversation before gate activation", () => {
    const state = completeConversation(createInitialGameState());
    expect(state.conversationCompleted).toBe(false);
    expect(state.phase).toBe("reach-terminal");
  });
});
