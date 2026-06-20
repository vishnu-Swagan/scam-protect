import { useState, type CSSProperties } from 'react';
import { FONT_DISPLAY, FONT_MONO, type Palette } from '../theme';
import type { IconName, RecentItem, Stats } from '../types';
import type { HomeStyle } from '../settings';
import { Icon, ShieldMark } from '../components/Icon';
import { Dot } from '../components/atoms';
import { Card, IconBadge, SectionLabel, ActivityRow, StatusRing } from '../components/screenAtoms';

function GearButton({ P, onClick }: { P: Palette; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      title="Settings"
      style={{ width: 42, height: 42, borderRadius: '50%', background: P.panel, border: `1px solid ${P.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
    >
      <Icon name="gear" size={20} color={P.inkSoft} weight={1.8} />
    </div>
  );
}

export function CommunityPromo({ P, onGo }: { P: Palette; onGo: (dest: string) => void }) {
  return (
    <div
      onClick={() => onGo('community')}
      style={{ display: 'flex', alignItems: 'center', gap: 13, background: P.surface, border: `1px solid ${P.line}`, borderRadius: 16, padding: 14, marginTop: 16, cursor: 'pointer' }}
    >
      <IconBadge P={P} name="globe" fg={P.accent} bg={P.isDark ? P.panel : P.accentTint} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 15, color: P.ink }}>Community alerts</div>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 12.5, color: P.muted, marginTop: 1 }}>7,536 scams reported near you today</div>
      </div>
      <Icon name="chevron" size={18} color={P.faint} />
    </div>
  );
}

interface TriggerOpt {
  k: 'call' | 'message' | 'transaction';
  icon: IconName;
  label: string;
  desc: string;
}

// "Trigger a scam" demo launcher
export function TriggerCard({ P, onTrigger, style = {} }: { P: Palette; onTrigger: (k: TriggerOpt['k']) => void; style?: CSSProperties }) {
  const [open, setOpen] = useState(false);
  const opts: TriggerOpt[] = [
    { k: 'call', icon: 'phone', label: 'Scam call', desc: 'Bank impersonation' },
    { k: 'message', icon: 'message', label: 'Scam text', desc: 'Fake USPS link' },
    { k: 'transaction', icon: 'card', label: 'Fraud transfer', desc: '$8,740 push payment' },
  ];
  return (
    <div style={{ background: P.isDark ? P.panel : '#211C16', borderRadius: 18, padding: 16, ...style }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
        <div style={{ width: 38, height: 38, borderRadius: 11, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="scan" size={20} color="#fff" weight={2} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 15, color: '#fff' }}>Try a live demo</div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 12.5, color: 'rgba(255,255,255,0.55)' }}>Simulate an incoming scam and watch it get stopped</div>
        </div>
        <div onClick={() => setOpen((o) => !o)} style={{ transform: open ? 'rotate(90deg)' : 'none', transition: 'transform .2s', cursor: 'pointer' }}>
          <Icon name="chevron" size={18} color="rgba(255,255,255,0.7)" />
        </div>
      </div>
      {open && (
        <div style={{ display: 'flex', gap: 8, marginTop: 13 }}>
          {opts.map((o) => (
            <div
              key={o.k}
              onClick={() => onTrigger(o.k)}
              style={{ flex: 1, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 13, padding: '11px 8px', textAlign: 'center', cursor: 'pointer' }}
            >
              <Icon name={o.icon} size={20} color="#fff" weight={2} style={{ margin: '0 auto 7px' }} />
              <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 12, color: '#fff' }}>{o.label}</div>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 1 }}>{o.desc}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function HomeScreen({
  P,
  homeStyle,
  stats,
  recent,
  onTrigger,
  onGo,
  onOpenSettings,
}: {
  P: Palette;
  homeStyle: HomeStyle;
  stats: Stats;
  recent: RecentItem[];
  onTrigger: (k: TriggerOpt['k']) => void;
  onGo: (dest: string) => void;
  onOpenSettings: () => void;
}) {
  const tiles: { tab: string; icon: IconName; label: string; n: number; alert?: boolean }[] = [
    { tab: 'messages', icon: 'message', label: 'Messages', n: stats.messages },
    { tab: 'calls', icon: 'phone', label: 'Calls', n: stats.calls },
    { tab: 'bank', icon: 'card', label: 'Banking', n: stats.bank },
    { tab: 'family', icon: 'users', label: 'Family', n: stats.familyAlerts, alert: stats.familyAlerts > 0 },
  ];

  if (homeStyle === 'feed') {
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 30, letterSpacing: '-0.025em', color: P.ink, lineHeight: 1.05, padding: '6px 4px 0' }}>Good morning, Robert</div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 14.5, color: P.muted, marginTop: 5, padding: '0 4px 14px' }}>Scam Protect is watching your messages, calls, and money.</div>
          </div>
          <div style={{ paddingTop: 8 }}>
            <GearButton P={P} onClick={onOpenSettings} />
          </div>
        </div>
        <Card P={P} pad={16} style={{ display: 'flex', alignItems: 'center', gap: 14, background: P.isDark ? P.panel : P.accentTint, borderColor: P.isDark ? P.line : P.accentSoft }}>
          <ShieldMark size={42} accent={P.accent} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 17, color: P.ink }}>You’re protected</div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 13.5, color: P.muted, marginTop: 1 }}>{stats.blockedToday} threats blocked today · 0 got through</div>
          </div>
          <Dot size={9} color={P.safe} glow />
        </Card>
        <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
          {tiles.map((tl) => (
            <div
              key={tl.tab}
              onClick={() => onGo(tl.tab)}
              style={{ flex: 1, position: 'relative', background: P.surface, border: `1px solid ${P.line}`, borderRadius: 15, padding: '13px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, cursor: 'pointer' }}
            >
              <Icon name={tl.icon} size={22} color={tl.alert ? P.threat : P.accent} weight={2} />
              <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 11.5, color: P.inkSoft }}>{tl.label}</span>
              {tl.alert && <span style={{ position: 'absolute', top: 9, right: 12, width: 7, height: 7, borderRadius: '50%', background: P.threat }} />}
            </div>
          ))}
        </div>
        <SectionLabel P={P} right={<span onClick={() => onGo('messages')} style={{ fontFamily: FONT_MONO, fontSize: 11, color: P.accent, cursor: 'pointer', fontWeight: 600 }}>VIEW ALL</span>}>
          Live activity
        </SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {recent.map((r, i) => (
            <ActivityRow key={i} P={P} icon={r.icon} title={r.title} meta={r.meta} time={r.time} status={r.status} onClick={() => onGo(r.tab)} />
          ))}
        </div>
        <CommunityPromo P={P} onGo={onGo} />
        <TriggerCard P={P} onTrigger={onTrigger} style={{ marginTop: 12 }} />
      </div>
    );
  }

  // default: 'shield'
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 4px 8px' }}>
        <div>
          <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: P.muted }}>Tuesday, June 9</div>
          <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 24, color: P.ink, letterSpacing: '-0.02em', marginTop: 3 }}>Hi, Robert</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <GearButton P={P} onClick={onOpenSettings} />
          <div onClick={() => onGo('family')} style={{ position: 'relative', width: 42, height: 42, borderRadius: '50%', background: P.panel, border: `1px solid ${P.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Icon name="bell" size={20} color={P.inkSoft} />
            <span style={{ position: 'absolute', top: 8, right: 9, width: 8, height: 8, borderRadius: '50%', background: P.threat, border: `1.5px solid ${P.surface}` }} />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 0 6px' }}>
        <StatusRing P={P} size={186} />
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
        {(
          [
            ['blockedToday', 'Blocked today'],
            ['blockedWeek', 'This week'],
            ['saved', 'Money saved'],
          ] as const
        ).map(([k, l]) => (
          <Card key={k} P={P} pad={13} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 22, color: P.ink, letterSpacing: '-0.01em' }}>{stats[k]}</div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 11.5, color: P.muted, marginTop: 2 }}>{l}</div>
          </Card>
        ))}
      </div>

      <SectionLabel P={P}>Protection areas</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {tiles.map((tl) => (
          <div
            key={tl.tab}
            onClick={() => onGo(tl.tab)}
            style={{ position: 'relative', background: P.surface, border: `1px solid ${tl.alert ? P.threatSoft : P.line}`, borderRadius: 16, padding: 15, cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <IconBadge P={P} name={tl.icon} fg={tl.alert ? P.threat : P.accent} bg={tl.alert ? P.threatSoft : P.isDark ? P.panel : P.accentTint} size={38} isize={20} />
              <Icon name="chevron" size={16} color={P.faint} />
            </div>
            <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 15.5, color: P.ink, marginTop: 12 }}>{tl.label}</div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 12.5, color: tl.alert ? P.threat : P.muted, marginTop: 1 }}>
              {tl.alert ? `${tl.n} need${tl.n === 1 ? 's' : ''} attention` : `${tl.n} blocked`}
            </div>
          </div>
        ))}
      </div>

      <SectionLabel P={P} right={<span onClick={() => onGo('messages')} style={{ fontFamily: FONT_MONO, fontSize: 11, color: P.accent, cursor: 'pointer', fontWeight: 600 }}>VIEW ALL</span>}>
        Recent activity
      </SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {recent.slice(0, 3).map((r, i) => (
          <ActivityRow key={i} P={P} icon={r.icon} title={r.title} meta={r.meta} time={r.time} status={r.status} onClick={() => onGo(r.tab)} />
        ))}
      </div>
      <CommunityPromo P={P} onGo={onGo} />
      <TriggerCard P={P} onTrigger={onTrigger} style={{ marginTop: 12 }} />
    </div>
  );
}
