import { FONT_DISPLAY, FONT_MONO, type Palette } from '../theme';
import type { Tab } from '../types';
import { Icon } from './Icon';

export function StatusBar({ P, dark }: { P: Palette; dark: boolean }) {
  const c = dark ? '#fff' : P.ink;
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', zIndex: 30, paddingTop: 8 }}>
      <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 15, color: c }}>9:41</span>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        {[3, 5, 7, 9].map((h, i) => (
          <span key={i} style={{ width: 3.5, height: h + 2, borderRadius: 1, background: c, opacity: 0.92 }} />
        ))}
        <span style={{ width: 20, height: 11, borderRadius: 3, border: `1.4px solid ${c}`, opacity: 0.92, marginLeft: 4, position: 'relative' }}>
          <span style={{ position: 'absolute', inset: 1.3, width: '72%', background: c, borderRadius: 1 }} />
        </span>
      </div>
    </div>
  );
}

export function TabBar({ P, active, onSelect, tabs }: { P: Palette; active: string | null; onSelect: (id: string) => void; tabs: Tab[] }) {
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 25, background: P.tabBar, backdropFilter: 'blur(20px)', borderTop: `1px solid ${P.tabBorder}`, paddingBottom: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '9px 6px 4px' }}>
        {tabs.map((tb) => {
          const on = active === tb.id;
          return (
            <div key={tb.id} onClick={() => onSelect(tb.id)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer', width: 60, padding: '4px 0' }}>
              <Icon name={tb.icon} size={23} color={on ? P.accent : P.faint} weight={on ? 2.3 : 1.9} />
              <span style={{ fontFamily: FONT_DISPLAY, fontWeight: on ? 700 : 500, fontSize: 10.5, color: on ? P.accent : P.faint }}>{tb.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function Toast({ P, msg }: { P: Palette; msg: string }) {
  return (
    <div style={{ position: 'absolute', left: 16, right: 16, bottom: 96, zIndex: 50, background: '#211C16', borderRadius: 14, padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 11, boxShadow: '0 16px 40px -14px rgba(0,0,0,0.5)', animation: 'toastIn .3s cubic-bezier(.2,.8,.2,1)' }}>
      <div style={{ width: 26, height: 26, borderRadius: 8, background: P.safe, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon name="check" size={15} color="#fff" weight={3} />
      </div>
      <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 14, color: '#fff', flex: 1, lineHeight: 1.3 }}>{msg}</span>
    </div>
  );
}

export function SubHeader({ P, title, onBack }: { P: Palette; title?: string; onBack: () => void }) {
  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 12, background: P.bg, display: 'flex', alignItems: 'center', gap: 10, padding: '4px 0 12px', marginBottom: 2 }}>
      <div onClick={onBack} style={{ width: 38, height: 38, borderRadius: '50%', background: P.surface, border: `1px solid ${P.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
        <Icon name="chevron" size={18} color={P.inkSoft} style={{ transform: 'rotate(180deg)' }} />
      </div>
      {title && <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 17, color: P.ink }}>{title}</span>}
    </div>
  );
}
