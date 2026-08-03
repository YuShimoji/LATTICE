# Runtime State

Updated: 2026-08-04

## Start observation

- Remote: `https://github.com/YuShimoji/LATTICE.git`
- Remote HEAD: absent; repository was empty at kickstart.
- Local root: `C:\Users\thank\Storage\Game Projects\LATTICE`
- Branch: `codex/fp00-kickstart`
- Stack inherited from the approved kickstart: TypeScript, Vite, vanilla Three.js, DOM overlays.

## Implemented capability

- Three connected fixed-camera station scenes.
- Keyboard traversal and contextual interaction.
- Eight-player roster, seven registration slots, three formation choices.
- Seven-node Triangle topology with visible links and two-node player swaps.
- Platform 06 position-dependent regulation validation and gate activation.
- Registered Echo conversation and completed route state.
- Serializable simulation state separated from rendering.
- Read-only browser probe at `window.__LATTICE__`.

## Run and verify

```powershell
npm install
npm run dev
npm run typecheck
npm test
npm run build
```

## Latest verification

- `npm run typecheck`: PASS.
- `npm test`: 1 file / 5 tests PASS with a clean process exit.
- `npm run build`: Vite production build PASS; 13 modules, 499.46 kB main JS before gzip.
- FP-00 Browser QA: PASS at 1280×720 and 390×844.
- FP-01A desktop Browser QA: PASS at 1280×720.
- FP-01A Browser path: terminal → seventh player registration → Triangle rejected with four position-specific reasons → three node swaps → regulation match → gate online → energized gate → three-line Registered Echo dialogue → route restored.
- Browser console warning/error count: 0.
- Evidence summaries: `docs/verification/fp00-browser-qa.md`, `docs/verification/fp01a-formation-wiring-browser-qa.md`.

## Boundaries

Primitive visual prototype only. No complete match simulation, save persistence, production assets, audio, backend, monetization, NFT, deployment, or publication.

## Current critical blocker

None for FP-01A mechanical local validation. Human playtest and the next product slice remain separate gates.
