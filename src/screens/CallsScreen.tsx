import { FONT_DISPLAY, FONT_MONO, type Palette } from '../theme';
import { CALLS } from '../data';
import { Icon } from '../components/Icon';
import { Pill } from '../components/atoms';
import { Card, LargeTitle, SectionLabel, IconBadge, statusMeta } from '../components/screenAtoms';

export function CallsScreen({ P }: { P: Palette }) {
  const blocked = CALLS.filter((c) => c.type !== 'safe').length;
  return (
    <div>
      <LargeTitle P={P} title="Calls" sub="Scam and spam calls are screened before your phone rings." />
      <div style={{ display: 'flex', gap: 10 }}>
        <Card P={P} pad={14} style={{ flex: 1 }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 24, color: P.threat }}>{blocked}</div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 12.5, color: P.muted, marginTop: 2 }}>Screened today</div>
        </Card>
        <Card P={P} pad={14} style={{ flex: 1 }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 24, color: P.ink }}>Silent</div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 12.5, color: P.muted, marginTop: 2 }}>Unknown callers</div>
        </Card>
      </div>
      <SectionLabel P={P}>Recent calls</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {CALLS.map((c) => {
          const s = statusMeta(P, c.type);
          const scam = c.type !== 'safe';
          return (
            <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 13, background: P.surface, border: `1px solid ${P.line}`, borderRadius: 15, padding: '12px 14px' }}>
              <IconBadge P={P} name="phone" fg={scam ? s.fg : P.muted} bg={scam ? s.bg : P.panel} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 14.5, color: P.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: 12.5, color: scam ? s.fg : P.muted, marginTop: 1 }}>{c.label}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5 }}>
                {scam ? (
                  <Pill color={s.fg} bg={s.bg}>
                    <Icon name="block" size={11} color={s.fg} weight={2.6} /> {s.label}
                  </Pill>
                ) : (
                  <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: P.muted }}>{c.dur}</span>
                )}
                <span style={{ fontFamily: FONT_MONO, fontSize: 10.5, color: P.faint }}>{c.time}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
