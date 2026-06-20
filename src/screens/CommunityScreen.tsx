import { FONT_DISPLAY, FONT_MONO, type Palette } from '../theme';
import { COMMUNITY } from '../data';
import { Icon } from '../components/Icon';
import { Pill } from '../components/atoms';
import { Card, LargeTitle, SectionLabel } from '../components/screenAtoms';

export function CommunityScreen({ P }: { P: Palette }) {
  return (
    <div>
      <LargeTitle P={P} title="Community" sub="Scams reported by people near you, in real time." />
      <Card P={P} pad={15} style={{ display: 'flex', alignItems: 'center', gap: 13, background: P.isDark ? P.panel : P.accentTint, borderColor: P.isDark ? P.line : P.accentSoft }}>
        <Icon name="trending" size={24} color={P.accent} weight={2.2} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 16, color: P.ink }}>7,536 scams reported today</div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 12.5, color: P.muted, marginTop: 1 }}>Up 34% · your reports protect everyone</div>
        </div>
      </Card>
      <SectionLabel P={P}>Trending near you</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {COMMUNITY.map((r) => (
          <Card P={P} key={r.id} pad={15}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 9 }}>
              <Pill color={P.threat} bg={P.threatSoft}>{r.tag}</Pill>
              {r.trend === 'up' && (
                <Pill color={P.amber} bg={P.amberSoft}>
                  <Icon name="trending" size={11} color={P.amber} weight={2.4} /> Rising
                </Pill>
              )}
              <span style={{ marginLeft: 'auto', fontFamily: FONT_MONO, fontSize: 10.5, color: P.faint }}>{r.time}</span>
            </div>
            <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 15.5, color: P.ink, lineHeight: 1.3, letterSpacing: '-0.01em' }}>{r.title}</div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 13, color: P.inkSoft, lineHeight: 1.45, marginTop: 6 }}>{r.blurb}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 12, paddingTop: 12, borderTop: `1px solid ${P.lineSoft}` }}>
              <Icon name="flag" size={14} color={P.muted} weight={2} />
              <span style={{ fontFamily: FONT_MONO, fontSize: 11.5, color: P.muted }}>{r.reports.toLocaleString()} reports</span>
              <span style={{ marginLeft: 'auto', fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 12.5, color: P.accent }}>Confirm I got this →</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
