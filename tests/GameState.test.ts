import { describe, expect, it } from "vitest";
import {
  activateGate,
  completeConversation,
  createInitialGameState,
  evaluateFormation,
  setFormation,
  togglePlayerRegistration,
} from "../src/game/simulation/GameState";

describe("FP-00 formation contract", () => {
  it("starts with six of eight persistent players and an offline gate", () => {
    const state = createInitialGameState();
    expect(state.selectedPlayerIds).toHaveLength(6);
    expect(state.gatePowered).toBe(false);
    expect(evaluateFormation(state).valid).toBe(false);
  });

  it("accepts a regulation seven-player Triangle", () => {
    let state = createInitialGameState();
    state = togglePlayerRegistration(state, "kestrel");
    state = setFormation(state, "Triangle");

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
  });

  it("does not complete the echo conversation before gate activation", () => {
    const state = completeConversation(createInitialGameState());
    expect(state.conversationCompleted).toBe(false);
    expect(state.phase).toBe("reach-terminal");
  });
});
