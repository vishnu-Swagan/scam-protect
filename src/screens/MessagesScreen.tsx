import { useState } from 'react';
import { FONT_DISPLAY, FONT_MONO, type Palette } from '../theme';
import type { Message } from '../types';
import { MESSAGES } from '../data';
import { Icon } from '../components/Icon';
import { Pill } from '../components/atoms';
import { Card, LargeTitle, IconBadge, statusMeta } from '../components/screenAtoms';

export function MessagesScreen({
  P,
  onOpenAnalyzer,
  onOpenMsg,
}: {
  P: Palette;
  onOpenAnalyzer: () => void;
  onOpenMsg: (m: Message) => void;
}) {
  const [filter, setFilter] = useState<'all' | 'blocked' | 'safe'>('all');
  const filters: [typeof filter, string][] = [
    ['all', 'All'],
    ['blocked', 'Threats'],
    ['safe', 'Safe'],
  ];
  const list = MESSAGES.filter((m) =>
    filter === 'all' ? true : filter === 'blocked' ? m.status !== 'safe' : m.status === 'safe',
  );
  return (
    <div>
      <LargeTitle P={P} title="Messages" sub="Texts and emails, scanned the moment they arrive." />
      <Card
        P={P}
        onClick={onOpenAnalyzer}
        pad={15}
        style={{ display: 'flex', alignItems: 'center', gap: 13, background: P.isDark ? P.panel : P.accentTint, borderColor: P.isDark ? P.line : P.accentSoft }}
      >
        <div style={{ width: 40, height: 40, borderRadius: 12, background: P.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon name="sparkles" size={22} color="#fff" weight={1.8} fill="#fff" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 15, color: P.ink }}>Check a message with AI</div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 12.5, color: P.muted, marginTop: 1 }}>Paste anything suspicious for an instant verdict</div>
        </div>
        <Icon name="chevron" size={18} color={P.faint} />
      </Card>

      <div style={{ display: 'flex', gap: 8, margin: '16px 0 4px' }}>
        {filters.map(([k, l]) => (
          <div
            key={k}
            onClick={() => setFilter(k)}
            style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 13, padding: '7px 14px', borderRadius: 999, cursor: 'pointer', background: filter === k ? P.ink : P.panel, color: filter === k ? P.surface : P.inkSoft }}
          >
            {l}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 12 }}>
        {list.map((m) => {
          const s = statusMeta(P, m.status);
          return (
            <div key={m.id} onClick={() => onOpenMsg(m)} style={{ background: P.surface, border: `1px solid ${P.line}`, borderRadius: 15, padding: 14, cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                <IconBadge P={P} name="message" fg={s.fg} bg={s.bg} size={36} isize={18} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 14.5, color: P.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.sender}</span>
                    <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: P.faint, textTransform: 'uppercase' }}>{m.channel}</span>
                  </div>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 10.5, color: P.faint, marginTop: 1 }}>{m.time}</div>
                </div>
                <Pill color={s.fg} bg={s.bg}>
                  <Icon name={s.icon} size={11} color={s.fg} weight={2.6} /> {m.status === 'safe' ? 'Safe' : m.cat}
                </Pill>
              </div>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 13.5, color: P.inkSoft, marginTop: 10, lineHeight: 1.45, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{m.body}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
