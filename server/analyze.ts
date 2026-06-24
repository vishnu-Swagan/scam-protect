import 'dotenv/config';
import type { IncomingMessage, ServerResponse } from 'node:http';

export interface ScamResult {
  risk: number;
  verdict: string;
  category: string;
  reasons: string[];
  advice: string;
}

// Provider selection: explicit LLM_PROVIDER wins; otherwise auto-detect from
// whichever key is present (NVIDIA preferred if both are set).
type Provider = 'nvidia' | 'anthropic';
function activeProvider(): Provider {
  const explicit = (process.env.LLM_PROVIDER || '').toLowerCase();
  if (explicit === 'nvidia' || explicit === 'anthropic') return explicit;
  if (process.env.NVIDIA_API_KEY) return 'nvidia';
  return 'anthropic';
}

const NVIDIA_MODEL = process.env.NVIDIA_MODEL || 'meta/llama-3.3-70b-instruct';
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6';

const SYSTEM = `You are a fraud-detection engine for a consumer scam-protection app called SecurityZ Scam Protect. You analyze a single message (SMS, email, or call transcript) for signs of a scam, phishing, or fraud, and you respond only with machine-readable JSON.`;

function buildPrompt(text: string): string {
  return `Analyze the following message for signs of a scam, phishing, or fraud.

Message:
"""${text}"""

Respond with ONLY a JSON object, no markdown, no commentary, in exactly this shape:
{"risk": <integer 0-100>, "verdict": "<Safe|Suspicious|Likely scam|Dangerous scam>", "category": "<short label e.g. Phishing, Smishing, Bank impersonation, Lottery scam, Safe>", "reasons": ["<short reason>", "<short reason>", "<short reason>"], "advice": "<one short sentence telling the user what to do>"}`;
}

class HttpError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

// ── provider calls ────────────────────────────────────────────────────────────

// NVIDIA — OpenAI-compatible chat completions (no SDK needed; uses global fetch).
async function completeNvidia(text: string): Promise<string> {
  const key = process.env.NVIDIA_API_KEY;
  if (!key) {
    throw new HttpError('AI scam check is not configured. Set NVIDIA_API_KEY in the server environment.', 503);
  }
  let res: Response;
  try {
    res = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: NVIDIA_MODEL,
        temperature: 0.2,
        top_p: 0.9,
        max_tokens: 600,
        messages: [
          { role: 'system', content: SYSTEM },
          { role: 'user', content: buildPrompt(text) },
        ],
      }),
    });
  } catch {
    throw new HttpError('Could not reach the NVIDIA API. Check connectivity and try again.', 502);
  }
  if (!res.ok) {
    let detail = '';
    try {
      detail = (await res.text()).slice(0, 200);
    } catch {
      /* ignore */
    }
    throw new HttpError(`NVIDIA API error (${res.status}). ${detail}`.trim(), res.status === 401 ? 503 : 502);
  }
  const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
  return data.choices?.[0]?.message?.content || '';
}

// Anthropic — Messages API (lazy-imports the SDK so NVIDIA-only deploys don't need it loaded).
async function completeAnthropic(text: string): Promise<string> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    throw new HttpError('AI scam check is not configured. Set ANTHROPIC_API_KEY in the server environment.', 503);
  }
  const { default: Anthropic } = await import('@anthropic-ai/sdk');
  const client = new Anthropic({ apiKey: key });
  const msg = await client.messages.create({
    model: ANTHROPIC_MODEL,
    max_tokens: 600,
    system: SYSTEM,
    messages: [{ role: 'user', content: buildPrompt(text) }],
  });
  return msg.content.map((b) => (b.type === 'text' ? b.text : '')).join('').trim();
}

/** Pull the JSON object out of the model's reply and coerce it into a ScamResult. */
function parseResult(raw: string): ScamResult {
  let s = (raw || '').trim().replace(/^```(json)?/i, '').replace(/```$/, '').trim();
  const a = s.indexOf('{');
  const b = s.lastIndexOf('}');
  if (a >= 0 && b >= 0) s = s.slice(a, b + 1);

  let o: Partial<ScamResult>;
  try {
    o = JSON.parse(s) as Partial<ScamResult>;
  } catch {
    throw new HttpError('The analyzer returned an unreadable response. Please try again.', 502);
  }

  const risk = Math.max(0, Math.min(100, parseInt(String(o.risk), 10) || 0));
  return {
    risk,
    verdict: typeof o.verdict === 'string' && o.verdict.trim() ? o.verdict : risk >= 35 ? 'Suspicious' : 'Safe',
    category: typeof o.category === 'string' ? o.category : 'Unknown',
    reasons: Array.isArray(o.reasons) ? o.reasons.filter((r): r is string => typeof r === 'string') : [],
    advice: typeof o.advice === 'string' ? o.advice : '',
  };
}

/** Run the live scam analysis against the configured provider (NVIDIA or Anthropic). */
export async function analyzeScam(text: string): Promise<ScamResult> {
  const trimmed = (text || '').trim();
  if (!trimmed) throw new HttpError('No text provided to analyze.', 400);
  if (trimmed.length > 8000) throw new HttpError('Message is too long to analyze.', 413);

  const raw = activeProvider() === 'nvidia' ? await completeNvidia(trimmed) : await completeAnthropic(trimmed);
  return parseResult(raw);
}

// ── framework-agnostic Node middleware ───────────────────────────────────────
function readJsonBody(req: IncomingMessage): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let size = 0;
    req.on('data', (c: Buffer) => {
      size += c.length;
      if (size > 1_000_000) reject(new HttpError('Request body too large.', 413));
      else chunks.push(c);
    });
    req.on('end', () => {
      const body = Buffer.concat(chunks).toString('utf8').trim();
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new HttpError('Invalid JSON body.', 400));
      }
    });
    req.on('error', reject);
  });
}

function send(res: ServerResponse, status: number, payload: unknown): void {
  const json = JSON.stringify(payload);
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(json);
}

/**
 * A connect/Express-compatible handler for POST /api/analyze.
 * Reads the raw request body itself, so it works under Vite's dev middleware
 * stack and under Express without an extra body parser.
 */
export function analyzeMiddleware() {
  return async (req: IncomingMessage & { method?: string }, res: ServerResponse): Promise<void> => {
    try {
      if (req.method !== 'POST') {
        send(res, 405, { error: 'Method not allowed. Use POST.' });
        return;
      }
      const body = await readJsonBody(req);
      const text = typeof body.text === 'string' ? body.text : '';
      const result = await analyzeScam(text);
      send(res, 200, result);
    } catch (err) {
      const status = err instanceof HttpError ? err.status : 500;
      const message = err instanceof Error ? err.message : 'Something went wrong while analyzing.';
      // Surface a clean message; never leak stack traces or keys to the client.
      send(res, status, { error: message });
    }
  };
}
