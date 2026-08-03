# Project Context

Updated: 2026-08-04

## Current mission

`LEL-FP01A-FORMATION-WIRING`: deepen the formation-to-infrastructure loop so topology placement, not only role totals, controls the station gate.

## Current state

The topic branch contains the canonical design sources, the mechanically verified FP-00 spine, and the selected FP-01A formation-wiring slice. A real browser run proves that the same registered seven can fail or pass Triangle regulation according to node placement, then complete the existing restored-route loop.

## Architecture

- `src/game/content`: roster plus authored formation nodes and links.
- `src/game/simulation`: serializable roster, node assignment, rules, and progression authority.
- `src/game/input`: physical-key to action mapping.
- `src/render`: Three.js projection and fixed cameras.
- `src/ui`: DOM terminal, HUD, and conversation.
- `src/diagnostics`: read-only runtime inspection.

## Next decision after acceptance

Choose the next narrow product slice after FP-01A: add station-specific topology variation, make the Registered Echo react to the committed wiring, or expand traversal to the first second relay. Do not infer Full First Playable acceptance from FP-01A mechanical completion.
