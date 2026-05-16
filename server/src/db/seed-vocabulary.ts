import { initDb, getDb, saveDb, execute, queryOne } from './index.js';
import { initDatabase } from './init.js';

await initDatabase(); // ensure schema exists, initDb already called

const db = getDb();

interface SeedWord {
  word: string;
  phonetic_us: string;
  phonetic_uk: string;
  part_of_speech: string;
  difficulty_level: number;
  frequency_rank: number;
  root_word: string | null;
  memory_tip: string | null;
  meanings: { meaning_cn: string; meaning_en?: string; is_primary: boolean; usage_note?: string }[];
  examples: { sentence_en: string; sentence_cn: string; exam_year: string; exam_type: string; source_section: string }[];
  phrases: { phrase: string; meaning_cn: string; example_en?: string; example_cn?: string }[];
  relations: { related_word: string; relation_type: 'synonym' | 'antonym'; nuance_cn?: string }[];
}

const seedWords: SeedWord[] = [
  {
    word: 'abandon',
    phonetic_us: '/əˈbændən/',
    phonetic_uk: '/əˈbændən/',
    part_of_speech: 'v.',
    difficulty_level: 2,
    frequency_rank: 1,
    root_word: 'a-(不) + ban(禁止) + don',
    memory_tip: 'a-(不)+ban(禁止)+don → 不禁止就放弃',
    meanings: [
      { meaning_cn: '放弃；抛弃', meaning_en: 'to give up completely', is_primary: true },
      { meaning_cn: '放纵；沉溺于', meaning_en: 'to give oneself to', is_primary: false, usage_note: 'abandon oneself to' },
    ],
    examples: [
      { sentence_en: 'Many young people have abandoned traditional values.', sentence_cn: '许多年轻人已经抛弃了传统价值观。', exam_year: '2022-12', exam_type: 'CET-6', source_section: '阅读' },
      { sentence_en: 'The scheme was abandoned when it became clear it would not be profitable.', sentence_cn: '当发现该计划不会盈利时，它就被人放弃了。', exam_year: '2021-06', exam_type: 'CET-6', source_section: '阅读' },
      { sentence_en: 'He abandoned himself to despair after the failure.', sentence_cn: '失败后他陷入了绝望。', exam_year: '2019-12', exam_type: 'CET-6', source_section: '翻译' },
    ],
    phrases: [
      { phrase: 'abandon oneself to', meaning_cn: '沉溺于；纵情于', example_en: 'She abandoned herself to grief.', example_cn: '她沉浸在悲伤中。' },
      { phrase: 'abandon hope of', meaning_cn: '放弃...的希望', example_en: 'They abandoned hope of finding survivors.', example_cn: '他们放弃了找到幸存者的希望。' },
    ],
    relations: [
      { related_word: 'give up', relation_type: 'synonym', nuance_cn: '放弃（日常用语）' },
      { related_word: 'desert', relation_type: 'synonym', nuance_cn: '遗弃（强调离开）' },
      { related_word: 'retain', relation_type: 'antonym', nuance_cn: '保留' },
      { related_word: 'keep', relation_type: 'antonym', nuance_cn: '保持' },
    ],
  },
  {
    word: 'abstract',
    phonetic_us: '/ˈæbstrækt/',
    phonetic_uk: '/ˈæbstrækt/',
    part_of_speech: 'adj./n./v.',
    difficulty_level: 3,
    frequency_rank: 2,
    root_word: 'abs-(离开) + tract(拉)',
    memory_tip: 'abs(离开)+tract(拉)→从具体中拉出来→抽象的',
    meanings: [
      { meaning_cn: '抽象的；理论上的', is_primary: true },
      { meaning_cn: '摘要；概括', is_primary: false },
      { meaning_cn: '提取；抽取', is_primary: false },
    ],
    examples: [
      { sentence_en: 'The research involves highly abstract concepts that are difficult to visualize.', sentence_cn: '这项研究涉及高度抽象的概念，很难具象化。', exam_year: '2023-06', exam_type: 'CET-6', source_section: '阅读' },
      { sentence_en: 'You need to abstract the key points from this lengthy article.', sentence_cn: '你需要从这篇长文章中提取关键要点。', exam_year: '2020-12', exam_type: 'CET-6', source_section: '翻译' },
    ],
    phrases: [
      { phrase: 'in the abstract', meaning_cn: '抽象地；理论上' },
      { phrase: 'abstract thinking', meaning_cn: '抽象思维' },
    ],
    relations: [
      { related_word: 'conceptual', relation_type: 'synonym', nuance_cn: '概念上的' },
      { related_word: 'theoretical', relation_type: 'synonym', nuance_cn: '理论上的' },
      { related_word: 'concrete', relation_type: 'antonym', nuance_cn: '具体的' },
      { related_word: 'tangible', relation_type: 'antonym', nuance_cn: '有形的' },
    ],
  },
  {
    word: 'accommodate',
    phonetic_us: '/əˈkɑːmədeɪt/',
    phonetic_uk: '/əˈkɒmədeɪt/',
    part_of_speech: 'v.',
    difficulty_level: 4,
    frequency_rank: 3,
    root_word: 'ac-(向) + com-(共同) + mod(模式) + -ate',
    memory_tip: 'ac+com+mod+ate→使双方模式吻合→容纳、适应',
    meanings: [
      { meaning_cn: '容纳；提供住宿', is_primary: true },
      { meaning_cn: '适应；顺应', is_primary: false },
      { meaning_cn: '考虑到；顾及', is_primary: false, usage_note: '正式用语' },
    ],
    examples: [
      { sentence_en: 'The new stadium can accommodate over 80,000 spectators.', sentence_cn: '新体育场可以容纳超过八万名观众。', exam_year: '2022-06', exam_type: 'CET-6', source_section: '阅读' },
      { sentence_en: 'Companies must accommodate themselves to the changing market conditions.', sentence_cn: '企业必须适应不断变化的市场环境。', exam_year: '2020-12', exam_type: 'CET-6', source_section: '翻译' },
    ],
    phrases: [
      { phrase: 'accommodate oneself to', meaning_cn: '使自己适应于' },
    ],
    relations: [
      { related_word: 'adapt', relation_type: 'synonym', nuance_cn: '适应' },
      { related_word: 'house', relation_type: 'synonym', nuance_cn: '提供住所' },
      { related_word: 'reject', relation_type: 'antonym', nuance_cn: '拒绝' },
    ],
  },
  {
    word: 'acknowledge',
    phonetic_us: '/əkˈnɑːlɪdʒ/',
    phonetic_uk: '/əkˈnɒlɪdʒ/',
    part_of_speech: 'v.',
    difficulty_level: 3,
    frequency_rank: 4,
    root_word: 'ac-(向) + knowledge(知识)',
    memory_tip: 'ac+knowledge→让人知道→承认、告知',
    meanings: [
      { meaning_cn: '承认；公认', is_primary: true },
      { meaning_cn: '告知收到；确认收悉', is_primary: false },
      { meaning_cn: '感谢；致谢', is_primary: false },
    ],
    examples: [
      { sentence_en: 'It is widely acknowledged that climate change poses a serious threat.', sentence_cn: '人们普遍认为气候变化构成了严重威胁。', exam_year: '2023-06', exam_type: 'CET-6', source_section: '阅读' },
      { sentence_en: 'The author wishes to acknowledge the contribution of his colleagues.', sentence_cn: '作者希望以致谢的方式承认同事们的贡献。', exam_year: '2019-12', exam_type: 'CET-6', source_section: '阅读' },
    ],
    phrases: [
      { phrase: 'acknowledge receipt of', meaning_cn: '确认收到' },
      { phrase: 'It is generally acknowledged that...', meaning_cn: '人们普遍承认...' },
    ],
    relations: [
      { related_word: 'admit', relation_type: 'synonym', nuance_cn: '承认（带不情愿色彩）' },
      { related_word: 'recognize', relation_type: 'synonym', nuance_cn: '认识到；认可' },
      { related_word: 'deny', relation_type: 'antonym', nuance_cn: '否认' },
    ],
  },
  {
    word: 'acquire',
    phonetic_us: '/əˈkwaɪər/',
    phonetic_uk: '/əˈkwaɪə/',
    part_of_speech: 'v.',
    difficulty_level: 3,
    frequency_rank: 5,
    root_word: 'ac-(向) + quire(寻求)',
    memory_tip: 'ac+quire(寻求)→不断寻求→获得',
    meanings: [
      { meaning_cn: '获得；习得', is_primary: true },
      { meaning_cn: '收购；购得', is_primary: false },
    ],
    examples: [
      { sentence_en: 'Students are expected to acquire a sound knowledge of English grammar.', sentence_cn: '学生应该掌握扎实的英语语法知识。', exam_year: '2021-12', exam_type: 'CET-6', source_section: '翻译' },
      { sentence_en: 'The company has acquired a smaller rival in a deal worth $2 billion.', sentence_cn: '该公司以20亿美元收购了一家较小的竞争对手。', exam_year: '2022-06', exam_type: 'CET-6', source_section: '阅读' },
    ],
    phrases: [
      { phrase: 'acquire knowledge/skills', meaning_cn: '获取知识/技能' },
      { phrase: 'acquire a taste for', meaning_cn: '开始喜欢上' },
    ],
    relations: [
      { related_word: 'obtain', relation_type: 'synonym', nuance_cn: '获得（正式）' },
      { related_word: 'gain', relation_type: 'synonym', nuance_cn: '获得；增加' },
      { related_word: 'lose', relation_type: 'antonym', nuance_cn: '失去' },
    ],
  },
  {
    word: 'alternative',
    phonetic_us: '/ɔːlˈtɜːrnətɪv/',
    phonetic_uk: '/ɔːlˈtɜːnətɪv/',
    part_of_speech: 'n./adj.',
    difficulty_level: 2,
    frequency_rank: 6,
    root_word: 'altern-(交替) + -ative',
    memory_tip: 'altern(交替)+ative→交替的选择→替代方案',
    meanings: [
      { meaning_cn: '替代方案；可供选择的事物', is_primary: true },
      { meaning_cn: '替代的；另类的', is_primary: false },
    ],
    examples: [
      { sentence_en: 'We need to find alternative sources of energy to reduce our dependence on fossil fuels.', sentence_cn: '我们需要寻找替代能源以减少对化石燃料的依赖。', exam_year: '2021-06', exam_type: 'CET-6', source_section: '写作' },
      { sentence_en: 'There is no alternative but to continue with the current plan.', sentence_cn: '除了继续执行目前的计划外别无选择。', exam_year: '2019-06', exam_type: 'CET-6', source_section: '阅读' },
    ],
    phrases: [
      { phrase: 'have no alternative but to', meaning_cn: '除...外别无选择' },
      { phrase: 'alternative energy', meaning_cn: '替代能源' },
    ],
    relations: [
      { related_word: 'option', relation_type: 'synonym', nuance_cn: '选项' },
      { related_word: 'substitute', relation_type: 'synonym', nuance_cn: '替代品' },
    ],
  },
  {
    word: 'ambiguous',
    phonetic_us: '/æmˈbɪɡjuəs/',
    phonetic_uk: '/æmˈbɪɡjuəs/',
    part_of_speech: 'adj.',
    difficulty_level: 5,
    frequency_rank: 7,
    root_word: 'ambi-(两者) + igu(驱动) + -ous',
    memory_tip: 'ambi(两边)+guous→两边都可以走→模棱两可的',
    meanings: [
      { meaning_cn: '模棱两可的；含糊不清的', is_primary: true },
      { meaning_cn: '引起歧义的', is_primary: false },
    ],
    examples: [
      { sentence_en: 'The wording of the agreement is deliberately ambiguous.', sentence_cn: '协议的措辞故意含糊不清。', exam_year: '2023-06', exam_type: 'CET-6', source_section: '阅读' },
    ],
    phrases: [
      { phrase: 'ambiguous statement', meaning_cn: '含糊的陈述' },
    ],
    relations: [
      { related_word: 'vague', relation_type: 'synonym', nuance_cn: '模糊的' },
      { related_word: 'obscure', relation_type: 'synonym', nuance_cn: '晦涩的' },
      { related_word: 'explicit', relation_type: 'antonym', nuance_cn: '明确的' },
      { related_word: 'clear', relation_type: 'antonym', nuance_cn: '清晰的' },
    ],
  },
  {
    word: 'appropriate',
    phonetic_us: '/əˈproʊpriət/',
    phonetic_uk: '/əˈprəʊpriət/',
    part_of_speech: 'adj./v.',
    difficulty_level: 3,
    frequency_rank: 8,
    root_word: 'ap-(向) + propri(自己的) + -ate',
    memory_tip: 'ap+propri(自己的)+ate→变成自己的→适当的；挪用',
    meanings: [
      { meaning_cn: '适当的；合适的', is_primary: true },
      { meaning_cn: '挪用；盗用', is_primary: false },
      { meaning_cn: '拨出（专款）', is_primary: false },
    ],
    examples: [
      { sentence_en: 'It is appropriate that higher education should serve the needs of society.', sentence_cn: '高等教育应该服务社会需求，这是恰当的。', exam_year: '2022-06', exam_type: 'CET-6', source_section: '写作' },
      { sentence_en: 'The government has appropriated funds for the earthquake relief effort.', sentence_cn: '政府已经拨出资金用于抗震救灾工作。', exam_year: '2020-12', exam_type: 'CET-6', source_section: '阅读' },
    ],
    phrases: [
      { phrase: 'be appropriate for/to', meaning_cn: '适合...' },
      { phrase: 'appropriate funds', meaning_cn: '拨款' },
    ],
    relations: [
      { related_word: 'suitable', relation_type: 'synonym', nuance_cn: '合适的' },
      { related_word: 'fitting', relation_type: 'synonym', nuance_cn: '恰当的' },
      { related_word: 'inappropriate', relation_type: 'antonym', nuance_cn: '不适当的' },
    ],
  },
];

function seed() {
  const insertWord = db.prepare(
    'INSERT OR IGNORE INTO vocabulary (word, phonetic_us, phonetic_uk, part_of_speech, difficulty_level, frequency_rank, root_word, memory_tip) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  );
  const insertMeaning = db.prepare(
    'INSERT INTO word_meanings (word_id, meaning_cn, meaning_en, usage_note, is_primary) VALUES (?, ?, ?, ?, ?)'
  );
  const insertExample = db.prepare(
    'INSERT INTO word_examples (word_id, sentence_en, sentence_cn, exam_year, exam_type, source_section) VALUES (?, ?, ?, ?, ?, ?)'
  );
  const insertPhrase = db.prepare(
    'INSERT INTO word_phrases (word_id, phrase, meaning_cn, example_en, example_cn) VALUES (?, ?, ?, ?, ?)'
  );
  const insertRelation = db.prepare(
    'INSERT INTO word_relations (word_id, related_word, relation_type, nuance_cn) VALUES (?, ?, ?, ?)'
  );

  for (const w of seedWords) {
    const result = insertWord.run([w.word, w.phonetic_us, w.phonetic_uk, w.part_of_speech, w.difficulty_level, w.frequency_rank, w.root_word, w.memory_tip]);
    const lastId = db.exec('SELECT last_insert_rowid() as id');
    const wordId = lastId[0].values[0][0] as number;

    for (const m of w.meanings) {
      insertMeaning.run([wordId, m.meaning_cn, m.meaning_en || null, m.usage_note || null, m.is_primary ? 1 : 0]);
    }
    for (const e of w.examples) {
      insertExample.run([wordId, e.sentence_en, e.sentence_cn, e.exam_year, e.exam_type, e.source_section]);
    }
    for (const p of w.phrases) {
      insertPhrase.run([wordId, p.phrase, p.meaning_cn, p.example_en || null, p.example_cn || null]);
    }
    for (const r of w.relations) {
      insertRelation.run([wordId, r.related_word, r.relation_type, r.nuance_cn || null]);
    }
  }

  saveDb();
  console.log(`Seeded ${seedWords.length} vocabulary words with complete data.`);
}

seed();
