import { ROSTER } from "../game/content/roster";
import { playerCanFillNode, TRIANGLE_LINKS, TRIANGLE_NODES } from "../game/content/formations";
import { evaluateFormation, objectiveFor } from "../game/simulation/GameState";
import type { Formation, GameState } from "../game/simulation/types";

interface UiCallbacks {
  onTogglePlayer: (id: string) => void;
  onFormation: (formation: Formation) => void;
  onSwapFormationSlots: (firstIndex: number, secondIndex: number) => void;
  onConfirmFormation: () => void;
  onCloseTerminal: () => void;
  onConversationComplete: () => void;
}
const DIALOGUE = [
  "Your Triangle reached the station before your names did.",
  "Platform 06 recognizes a club again. The northbound lattice is still dark, but it is listening.",
  "Find the next relay. Bring seven people who choose to remain seven people.",
] as const;

function requiredElement<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Missing UI element #${id}`);
  return element as T;
}

export class GameUi {
  private readonly objective = requiredElement<HTMLElement>("objective");
  private readonly gridStatus = requiredElement<HTMLElement>("grid-status");
  private readonly prompt = requiredElement<HTMLElement>("interaction-prompt");
  private readonly terminal = requiredElement<HTMLElement>("terminal");
  private readonly rosterList = requiredElement<HTMLElement>("roster-list");
  private readonly slots = requiredElement<HTMLOListElement>("registration-slots");
  private readonly formationButtons = requiredElement<HTMLElement>("formation-buttons");
  private readonly formationBoard = requiredElement<HTMLElement>("formation-board");
  private readonly formationHint = requiredElement<HTMLElement>("formation-hint");
  private readonly validity = requiredElement<HTMLElement>("formation-validity");
  private readonly confirmButton = requiredElement<HTMLButtonElement>("formation-confirm");
  private readonly conversation = requiredElement<HTMLElement>("conversation");
  private readonly dialogueLine = requiredElement<HTMLElement>("dialogue-line");
  private readonly dialogueNext = requiredElement<HTMLButtonElement>("dialogue-next");
  private readonly focusPause = requiredElement<HTMLElement>("focus-pause");
  private dialogueIndex = 0;
  private selectedFormationNode: number | null = null;
  private currentState: GameState | null = null;
  private readonly formationNodeButtons: HTMLButtonElement[] = [];
  private readonly formationLinkLines: SVGLineElement[] = [];

  constructor(private readonly callbacks: UiCallbacks) {
    requiredElement<HTMLButtonElement>("terminal-close").addEventListener("click", callbacks.onCloseTerminal);
    this.confirmButton.addEventListener("click", callbacks.onConfirmFormation);
    this.dialogueNext.addEventListener("click", this.advanceDialogue);
    this.focusPause.addEventListener("click", () => window.focus());

    for (const formation of ["Triangle", "Spear", "Ring"] as const) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = formation.toUpperCase();
      button.dataset.formation = formation;
      button.addEventListener("click", () => callbacks.onFormation(formation));
      this.formationButtons.appendChild(button);
    }
    this.createFormationBoard();
  }

  render(state: GameState): void {
    this.currentState = state;
    this.objective.textContent = objectiveFor(state);
    this.gridStatus.textContent = state.gatePowered ? "NODE 00 · GRID ONLINE" : "NODE 00 · GRID OFFLINE";
    this.renderTerminal(state);
  }

  openTerminal(): void { this.terminal.hidden = false; }
  closeTerminal(): void { this.terminal.hidden = true; }
  isTerminalOpen(): boolean { return !this.terminal.hidden; }
  isConversationOpen(): boolean { return !this.conversation.hidden; }

  setPrompt(message: string | null): void {
    this.prompt.hidden = !message;
    this.prompt.textContent = message ?? "";
  }

  showConversation(): void {
    this.dialogueIndex = 0;
    this.dialogueLine.textContent = DIALOGUE[0];
    this.dialogueNext.textContent = "Continue";
    this.conversation.hidden = false;
  }

  setFocusPaused(paused: boolean): void { this.focusPause.hidden = !paused; }

  private renderTerminal(state: GameState): void {
    this.rosterList.replaceChildren(...ROSTER.map((player, index) => {
      const selected = state.selectedPlayerIds.includes(player.id);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "roster-card";
      button.setAttribute("aria-pressed", String(selected));
      button.disabled = state.gatePowered;
      button.innerHTML = `<span class="roster-index">${String(index + 1).padStart(2, "0")}</span><span><span class="roster-name">${player.name}</span><span class="roster-role">${player.primaryRole}${player.secondaryRole ? ` / ${player.secondaryRole}` : ""}</span></span><span class="roster-state">${selected ? "IN" : "OUT"}</span>`;
      button.title = player.note;
      button.addEventListener("click", () => this.callbacks.onTogglePlayer(player.id));
      return button;
    }));

    const selectedPlayers = state.selectedPlayerIds.map((id) => ROSTER.find((player) => player.id === id)).filter((player) => player !== undefined);
    const slotItems: HTMLLIElement[] = [];
    for (let index = 0; index < 7; index += 1) {
      const item = document.createElement("li");
      const player = selectedPlayers[index];
      if (player) item.innerHTML = `<span>${String(index + 1).padStart(2, "0")} · ${player.name}</span><strong>${player.primaryRole}</strong>`;
      else { item.className = "empty"; item.textContent = `${String(index + 1).padStart(2, "0")} · EMPTY`; }
      slotItems.push(item);
    }
    this.slots.replaceChildren(...slotItems);

    for (const button of this.formationButtons.querySelectorAll<HTMLButtonElement>("button")) {
      button.setAttribute("aria-pressed", String(button.dataset.formation === state.formation));
      button.disabled = state.gatePowered;
    }

    const triangleSelected = state.formation === "Triangle";
    const evaluation = evaluateFormation(state);
    TRIANGLE_NODES.forEach((node, index) => {
      const button = this.formationNodeButtons[index];
      if (!button) return;
      const player = ROSTER.find((candidate) => candidate.id === state.formationAssignments[index]);
      const compatible = player ? playerCanFillNode(player, node) : false;
      button.disabled = state.gatePowered || !triangleSelected;
      button.className = `formation-node${player && compatible ? " compatible" : ""}${player && !compatible ? " incompatible" : ""}`;
      button.setAttribute("aria-pressed", String(this.selectedFormationNode === index));
      button.innerHTML = `<span>${node.shortLabel}${node.requiredRole ? ` · ${node.requiredRole}` : " · FLEX"}</span><strong>${player?.name ?? "EMPTY"}</strong><small>${player ? `${player.primaryRole}${player.secondaryRole ? ` / ${player.secondaryRole}` : ""}` : "Select a registered player"}</small>`;
    });
    this.formationLinkLines.forEach((line) => line.dataset.active = String(triangleSelected));
    this.formationBoard.dataset.valid = String(triangleSelected && evaluation.valid);
    this.formationHint.textContent = !triangleSelected
      ? "Select TRIANGLE to inspect its live topology."
      : this.selectedFormationNode === null
        ? "Select a player node, then select a destination node to swap them."
        : `Selected ${TRIANGLE_NODES[this.selectedFormationNode]?.label ?? "node"} · choose another node.`;

    this.validity.className = `validity${evaluation.valid ? " valid" : ""}`;
    this.validity.textContent = evaluation.valid ? "REGULATION MATCH · Formation can energize the gate." : evaluation.reasons.join(" ");
    this.confirmButton.disabled = !evaluation.valid || state.gatePowered;
    this.confirmButton.textContent = state.gatePowered ? "Formation committed" : "Commit formation";
  }

  private createFormationBoard(): void {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 100 100");
    svg.setAttribute("aria-hidden", "true");
    for (const [fromIndex, toIndex] of TRIANGLE_LINKS) {
      const from = TRIANGLE_NODES[fromIndex];
      const to = TRIANGLE_NODES[toIndex];
      if (!from || !to) continue;
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", String(from.xPercent));
      line.setAttribute("y1", String(from.yPercent));
      line.setAttribute("x2", String(to.xPercent));
      line.setAttribute("y2", String(to.yPercent));
      svg.appendChild(line);
      this.formationLinkLines.push(line);
    }
    this.formationBoard.appendChild(svg);
    TRIANGLE_NODES.forEach((node, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "formation-node";
      button.style.left = `${node.xPercent}%`;
      button.style.top = `${node.yPercent}%`;
      button.addEventListener("click", () => this.selectFormationNode(index));
      this.formationBoard.appendChild(button);
      this.formationNodeButtons.push(button);
    });
  }

  private selectFormationNode(index: number): void {
    if (this.selectedFormationNode === null) {
      this.selectedFormationNode = index;
      if (this.currentState) this.render(this.currentState);
      return;
    }
    if (this.selectedFormationNode === index) {
      this.selectedFormationNode = null;
      if (this.currentState) this.render(this.currentState);
      return;
    }
    const fromIndex = this.selectedFormationNode;
    this.selectedFormationNode = null;
    this.callbacks.onSwapFormationSlots(fromIndex, index);
  }

  private readonly advanceDialogue = (): void => {
    this.dialogueIndex += 1;
    if (this.dialogueIndex >= DIALOGUE.length) {
      this.conversation.hidden = true;
      this.callbacks.onConversationComplete();
      return;
    }
    this.dialogueLine.textContent = DIALOGUE[this.dialogueIndex];
    this.dialogueNext.textContent = this.dialogueIndex === DIALOGUE.length - 1 ? "Restore route" : "Continue";
  };
}
