import { Hono } from 'hono';
import { handle } from 'hono/cloudflare-pages';
import { sign, verify } from 'hono/jwt';

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const hash = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    key, 256
  );
  const hashHex = [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, '0')).join('');
  const saltHex = [...salt].map(b => b.toString(16).padStart(2, '0')).join('');
  return `${saltHex}:${hashHex}`;
}

async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [saltHex, hashHex] = stored.split(':');
  const salt = new Uint8Array(saltHex.match(/.{2}/g)!.map(b => parseInt(b, 16)));
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const hash = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    key, 256
  );
  const computedHex = [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, '0')).join('');
  return computedHex === hashHex;
}

async function generateToken(userId: number, secret: string): Promise<string> {
  return await sign({ userId, exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60 }, secret);
}

// Auth verify helper
async function authVerify(c: any, next: any) {
  const header = c.req.header('Authorization');
  if (!header?.startsWith('Bearer ')) return c.json({ error: '未登录' }, 401);
  try {
    const payload = await verify(header.slice(7), 'cet6-dev-secret-change-in-production', 'HS256') as { userId: number };
    c.set('userId', payload.userId);
    await next();
  } catch {
    return c.json({ error: '登录过期' }, 401);
  }
}

// Auth routes
app.post('/api/auth/register', async (c) => {
  const { username, email, password } = await c.req.json();
  if (!username || !email || !password) return c.json({ error: '请填写所有字段' }, 400);
  if (password.length < 6) return c.json({ error: '密码至少6位' }, 400);
  const existing = await c.env.DB.prepare('SELECT id FROM users WHERE email = ? OR username = ?').bind(email, username).first();
  if (existing) return c.json({ error: '用户名或邮箱已存在' }, 409);
  const hash = await hashPassword(password);
  const result = await c.env.DB.prepare('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)').bind(username, email, hash).run();
  const userId = result.meta.last_row_id;
  const token = await generateToken(userId as number, 'cet6-dev-secret-change-in-production');
  return c.json({ token, user: { id: userId, username, email } }, 201);
});

app.post('/api/auth/login', async (c) => {
  const { email, password } = await c.req.json();
  if (!email || !password) return c.json({ error: '请填写邮箱和密码' }, 400);
  const user = await c.env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(email).first();
  if (!user) return c.json({ error: '邮箱或密码错误' }, 401);
  const valid = await verifyPassword(password, user.password_hash as string);
  if (!valid) return c.json({ error: '邮箱或密码错误' }, 401);
  const token = await generateToken(user.id as number, 'cet6-dev-secret-change-in-production');
  return c.json({ token, user: { id: user.id, username: user.username, email: user.email } });
});

app.get('/api/auth/me', async (c) => {
  const header = c.req.header('Authorization');
  if (!header?.startsWith('Bearer ')) return c.json({ error: '未登录' }, 401);
  try {
    const payload = await verify(header.slice(7), 'cet6-dev-secret-change-in-production', 'HS256') as { userId: number };
    const user = await c.env.DB.prepare('SELECT id, username, email, created_at FROM users WHERE id = ?').bind(payload.userId).first();
    if (!user) return c.json({ error: '用户不存在' }, 404);
    return c.json({ user });
  } catch { return c.json({ error: '登录过期' }, 401); }
});

app.get('/api/health', (c) => c.json({ status: 'ok' }));

// Vocabulary routes
const vocab = new Hono<{ Bindings: Bindings }>();
vocab.use('*', authVerify);

vocab.post('/draw', async (c) => {
  const userId = c.get('userId');
  const { count = 10 } = await c.req.json();
  const { results } = await c.env.DB.prepare(
    `SELECT v.* FROM vocabulary v WHERE v.id NOT IN (SELECT uv.word_id FROM user_vocabulary uv WHERE uv.user_id = ? AND uv.status IN ('mastered', 'skipped')) ORDER BY RANDOM() LIMIT ?`
  ).bind(userId, count).all();
  return c.json({ words: results });
});

vocab.get('/search', async (c) => {
  const q = c.req.query('q');
  if (!q || q.length < 1) return c.json({ words: [] });
  const { results } = await c.env.DB.prepare(
    'SELECT v.*, wm.meaning_cn FROM vocabulary v LEFT JOIN word_meanings wm ON v.id=wm.word_id AND wm.is_primary=1 WHERE v.word LIKE ? LIMIT 20'
  ).bind(`${q}%`).all();
  return c.json({ words: results });
});

vocab.get('/list', async (c) => {
  const userId = c.get('userId');
  const letter = c.req.query('letter') || 'A';
  const page = Number(c.req.query('page') || '1');
  const limit = Number(c.req.query('limit') || '100');
  const status = c.req.query('status');
  const offset = (page - 1) * limit;

  let conds = '';
  const params: any[] = [userId];
  if (letter && letter !== 'all') { conds += ' AND v.word LIKE ?'; params.push(`${letter}%`); }
  if (status && status !== 'all') {
    if (status === 'none') conds += ' AND uv.status IS NULL';
    else { conds += ' AND uv.status = ?'; params.push(status); }
  }

  const base = `FROM vocabulary v LEFT JOIN word_meanings wm ON v.id=wm.word_id AND wm.is_primary=1 LEFT JOIN user_vocabulary uv ON v.id=uv.word_id AND uv.user_id=?${conds}`;
  const countResult = await c.env.DB.prepare(`SELECT COUNT(*) as count ${base}`).bind(...params).first();
  const total = (countResult as any)?.count || 0;
  const { results } = await c.env.DB.prepare(`SELECT v.*, wm.meaning_cn, uv.status as user_status, uv.last_reviewed ${base} ORDER BY v.word ASC LIMIT ? OFFSET ?`).bind(...params, limit, offset).all();
  return c.json({ words: results, total, letter: letter || 'all' });
});

vocab.get('/stats/summary', async (c) => {
  const userId = c.get('userId');
  const totalR = await c.env.DB.prepare('SELECT COUNT(*) as count FROM vocabulary').first();
  const masteredR = await c.env.DB.prepare('SELECT COUNT(*) as count FROM user_vocabulary WHERE user_id = ? AND status = ?').bind(userId, 'mastered').first();
  const learningR = await c.env.DB.prepare('SELECT COUNT(*) as count FROM user_vocabulary WHERE user_id = ? AND status IN (?, ?)').bind(userId, 'learning', 'reviewed').first();
  const total = (totalR as any)?.count || 0;
  const mastered = (masteredR as any)?.count || 0;
  const learning = (learningR as any)?.count || 0;
  return c.json({ total, mastered, learning, remaining: total - mastered - learning });
});

vocab.get('/:wordId', async (c) => {
  const wordId = c.req.param('wordId');
  const isNumeric = /^\d+$/.test(wordId);
  const word = isNumeric
    ? await c.env.DB.prepare('SELECT * FROM vocabulary WHERE id = ?').bind(Number(wordId)).first()
    : await c.env.DB.prepare('SELECT * FROM vocabulary WHERE LOWER(word) = LOWER(?)').bind(wordId).first();
  if (!word) return c.json({ error: '单词不存在' }, 404);
  const id = (word as any).id;
  const meanings = await c.env.DB.prepare('SELECT * FROM word_meanings WHERE word_id = ? ORDER BY is_primary DESC').bind(id).all();
  const examples = await c.env.DB.prepare('SELECT * FROM word_examples WHERE word_id = ?').bind(id).all();
  const phrases = await c.env.DB.prepare('SELECT * FROM word_phrases WHERE word_id = ?').bind(id).all();
  const relations = await c.env.DB.prepare('SELECT * FROM word_relations WHERE word_id = ?').bind(id).all();
  return c.json({ word, meanings: meanings.results, examples: examples.results, phrases: phrases.results, relations: relations.results });
});

vocab.patch('/:wordId/status', async (c) => {
  const userId = c.get('userId');
  const wordId = c.req.param('wordId');
  const { status } = await c.req.json();
  if (!['new', 'learning', 'reviewed', 'mastered', 'skipped'].includes(status)) return c.json({ error: '无效状态' }, 400);
  const now = new Date().toISOString();
  const nextReview = status === 'mastered' ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() : null;
  await c.env.DB.prepare(
    `INSERT INTO user_vocabulary (user_id, word_id, status, last_reviewed, next_review, review_count) VALUES (?, ?, ?, ?, ?, 1) ON CONFLICT(user_id, word_id) DO UPDATE SET status = excluded.status, last_reviewed = excluded.last_reviewed, next_review = excluded.next_review, review_count = user_vocabulary.review_count + 1`
  ).bind(userId, wordId, status, now, nextReview).run();
  return c.json({ success: true });
});

vocab.delete('/:wordId/status', async (c) => {
  const userId = c.get('userId');
  const wordId = c.req.param('wordId');
  await c.env.DB.prepare('DELETE FROM user_vocabulary WHERE user_id = ? AND word_id = ?').bind(userId, wordId).run();
  return c.json({ success: true });
});

app.route('/api/vocabulary', vocab);
app.get('/api/reading', authVerify, (c) => c.json({ passages: [] }));
app.get('/api/translation', authVerify, (c) => c.json({ exercises: [] }));
app.get('/api/writing', authVerify, (c) => c.json({ topics: [] }));

export const onRequest = handle(app);
