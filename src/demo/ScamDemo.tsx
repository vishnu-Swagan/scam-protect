import { useEffect, useState } from 'react';
import { FONT_DISPLAY, FONT_MONO, type Palette } from '../theme';
import type { Scenario, ScenarioKey } from '../types';
import { SCENARIOS } from '../data';
import { Icon } from '../components/Icon';
import { Dot } from '../components/atoms';
import type { Intensity } from '../settings';

function useClock(active: boolean): number {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!active) return;
    const s = performance.now();
    const id = setInterval(() => setT((performance.now() - s) / 1000), 33);
    return () => clearInterval(id);
  }, [active]);
  return t;
}

function ScanningStrip({ P, t }: { P: Palette; t: number }) {
  const x = ((t * 0.6) % 1) * 100;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9, background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(6px)', borderRadius: 999, padding: '7px 13px' }}>
      <Dot size={7} color={P.accent} glow />
      <span style={{ fontFamily: FONT_MONO, fontSize: 11.5, letterSpacing: '0.08em', color: '#fff', fontWeight: 500 }}>SCAM PROTECT SCREENING</span>
      <div style={{ width: 46, height: 4, borderRadius: 999, background: 'rgba(255,255,255,0.2)', overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', left: `${x - 30}%`, width: '30%', height: '100%', background: P.accent, borderRadius: 999 }} />
      </div>
    </div>
  );
}

function IncomingCall({ P, sc, t }: { P: Palette; sc: Scenario; t: number }) {
  const ring = 1 + 0.05 * Math.sin(t * 7);
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #1B2A2F, #0C1416)', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 96 }}>
      <div style={{ position: 'absolute', top: 54, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <ScanningStrip P={P} t={t} />
      </div>
      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 15, color: 'rgba(255,255,255,0.5)' }}>incoming call</div>
      <div style={{ position: 'relative', marginTop: 26, marginBottom: 16 }}>
        <div style={{ position: 'absolute', inset: -14, borderRadius: '50%', border: '2px solid rgba(240,101,74,0.4)', transform: `scale(${ring})` }} />
        <div style={{ width: 108, height: 108, borderRadius: '50%', background: 'linear-gradient(150deg,#2E3B40,#1A2427)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.08)' }}>
          <Icon name="card" size={44} color="rgba(255,255,255,0.85)" weight={1.8} />
        </div>
      </div>
      <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 24, color: '#fff', letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>{sc.caller}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 9, fontFamily: FONT_MONO, fontSize: 12, color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap' }}>
        <span style={{ width: 14, height: 14, borderRadius: 4, background: '#3B7DD8', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="check" size={9} color="#fff" weight={3} />
        </span>
        {sc.sub}
      </div>
      <div style={{ position: 'absolute', bottom: 64, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 76 }}>
        {(
          [
            ['#E0503A', 'x', 'decline'],
            [P.safe, 'phone', 'accept'],
          ] as const
        ).map(([c, ic, l], i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 9 }}>
            <div style={{ width: 66, height: 66, borderRadius: '50%', background: c, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: i === 1 ? `scale(${ring})` : 'none' }}>
              <Icon name={ic} size={28} color="#fff" weight={2.4} />
            </div>
            <span style={{ fontFamily: FONT_DISPLAY, fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function IncomingMessage({ P, sc, t }: { P: Palette; sc: Scenario; t: number }) {
  const drop = Math.min(1, t / 0.4);
  return (
    <div style={{ position: 'absolute', inset: 0, background: P.isDark ? P.bg : '#0C0F0E' }}>
      <div style={{ position: 'absolute', inset: 0, background: P.isDark ? 'linear-gradient(180deg,#10201b,#0a120f)' : 'linear-gradient(180deg,#1a201e,#0c0f0e)' }} />
      <div style={{ position: 'absolute', top: 64, left: 14, right: 14, transform: `translateY(${(1 - drop) * -40}px)`, opacity: drop }}>
        <div style={{ background: 'rgba(40,40,40,0.72)', backdropFilter: 'blur(20px)', borderRadius: 22, padding: '14px 16px', boxShadow: '0 20px 50px -20px rgba(0,0,0,0.6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 8 }}>
            <div style={{ width: 22, height: 22, borderRadius: 6, background: '#3B7DD8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="message" size={13} color="#fff" weight={2.2} />
            </div>
            <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 13.5, color: '#fff' }}>Messages</span>
            <span style={{ fontFamily: FONT_DISPLAY, fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>now</span>
          </div>
          <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 14.5, color: '#fff' }}>{sc.caller}</div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 13.5, color: 'rgba(255,255,255,0.8)', marginTop: 3, lineHeight: 1.45 }}>{sc.preview}</div>
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: 90, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <ScanningStrip P={P} t={t} />
      </div>
    </div>
  );
}

function IncomingTransfer({ P, sc, t }: { P: Palette; sc: Scenario; t: number }) {
  const pulse = 1 + 0.02 * Math.sin(t * 5);
  return (
    <div style={{ position: 'absolute', inset: 0, background: P.bg }}>
      <div style={{ position: 'absolute', top: 60, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <ScanningStrip P={P} t={t} />
      </div>
      <div style={{ position: 'absolute', left: 16, right: 16, bottom: 24, background: P.surface, borderRadius: 24, border: `1px solid ${P.line}`, padding: '22px 22px 24px', boxShadow: P.shadow }}>
        <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: P.muted, marginBottom: 16 }}>Confirm transfer</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontFamily: FONT_DISPLAY, fontSize: 14.5, color: P.inkSoft }}>To</span>
          <span style={{ fontFamily: FONT_MONO, fontSize: 13.5, color: P.ink }}>SAFEPAY ••4471</span>
        </div>
        <div style={{ height: 1, background: P.lineSoft, margin: '4px 0 12px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontFamily: FONT_DISPLAY, fontSize: 14.5, color: P.inkSoft }}>Amount</span>
          <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 34, color: P.ink, letterSpacing: '-0.02em' }}>{sc.amount}</span>
        </div>
        <div style={{ marginTop: 18, height: 54, borderRadius: 14, background: P.threat, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${pulse})`, boxShadow: `0 10px 24px -10px ${P.threat}` }}>
          <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 17, color: '#fff' }}>Confirm transfer now</span>
        </div>
      </div>
    </div>
  );
}

function InterceptSheet({ P, sc, t, onClose, intensity }: { P: Palette; sc: Scenario; t: number; onClose: () => void; intensity: Intensity }) {
  const sheet = Math.min(1, Math.pow(t / 0.5, 0.7));
  const dim = Math.min(1, t / 0.3);
  const flash = t < 0.5 ? 1 - t / 0.5 : 0;
  const checkP = Math.min(1, Math.max(0, (t - 0.5) / 0.5));
  const flashStrength = intensity === 'high' ? 0.6 : intensity === 'low' ? 0.18 : 0.4;
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 5 }}>
      <div style={{ position: 'absolute', inset: 0, background: `rgba(12,9,7,${0.6 * dim})` }} />
      <div style={{ position: 'absolute', inset: 0, background: P.threat, opacity: flash * flashStrength, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', left: 12, right: 12, bottom: 14, background: P.surface, borderRadius: 28, overflow: 'hidden', transform: `translateY(${(1 - sheet) * 120}%)`, boxShadow: '0 -16px 60px -10px rgba(0,0,0,0.55)' }}>
        <div style={{ height: 6, background: P.accent }} />
        <div style={{ padding: '24px 24px 26px', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 15 }}>
            <div style={{ position: 'relative', width: 76, height: 76 }}>
              <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: P.isDark ? P.panel : P.accentTint }} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="46" height="46" viewBox="0 0 24 24">
                  <path d="M12 2.5 L20 5.6 V11 C20 16 16.5 19.8 12 21.8 C7.5 19.8 4 16 4 11 V5.6 Z" fill={P.accent} />
                  <path d="M8 12 L11 15 L16.5 8.5" stroke="#fff" strokeWidth="2.1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="14" strokeDashoffset={14 * (1 - checkP)} />
                </svg>
              </div>
            </div>
          </div>
          <div style={{ fontFamily: FONT_MONO, fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: P.accent, fontWeight: 600, marginBottom: 9 }}>Scam Protect</div>
          <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 26, color: P.ink, letterSpacing: '-0.02em', lineHeight: 1.12, marginBottom: 10 }}>{sc.verdict}</div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 15, color: P.inkSoft, lineHeight: 1.5, marginBottom: 16 }}>{sc.why}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, justifyContent: 'center', marginBottom: 20 }}>
            {sc.reasons.map((r, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: FONT_MONO, fontSize: 11.5, fontWeight: 600, color: P.threatDeep, background: P.threatSoft, borderRadius: 999, padding: '6px 11px' }}>
                <Icon name="alert" size={12} color={P.threat} weight={2.4} /> {r}
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            <div onClick={onClose} style={{ height: 54, borderRadius: 15, background: P.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 16.5, color: '#fff' }}>{sc.cta}</span>
            </div>
            <div onClick={onClose} style={{ height: 48, borderRadius: 15, background: P.panel, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 14.5, color: P.inkSoft }}>See how we knew</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ScamDemo({ P, scenarioKey, onClose, intensity = 'medium' }: { P: Palette; scenarioKey: ScenarioKey; onClose: () => void; intensity?: Intensity }) {
  const sc = SCENARIOS[scenarioKey];
  const t = useClock(true);
  const dur = scenarioKey === 'message' ? 2.6 : scenarioKey === 'transaction' ? 3.0 : 2.8;
  const phase: 'incoming' | 'blocked' = t < dur ? 'incoming' : 'blocked';
  const bt = t - dur;

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 40, overflow: 'hidden' }}>
      {scenarioKey === 'call' && <IncomingCall P={P} sc={sc} t={t} />}
      {scenarioKey === 'message' && <IncomingMessage P={P} sc={sc} t={t} />}
      {scenarioKey === 'transaction' && <IncomingTransfer P={P} sc={sc} t={t} />}
      {phase === 'blocked' && <InterceptSheet P={P} sc={sc} t={bt} onClose={onClose} intensity={intensity} />}
      {phase === 'incoming' && (
        <div onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, zIndex: 6, width: 32, height: 32, borderRadius: '50%', background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <Icon name="x" size={16} color="#fff" weight={2.4} />
        </div>
      )}
    </div>
  );
}
