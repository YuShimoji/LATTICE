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
- Platform 06 regulation validation and gate activation.
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
- `npm test`: 1 file / 4 tests PASS. Vitest reports an exit open-handle warning after successful closure in this Windows environment.
- `npm run build`: Vite production build PASS; 12 modules, 495.27 kB main JS before gzip.
- Browser QA: PASS at 1280×720 and 390×844.
- Browser path: concourse → terminal → seventh player registration → Triangle → gate online → energized gate → three-line Registered Echo dialogue → route restored.
- Browser console warning/error count: 0.
- Evidence summary: `docs/verification/fp00-browser-qa.md`.

## Boundaries

Primitive visual prototype only. No complete match simulation, save persistence, production assets, audio, backend, monetization, NFT, deployment, or publication.

## Current critical blocker

None for FP-00 mechanical local validation. Human playtest and the next product slice remain separate gates.
