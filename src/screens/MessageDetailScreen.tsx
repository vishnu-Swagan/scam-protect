import { useState } from 'react';
import { FONT_DISPLAY, FONT_MONO, type Palette } from '../theme';
import type { Message, ScamResult } from '../types';
import { Icon } from '../components/Icon';
import { Pill } from '../components/atoms';
import { Card, IconBadge, VerdictCard, statusMeta } from '../components/screenAtoms';
import { runScamAnalysis } from '../lib/analyze';

export function MessageDetailScreen({ P, msg }: { P: Palette; msg: Message }) {
  const s = statusMeta(P, msg.status);
  const isScam = msg.status !== 'safe';
  const [ai, setAi] = useState<ScamResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const reanalyze = async () => {
    if (loading) return;
    setLoading(true);
    setErr('');
    try {
      setAi(await runScamAnalysis(msg.body));
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Could not analyze right now.');
    }
    setLoading(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 4px 16px' }}>
        <IconBadge P={P} name="message" fg={s.fg} bg={s.bg} size={46} isize={24} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 19, color: P.ink, letterSpacing: '-0.01em' }}>{msg.sender}</div>
          <div style={{ fontFamily: FONT_MONO, fontSize: 11.5, color: P.muted, marginTop: 2 }}>{msg.number} · {msg.time}</div>
        </div>
        <Pill color={s.fg} bg={s.bg}>
          <Icon name={s.icon} size={11} color={s.fg} weight={2.6} /> {isScam ? 'Blocked' : 'Safe'}
        </Pill>
      </div>

      <div style={{ background: isScam ? P.threatSoft : P.panel, border: `1px solid ${isScam ? P.threatSoft : P.line}`, borderRadius: '4px 16px 16px 16px', padding: '14px 16px', position: 'relative' }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 15, color: P.ink, lineHeight: 1.5 }}>{msg.body}</div>
        {isScam && (
          <div style={{ fontFamily: FONT_MONO, fontSize: 10.5, color: P.threatDeep, marginTop: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon name="lock" size={12} color={P.threatDeep} weight={2} /> Links disabled by Scam Protect
          </div>
        )}
      </div>

      {isScam && (
        <Card P={P} pad={16} style={{ marginTop: 14 }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: P.muted, marginBottom: 11 }}>Why we flagged this · {msg.cat}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {msg.reasons.map((r, i) => (
              <div key={i} style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}>
                <span style={{ marginTop: 3, flexShrink: 0 }}>
                  <Icon name="x" size={13} color={P.threat} weight={2.6} />
                </span>
                <span style={{ fontFamily: FONT_DISPLAY, fontSize: 13.5, color: P.inkSoft, lineHeight: 1.4 }}>{r}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {ai && (
        <div style={{ marginTop: 14 }}>
          <VerdictCard P={P} result={ai} />
        </div>
      )}

      {err && (
        <div style={{ marginTop: 12, fontFamily: FONT_DISPLAY, fontSize: 13, color: P.threat, display: 'flex', alignItems: 'center', gap: 7 }}>
          <Icon name="alert" size={14} color={P.threat} weight={2.2} /> {err}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 16 }}>
        <div onClick={reanalyze} style={{ height: 50, borderRadius: 14, background: P.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, cursor: 'pointer' }}>
          <Icon name="sparkles" size={18} color="#fff" weight={1.8} />
          <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 15.5, color: '#fff' }}>{loading ? 'Analyzing…' : ai ? 'Re-run AI analysis' : 'Re-analyze with AI'}</span>
        </div>
        <div style={{ display: 'flex', gap: 9 }}>
          <div style={{ flex: 1, height: 48, borderRadius: 14, background: P.panel, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}>
            <Icon name="flag" size={16} color={P.inkSoft} weight={2} />
            <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 14, color: P.inkSoft }}>Report</span>
          </div>
          <div style={{ flex: 1, height: 48, borderRadius: 14, background: P.panel, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}>
            <Icon name="block" size={16} color={P.inkSoft} weight={2} />
            <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 14, color: P.inkSoft }}>Block</span>
          </div>
        </div>
      </div>
    </div>
  );
}
