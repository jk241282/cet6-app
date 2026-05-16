import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { queryOne, execute } from '../db/index.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'cet6-dev-secret-change-in-production';

router.post('/register', (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: '请填写所有字段' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: '密码至少6位' });
  }

  const existing = queryOne('SELECT id FROM users WHERE email = ? OR username = ?', [email, username]);
  if (existing) {
    return res.status(409).json({ error: '用户名或邮箱已存在' });
  }

  const hash = bcrypt.hashSync(password, 10);
  const result = execute('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)', [username, email, hash]);
  const token = jwt.sign({ userId: result.lastInsertRowid }, JWT_SECRET, { expiresIn: '7d' });

  res.status(201).json({
    token,
    user: { id: result.lastInsertRowid, username, email },
  });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: '请填写邮箱和密码' });
  }

  const user = queryOne('SELECT * FROM users WHERE email = ?', [email]) as Record<string, unknown> | undefined;
  if (!user || !bcrypt.compareSync(password, user.password_hash as string)) {
    return res.status(401).json({ error: '邮箱或密码错误' });
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
  res.json({
    token,
    user: { id: user.id, username: user.username, email: user.email },
  });
});

router.get('/me', (req, res) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: '未登录' });
  }
  try {
    const payload = jwt.verify(header.slice(7), JWT_SECRET) as { userId: number };
    const user = queryOne('SELECT id, username, email, created_at FROM users WHERE id = ?', [payload.userId]);
    if (!user) return res.status(404).json({ error: '用户不存在' });
    res.json({ user });
  } catch {
    return res.status(401).json({ error: '登录过期' });
  }
});

export default router;
