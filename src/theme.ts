// Palette, fonts, and accent options for the Scam Protect app.
// Ported faithfully from the design's app-theme.jsx.

export const FONT_DISPLAY = "'Hanken Grotesk', system-ui, sans-serif";
export const FONT_MONO = "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace";

export type AccentKey = 'emerald' | 'indigo' | 'plum' | 'ember';

// Accent (brand) options for the Settings panel.
export const ACCENTS: Record<AccentKey, string> = {
  emerald: '#1C6B57',
  indigo: '#3D52C9',
  plum: '#7A3E8E',
  ember: '#C2521E',
};

export interface Palette {
  accent: string;
  accentDeep: string;
  accentSoft: string;
  accentTint: string;
  bg: string;
  surface: string;
  surfaceWarm: string;
  panel: string;
  panel2: string;
  ink: string;
  inkSoft: string;
  muted: string;
  faint: string;
  line: string;
  lineSoft: string;
  safe: string;
  safeSoft: string;
  threat: string;
  threatDeep: string;
  threatSoft: string;
  amber: string;
  amberSoft: string;
  tabBar: string;
  tabBorder: string;
  shadow: string;
  isDark: boolean;
}

// ── color helpers ────────────────────────────────────────────────────────────
function hexToRgb(h: string): [number, number, number] {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((x) => Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, '0'))
      .join('')
  );
}
export function tint(hex: string, amt: number): string {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(r + (255 - r) * amt, g + (255 - g) * amt, b + (255 - b) * amt);
}
export function shade(hex: string, amt: number): string {
  const [r, g, b] = hexToRgb(hex);
  const f = 1 + amt;
  return rgbToHex(r * f, g * f, b * f);
}
export function lighten(hex: string, amt: number): string {
  return tint(hex, amt);
}

// Build a full palette from an accent + dark flag.
export function makePalette(accent: string = ACCENTS.emerald, dark = false): Palette {
  const a = accent;
  if (!dark) {
    return {
      accent: a,
      accentDeep: shade(a, -0.18),
      accentSoft: tint(a, 0.86),
      accentTint: tint(a, 0.94),
      bg: '#F4F1EA',
      surface: '#FFFFFF',
      surfaceWarm: '#FBF9F3',
      panel: '#EEE9DF',
      panel2: '#F3EFE6',
      ink: '#211C16',
      inkSoft: '#565047',
      muted: '#8A8175',
      faint: '#B4AB9E',
      line: '#E6DFD2',
      lineSoft: '#F0EADF',
      safe: '#2E9D71',
      safeSoft: '#E2F2E9',
      threat: '#D24A30',
      threatDeep: '#A6371F',
      threatSoft: '#FBE7E0',
      amber: '#C7892A',
      amberSoft: '#F6ECD6',
      tabBar: 'rgba(255,255,255,0.86)',
      tabBorder: '#E6DFD2',
      shadow: '0 22px 50px -24px rgba(40,34,26,0.45)',
      isDark: false,
    };
  }
  return {
    accent: lighten(a, 0.12),
    accentDeep: a,
    accentSoft: 'rgba(255,255,255,0.07)',
    accentTint: 'rgba(255,255,255,0.05)',
    bg: '#0E1411',
    surface: '#161E1A',
    surfaceWarm: '#19221D',
    panel: '#202A24',
    panel2: '#1B2520',
    ink: '#F2EFE9',
    inkSoft: '#C4BFB6',
    muted: '#8E897F',
    faint: '#5E5A52',
    line: '#293530',
    lineSoft: '#222C27',
    safe: '#3FBF8C',
    safeSoft: 'rgba(63,191,140,0.14)',
    threat: '#F0654A',
    threatDeep: '#F0654A',
    threatSoft: 'rgba(240,101,74,0.16)',
    amber: '#E0A03E',
    amberSoft: 'rgba(224,160,62,0.16)',
    tabBar: 'rgba(20,28,24,0.88)',
    tabBorder: '#293530',
    shadow: '0 22px 60px -22px rgba(0,0,0,0.7)',
    isDark: true,
  };
}
