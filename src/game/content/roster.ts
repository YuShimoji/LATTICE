import type { PlayerProfile } from "../simulation/types";

export const ROSTER: readonly PlayerProfile[] = [
  { id: "iona", name: "Iona Vey", primaryRole: "Anchor", secondaryRole: "Warden", note: "Keeps a dead route from drifting." },
  { id: "vale", name: "Vale Rook", primaryRole: "Relayer", secondaryRole: "Conductor", note: "Reads old transit cadence by ear." },
  { id: "neri", name: "Neri Lune", primaryRole: "Runner", secondaryRole: "Wild", note: "Maps gaps between camera sectors." },
  { id: "pax", name: "Pax Orra", primaryRole: "Runner", secondaryRole: "Breaker", note: "Fastest over broken platform edges." },
  { id: "sable", name: "Sable Dae", primaryRole: "Breaker", secondaryRole: "Anchor", note: "Turns pressure into open space." },
  { id: "orin", name: "Orin Moss", primaryRole: "Warden", secondaryRole: "Relayer", note: "Protects a line after it forms." },
  { id: "kestrel", name: "Kestrel Ash", primaryRole: "Conductor", secondaryRole: "Runner", note: "Calls formations without a crowd." },
  { id: "mira", name: "Mira Quill", primaryRole: "Wild", secondaryRole: "Relayer", note: "Carries an unregistered club signal." },
] as const;
