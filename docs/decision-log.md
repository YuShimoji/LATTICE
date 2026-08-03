# Decision Log

## 2026-08-04 — FP-00 implementation track

| Field | Decision |
|---|---|
| Runtime | Plain TypeScript, Vite, and Three.js |
| State ownership | Simulation owns roster, formation, gate, and conversation state; Three.js only projects it |
| UI | Low-chrome HUD plus DOM overlays for the formation terminal and dialogue |
| Physics | Not added; FP-00 traversal only needs bounded planar movement |
| Assets | Stable manifest keys backed by project-local primitive geometry |
| Camera | Three authored fixed shots with hard cuts at scene boundaries |
| External effects | No push, PR, merge, deploy, publication, monetization, or NFT work in the kickstart block |

## 2026-08-04 — FP-01A formation wiring

| Field | Decision |
|---|---|
| User direction | Option A: deepen formation play before adding the second relay |
| Formation model | An authored seven-node graph defines Triangle positions and visible links |
| Regulation | Required roles bind to named nodes; total roster counts alone are insufficient |
| Interaction | Select two occupied nodes to swap their players |
| State ownership | Simulation owns the seven assignments; UI owns only the transient first-node selection |
| Locking | Gate activation freezes registration, formation choice, and node swaps |
| Scope | Extend the existing FP-00 route without adding combat, a second region, or backend state |
