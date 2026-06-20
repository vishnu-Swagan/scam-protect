import type { ReactNode } from 'react';
import { ACCENTS, FONT_DISPLAY, FONT_MONO, makePalette, type Palette } from '../theme';
import { Icon, ShieldMark, Wordmark } from '../components/Icon';
import { Card, LargeTitle, SectionLabel } from '../components/screenAtoms';
import { useSettings, type HomeStyle, type Intensity } from '../settings';

function Row({ P, label, sub, children }: { P: Palette; label: string; sub?: string; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 4px' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 14.5, color: P.ink }}>{label}</div>
        {sub && <div style={{ fontFamily: FONT_DISPLAY, fontSize: 12, color: P.muted, marginTop: 2, lineHeight: 1.35 }}>{sub}</div>}
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  );
}

function Divider({ P }: { P: Palette }) {
  return <div style={{ height: 1, background: P.lineSoft, margin: '0 4px' }} />;
}

function Toggle({ P, on, onChange }: { P: Palette; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      style={{ position: 'relative', width: 48, height: 28, borderRadius: 999, border: 'none', cursor: 'pointer', background: on ? P.safe : P.line, transition: 'background .18s', padding: 0 }}
    >
      <span style={{ position: 'absolute', top: 3, left: 3, width: 22, height: 22, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.3)', transition: 'transform .18s', transform: on ? 'translateX(20px)' : 'none' }} />
    </button>
  );
}

function Segmented<T extends string>({ P, value, options, onChange }: { P: Palette; value: T; options: { value: T; label: string }[]; onChange: (v: T) => void }) {
  const idx = Math.max(0, options.findIndex((o) => o.value === value));
  const n = options.length;
  return (
    <div style={{ position: 'relative', display: 'flex', background: P.panel, borderRadius: 11, padding: 3, width: 168 }}>
      <div
        style={{
          position: 'absolute',
          top: 3,
          bottom: 3,
          left: `calc(3px + ${idx} * (100% - 6px) / ${n})`,
          width: `calc((100% - 6px) / ${n})`,
          background: P.surface,
          borderRadius: 8,
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
          transition: 'left .16s cubic-bezier(.3,.7,.4,1)',
        }}
      />
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            style={{ position: 'relative', zIndex: 1, flex: 1, border: 'none', background: 'transparent', cursor: 'pointer', padding: '7px 4px', fontFamily: FONT_DISPLAY, fontWeight: on ? 700 : 600, fontSize: 12.5, color: on ? P.ink : P.muted, textTransform: 'capitalize' }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function AccentChips({ P, value, onChange }: { P: Palette; value: string; onChange: (v: string) => void }) {
  const entries = Object.entries(ACCENTS) as [string, string][];
  return (
    <div style={{ display: 'flex', gap: 10 }}>
      {entries.map(([key, hex]) => {
        const on = value.toLowerCase() === hex.toLowerCase();
        return (
          <button
            key={key}
            type="button"
            aria-label={key}
            title={key}
            onClick={() => onChange(hex)}
            style={{ width: 34, height: 34, borderRadius: '50%', background: hex, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: on ? `0 0 0 2px ${P.surface}, 0 0 0 4px ${hex}` : `0 0 0 1px ${P.line}` }}
          >
            {on && <Icon name="check" size={16} color="#fff" weight={3} />}
          </button>
        );
      })}
    </div>
  );
}

export function SettingsScreen({ P }: { P: Palette }) {
  const { settings, setSetting, reset } = useSettings();

  // Live preview swatch of the current theme.
  const preview = makePalette(settings.accent, settings.dark);

  return (
    <div>
      <LargeTitle P={P} title="Settings" sub="Tune how SecurityZ looks and how loudly it alerts you." />

      <Card P={P} pad={16} style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
        <ShieldMark size={40} accent={preview.accent} />
        <div style={{ flex: 1 }}>
          <Wordmark size={18} color={P.ink} accent={preview.accent} />
          <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: P.muted, marginTop: 3 }}>Scam Protect</div>
        </div>
        <div style={{ width: 26, height: 26, borderRadius: 8, background: preview.bg, border: `1px solid ${P.line}` }} />
      </Card>

      <SectionLabel P={P}>Brand</SectionLabel>
      <Card P={P} pad={6}>
        <Row P={P} label="Accent color" sub="Used across icons, highlights, and the shield.">
          <AccentChips P={P} value={settings.accent} onChange={(v) => setSetting('accent', v)} />
        </Row>
      </Card>

      <SectionLabel P={P}>Appearance</SectionLabel>
      <Card P={P} pad={6}>
        <Row P={P} label="Dark mode" sub="Switch to a low-light theme.">
          <Toggle P={P} on={settings.dark} onChange={(v) => setSetting('dark', v)} />
        </Row>
        <Divider P={P} />
        <Row P={P} label="Home layout" sub="“Shield” centers a protection ring; “Feed” leads with live activity.">
          <Segmented<HomeStyle>
            P={P}
            value={settings.homeStyle}
            options={[
              { value: 'shield', label: 'Shield' },
              { value: 'feed', label: 'Feed' },
            ]}
            onChange={(v) => setSetting('homeStyle', v)}
          />
        </Row>
      </Card>

      <SectionLabel P={P}>Alerts</SectionLabel>
      <Card P={P} pad={6}>
        <Row P={P} label="Alert intensity" sub="How strongly an intercepted scam flashes when it’s caught.">
          <Segmented<Intensity>
            P={P}
            value={settings.intensity}
            options={[
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Med' },
              { value: 'high', label: 'High' },
            ]}
            onChange={(v) => setSetting('intensity', v)}
          />
        </Row>
      </Card>

      <div
        onClick={reset}
        style={{ height: 48, borderRadius: 14, border: `1.5px solid ${P.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 18, cursor: 'pointer' }}
      >
        <Icon name="gear" size={16} color={P.inkSoft} weight={1.9} />
        <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 14.5, color: P.inkSoft }}>Reset to defaults</span>
      </div>

      <div style={{ textAlign: 'center', marginTop: 18, fontFamily: FONT_MONO, fontSize: 10.5, letterSpacing: '0.08em', color: P.faint }}>
        SecurityZ · Scam Protect v1.0
      </div>
    </div>
  );
}
