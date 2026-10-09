import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const originalEnv = process.env;

beforeEach(() => {
  vi.resetModules();
  process.env = { ...originalEnv };
});

afterEach(() => {
  process.env = originalEnv;
});

describe('POST /api/contact', () => {
  it('retorna 400 quando body ausente ou JSON inválido', async () => {
    process.env.RESEND_API_KEY = 're_test';
    process.env.CONTACT_TO_EMAIL = 'dest@test.com';

    const { POST } = await import('./route');

    const req = new Request('http://localhost/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not json'
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.ok).toBe(false);
    expect(json.code).toBe('validation');
  });

  it('retorna 400 com fields quando name curto/ausente', async () => {
    process.env.RESEND_API_KEY = 're_test';
    process.env.CONTACT_TO_EMAIL = 'dest@test.com';

    const { POST } = await import('./route');

    const req = new Request('http://localhost/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'A',
        email: 'test@test.com',
        message: 'Mensagem válida com mais de 10 chars'
      })
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.ok).toBe(false);
    expect(json.code).toBe('validation');
    expect(json.fields.name).toBe('length');
  });

  it('retorna 400 com fields quando email inválido', async () => {
    process.env.RESEND_API_KEY = 're_test';
    process.env.CONTACT_TO_EMAIL = 'dest@test.com';

    const { POST } = await import('./route');

    const req = new Request('http://localhost/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Nome Válido',
        email: 'email-invalido',
        message: 'Mensagem válida com mais de 10 chars'
      })
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.ok).toBe(false);
    expect(json.code).toBe('validation');
    expect(json.fields.email).toBe('format');
  });

  it('retorna 400 com fields quando message curta (<10)', async () => {
    process.env.RESEND_API_KEY = 're_test';
    process.env.CONTACT_TO_EMAIL = 'dest@test.com';

    const { POST } = await import('./route');

    const req = new Request('http://localhost/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Nome Válido',
        email: 'test@test.com',
        message: 'Curta'
      })
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.ok).toBe(false);
    expect(json.code).toBe('validation');
    expect(json.fields.message).toBe('length');
  });

  it('retorna 400 com fields quando message longa (>2000)', async () => {
    process.env.RESEND_API_KEY = 're_test';
    process.env.CONTACT_TO_EMAIL = 'dest@test.com';

    const { POST } = await import('./route');

    const longMessage = 'a'.repeat(2001);
    const req = new Request('http://localhost/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Nome Válido',
        email: 'test@test.com',
        message: longMessage
      })
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.ok).toBe(false);
    expect(json.code).toBe('validation');
    expect(json.fields.message).toBe('length');
  });

  it('honeypot preenchido retorna 200 sem chamar fetch do provedor', async () => {
    const fetchMock = vi.fn();
    global.fetch = fetchMock;

    process.env.RESEND_API_KEY = 're_test';
    process.env.CONTACT_TO_EMAIL = 'dest@test.com';

    const { POST } = await import('./route');

    const req = new Request('http://localhost/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Nome Válido',
        email: 'test@test.com',
        message: 'Mensagem válida com mais de 10 chars',
        website: 'preenchido-por-bot'
      })
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('variáveis de ambiente ausentes retorna 500 genérico sem vazar segredos', async () => {
    delete process.env.RESEND_API_KEY;
    delete process.env.CONTACT_TO_EMAIL;

    const { POST } = await import('./route');

    const req = new Request('http://localhost/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Nome Válido',
        email: 'test@test.com',
        message: 'Mensagem válida com mais de 10 chars'
      })
    });

    const res = await POST(req);
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.ok).toBe(false);
    expect(json.code).toBe('server');
    expect(JSON.stringify(json)).not.toContain('RESEND_API_KEY');
    expect(JSON.stringify(json)).not.toContain('CONTACT_TO_EMAIL');
  });

  it('sucesso com fetch mockado: reply_to = email do visitante, HTML escapado, assunto sem quebras de linha', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    global.fetch = fetchMock;

    process.env.RESEND_API_KEY = 're_test';
    process.env.CONTACT_TO_EMAIL = 'dest@test.com';

    const { POST } = await import('./route');

    const req = new Request('http://localhost/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'João\nSilva',
        email: 'joao@test.com',
        message: 'Mensagem com <script>alert(1)</script> e mais texto válido'
      })
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const call = fetchMock.mock.calls[0];
    const body = JSON.parse(call[1].body);

    expect(body.reply_to).toBe('joao@test.com');
    expect(body.subject).not.toContain('\n');
    expect(body.subject).not.toContain('\r');
    expect(body.html).toContain('<script>alert(1)</script>');
  });

  it('falha do provedor retorna 500 genérico', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ message: 'Invalid API key' })
    });
    global.fetch = fetchMock;

    process.env.RESEND_API_KEY = 're_test';
    process.env.CONTACT_TO_EMAIL = 'dest@test.com';

    const { POST } = await import('./route');

    const req = new Request('http://localhost/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Nome Válido',
        email: 'test@test.com',
        message: 'Mensagem válida com mais de 10 chars'
      })
    });

    const res = await POST(req);
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.ok).toBe(false);
    expect(json.code).toBe('server');
  });

  it('limite de taxa: N+1-ésima requisição do mesmo IP retorna 429', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    global.fetch = fetchMock;

    process.env.RESEND_API_KEY = 're_test';
    process.env.CONTACT_TO_EMAIL = 'dest@test.com';

    const { POST } = await import('./route');

    const ip = '192.168.1.1';
    const headers = {
      'Content-Type': 'application/json',
      'x-forwarded-for': ip
    };

    for (let i = 0; i < 5; i++) {
      const req = new Request('http://localhost/api/contact', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: `Nome ${i}`,
          email: 'test@test.com',
          message: 'Mensagem válida com mais de 10 chars'
        })
      });
      const res = await POST(req);
      expect(res.status).toBe(200);
    }

    const req6 = new Request('http://localhost/api/contact', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: 'Nome 6',
        email: 'test@test.com',
        message: 'Mensagem válida com mais de 10 chars'
      })
    });
    const res6 = await POST(req6);
    expect(res6.status).toBe(429);
    const json6 = await res6.json();
    expect(json6.ok).toBe(false);
    expect(json6.code).toBe('rate_limited');
  });
});
