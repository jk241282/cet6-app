import { Router } from 'express';
import { queryAll, queryOne, execute } from '../db/index.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();
router.use(authenticate);

// 获取翻译题目列表
router.get('/exercises', (req: AuthRequest, res) => {
  const { page = '1', limit = '50' } = req.query;
  const offset = (Number(page) - 1) * Number(limit);
  const exercises = queryAll(
    'SELECT id, source_text_cn, key_points, difficulty, exam_year FROM translation_exercises ORDER BY id DESC LIMIT ? OFFSET ?',
    [Number(limit), offset]
  );
  res.json({ exercises });
});

// 获取单个翻译题
router.get('/exercises/:id', (req: AuthRequest, res) => {
  const { id } = req.params;
  const exercise = queryOne('SELECT * FROM translation_exercises WHERE id = ?', [id]);
  if (!exercise) return res.status(404).json({ error: '题目不存在' });
  res.json({ exercise });
});

// 提交翻译答案 (保存练习记录)
router.post('/exercises/:id/submit', (req: AuthRequest, res) => {
  const { id } = req.params;
  const { userTranslation } = req.body;
  const userId = req.userId!;

  const exercise = queryOne('SELECT reference_en FROM translation_exercises WHERE id = ?', [id]) as any;
  if (!exercise) return res.status(404).json({ error: '题目不存在' });

  res.json({
    reference: exercise.reference_en,
    userTranslation,
    message: '请对照参考译文自我评估',
  });
});

// 翻译技巧提示
router.get('/tips', (_req: AuthRequest, res) => {
  const tips = [
    '先通读中文全文，理解整体意思再动笔翻译',
    '确定英语主干结构（主谓宾），再添加修饰成分',
    '避免逐字直译，追求意译和自然流畅的表达',
    '常考主题词汇：中国传统文化、科技发展、社会热点',
    '遇到不会的词，用已知的近义词或解释性翻译替代',
    '翻译完成后通读检查：时态一致性、单复数、冠词用法',
    '注意中文无主语句 → 英语必须补主语或用被动语态',
    '四字成语 → 意译核心含义，不必逐字翻译',
  ];
  res.json({ tips });
});

export default router;
