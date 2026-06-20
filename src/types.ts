// Shared domain types for the Scam Protect app.

export type IconName =
  | 'shield' | 'message' | 'phone' | 'card' | 'users' | 'globe' | 'search'
  | 'sparkles' | 'alert' | 'check' | 'x' | 'chevron' | 'bell' | 'lock'
  | 'plus' | 'scan' | 'send' | 'flag' | 'block' | 'link' | 'filter' | 'user'
  | 'clock' | 'trending' | 'pause' | 'arrowDown' | 'arrowUp' | 'gear'
  | 'home' | 'voice';

export type MessageStatus = 'blocked' | 'flagged' | 'safe';
export type CallType = 'scam' | 'spam' | 'safe';
export type TxnStatus = 'blocked' | 'flagged' | 'cleared' | 'held';
export type FamilyStatus = 'alert' | 'safe';
export type Trend = 'up' | 'flat';

export interface Message {
  id: string;
  channel: 'sms' | 'email';
  sender: string;
  number: string;
  time: string;
  status: MessageStatus;
  cat: string;
  body: string;
  reasons: string[];
}

export interface Call {
  id: string;
  name: string;
  number: string;
  time: string;
  type: CallType;
  label: string;
  blocked: boolean;
  dur: string;
}

export interface Transaction {
  id: string;
  merchant: string;
  amount: number;
  dir: 'in' | 'out';
  time: string;
  status: TxnStatus;
  card: string;
  reason: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  rel: string;
  status: FamilyStatus;
  initials: string;
  blocked: number;
  note: string;
  last: string;
}

export interface CommunityReport {
  id: string;
  title: string;
  tag: string;
  reports: number;
  time: string;
  trend: Trend;
  blurb: string;
}

export type ScenarioKey = 'call' | 'message' | 'transaction';

export interface Scenario {
  kind: ScenarioKey;
  label: string;
  caller: string;
  sub: string;
  number: string;
  verdict: string;
  why: string;
  reasons: string[];
  cta: string;
  preview?: string;
  amount?: string;
}

export interface ScamResult {
  risk: number;
  verdict: string;
  category: string;
  reasons: string[];
  advice: string;
}

export interface Tab {
  id: string;
  icon: IconName;
  label: string;
}

export interface RecentItem {
  icon: IconName;
  tab: string;
  title: string;
  meta: string;
  time: string;
  status: 'blocked' | 'flagged';
}

export interface Stats {
  blockedToday: number;
  blockedWeek: number;
  saved: string;
  messages: number;
  calls: number;
  bank: number;
  familyAlerts: number;
}
