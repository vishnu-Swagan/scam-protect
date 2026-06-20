import { FONT_DISPLAY, FONT_MONO, type Palette } from '../theme';
import { FAMILY } from '../data';
import { Icon } from '../components/Icon';
import { Dot, Pill } from '../components/atoms';
import { Card, LargeTitle, statusMeta } from '../components/screenAtoms';

export function FamilyScreen({ P }: { P: Palette }) {
  return (
    <div>
      <LargeTitle P={P} title="Family" sub="Guard the people most targeted by scams — and get alerted when it matters." />
      {FAMILY.map((f) => {
        const alert = f.status === 'alert';
        const s = statusMeta(P, alert ? 'flagged' : 'safe');
        return (
          <Card P={P} key={f.id} pad={15} style={{ marginBottom: 11, borderColor: alert ? s.bg : P.line }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
              <div style={{ position: 'relative', width: 48, height: 48, borderRadius: '50%', background: alert ? s.bg : P.isDark ? P.panel : P.accentTint, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 17, color: alert ? s.fg : P.accent }}>{f.initials}</span>
                <span style={{ position: 'absolute', bottom: 0, right: 0, width: 14, height: 14, borderRadius: '50%', background: alert ? P.threat : P.safe, border: `2.5px solid ${P.surface}` }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 16, color: P.ink }}>{f.name}</div>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: 12.5, color: P.muted, marginTop: 1 }}>{f.rel} · {f.blocked} blocked</div>
              </div>
              {alert && (
                <Pill color={s.fg} bg={s.bg}>
                  <Dot size={6} color={s.fg} /> Alert
                </Pill>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 12, padding: '11px 13px', borderRadius: 12, background: alert ? s.bg : P.panel }}>
              <Icon name={alert ? 'alert' : 'check'} size={16} color={alert ? s.fg : P.safe} weight={2.2} style={{ flexShrink: 0 }} />
              <span style={{ flex: 1, fontFamily: FONT_DISPLAY, fontSize: 13, color: alert ? P.threatDeep : P.inkSoft, lineHeight: 1.4, fontWeight: alert ? 600 : 400 }}>{f.note}</span>
              <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: P.faint, flexShrink: 0 }}>{f.last}</span>
            </div>
          </Card>
        );
      })}
      <div style={{ height: 50, borderRadius: 14, border: `1.5px dashed ${P.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 4, cursor: 'pointer' }}>
        <Icon name="plus" size={18} color={P.accent} weight={2.2} />
        <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 14.5, color: P.accent }}>Invite a family member</span>
      </div>
    </div>
  );
}
