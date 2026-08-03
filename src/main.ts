import "./styles.css";
import * as THREE from "three";
import { installRuntimeProbe } from "./diagnostics/runtimeProbe";
import { InputController } from "./game/input/InputController";
import {
  activateGate,
  completeConversation,
  createInitialGameState,
  markEchoReached,
  markTerminalReached,
  setFormation,
  swapFormationAssignments,
  togglePlayerRegistration,
} from "./game/simulation/GameState";
import type { Formation, GameState } from "./game/simulation/types";
import { RenderSystem } from "./render/app/RenderSystem";
import { GameUi } from "./ui/GameUi";

const viewport = document.getElementById("viewport");
if (!viewport) throw new Error("Missing #viewport");

let state: GameState = createInitialGameState();
let focusPaused = false;
const input = new InputController();
const render = new RenderSystem(viewport);
const clock = new THREE.Clock();

const ui = new GameUi({
  onTogglePlayer: (id) => {
    state = togglePlayerRegistration(state, id);
    ui.render(state);
  },
  onFormation: (formation: Formation) => {
    state = setFormation(state, formation);
    ui.render(state);
  },
  onSwapFormationSlots: (firstIndex, secondIndex) => {
    state = swapFormationAssignments(state, firstIndex, secondIndex);
    ui.render(state);
  },
  onConfirmFormation: () => {
    const nextState = activateGate(state);
    if (nextState !== state) {
      state = nextState;
      ui.closeTerminal();
      input.setBlocked(false);
    }
    ui.render(state);
  },
  onCloseTerminal: () => {
    ui.closeTerminal();
    input.setBlocked(false);
  },
  onConversationComplete: () => {
    state = completeConversation(state);
    input.setBlocked(false);
    ui.render(state);
  },
});

function distanceTo(x: number, z: number): number {
  return Math.hypot(render.playerPosition.x - x, render.playerPosition.z - z);
}

function updateInteraction(): void {
  const terminalDistance = distanceTo(2.3, -18);
  const gateDistance = distanceTo(0, -34.1);
  let prompt: string | null = null;

  if (terminalDistance < 2.2) prompt = state.gatePowered ? "E — Review committed formation" : "E — Open Formation Terminal";
  else if (gateDistance < 2.8) prompt = state.gatePowered ? "E — Cross the energized gate" : "Gate offline · configure a regulation formation";
  ui.setPrompt(prompt);

  if (!input.consumeInteract()) return;
  if (terminalDistance < 2.2) {
    state = markTerminalReached(state);
    ui.openTerminal();
    input.setBlocked(true);
    ui.render(state);
  } else if (gateDistance < 2.8 && state.gatePowered) {
    state = markEchoReached(state);
    ui.showConversation();
    input.setBlocked(true);
    ui.render(state);
  }
}

function frame(): void {
  const delta = Math.min(clock.getDelta(), 0.05);
  const overlayOpen = ui.isTerminalOpen() || ui.isConversationOpen() || focusPaused;
  if (!overlayOpen) {
    const movement = input.movement();
    const movementImpulse = input.consumeMovementImpulse();
    const speed = 4.4;
    render.playerPosition.x = THREE.MathUtils.clamp(render.playerPosition.x + movement.x * speed * delta + movementImpulse.x * 0.42, -5.4, 5.4);
    render.playerPosition.z = THREE.MathUtils.clamp(render.playerPosition.z + movement.y * speed * delta + movementImpulse.y * 0.42, -39.5, 4.5);
    updateInteraction();
  }
  render.update(delta, state.gatePowered);
  requestAnimationFrame(frame);
}

window.addEventListener("blur", () => {
  focusPaused = true;
  input.setBlocked(true);
  ui.setFocusPaused(true);
});

window.addEventListener("focus", () => {
  focusPaused = false;
  input.setBlocked(ui.isTerminalOpen() || ui.isConversationOpen());
  ui.setFocusPaused(false);
  clock.getDelta();
});

window.addEventListener("beforeunload", () => {
  input.destroy();
  render.dispose();
});

installRuntimeProbe(
  () => structuredClone(state),
  () => ({ x: render.playerPosition.x, z: render.playerPosition.z }),
);
ui.render(state);
frame();
