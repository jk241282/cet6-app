import { Router } from 'express';
import { queryAll, queryOne, execute } from '../db/index.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();
router.use(authenticate);

// 随机抽取未掌握的单词
router.post('/draw', (req: AuthRequest, res) => {
  const { count = 10 } = req.body;
  const userId = req.userId!;

  const words = queryAll(`
    SELECT v.* FROM vocabulary v
    WHERE v.id NOT IN (
      SELECT uv.word_id FROM user_vocabulary uv
      WHERE uv.user_id = ? AND uv.status IN ('mastered', 'skipped')
    )
    ORDER BY RANDOM()
    LIMIT ?
  `, [userId, count]);

  res.json({ words });
});

// 单词搜索
router.get('/search', (req: AuthRequest, res) => {
  const { q } = req.query;
  if (!q || String(q).length < 1) return res.json({ words: [] });
  const words = queryAll(
    `SELECT v.*, wm.meaning_cn FROM vocabulary v LEFT JOIN word_meanings wm ON v.id=wm.word_id AND wm.is_primary=1 WHERE v.word LIKE ? LIMIT 20`,
    [`${q}%`]
  );
  res.json({ words });
});

// 按字母获取单词列表 (含用户学习状态)
router.get('/list', (req: AuthRequest, res) => {
  const { letter = 'A', page = '1', limit = '100', status } = req.query;
  const userId = req.userId!;
  const offset = (Number(page) - 1) * Number(limit);

  let sql = `SELECT v.*, wm.meaning_cn, uv.status as user_status, uv.last_reviewed FROM vocabulary v LEFT JOIN word_meanings wm ON v.id=wm.word_id AND wm.is_primary=1 LEFT JOIN user_vocabulary uv ON v.id=uv.word_id AND uv.user_id=? WHERE 1=1`;
  const params: (string|number)[] = [userId];

  if (letter && letter !== 'all') {
    sql += ' AND v.word LIKE ?';
    params.push(`${letter}%`);
  }
  if (status && status !== 'all') {
    if (status === 'none') sql += ' AND uv.status IS NULL';
    else { sql += ' AND uv.status = ?'; params.push(String(status)); }
  }

  const total = queryAll(`SELECT COUNT(*) as count FROM (${sql})`, params);
  sql += ' ORDER BY v.word ASC LIMIT ? OFFSET ?';
  params.push(Number(limit), offset);

  const words = queryAll(sql, params);
  res.json({ words, total: (total[0] as any).count, letter: letter || 'all' });
});

// 删除用户对单词的学习状态 (取消标记)
router.delete('/:wordId/status', (req: AuthRequest, res) => {
  const { wordId } = req.params;
  const userId = req.userId!;
  execute('DELETE FROM user_vocabulary WHERE user_id = ? AND word_id = ?', [userId, wordId]);
  res.json({ success: true });
});

// 获取单词的完整知识点 (支持按ID或按word查询)
router.get('/:wordId', (req: AuthRequest, res) => {
  const { wordId } = req.params;

  const word = queryOne('SELECT * FROM vocabulary WHERE id = ?', [wordId]);
  if (!word) return res.status(404).json({ error: '单词不存在' });

  const meanings = queryAll('SELECT * FROM word_meanings WHERE word_id = ? ORDER BY is_primary DESC', [wordId]);
  const examples = queryAll('SELECT * FROM word_examples WHERE word_id = ?', [wordId]);
  const phrases = queryAll('SELECT * FROM word_phrases WHERE word_id = ?', [wordId]);
  const relations = queryAll('SELECT * FROM word_relations WHERE word_id = ?', [wordId]);

  res.json({ word, meanings, examples, phrases, relations });
});

// 更新用户对单词的学习状态
router.patch('/:wordId/status', (req: AuthRequest, res) => {
  const { status } = req.body;
  const { wordId } = req.params;
  const userId = req.userId!;

  if (!['new', 'learning', 'reviewed', 'mastered', 'skipped'].includes(status)) {
    return res.status(400).json({ error: '无效状态' });
  }

  const now = new Date().toISOString();
  const nextReview = status === 'mastered'
    ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    : null;

  execute(`
    INSERT INTO user_vocabulary (user_id, word_id, status, last_reviewed, next_review, review_count)
    VALUES (?, ?, ?, ?, ?, 1)
    ON CONFLICT(user_id, word_id) DO UPDATE SET
      status = excluded.status,
      last_reviewed = excluded.last_reviewed,
      next_review = excluded.next_review,
      review_count = user_vocabulary.review_count + 1
  `, [userId, wordId, status, now, nextReview]);

  res.json({ success: true });
});

// 获取学习统计
router.get('/stats/summary', (req: AuthRequest, res) => {
  const userId = req.userId!;

  const totalWords = queryOne('SELECT COUNT(*) as count FROM vocabulary') as { count: number };
  const mastered = queryOne(
    'SELECT COUNT(*) as count FROM user_vocabulary WHERE user_id = ? AND status = ?',
    [userId, 'mastered']
  ) as { count: number };
  const learning = queryOne(
    'SELECT COUNT(*) as count FROM user_vocabulary WHERE user_id = ? AND status IN (?, ?)',
    [userId, 'learning', 'reviewed']
  ) as { count: number };

  res.json({
    total: totalWords.count,
    mastered: mastered.count,
    learning: learning.count,
    remaining: totalWords.count - mastered.count - learning.count,
  });
});

export default router;
