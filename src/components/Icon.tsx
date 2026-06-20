import type { CSSProperties } from 'react';
import { FONT_DISPLAY, ACCENTS } from '../theme';
import type { IconName } from '../types';

// Stroke icon set, 24×24 viewBox. Ported from app-theme.jsx.
const PATHS: Record<IconName, string> = {
  shield: 'M12 3 L19 6 V11 C19 15.5 16 19 12 21 C8 19 5 15.5 5 11 V6 Z',
  message: 'M4 5 H20 V16 H9 L4 20 Z',
  phone: 'M6 3 C6 3 4 4 4 6 C4 13 11 20 18 20 C20 20 21 18 21 18 L17 15 L14.5 17 C12 16 8 12 7 9.5 L9 7 Z',
  card: 'M3 7 H21 V18 H3 Z M3 10.5 H21',
  users: 'M8 11 a3 3 0 1 0 0-6 a3 3 0 0 0 0 6 Z M2.5 19 C2.5 15.5 5 14 8 14 C11 14 13.5 15.5 13.5 19 M16 11 a2.5 2.5 0 1 0 0-5 M15 14.2 C18 14.2 21 15.6 21 19',
  globe: 'M12 3 a9 9 0 1 0 0 18 a9 9 0 0 0 0-18 Z M3 12 H21 M12 3 C9 6 9 18 12 21 M12 3 C15 6 15 18 12 21',
  search: 'M11 4 a7 7 0 1 0 0 14 a7 7 0 0 0 0-14 Z M16.5 16.5 L21 21',
  sparkles: 'M12 4 L13.4 9 L18.5 10.4 L13.4 11.8 L12 17 L10.6 11.8 L5.5 10.4 L10.6 9 Z M18.5 15 L19.2 17.3 L21.5 18 L19.2 18.7 L18.5 21 L17.8 18.7 L15.5 18 L17.8 17.3 Z',
  alert: 'M12 4 L21 19 H3 Z M12 10 V14 M12 16.6 V16.8',
  check: 'M5 12.5 L10 17.5 L19 7',
  x: 'M6 6 L18 18 M18 6 L6 18',
  chevron: 'M9 5 L16 12 L9 19',
  bell: 'M6 10 a6 6 0 0 1 12 0 c0 4 1.5 6 1.5 6 H4.5 C4.5 16 6 14 6 10 Z M9.5 19 a2.5 2.5 0 0 0 5 0',
  lock: 'M6 11 H18 V20 H6 Z M8.5 11 V8 a3.5 3.5 0 0 1 7 0 V11',
  plus: 'M12 5 V19 M5 12 H19',
  scan: 'M4 8 V5 H7 M17 5 H20 V8 M20 16 V19 H17 M7 19 H4 V16 M4 12 H20',
  send: 'M4 12 L20 4 L14 20 L11 13 Z',
  flag: 'M6 4 V21 M6 5 H17 L14.5 9 L17 13 H6',
  block: 'M12 3 a9 9 0 1 0 0 18 a9 9 0 0 0 0-18 Z M6 6 L18 18',
  link: 'M9.5 14.5 L14.5 9.5 M8 12 L6 14 a3 3 0 0 0 4 4 l2-2 M16 12 l2-2 a3 3 0 0 0-4-4 l-2 2',
  filter: 'M4 6 H20 M7 12 H17 M10 18 H14',
  user: 'M12 11 a3.5 3.5 0 1 0 0-7 a3.5 3.5 0 0 0 0 7 Z M5 20 C5 16 8 14.5 12 14.5 C16 14.5 19 16 19 20',
  clock: 'M12 3 a9 9 0 1 0 0 18 a9 9 0 0 0 0-18 Z M12 7 V12 L15.5 14',
  trending: 'M4 16 L10 10 L13 13 L20 6 M20 6 H15 M20 6 V11',
  pause: 'M8 5 V19 M16 5 V19',
  arrowDown: 'M12 4 V20 M6 14 L12 20 L18 14',
  arrowUp: 'M12 20 V4 M6 10 L12 4 L18 10',
  gear: 'M12 9.5 a2.5 2.5 0 1 0 0 5 a2.5 2.5 0 0 0 0-5 Z M12 3 l1.2 2.1 2.4-.3 .6 2.3 2.2 1 -.7 2.3 1.5 1.9 -1.5 1.9 .7 2.3 -2.2 1 -.6 2.3 -2.4-.3 L12 21 l-1.2-2.1 -2.4 .3 -.6-2.3 -2.2-1 .7-2.3 -1.5-1.9 1.5-1.9 -.7-2.3 2.2-1 .6-2.3 2.4 .3 Z',
  home: 'M4 11 L12 4 L20 11 M6 9.5 V20 H18 V9.5',
  voice: 'M12 4 a3 3 0 0 1 3 3 V12 a3 3 0 0 1-6 0 V7 a3 3 0 0 1 3-3 Z M6 11 a6 6 0 0 0 12 0 M12 17 V21',
};

export interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  weight?: number;
  fill?: string;
  style?: CSSProperties;
}

export function Icon({ name, size = 22, color = 'currentColor', weight = 1.9, fill = 'none', style = {} }: IconProps) {
  const d = PATHS[name] || PATHS.shield;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill === 'none' ? 'none' : fill}
      style={{ display: 'block', flexShrink: 0, ...style }}
    >
      <path
        d={d}
        stroke={color}
        strokeWidth={weight}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={fill === 'none' ? 'none' : fill}
      />
    </svg>
  );
}

// Shield mark with a check, used for brand.
export function ShieldMark({ size = 34, accent }: { size?: number; accent?: string }) {
  const a = accent || ACCENTS.emerald;
  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} viewBox="0 0 24 24" style={{ position: 'absolute', inset: 0 }}>
        <path d="M12 2.5 L20 5.6 V11 C20 16 16.5 19.8 12 21.8 C7.5 19.8 4 16 4 11 V5.6 Z" fill={a} />
        <path d="M8 12 L11 15 L16.5 8.5" stroke="#fff" strokeWidth="2.1" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export function Wordmark({ size = 22, color, accent }: { size?: number; color?: string; accent?: string }) {
  return (
    <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: size, letterSpacing: '-0.02em', color, lineHeight: 1 }}>
      Security<span style={{ color: accent }}>Z</span>
    </span>
  );
}
