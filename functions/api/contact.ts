/**
 * Cloudflare Pages Function: POST /api/contact
 * Accepts the contact form, validates, checks honeypot, calls Resend to email hello@bsidesstudio.com.
 *
 * Environment variables (set in Cloudflare Pages → Settings → Environment variables):
 *   RESEND_API_KEY    — required; from https://resend.com/api-keys
 *   CONTACT_TO        — optional override; defaults to hello@bsidesstudio.com
 *   CONTACT_FROM      — optional override; defaults to "B·Sides Studio <no-reply@bsidesstudio.com>"
 *   CONTACT_ALLOWED_ORIGINS — optional; comma-separated origins to allow. Defaults to the prod site.
 *                             `.pages.dev` preview deploys and localhost are always allowed.
 *
 * The CONTACT_FROM address domain (bsidesstudio.com) must be verified in Resend.
 *
 * Additional abuse defense: configure a Cloudflare Rate Limiting rule on /api/contact
 * in the dashboard (e.g. 5 req / 10 min per IP). KV-based rate limiting isn't done
 * in-code because this function has no KV binding.
 */

type Env = {
  RESEND_API_KEY?: string;
  CONTACT_TO?: string;
  CONTACT_FROM?: string;
  CONTACT_ALLOWED_ORIGINS?: string;
};

type ContactPayload = {
  handle?: string;
  email?: string;
  message?: string;
  // Honeypot — real humans leave this blank.
  website?: string;
  // Timing honeypot — milliseconds the form was visible before submit.
  // Submissions under MIN_FILL_MS are treated as bots.
  elapsed?: number;
};

const MAX_HANDLE_LEN = 120;
const MAX_EMAIL_LEN = 200;
const MAX_MESSAGE_LEN = 5000;
const MAX_BODY_BYTES = 16 * 1024;
const MIN_FILL_MS = 1500;

const DEFAULT_ALLOWED_ORIGINS = [
  'https://bsidesstudio.com',
  'https://www.bsidesstudio.com',
];

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= MAX_EMAIL_LEN;

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const isAllowedOrigin = (origin: string, env: Env) => {
  if (!origin) return false;
  let url: URL;
  try {
    url = new URL(origin);
  } catch {
    return false;
  }
  const host = url.host;
  if (host === 'localhost' || host.startsWith('localhost:') || host === '127.0.0.1' || host.startsWith('127.0.0.1:')) {
    return true;
  }
  if (host.endsWith('.pages.dev')) return true;
  const configured = (env.CONTACT_ALLOWED_ORIGINS ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const allowlist = configured.length > 0 ? configured : DEFAULT_ALLOWED_ORIGINS;
  return allowlist.includes(origin);
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.RESEND_API_KEY) {
    return json({ ok: false, error: 'Server not configured.' }, 500);
  }

  const origin = request.headers.get('origin') ?? '';
  if (!isAllowedOrigin(origin, env)) {
    return json({ ok: false, error: 'Forbidden.' }, 403);
  }

  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.toLowerCase().includes('application/json')) {
    return json({ ok: false, error: 'Unsupported content type.' }, 415);
  }

  const contentLength = Number(request.headers.get('content-length') ?? '0');
  if (contentLength > MAX_BODY_BYTES) {
    return json({ ok: false, error: 'Payload too large.' }, 413);
  }

  let data: ContactPayload;
  try {
    data = await request.json();
  } catch {
    return json({ ok: false, error: 'Invalid JSON.' }, 400);
  }

  // Honeypot: silently succeed so the bot thinks it worked.
  if (data.website && data.website.trim().length > 0) {
    return json({ ok: true });
  }

  // Timing honeypot: bots tend to submit instantly. Silent success so they don't retry.
  if (typeof data.elapsed === 'number' && data.elapsed >= 0 && data.elapsed < MIN_FILL_MS) {
    return json({ ok: true });
  }

  const handle = (data.handle ?? '').trim().slice(0, MAX_HANDLE_LEN);
  const email = (data.email ?? '').trim().slice(0, MAX_EMAIL_LEN);
  const message = (data.message ?? '').trim().slice(0, MAX_MESSAGE_LEN);

  if (!isValidEmail(email)) {
    return json({ ok: false, error: 'A valid email is required.' }, 400);
  }
  if (message.length < 1) {
    return json({ ok: false, error: 'Message is required.' }, 400);
  }

  const to = env.CONTACT_TO ?? 'hello@bsidesstudio.com';
  const from = env.CONTACT_FROM ?? 'B·Sides Studio <no-reply@bsidesstudio.com>';
  const subject = handle ? `[b·sides] hi from ${handle}` : '[b·sides] drop us a line';

  const text = [
    `Handle: ${handle || '—'}`,
    `Email:  ${email}`,
    '',
    message,
  ].join('\n');

  const html = `
    <div style="font-family: ui-monospace, SFMono-Regular, Menlo, monospace; color: #1a1612; line-height: 1.6;">
      <p><strong>Handle:</strong> ${escapeHtml(handle || '—')}</p>
      <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
      <hr style="border: none; border-top: 2px dashed #3b332a; margin: 16px 0;" />
      <div style="white-space: pre-wrap;">${escapeHtml(message)}</div>
    </div>
  `.trim();

  const resp = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email,
      subject,
      text,
      html,
    }),
  });

  if (!resp.ok) {
    const detail = await resp.text().catch(() => '');
    console.error('Resend send failed:', resp.status, detail);
    return json({ ok: false, error: 'Could not send right now. Try again, or email us directly.' }, 502);
  }

  return json({ ok: true });
};
