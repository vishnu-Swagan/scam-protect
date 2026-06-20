import { FONT_DISPLAY, FONT_MONO, type Palette } from '../theme';
import { TRANSACTIONS } from '../data';
import { Icon } from '../components/Icon';
import { Pill } from '../components/atoms';
import { Card, LargeTitle, SectionLabel, IconBadge, statusMeta } from '../components/screenAtoms';

export function BankScreen({ P }: { P: Palette }) {
  return (
    <div>
      <LargeTitle P={P} title="Banking" sub="We watch for scam-driven transfers before the money leaves." />
      <div style={{ background: `linear-gradient(135deg, ${P.accent}, ${P.accentDeep})`, borderRadius: 18, padding: 18, color: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.7 }}>Protected balance</div>
            <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 32, letterSpacing: '-0.02em', marginTop: 5 }}>$12,418.65</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.16)', borderRadius: 999, padding: '5px 10px', fontFamily: FONT_MONO, fontSize: 11, fontWeight: 600 }}>
            <Icon name="lock" size={12} color="#fff" weight={2} /> Monitored
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 16, fontFamily: FONT_DISPLAY, fontSize: 13, opacity: 0.9 }}>
          <span>Checking •• 2841</span>
          <span style={{ opacity: 0.45 }}>|</span>
          <span>Visa •• 6612</span>
        </div>
      </div>
      <Card P={P} pad={14} style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 12, background: P.threatSoft, borderColor: P.threatSoft }}>
        <Icon name="alert" size={22} color={P.threat} weight={2.2} />
        <div style={{ flex: 1, fontFamily: FONT_DISPLAY, fontSize: 13.5, color: P.threatDeep, fontWeight: 600, lineHeight: 1.4 }}>$9,240 in scam transfers stopped this week.</div>
      </Card>
      <SectionLabel P={P}>Transactions</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {TRANSACTIONS.map((t) => {
          const s = statusMeta(P, t.status === 'cleared' ? 'safe' : t.status);
          const flagged = t.status !== 'cleared';
          return (
            <div key={t.id} style={{ background: P.surface, border: `1px solid ${flagged ? s.bg : P.line}`, borderRadius: 15, padding: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                <IconBadge P={P} name={flagged ? 'alert' : t.dir === 'in' ? 'arrowDown' : 'card'} fg={flagged ? s.fg : P.muted} bg={flagged ? s.bg : P.panel} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 14, color: P.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.merchant}</div>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 10.5, color: P.faint, marginTop: 1 }}>{t.card} · {t.time}</div>
                </div>
                <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 15, color: t.dir === 'in' ? P.safe : flagged ? s.fg : P.ink, whiteSpace: 'nowrap' }}>
                  {t.dir === 'in' ? '+' : '−'}${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
              </div>
              {flagged && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginTop: 11, paddingTop: 11, borderTop: `1px solid ${P.lineSoft}` }}>
                  <Pill color={s.fg} bg={s.bg} style={{ flexShrink: 0 }}>
                    <Icon name={t.status === 'blocked' ? 'block' : 'alert'} size={11} color={s.fg} weight={2.6} /> {t.status === 'blocked' ? 'Blocked' : 'Held'}
                  </Pill>
                  <span style={{ fontFamily: FONT_DISPLAY, fontSize: 12.5, color: P.inkSoft, lineHeight: 1.4 }}>{t.reason}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
