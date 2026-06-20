// Seed datasets + scam scenarios for the Scam Protect app.
// Ported from the design's app-data.jsx (+ TABS/STATS/RECENT from the main HTML).

import type {
  Call,
  CommunityReport,
  FamilyMember,
  Message,
  RecentItem,
  Scenario,
  ScenarioKey,
  Stats,
  Tab,
  Transaction,
} from './types';

export const TABS: Tab[] = [
  { id: 'home', icon: 'home', label: 'Home' },
  { id: 'messages', icon: 'message', label: 'Inbox' },
  { id: 'calls', icon: 'phone', label: 'Calls' },
  { id: 'bank', icon: 'card', label: 'Money' },
  { id: 'family', icon: 'users', label: 'Family' },
];

export const STATS: Stats = {
  blockedToday: 23,
  blockedWeek: 184,
  saved: '$9.2k',
  messages: 4,
  calls: 4,
  bank: 3,
  familyAlerts: 1,
};

export const RECENT: RecentItem[] = [
  { icon: 'phone', tab: 'calls', title: 'YourBank Security', meta: 'Bank impersonation call', time: '9:38', status: 'blocked' },
  { icon: 'card', tab: 'bank', title: 'SAFEPAY transfer ••4471', meta: 'Push-payment fraud · $8,740', time: '9:39', status: 'blocked' },
  { icon: 'message', tab: 'messages', title: 'USPS-Alert', meta: 'Smishing · fake fee link', time: '9:41', status: 'blocked' },
  { icon: 'users', tab: 'family', title: 'Robert Garcia (Dad)', meta: 'Needs your attention', time: '2m', status: 'flagged' },
];

export const MESSAGES: Message[] = [
  { id: 'm1', channel: 'sms', sender: 'USPS-Alert', number: '+1 (845) 220-9981', time: '9:41 AM', status: 'blocked', cat: 'Smishing',
    body: 'USPS: Your package SP-4471 is held due to an unpaid customs fee of $2.99. Pay now to avoid return: usps-redeliver.co/track',
    reasons: ['Look-alike domain registered 3 days ago', 'Urgency + payment request', 'USPS never texts for fees'] },
  { id: 'm2', channel: 'email', sender: 'PayPaI Security', number: 'service@paypal-resolve.net', time: '9:12 AM', status: 'blocked', cat: 'Phishing',
    body: 'We noticed a login from a new device in Lagos, Nigeria. If this wasn’t you, verify your identity within 24 hours or your account will be permanently limited. Verify now.',
    reasons: ['Display name spoofs "PayPal" (capital i)', 'Sender domain is not paypal.com', 'Fake deadline pressure'] },
  { id: 'm3', channel: 'sms', sender: 'Mom', number: '+1 (415) 555-0148', time: '8:55 AM', status: 'safe', cat: 'Trusted',
    body: 'Are we still on for dinner Sunday? Bring the photos from the trip!', reasons: [] },
  { id: 'm4', channel: 'sms', sender: '+1 (302) 410-7755', number: '+1 (302) 410-7755', time: 'Yesterday', status: 'flagged', cat: 'Likely scam',
    body: 'Hi, this is Amazon. A charge of $1,299.00 for an iPhone 16 Pro was placed on your account. Call us immediately if you did not authorize: 1-888-204-7711',
    reasons: ['Unknown number claiming to be Amazon', 'Call-back number is not Amazon’s', 'High-value charge bait'] },
  { id: 'm5', channel: 'email', sender: 'IRS Refund Dept', number: 'refunds@irs-gov-payments.org', time: 'Yesterday', status: 'blocked', cat: 'Impersonation',
    body: 'You are eligible for a tax refund of $946.20. Submit your bank details through our secure portal to receive your deposit within 48 hours.',
    reasons: ['IRS does not email refunds', 'Asks for bank details', 'Spoofed government domain'] },
  { id: 'm6', channel: 'sms', sender: 'Chase', number: '28107', time: 'Mon', status: 'safe', cat: 'Verified sender',
    body: 'Chase: Your statement is ready. View it in the Chase app. Reply STOP to opt out.', reasons: [] },
];

export const CALLS: Call[] = [
  { id: 'c1', name: 'YourBank Security', number: '+1 (888) 442-0190', time: '9:38 AM', type: 'scam', label: 'Bank impersonation', blocked: true, dur: '—' },
  { id: 'c2', name: 'Auto Warranty', number: '+1 (213) 555-7781', time: '9:02 AM', type: 'spam', label: 'Robocall', blocked: true, dur: '—' },
  { id: 'c3', name: 'Dr. Patel’s Office', number: '+1 (415) 555-2203', time: 'Yesterday', type: 'safe', label: 'In contacts', blocked: false, dur: '4:12' },
  { id: 'c4', name: '+1 (700) 113-9088', number: '+1 (700) 113-9088', time: 'Yesterday', type: 'scam', label: 'SSN suspension scam', blocked: true, dur: '—' },
  { id: 'c5', name: 'IRS Collections', number: '+1 (202) 555-0162', time: 'Tue', type: 'scam', label: 'Govt impersonation', blocked: true, dur: '—' },
  { id: 'c6', name: 'Sarah Lin', number: '+1 (628) 555-9912', time: 'Tue', type: 'safe', label: 'In contacts', blocked: false, dur: '12:40' },
];

export const TRANSACTIONS: Transaction[] = [
  { id: 't1', merchant: 'SAFEPAY TRANSFER ••4471', amount: 8740.0, dir: 'out', time: '9:39 AM', status: 'blocked', card: 'Checking ••2841',
    reason: 'Push-payment to a flagged "safe account" during an active scam call' },
  { id: 't2', merchant: 'Apple Store', amount: 4.99, dir: 'out', time: '8:30 AM', status: 'cleared', card: 'Visa ••6612', reason: '' },
  { id: 't3', merchant: 'CRYPTO-XCHANGE LTD', amount: 1500.0, dir: 'out', time: 'Yesterday', status: 'flagged', card: 'Visa ••6612',
    reason: 'First-time crypto transfer, unusually large for this account' },
  { id: 't4', merchant: 'Whole Foods Market', amount: 86.41, dir: 'out', time: 'Yesterday', status: 'cleared', card: 'Visa ••6612', reason: '' },
  { id: 't5', merchant: 'Direct Deposit — Payroll', amount: 3120.0, dir: 'in', time: 'Mon', status: 'cleared', card: 'Checking ••2841', reason: '' },
  { id: 't6', merchant: 'GIFTCARD-MART ONLINE', amount: 500.0, dir: 'out', time: 'Mon', status: 'blocked', card: 'Visa ••6612',
    reason: 'Bulk gift-card purchase — a top scam payment method' },
];

export const FAMILY: FamilyMember[] = [
  { id: 'f1', name: 'Robert Garcia', rel: 'Dad · 72', status: 'alert', initials: 'RG', blocked: 14,
    note: 'Blocked a bank-impersonation call + $8,740 transfer this morning', last: '2 min ago' },
  { id: 'f2', name: 'Elena Garcia', rel: 'Mom · 69', status: 'safe', initials: 'EG', blocked: 6, note: 'All clear', last: '1 hr ago' },
  { id: 'f3', name: 'Marcus Garcia', rel: 'Son · 16', status: 'safe', initials: 'MG', blocked: 3, note: 'Blocked a gaming gift-card scam', last: 'Today' },
];

export const COMMUNITY: CommunityReport[] = [
  { id: 'r1', title: 'Fake USPS "customs fee" texts surging', tag: 'Smishing', reports: 2841, time: '12m', trend: 'up',
    blurb: 'Texts claim a package is held for a $2.99 fee, linking to usps-redeliver.co. Do not pay.' },
  { id: 'r2', title: '"Bank fraud dept" calls asking to move money to a safe account', tag: 'Vishing', reports: 1976, time: '38m', trend: 'up',
    blurb: 'Caller spoofs your bank’s number and pressures an instant transfer. Banks never ask this.' },
  { id: 'r3', title: 'PayPal "login from Lagos" phishing email', tag: 'Phishing', reports: 1204, time: '1h', trend: 'up',
    blurb: 'Sender domain paypal-resolve.net. Links to a cloned login page.' },
  { id: 'r4', title: 'Grandparent emergency / bail money scam (AI voice)', tag: 'Voice clone', reports: 903, time: '2h', trend: 'up',
    blurb: 'Cloned voice of a grandchild begging for bail. Hang up and call them directly.' },
  { id: 'r5', title: 'Crypto "investment advisor" on WhatsApp', tag: 'Pig butchering', reports: 612, time: '3h', trend: 'flat',
    blurb: 'Builds trust over weeks, then pushes a fake trading platform.' },
];

// ── Scam scenarios for the "Trigger a scam" demo ─────────────────────────────
export const SCENARIOS: Record<ScenarioKey, Scenario> = {
  call: {
    kind: 'call', label: 'Bank impersonation call',
    caller: 'YourBank Security', sub: 'Caller ID · Fraud Dept', number: '+1 (888) 442-0190',
    verdict: 'Scam call blocked',
    why: 'This number matches 1,976 reports of bank-impersonation fraud. Real banks never ask you to move money to a "safe account."',
    reasons: ['Spoofed bank caller ID', 'Matches active fraud campaign', 'Pressures an urgent transfer'],
    cta: 'Block & report caller',
  },
  message: {
    kind: 'message', label: 'Smishing text',
    caller: 'USPS-Alert', sub: 'SMS · +1 (845) 220-9981', number: '+1 (845) 220-9981',
    preview: 'USPS: Your package SP-4471 is held due to an unpaid customs fee of $2.99. Pay now: usps-redeliver.co/track',
    verdict: 'Scam text blocked',
    why: 'The link goes to a look-alike domain registered 3 days ago. USPS never texts you to collect fees.',
    reasons: ['Look-alike domain (usps-redeliver.co)', 'Urgency + payment request', 'Link flagged by 2,841 people'],
    cta: 'Delete & block sender',
  },
  transaction: {
    kind: 'transaction', label: 'Fraudulent transfer',
    caller: 'Transfer to SAFEPAY ••4471', sub: 'Checking ••2841', number: '',
    amount: '$8,740.00',
    verdict: 'Transfer paused',
    why: 'You’re sending your full balance to a flagged account while on a call we identified as a scam. This is a classic push-payment fraud.',
    reasons: ['Recipient flagged as mule account', 'Full-balance transfer', 'Active scam call detected'],
    cta: 'Cancel transfer & keep money',
  },
};
