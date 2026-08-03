import * as THREE from "three";

const KEY_TO_DIRECTION = new Map<string, readonly [number, number]>([
  ["KeyW", [0, -1]], ["ArrowUp", [0, -1]],
  ["KeyS", [0, 1]], ["ArrowDown", [0, 1]],
  ["KeyA", [-1, 0]], ["ArrowLeft", [-1, 0]],
  ["KeyD", [1, 0]], ["ArrowRight", [1, 0]],
]);

export class InputController {
  private readonly pressed = new Set<string>();
  private readonly movementImpulse = new THREE.Vector2();
  private interactQueued = false;
  private blocked = false;

  constructor() {
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
  }

  setBlocked(blocked: boolean): void {
    this.blocked = blocked;
    if (blocked) {
      this.pressed.clear();
      this.movementImpulse.set(0, 0);
    }
  }

  consumeMovementImpulse(): THREE.Vector2 {
    if (this.blocked) return new THREE.Vector2();
    const impulse = this.movementImpulse.clone();
    this.movementImpulse.set(0, 0);
    return impulse.lengthSq() > 1 ? impulse.normalize() : impulse;
  }

  movement(): THREE.Vector2 {
    if (this.blocked) return new THREE.Vector2();
    const movement = new THREE.Vector2();
    for (const code of this.pressed) {
      const direction = KEY_TO_DIRECTION.get(code);
      if (direction) movement.add(new THREE.Vector2(direction[0], direction[1]));
    }
    return movement.lengthSq() > 1 ? movement.normalize() : movement;
  }

  consumeInteract(): boolean {
    if (this.blocked || !this.interactQueued) return false;
    this.interactQueued = false;
    return true;
  }

  destroy(): void {
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
  }

  private readonly onKeyDown = (event: KeyboardEvent): void => {
    if (KEY_TO_DIRECTION.has(event.code)) {
      event.preventDefault();
      this.pressed.add(event.code);
      const direction = KEY_TO_DIRECTION.get(event.code);
      if (direction && !event.repeat && !this.blocked) {
        this.movementImpulse.add(new THREE.Vector2(direction[0], direction[1]));
      }
    }
    if ((event.code === "KeyE" || event.code === "Enter") && !event.repeat) {
      this.interactQueued = true;
    }
  };

  private readonly onKeyUp = (event: KeyboardEvent): void => {
    this.pressed.delete(event.code);
  };
}
