import { useState } from 'react';
import { FONT_DISPLAY, FONT_MONO, type Palette } from '../theme';
import type { ScamResult } from '../types';
import { Icon } from '../components/Icon';
import { Card, LargeTitle, ScanPulse, VerdictCard } from '../components/screenAtoms';
import { runScamAnalysis } from '../lib/analyze';

const ANALYZER_EXAMPLES = [
  'USPS: Your package is held due to an unpaid customs fee of $2.99. Pay now: usps-redeliver.co/track',
  'Grandpa it’s me, I’m in jail and need $2,000 for bail. Please don’t tell mom. Send via gift cards.',
  'Hi! Lunch at 12:30 still good? — Sarah',
];

export function AnalyzerScreen({ P, initialText = '' }: { P: Palette; initialText?: string }) {
  const [text, setText] = useState(initialText);
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [result, setResult] = useState<ScamResult | null>(null);
  const [err, setErr] = useState('');

  const analyze = async () => {
    if (!text.trim() || state === 'loading') return;
    setState('loading');
    setResult(null);
    setErr('');
    try {
      setResult(await runScamAnalysis(text));
      setState('done');
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Could not analyze right now. Please try again.');
      setState('error');
    }
  };

  return (
    <div>
      <LargeTitle P={P} title="AI scam check" sub="Paste any text, email, or call transcript. SecurityZ analyzes it live." />
      <Card P={P} pad={14}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste the suspicious message here…"
          style={{ width: '100%', minHeight: 116, border: 'none', outline: 'none', resize: 'none', background: 'transparent', fontFamily: FONT_DISPLAY, fontSize: 15, color: P.ink, lineHeight: 1.5 }}
        />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, borderTop: `1px solid ${P.lineSoft}`, paddingTop: 12 }}>
          <span style={{ fontFamily: FONT_MONO, fontSize: 10.5, color: P.faint }}>{text.length} chars</span>
          <div
            onClick={analyze}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: text.trim() ? P.accent : P.panel,
              color: text.trim() ? '#fff' : P.faint,
              fontFamily: FONT_DISPLAY,
              fontWeight: 700,
              fontSize: 14,
              padding: '9px 18px',
              borderRadius: 999,
              cursor: text.trim() ? 'pointer' : 'default',
            }}
          >
            <Icon name="sparkles" size={16} color={text.trim() ? '#fff' : P.faint} weight={1.8} /> {state === 'loading' ? 'Analyzing…' : 'Analyze'}
          </div>
        </div>
      </Card>

      {state === 'idle' && (
        <div style={{ marginTop: 16 }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: P.muted, marginBottom: 10 }}>Try an example</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {ANALYZER_EXAMPLES.map((ex, i) => (
              <div
                key={i}
                onClick={() => setText(ex)}
                style={{ background: P.surface, border: `1px solid ${P.line}`, borderRadius: 13, padding: '11px 13px', fontFamily: FONT_DISPLAY, fontSize: 13, color: P.inkSoft, lineHeight: 1.4, cursor: 'pointer', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
              >
                {ex}
              </div>
            ))}
          </div>
        </div>
      )}

      {state === 'loading' && (
        <Card P={P} pad={22} style={{ marginTop: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <ScanPulse P={P} />
          <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 15, color: P.ink }}>Analyzing for scam signals…</div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 13, color: P.muted, textAlign: 'center', maxWidth: 240 }}>Checking sender, links, urgency, payment requests, and known fraud patterns.</div>
        </Card>
      )}

      {state === 'error' && (
        <Card P={P} pad={16} style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <Icon name="alert" size={18} color={P.threat} weight={2.2} style={{ marginTop: 1, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 14, color: P.ink }}>Couldn’t analyze</div>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 13, color: P.muted, marginTop: 2, lineHeight: 1.4 }}>{err}</div>
              <div onClick={analyze} style={{ marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 7, background: P.accent, color: '#fff', fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 13.5, padding: '8px 14px', borderRadius: 999, cursor: 'pointer' }}>
                <Icon name="sparkles" size={14} color="#fff" weight={1.8} /> Try again
              </div>
            </div>
          </div>
        </Card>
      )}

      {state === 'done' && result && (
        <div style={{ marginTop: 16 }}>
          <VerdictCard P={P} result={result} />
        </div>
      )}
    </div>
  );
}
