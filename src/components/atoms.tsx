import type { CSSProperties, ReactNode } from 'react';
import { FONT_MONO } from '../theme';

export function Dot({ size = 8, color, glow = false }: { size?: number; color: string; glow?: boolean }) {
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        display: 'inline-block',
        flexShrink: 0,
        boxShadow: glow ? `0 0 0 ${size * 0.5}px ${color}33` : 'none',
      }}
    />
  );
}

export function Pill({
  children,
  color,
  bg,
  border,
  style = {},
}: {
  children: ReactNode;
  color: string;
  bg: string;
  border?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontFamily: FONT_MONO,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.02em',
        color,
        background: bg,
        border: border ? `1px solid ${border}` : 'none',
        borderRadius: 999,
        padding: '4px 9px',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {children}
    </span>
  );
}
