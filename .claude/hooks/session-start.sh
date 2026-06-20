#!/bin/bash
# SessionStart hook — installs npm dependencies so tests, linters, type-checks,
# and the dev server work immediately in Claude Code on the web sessions.
set -euo pipefail

# Only run in remote (Claude Code on the web) sessions; local sessions manage
# their own dependencies.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

echo "[session-start] Installing npm dependencies…"
# install (not ci) so the cached container layer is reused on later sessions;
# idempotent and non-interactive.
npm install --no-audit --no-fund
echo "[session-start] Dependencies ready."
