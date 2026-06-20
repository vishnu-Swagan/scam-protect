import { useEffect, useRef, useState } from 'react';
import { FONT_MONO, makePalette } from './theme';
import { TABS, STATS, RECENT } from './data';
import type { Message, ScenarioKey } from './types';
import { useSettings } from './settings';
import { Icon, ShieldMark, Wordmark } from './components/Icon';
import { StatusBar, TabBar, Toast, SubHeader } from './components/PhoneChrome';
import { HomeScreen } from './screens/HomeScreen';
import { MessagesScreen } from './screens/MessagesScreen';
import { AnalyzerScreen } from './screens/AnalyzerScreen';
import { MessageDetailScreen } from './screens/MessageDetailScreen';
import { CallsScreen } from './screens/CallsScreen';
import { BankScreen } from './screens/BankScreen';
import { FamilyScreen } from './screens/FamilyScreen';
import { CommunityScreen } from './screens/CommunityScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { ScamDemo } from './demo/ScamDemo';

type View =
  | { type: 'detail'; msg: Message }
  | { type: 'analyzer'; text?: string }
  | { type: 'community' }
  | { type: 'settings' }
  | null;

export function App() {
  const { settings: t } = useSettings();
  const P = makePalette(t.accent, t.dark);

  const [tab, setTab] = useState<string>(() => localStorage.getItem('sp-tab') || 'home');
  const [view, setView] = useState<View>(null);
  const [demo, setDemo] = useState<ScenarioKey | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('sp-tab', tab);
  }, [tab]);
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [tab, view]);
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(id);
  }, [toast]);

  const go = (dest: string) => {
    if (dest === 'community') {
      setView({ type: 'community' });
      return;
    }
    setView(null);
    setTab(dest);
  };
  const openView = (v: View) => setView(v);
  const back = () => setView(null);

  const triggerDemo = (k: ScenarioKey) => setDemo(k);
  const closeDemo = () => {
    const k = demo;
    setDemo(null);
    setToast(
      k === 'transaction'
        ? 'Transfer cancelled — your $8,740 is safe.'
        : k === 'call'
          ? 'Caller blocked and reported.'
          : 'Sender blocked and message deleted.',
    );
  };

  // ── scaling ──
  const [scale, setScale] = useState(1);
  const PW = 390;
  const PH = 844;
  useEffect(() => {
    const fit = () => setScale(Math.min((window.innerHeight - 44) / PH, (window.innerWidth - 32) / PW, 1.05));
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  // current screen
  let content: React.ReactNode = null;
  if (view && view.type === 'detail') content = <MessageDetailScreen P={P} msg={view.msg} />;
  else if (view && view.type === 'analyzer') content = <AnalyzerScreen P={P} initialText={view.text || ''} />;
  else if (view && view.type === 'community') content = <CommunityScreen P={P} />;
  else if (view && view.type === 'settings') content = <SettingsScreen P={P} />;
  else if (tab === 'home')
    content = (
      <HomeScreen
        P={P}
        homeStyle={t.homeStyle}
        stats={STATS}
        recent={RECENT}
        onTrigger={triggerDemo}
        onGo={go}
        onOpenSettings={() => openView({ type: 'settings' })}
      />
    );
  else if (tab === 'messages')
    content = (
      <MessagesScreen
        P={P}
        onOpenAnalyzer={() => openView({ type: 'analyzer' })}
        onOpenMsg={(m) => openView({ type: 'detail', msg: m })}
      />
    );
  else if (tab === 'calls') content = <CallsScreen P={P} />;
  else if (tab === 'bank') content = <BankScreen P={P} />;
  else if (tab === 'family') content = <FamilyScreen P={P} />;

  const showSub = !!view;
  const subTitle = view && view.type === 'detail' ? 'Message' : '';

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: t.dark ? '#0A0F0C' : 'radial-gradient(140% 120% at 50% 0%, #FBF9F3, #E8E1D4 70%, #DED5C5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* ambient desktop label */}
      <div style={{ position: 'absolute', top: 26, left: 32, display: 'flex', alignItems: 'center', gap: 11, opacity: scale > 0.92 ? 1 : 0, transition: 'opacity .3s' }}>
        <ShieldMark size={30} accent={t.dark ? '#3FBF8C' : '#1C6B57'} />
        <Wordmark size={19} color={t.dark ? '#F2EFE9' : '#211C16'} accent={t.dark ? '#3FBF8C' : '#1C6B57'} />
        <span style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: t.dark ? '#8E897F' : '#8A8175', marginLeft: 6, borderLeft: `1px solid ${t.dark ? '#293530' : '#D8CFBF'}`, paddingLeft: 12 }}>Scam Protect</span>
      </div>

      {/* phone */}
      <div style={{ width: PW, height: PH, transform: `scale(${scale})`, transformOrigin: 'center', position: 'relative', flexShrink: 0 }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: 56, background: 'linear-gradient(150deg, #2B2620, #16130F)', padding: 12, boxShadow: '0 50px 100px -30px rgba(40,30,20,0.6), 0 14px 50px -14px rgba(0,0,0,0.4)' }}>
          <div style={{ position: 'absolute', inset: 12, borderRadius: 45, overflow: 'hidden', background: P.bg }}>
            <StatusBar P={P} dark={demo === 'call' || demo === 'message'} />
            {/* dynamic island */}
            <div style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', width: 108, height: 31, borderRadius: 20, background: '#000', zIndex: 31 }} />

            {/* scroll area */}
            <div ref={scrollRef} className="app-scroll" style={{ position: 'absolute', inset: 0, top: 0, overflowY: 'auto', overflowX: 'hidden', paddingTop: 56, paddingBottom: 96, paddingLeft: 14, paddingRight: 14, WebkitOverflowScrolling: 'touch' }}>
              {showSub && <SubHeader P={P} title={subTitle} onBack={back} />}
              {content}
            </div>

            <TabBar P={P} active={view ? null : tab} onSelect={go} tabs={TABS} />
            {toast && <Toast P={P} msg={toast} />}
            {demo && <ScamDemo P={P} scenarioKey={demo} onClose={closeDemo} intensity={t.intensity} />}
          </div>
        </div>
      </div>
    </div>
  );
}
