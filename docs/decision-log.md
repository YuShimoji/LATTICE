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
