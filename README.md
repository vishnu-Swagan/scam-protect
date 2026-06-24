# SecurityZ — Scam Protect

An interactive scam-protection mobile app, implemented from the Claude Design
handoff (`project/Scam Protect App.html` and its imports). Built as a real
**Vite + React + TypeScript** app with a small backend route for the **live AI
scam check** (Anthropic API) and a real **in-app Settings** screen.

## What's in it

- **5 tabs + extras** — Home, Inbox (messages/email), Calls, Money (bank),
  Family, plus a Community alerts feed, an AI Analyzer, and a Message detail view.
- **Live AI scam check** — paste any message / email / call transcript and it
  calls an LLM provider on the backend (NVIDIA or Anthropic) to return a risk
  score, verdict, reasons, and advice. Also available as "Re-analyze with AI".
- **"Try a live demo"** (Home) — simulate an incoming scam **call**, **text**, or
  **fraud transfer** and watch it get screened and blocked with an intercept sheet.
- **Settings** (gear on Home) — accent color, dark mode, home layout
  (shield vs feed), and alert intensity. Persisted to `localStorage`.

## Architecture

```
.
├─ index.html              # entry, loads Google Fonts (Hanken Grotesk + JetBrains Mono)
├─ vite.config.ts          # mounts the /api/analyze endpoint in dev & preview
├─ .claude/                # SessionStart hook: auto-installs deps in web sessions
├─ server/
│  ├─ analyze.ts           # Anthropic call + framework-agnostic /api/analyze handler
│  └─ index.ts             # production Express server (serves dist/ + /api/analyze)
└─ src/
   ├─ App.tsx              # phone frame, navigation, demo + toast orchestration
   ├─ theme.ts             # palette, accents, fonts (ported from app-theme.jsx)
   ├─ settings.tsx         # SettingsProvider/useSettings (replaces the dev Tweaks panel)
   ├─ data.ts / types.ts   # seed datasets + scam scenarios
   ├─ lib/analyze.ts       # frontend fetch → /api/analyze
   ├─ components/          # Icon, atoms, screen atoms, phone chrome
   ├─ screens/             # Home, Messages, Analyzer, MessageDetail, Calls, Bank, Family, Community, Settings
   └─ demo/ScamDemo.tsx    # incoming-scam → scan → intercept overlay
```

The AI key lives **only on the server** — the browser calls `/api/analyze`, never
Anthropic directly.

## Getting started

```bash
npm install
cp .env.example .env        # add your ANTHROPIC_API_KEY
npm run dev                  # http://localhost:5173
```

`npm run dev` runs the whole app (frontend + the `/api/analyze` endpoint) in one
process — no separate server needed.

### Production

```bash
npm run build               # type-checks, then builds the client to dist/
npm start                   # Express serves dist/ + /api/analyze on PORT (default 3000)
```

## Configuration

The live AI scam check works with **NVIDIA** or **Anthropic**. Set one key — if
`NVIDIA_API_KEY` is present it's used automatically; otherwise `ANTHROPIC_API_KEY`
is used. `LLM_PROVIDER` forces a choice.

| Variable            | Required | Default                      | Notes                                                     |
| ------------------- | -------- | ---------------------------- | --------------------------------------------------------- |
| `NVIDIA_API_KEY`    | one of\* | —                            | Get one free at https://build.nvidia.com.                 |
| `NVIDIA_MODEL`      | no       | `meta/llama-3.3-70b-instruct`| Any model id from build.nvidia.com.                       |
| `ANTHROPIC_API_KEY` | one of\* | —                            | Anthropic alternative.                                    |
| `ANTHROPIC_MODEL`   | no       | `claude-sonnet-4-6`          | e.g. `claude-haiku-4-5-20251001` for speed/cost.          |
| `LLM_PROVIDER`      | no       | auto-detect                  | Force `nvidia` or `anthropic`.                            |
| `PORT`              | no       | `3000`                       | Production Express port (`npm start`).                    |

\* Provide **one** provider key. Without any key the app still runs fine; the AI
scam check shows a graceful "couldn't analyze" state with a retry. Everything
else (navigation, the demo, settings, the seeded data) works offline.

NVIDIA's API is OpenAI-compatible, so it's called over plain HTTP — no extra
dependency. The Anthropic SDK is only loaded if you use the Anthropic provider.

## Notes

- The message / call / transaction / family / community lists are **seed data**
  from the design — a production build would wire these to real device/bank
  integrations. The AI scam check is the one piece that runs live.
- Visuals are a faithful port of the prototype (390×844 phone mockup, warm light
  theme, emerald accent). The dev-only "Tweaks" panel from the prototype is now a
  real in-app **Settings** screen.

## Claude Code on the web

`.claude/hooks/session-start.sh` is a **SessionStart** hook: when a Claude Code
web session starts on this repo it runs `npm install` automatically, so tests,
type-checks, and the dev server work right away. It only runs in remote sessions
(guarded by `CLAUDE_CODE_REMOTE`) and is a no-op locally. Registered in
`.claude/settings.json`. Once this is on your default branch, all future web
sessions use it.
