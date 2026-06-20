import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { FONT_DISPLAY, FONT_MONO, type Palette } from '../theme';
import type { IconName } from '../types';
import { Icon, ShieldMark } from './Icon';
import { Dot, Pill } from './atoms';

export interface StatusMeta {
  fg: string;
  bg: string;
  label: string;
  icon: IconName;
}

export function statusMeta(P: Palette, status: string): StatusMeta {
  if (status === 'blocked' || status === 'scam') return { fg: P.threat, bg: P.threatSoft, label: 'Blocked', icon: 'block' };
  if (status === 'flagged' || status === 'spam') return { fg: P.amber, bg: P.amberSoft, label: status === 'spam' ? 'Spam' : 'Flagged', icon: 'alert' };
  return { fg: P.safe, bg: P.safeSoft, label: 'Safe', icon: 'check' };
}

export function Card({
  P,
  children,
  style = {},
  onClick,
  pad = 16,
}: {
  P: Palette;
  children: ReactNode;
  style?: CSSProperties;
  onClick?: () => void;
  pad?: number;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        background: P.surface,
        border: `1px solid ${P.line}`,
        borderRadius: 18,
        padding: pad,
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function LargeTitle({ P, title, sub }: { P: Palette; title: string; sub?: string }) {
  return (
    <div style={{ padding: '6px 4px 14px' }}>
      <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 30, letterSpacing: '-0.025em', color: P.ink, lineHeight: 1.05 }}>{title}</div>
      {sub && <div style={{ fontFamily: FONT_DISPLAY, fontSize: 14.5, color: P.muted, marginTop: 5 }}>{sub}</div>}
    </div>
  );
}

export function SectionLabel({ P, children, right }: { P: Palette; children: ReactNode; right?: ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '20px 4px 11px' }}>
      <span style={{ fontFamily: FONT_MONO, fontSize: 11.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: P.muted, fontWeight: 600 }}>{children}</span>
      {right}
    </div>
  );
}

export function IconBadge({
  P,
  name,
  fg,
  bg,
  size = 40,
  isize = 21,
}: {
  P: Palette;
  name: IconName;
  fg: string;
  bg: string;
  size?: number;
  isize?: number;
}) {
  return (
    <div style={{ width: size, height: size, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Icon name={name} size={isize} color={fg} weight={2} />
    </div>
  );
}

// activity row used in several places
export function ActivityRow({
  P,
  icon,
  title,
  meta,
  time,
  status,
  onClick,
}: {
  P: Palette;
  icon: IconName;
  title: string;
  meta: string;
  time: string;
  status: string;
  onClick?: () => void;
}) {
  const s = statusMeta(P, status);
  return (
    <div
      onClick={onClick}
      style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '12px 14px', background: P.surface, border: `1px solid ${P.line}`, borderRadius: 15, cursor: onClick ? 'pointer' : 'default' }}
    >
      <IconBadge P={P} name={icon} fg={s.fg} bg={s.bg} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 15, color: P.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</div>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 13, color: P.muted, marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{meta}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5, flexShrink: 0 }}>
        <Pill color={s.fg} bg={s.bg}>
          <Icon name={s.icon} size={11} color={s.fg} weight={2.6} /> {s.label}
        </Pill>
        <span style={{ fontFamily: FONT_MONO, fontSize: 10.5, color: P.faint }}>{time}</span>
      </div>
    </div>
  );
}

// ── Protection status ring ───────────────────────────────────────────────────
export function StatusRing({ P, size = 180, score = 100, pulse = true }: { P: Palette; size?: number; score?: number; pulse?: boolean }) {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!pulse) return;
    let raf = 0;
    const s = performance.now();
    const loop = (n: number) => {
      setT((n - s) / 1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [pulse]);
  const deg = (score / 100) * 360;
  const breathe = pulse ? 1 + 0.01 * Math.sin(t * 1.8) : 1;
  return (
    <div style={{ position: 'relative', width: size, height: size, transform: `scale(${breathe})` }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: `conic-gradient(${P.safe} ${deg}deg, ${P.lineSoft} ${deg}deg)` }} />
      <div style={{ position: 'absolute', inset: 12, borderRadius: '50%', background: P.surface, boxShadow: `inset 0 0 0 1px ${P.lineSoft}` }} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 9 }}>
        <ShieldMark size={52} accent={P.accent} />
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 21, color: P.ink, letterSpacing: '-0.01em' }}>Protected</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: FONT_MONO, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: P.safe, fontWeight: 600, whiteSpace: 'nowrap' }}>
          <Dot size={6} color={P.safe} glow /> All systems active
        </div>
      </div>
    </div>
  );
}

// ── live AI verdict UI ───────────────────────────────────────────────────────
export interface RiskTone {
  fg: string;
  bg: string;
  deep: string;
  word: string;
}

export function riskTone(P: Palette, risk: number): RiskTone {
  if (risk >= 70) return { fg: P.threat, bg: P.threatSoft, deep: P.threatDeep, word: 'Danger' };
  if (risk >= 35) return { fg: P.amber, bg: P.amberSoft, deep: P.amber, word: 'Caution' };
  return { fg: P.safe, bg: P.safeSoft, deep: P.safe, word: 'Safe' };
}

export function RiskMeter({ P, risk }: { P: Palette; risk: number }) {
  const tone = riskTone(P, risk);
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: P.muted }}>Risk score</span>
        <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 26, color: tone.fg, letterSpacing: '-0.01em' }}>
          {risk}
          <span style={{ fontSize: 14, color: P.faint }}>/100</span>
        </span>
      </div>
      <div style={{ height: 9, borderRadius: 999, background: P.panel, overflow: 'hidden' }}>
        <div style={{ width: `${risk}%`, height: '100%', borderRadius: 999, background: tone.fg, transition: 'width .6s cubic-bezier(.2,.8,.2,1)' }} />
      </div>
    </div>
  );
}

export function ScanPulse({ P }: { P: Palette }) {
  const [t, setT] = useState(0);
  useEffect(() => {
    let raf = 0;
    const s = performance.now();
    const l = (n: number) => {
      setT((n - s) / 1000);
      raf = requestAnimationFrame(l);
    };
    raf = requestAnimationFrame(l);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div style={{ position: 'relative', width: 58, height: 58 }}>
      {[0, 1, 2].map((i) => {
        const p = (t * 0.9 + i * 0.33) % 1;
        return <div key={i} style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `2px solid ${P.accent}`, transform: `scale(${0.4 + p})`, opacity: 1 - p }} />;
      })}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ShieldMark size={30} accent={P.accent} />
      </div>
    </div>
  );
}

export function VerdictCard({ P, result }: { P: Palette; result: { risk: number; verdict: string; category: string; reasons: string[]; advice: string } }) {
  const tone = riskTone(P, result.risk);
  const innerRef = useRef<HTMLDivElement>(null);
  return (
    <Card P={P} pad={18} style={{ borderColor: tone.bg, boxShadow: `0 0 0 3px ${tone.bg}` }}>
      <div ref={innerRef} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{ width: 46, height: 46, borderRadius: 13, background: tone.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon name={result.risk >= 35 ? 'alert' : 'check'} size={26} color={tone.fg} weight={2.2} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 19, color: P.ink, letterSpacing: '-0.01em' }}>{result.verdict}</div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 13, color: P.muted, marginTop: 1 }}>{result.category}</div>
        </div>
      </div>
      <RiskMeter P={P} risk={result.risk} />
      {result.reasons.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: P.muted, marginBottom: 9 }}>Why</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {result.reasons.map((r, i) => (
              <div key={i} style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}>
                <span style={{ marginTop: 4, flexShrink: 0 }}>
                  <Icon name={result.risk >= 35 ? 'x' : 'check'} size={13} color={tone.fg} weight={2.6} />
                </span>
                <span style={{ fontFamily: FONT_DISPLAY, fontSize: 13.5, color: P.inkSoft, lineHeight: 1.4 }}>{r}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {result.advice && (
        <div style={{ marginTop: 16, padding: '12px 14px', borderRadius: 12, background: tone.bg }}>
          <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 13.5, color: tone.deep, lineHeight: 1.4 }}>{result.advice}</span>
        </div>
      )}
    </Card>
  );
}
