export const dynamic = 'force-dynamic';

type ContactRequest = {
  name: string;
  email: string;
  message: string;
  website?: string;
};

type ValidationErrors = {
  name?: string;
  email?: string;
  message?: string;
};

const rateLimitStore = new Map<string, number[]>();

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }
  return 'unknown';
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const maxRequests = 5;

  const timestamps = rateLimitStore.get(ip) ?? [];
  const recent = timestamps.filter((ts) => now - ts < windowMs);

  if (recent.length >= maxRequests) {
    return true;
  }

  recent.push(now);
  rateLimitStore.set(ip, recent);
  return false;
}

function validateRequest(
  body: unknown
): ContactRequest & { errors: ValidationErrors } {
  const errors: ValidationErrors = {};
  const data = body as Partial<ContactRequest> | null;

  if (!data || typeof data !== 'object') {
    return {
      name: '',
      email: '',
      message: '',
      website: '',
      errors: { name: 'required', email: 'required', message: 'required' }
    };
  }

  const name = typeof data.name === 'string' ? data.name.trim() : '';
  const email = typeof data.email === 'string' ? data.email.trim() : '';
  const message = typeof data.message === 'string' ? data.message.trim() : '';
  const website = typeof data.website === 'string' ? data.website.trim() : '';

  if (!name) {
    errors.name = 'required';
  } else if (name.length < 2 || name.length > 80) {
    errors.name = 'length';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    errors.email = 'required';
  } else if (!emailRegex.test(email) || email.length > 254) {
    errors.email = 'format';
  }

  if (!message) {
    errors.message = 'required';
  } else if (message.length < 10 || message.length > 2000) {
    errors.message = 'length';
  }

  return { name, email, message, website, errors };
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, '&#039;');
}

function sendEmailViaResend(
  apiKey: string,
  from: string,
  to: string,
  subject: string,
  text: string,
  html: string,
  replyTo: string
): Promise<{ ok: boolean; error?: string }> {
  return fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      text,
      html,
      reply_to: replyTo
    })
  })
    .then(async (res) => {
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        return {
          ok: false,
          error: errorData.message ?? `Resend error: ${res.status}`
        };
      }
      return { ok: true };
    })
    .catch((err) => ({ ok: false, error: err.message }));
}

export async function POST(request: Request): Promise<Response> {
  const resendApiKey = process.env.RESEND_API_KEY;
  const contactToEmail = process.env.CONTACT_TO_EMAIL;
  const contactFromEmail =
    process.env.CONTACT_FROM_EMAIL ?? 'onboarding@resend.dev';

  if (!resendApiKey) {
    console.error('[Contact API] Missing RESEND_API_KEY');
    return Response.json({ ok: false, code: 'server' }, { status: 500 });
  }
  if (!contactToEmail) {
    console.error('[Contact API] Missing CONTACT_TO_EMAIL');
    return Response.json({ ok: false, code: 'server' }, { status: 500 });
  }

  const ip = getClientIp(request);
  if (isRateLimited(ip)) {
    return Response.json({ ok: false, code: 'rate_limited' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      {
        ok: false,
        code: 'validation',
        fields: { name: 'required', email: 'required', message: 'required' }
      },
      { status: 400 }
    );
  }

  const { name, email, message, website, errors } = validateRequest(body);

  if (website) {
    return Response.json({ ok: true });
  }

  if (Object.keys(errors).length > 0) {
    return Response.json(
      { ok: false, code: 'validation', fields: errors },
      { status: 400 }
    );
  }

  const safeName = name.replace(/[\r\n]+/g, ' ').trim();
  const subject = `[Portfólio] Nova mensagem de ${safeName}`;

  const textLines = [`Nome: ${name}`, `E-mail: ${email}`, `Mensagem:`, message];
  const text = textLines.join('\n');

  const htmlLines = [
    '<div style="font-family: system-ui, sans-serif; line-height: 1.6; max-width: 600px;">',
    `<p><strong>Nome:</strong> ${escapeHtml(name)}</p>`,
    `<p><strong>E-mail:</strong> ${escapeHtml(email)}</p>`,
    '<p><strong>Mensagem:</strong></p>',
    `<p style="white-space: pre-wrap;">${escapeHtml(message)}</p>`,
    '</div>'
  ];
  const html = htmlLines.join('\n');

  const result = await sendEmailViaResend(
    resendApiKey,
    contactFromEmail,
    contactToEmail,
    subject,
    text,
    html,
    email
  );

  if (!result.ok) {
    console.error('[Contact API] Resend send failed:', result.error);
    return Response.json({ ok: false, code: 'server' }, { status: 500 });
  }

  return Response.json({ ok: true });
}
