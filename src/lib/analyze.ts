import type { ScamResult } from '../types';

/**
 * Calls the backend live AI scam check (POST /api/analyze).
 * The Anthropic key lives only on the server; the browser never sees it.
 */
export async function runScamAnalysis(text: string): Promise<ScamResult> {
  let res: Response;
  try {
    res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
  } catch {
    throw new Error('Network error — check your connection and try again.');
  }

  let data: unknown;
  try {
    data = await res.json();
  } catch {
    throw new Error('The analyzer returned an unexpected response. Please try again.');
  }

  if (!res.ok) {
    const message = (data as { error?: string })?.error || 'Could not analyze right now. Please try again.';
    throw new Error(message);
  }

  const o = data as Partial<ScamResult>;
  return {
    risk: Math.max(0, Math.min(100, Number(o.risk) || 0)),
    verdict: typeof o.verdict === 'string' ? o.verdict : 'Unknown',
    category: typeof o.category === 'string' ? o.category : '',
    reasons: Array.isArray(o.reasons) ? o.reasons : [],
    advice: typeof o.advice === 'string' ? o.advice : '',
  };
}
