# FP-01A Formation Wiring Browser QA

Date: 2026-08-04

Runtime: local Vite development server

Viewport: 1280×720

## Result

PASS. The formation terminal exposes a readable seven-node Triangle, rejects an incorrectly wired seven-player roster, accepts the same roster after node swaps, and preserves the complete FP-00 route.

## Observed path

1. Reached the Platform 06 terminal and registered Kestrel Ash as the seventh player.
2. Selected Triangle. Commit remained disabled with four position-specific reasons:
   - Apex Runner requires Runner.
   - Left Channel requires Runner.
   - Relay Junction requires Relayer.
   - Foundation Anchor requires Anchor.
3. Swapped Apex/Right, Left/Relay, then Right/Anchor.
4. Observed the resulting valid wiring:
   - Apex: Neri Lune — Runner
   - Left: Pax Orra — Runner
   - Right: Orin Moss — flex
   - Relay: Vale Rook — Relayer
   - Brace L: Sable Dae — flex
   - Anchor: Iona Vey — Anchor
   - Brace R: Kestrel Ash — flex
5. Observed `REGULATION MATCH`, enabled the commit action, and committed the formation.
6. Observed `NODE 00 · GRID ONLINE`, crossed the energized gate, completed all three Registered Echo lines, and reached `Route restored`.

## Visual and interaction checks

- Node names, required roles, assigned players, and player roles were readable.
- Graph links switched to the valid state together with the regulation verdict.
- First-node selection had a distinct highlight and the second selection performed exactly one swap.
- Existing roster, HUD, gate, and dialogue interactions remained operable.

## Boundary

This is a mechanical local-browser receipt. It is not Full First Playable acceptance, a human playtest verdict, publication approval, or release approval.
