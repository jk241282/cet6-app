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

// 获取单词的完整知识点
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
