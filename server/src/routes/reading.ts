import { Router } from 'express';
import { queryAll, queryOne } from '../db/index.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();
router.use(authenticate);

// 获取阅读文章列表
router.get('/passages', (req: AuthRequest, res) => {
  const { topic, page = '1', limit = '10' } = req.query;
  const offset = (Number(page) - 1) * Number(limit);
  let sql = 'SELECT id, title, source, difficulty, word_count, topic_tag FROM reading_passages';
  const params: (string | number)[] = [];

  if (topic && topic !== 'all') {
    sql += ' WHERE topic_tag = ?';
    params.push(String(topic));
  }
  sql += ' ORDER BY id DESC LIMIT ? OFFSET ?';
  params.push(Number(limit), offset);

  const passages = queryAll(sql, params);
  res.json({ passages });
});

// 获取单篇阅读文章+题目
router.get('/passages/:id', (req: AuthRequest, res) => {
  const { id } = req.params;
  const passage = queryOne('SELECT * FROM reading_passages WHERE id = ?', [id]);
  if (!passage) return res.status(404).json({ error: '文章不存在' });
  const questions = queryAll('SELECT * FROM reading_questions WHERE passage_id = ?', [id]);
  res.json({ passage, questions });
});

// 提交阅读答案并记录错题
router.post('/passages/:id/submit', (req: AuthRequest, res) => {
  const { id } = req.params;
  const { answers } = req.body; // { questionId: userAnswer }
  const userId = req.userId!;

  const questions = queryAll('SELECT * FROM reading_questions WHERE passage_id = ?', [id]);
  let correctCount = 0;
  const results: Record<string, { correct: boolean; userAnswer: string; correctAnswer: string }> = {};

  for (const q of questions as any[]) {
    const userAnswer = answers[q.id] || '';
    const correct = userAnswer.trim().toUpperCase() === q.answer.trim().toUpperCase();
    if (correct) correctCount++;
    results[q.id] = { correct, userAnswer, correctAnswer: q.answer };

    if (!correct) {
      const existing = queryOne('SELECT id FROM user_errors WHERE user_id=? AND question_type=? AND question_id=?', [userId, 'reading', q.id]);
      if (!existing) {
        const { execute } = require('../db/index.js');
        execute('INSERT INTO user_errors (user_id, question_type, question_id, user_answer, correct_answer) VALUES (?,?,?,?,?)', [userId, 'reading', q.id, userAnswer, q.answer]);
      }
    }
  }

  res.json({
    score: correctCount,
    total: questions.length,
    results,
  });
});

// 获取阅读话题列表
router.get('/topics', (_req: AuthRequest, res) => {
  const topics = queryAll('SELECT DISTINCT topic_tag FROM reading_passages WHERE topic_tag IS NOT NULL');
  res.json({ topics: (topics as any[]).map((t) => t.topic_tag) });
});

export default router;
