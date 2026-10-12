/**
 * Olumi's existing public.early_access contract, inspected read-only on 12 Oct 2026.
 * No reads, upserts, new tables, account creation or email subscriptions.
 */
export const EARLY_ACCESS_URL = 'https://ewyskeampbmbagyclvfn.supabase.co';
const CAMPAIGNS = new Set(['investor-deck', 'partner-referral', 'website']);

export class SubmissionError extends Error {
  constructor(message, kind = 'unavailable') {
    super(message); this.name = 'SubmissionError'; this.kind = kind;
  }
}

export function campaignFromSearch(search = '') {
  const value = new URLSearchParams(search).get('source');
  return CAMPAIGNS.has(value) ? value : 'website';
}

export function validateContact(input) {
  const email = typeof input?.email === 'string' ? input.email.trim() : '';
  const name = typeof input?.full_name === 'string' ? input.full_name.trim() : '';
  const errors = {};
  if (!email) errors.email = 'Enter your email address.';
  else if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Enter a valid email address.';
  }
  if (name.length > 120 || /[\u0000-\u001f\u007f]/.test(name)) {
    errors.full_name = 'Use a name of 120 characters or fewer, without line breaks.';
  }
  return { valid: Object.keys(errors).length === 0, errors };
}

export function toExistingRecord(input) {
  if (!validateContact(input).valid) throw new SubmissionError('Check your contact details.', 'validation');
  return {
    email: input.email.trim().toLowerCase(),
    full_name: input.full_name?.trim() || null,
    // The current RLS INSERT policy requires source = 'holding_page'.
    // Campaign attribution belongs in utm, not the top-level source.
    source: 'holding_page',
    utm: { source: CAMPAIGNS.has(input.campaign) ? input.campaign : 'website', experience: 'netlify-preview-v3' }
  };
}

/** Reuse the public Supabase client already connected to the marketing site. */
export function createSupabaseSubmitter(client) {
  if (!client || typeof client.from !== 'function') {
    throw new SubmissionError('The request form has not been connected.', 'configuration');
  }
  return async (input, { signal } = {}) => {
    const payload = toExistingRecord(input);
    if (signal?.aborted) throw new SubmissionError('Request interrupted.', 'aborted');
    let query = client.from('early_access').insert(payload);
    if (signal && typeof query.abortSignal === 'function') query = query.abortSignal(signal);
    // Do not append .select(): anonymous SELECT is deliberately not available.
    const { error } = await query;
    if (signal?.aborted) throw new SubmissionError('Request interrupted.', 'aborted');
    if (error && error.code !== '23505') {
      throw new SubmissionError('We couldn’t send your request. Please try again.', 'unavailable');
    }
    // Same response for an existing email. Never overwrite the original record.
    return { ok: true };
  };
}

/** Browser-only REST adapter for a standalone static marketing page. */
export function createRestSubmitter({ url = EARLY_ACCESS_URL, apiKey = '', fetchImpl = globalThis.fetch } = {}) {
  let parsed;
  try { parsed = new URL(url); } catch { throw new SubmissionError('Invalid project URL.', 'configuration'); }
  if (parsed.origin !== EARLY_ACCESS_URL || !['', '/'].includes(parsed.pathname) || parsed.search || parsed.hash) {
    throw new SubmissionError('Use the existing early-access project, not the application project.', 'configuration');
  }
  if (typeof apiKey !== 'string' || !apiKey || typeof fetchImpl !== 'function') {
    throw new SubmissionError('The request form has not been connected.', 'configuration');
  }
  const headers = { 'Content-Type': 'application/json', apikey: apiKey, Prefer: 'return=minimal' };
  if (apiKey.startsWith('sb_publishable_')) {
    // Publishable keys belong in apikey, not an Authorization bearer header.
  } else if (apiKey.startsWith('eyJ')) {
    let claims;
    try {
      const raw = apiKey.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      claims = JSON.parse(atob(raw));
    } catch { throw new SubmissionError('Use the marketing site’s public API key.', 'configuration'); }
    if (claims.role !== 'anon') throw new SubmissionError('Never use a server key in this page.', 'configuration');
    headers.Authorization = `Bearer ${apiKey}`;
  } else {
    throw new SubmissionError('Use a publishable or legacy anon key only.', 'configuration');
  }
  return async (input, { signal } = {}) => {
    const response = await fetchImpl(`${EARLY_ACCESS_URL}/rest/v1/early_access`, {
      method: 'POST', headers, body: JSON.stringify(toExistingRecord(input)),
      credentials: 'omit', cache: 'no-store', referrerPolicy: 'no-referrer', signal
    });
    if (response.status === 201 || response.status === 204) return { ok: true };
    let problem = null;
    try { problem = await response.json(); } catch { /* Keep service errors private. */ }
    if (response.status === 409 && problem?.code === '23505') return { ok: true };
    if (response.status === 429) throw new SubmissionError('Please wait a moment before trying again.', 'rate_limit');
    throw new SubmissionError('We couldn’t send your request. Please try again.', 'unavailable');
  };
}
