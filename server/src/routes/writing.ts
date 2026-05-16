import { Router } from 'express';
import { queryAll, queryOne } from '../db/index.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();
router.use(authenticate);

// 获取写作话题列表
router.get('/topics', (req: AuthRequest, res) => {
  const { category } = req.query;
  let sql = 'SELECT id, topic_cn, topic_en, category, difficulty, exam_year FROM writing_topics';
  const params: string[] = [];
  if (category && category !== 'all') {
    sql += ' WHERE category = ?';
    params.push(String(category));
  }
  sql += ' ORDER BY id DESC';
  const topics = queryAll(sql, params);
  res.json({ topics });
});

// 获取单个写作话题 (含范文)
router.get('/topics/:id', (req: AuthRequest, res) => {
  const { id } = req.params;
  const topic = queryOne('SELECT * FROM writing_topics WHERE id = ?', [id]);
  if (!topic) return res.status(404).json({ error: '话题不存在' });
  res.json({ topic });
});

// 获取写作模板
router.get('/templates', (req: AuthRequest, res) => {
  const { category } = req.query;
  let sql = 'SELECT id, title, category, template_structure, model_paragraph_en, model_paragraph_cn FROM writing_templates';
  const params: string[] = [];
  if (category && category !== 'all') {
    sql += ' WHERE category = ?';
    params.push(String(category));
  }
  const templates = queryAll(sql, params);
  res.json({ templates });
});

// 获取单个模板
router.get('/templates/:id', (req: AuthRequest, res) => {
  const { id } = req.params;
  const template = queryOne('SELECT * FROM writing_templates WHERE id = ?', [id]);
  if (!template) return res.status(404).json({ error: '模板不存在' });
  res.json({ template });
});

// 获取写作佳句
router.get('/sentences', (req: AuthRequest, res) => {
  const { category, topic_tag } = req.query;
  let sql = 'SELECT * FROM writing_sentences WHERE 1=1';
  const params: string[] = [];
  if (category && category !== 'all') {
    sql += ' AND category = ?';
    params.push(String(category));
  }
  if (topic_tag) {
    sql += ' AND topic_tag = ?';
    params.push(String(topic_tag));
  }
  sql += ' ORDER BY id DESC LIMIT 50';
  const sentences = queryAll(sql, params);
  res.json({ sentences });
});

// 获取写作分类列表
router.get('/categories', (_req: AuthRequest, res) => {
  const topicCategories = queryAll('SELECT DISTINCT category FROM writing_topics WHERE category IS NOT NULL');
  const templateCategories = queryAll('SELECT DISTINCT category FROM writing_templates WHERE category IS NOT NULL');
  const sentenceCategories = queryAll('SELECT DISTINCT category FROM writing_sentences WHERE category IS NOT NULL');
  res.json({
    topics: (topicCategories as any[]).map((t) => t.category),
    templates: (templateCategories as any[]).map((t) => t.category),
    sentences: (sentenceCategories as any[]).map((t) => t.category),
  });
});

export default router;
