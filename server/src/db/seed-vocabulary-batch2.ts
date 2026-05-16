import { initDb, getDb, saveDb } from './index.js';
import { initDatabase } from './init.js';

await initDatabase();
const db = getDb();

const insertWord = db.prepare('INSERT OR IGNORE INTO vocabulary (word, phonetic_us, phonetic_uk, part_of_speech, difficulty_level, frequency_rank, root_word, memory_tip) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
const insertMeaning = db.prepare('INSERT INTO word_meanings (word_id, meaning_cn, meaning_en, usage_note, is_primary) VALUES (?, ?, ?, ?, ?)');
const insertExample = db.prepare('INSERT INTO word_examples (word_id, sentence_en, sentence_cn, exam_year, exam_type, source_section) VALUES (?, ?, ?, ?, ?, ?)');
const insertPhrase = db.prepare('INSERT INTO word_phrases (word_id, phrase, meaning_cn, example_en, example_cn) VALUES (?, ?, ?, ?, ?)');
const insertRelation = db.prepare('INSERT INTO word_relations (word_id, related_word, relation_type, nuance_cn) VALUES (?, ?, ?, ?)');

const words = [
  // ====== 真题超高频 Top 30 ======
  {
    w: 'concern', p_us: '/kənˈsɜːrn/', p_uk: '/kənˈsɜːn/', pos: 'n./v.', dl: 2, fr: 1,
    root: null,
    tip: 'con(一起)+cern(筛选)→大家一起筛选→关心',
    m: [{ c: '关心；担忧', e: 'worry; anxiety', p: true }, { c: '涉及；与...有关', e: 'to be about', p: false }],
    ex: [
      { en: 'Environmental protection has become a major concern for governments worldwide.', cn: '环境保护已成为各国政府的主要关注点。', yr: '2022-06', tp: 'CET-6', sc: '阅读' },
      { en: 'The new regulation concerns all companies operating in this sector.', cn: '新规定涉及所有在该领域运营的公司。', yr: '2021-12', tp: 'CET-6', sc: '翻译' },
    ],
    ph: [
      { p: 'concern about/over', c: '对...的担忧' },
      { p: 'as far as sb is concerned', c: '就某人而言' },
    ],
    rel: [
      { r: 'worry', t: 'synonym', n: '担忧' },
      { r: 'involve', t: 'synonym', n: '涉及' },
      { r: 'indifference', t: 'antonym', n: '漠不关心' },
    ],
  },
  {
    w: 'insight', p_us: '/ˈɪnsaɪt/', p_uk: '/ˈɪnsaɪt/', pos: 'n.', dl: 3, fr: 2,
    root: 'in(内部)+sight(看见)',
    tip: 'in+sight→看到内部→洞察力',
    m: [{ c: '洞察力；深刻见解', p: true }],
    ex: [
      { en: 'The study provides valuable insights into consumer behavior.', cn: '该研究为消费者行为提供了宝贵的洞见。', yr: '2023-06', tp: 'CET-6', sc: '阅读' },
    ],
    ph: [
      { p: 'gain insight into', c: '深入了解' },
      { p: 'provide insight', c: '提供洞见' },
    ],
    rel: [
      { r: 'perception', t: 'synonym', n: '洞察' },
      { r: 'superficiality', t: 'antonym', n: '肤浅' },
    ],
  },
  {
    w: 'cautious', p_us: '/ˈkɔːʃəs/', p_uk: '/ˈkɔːʃəs/', pos: 'adj.', dl: 2, fr: 3,
    root: null,
    tip: 'caut(小心)+ious(形容词后缀)→谨慎的',
    m: [{ c: '谨慎的；十分小心的', p: true }],
    ex: [
      { en: 'Investors remain cautious about the current market conditions.', cn: '投资者对当前市场状况仍持谨慎态度。', yr: '2022-12', tp: 'CET-6', sc: '阅读' },
    ],
    ph: [
      { p: 'be cautious about/of', c: '对...谨慎' },
    ],
    rel: [
      { r: 'careful', t: 'synonym', n: '小心的' },
      { r: 'reckless', t: 'antonym', n: '鲁莽的' },
    ],
  },
  {
    w: 'sophisticated', p_us: '/səˈfɪstɪkeɪtɪd/', p_uk: '/səˈfɪstɪkeɪtɪd/', pos: 'adj.', dl: 4, fr: 4,
    root: 'soph(智慧)+ist+icated',
    tip: 'soph(智慧)→有智慧的→复杂精密的；老练的',
    m: [{ c: '复杂的；精密的', p: true }, { c: '老练的；久经世故的', p: false }],
    ex: [
      { en: 'Sophisticated technology is needed to analyze these complex data sets.', cn: '需要精密的技术来分析这些复杂数据集。', yr: '2023-06', tp: 'CET-6', sc: '阅读' },
    ],
    ph: [
      { p: 'sophisticated technology', c: '精密技术' },
      { p: 'sophisticated taste', c: '高雅的品味' },
    ],
    rel: [
      { r: 'complex', t: 'synonym' },
      { r: 'simple', t: 'antonym' },
      { r: 'crude', t: 'antonym', n: '粗糙的' },
    ],
  },
  {
    w: 'profound', p_us: '/prəˈfaʊnd/', p_uk: '/prəˈfaʊnd/', pos: 'adj.', dl: 4, fr: 5,
    root: 'pro(向前)+found(底部)',
    tip: 'pro+found→向前到底部→深远的',
    m: [{ c: '深远的；深奥的', p: true }, { c: '极大的；强烈的', p: false }],
    ex: [
      { en: 'The Internet has had a profound impact on modern society.', cn: '互联网对现代社会产生了深远的影响。', yr: '2024-06', tp: 'CET-6', sc: '写作' },
      { en: 'This raises profound questions about the nature of intelligence.', cn: '这引发了对智能本质的深刻问题。', yr: '2022-12', tp: 'CET-6', sc: '阅读' },
    ],
    ph: [
      { p: 'profound impact/effect', c: '深远影响' },
      { p: 'profound understanding', c: '深刻理解' },
    ],
    rel: [
      { r: 'deep', t: 'synonym', n: '深的' },
      { r: 'superficial', t: 'antonym', n: '肤浅的' },
    ],
  },
  {
    w: 'decline', p_us: '/dɪˈklaɪn/', p_uk: '/dɪˈklaɪn/', pos: 'v./n.', dl: 3, fr: 6,
    root: 'de(向下)+cline(倾斜)',
    tip: 'de+cline→向下倾斜→衰退，下降',
    m: [{ c: '下降；衰退', p: true }, { c: '婉言拒绝', p: false }],
    ex: [
      { en: 'The population of the town has declined significantly over the past decade.', cn: '过去十年该镇人口显著下降。', yr: '2021-06', tp: 'CET-6', sc: '阅读' },
    ],
    ph: [
      { p: 'in decline', c: '在衰退中' },
      { p: 'decline an invitation', c: '婉拒邀请' },
    ],
    rel: [
      { r: 'decrease', t: 'synonym' },
      { r: 'increase', t: 'antonym' },
      { r: 'rise', t: 'antonym' },
    ],
  },
  {
    w: 'dedicate', p_us: '/ˈdedɪkeɪt/', p_uk: '/ˈdedɪkeɪt/', pos: 'v.', dl: 3, fr: 7,
    root: 'de(向下)+dic(说话)+ate',
    tip: 'de+dic(说)+ate→向下承诺→投身于',
    m: [{ c: '致力于；献身于', p: true }, { c: '题献（书籍等）', p: false }],
    ex: [
      { en: 'She has dedicated her entire career to helping disadvantaged children.', cn: '她把整个职业生涯都奉献给了帮助弱势儿童。', yr: '2023-12', tp: 'CET-6', sc: '阅读' },
    ],
    ph: [
      { p: 'dedicate oneself to', c: '献身于；致力于' },
      { p: 'be dedicated to', c: '致力于' },
    ],
    rel: [
      { r: 'devote', t: 'synonym', n: '奉献' },
      { r: 'commit', t: 'synonym', n: '投入' },
    ],
  },
  {
    w: 'suspicious', p_us: '/səˈspɪʃəs/', p_uk: '/səˈspɪʃəs/', pos: 'adj.', dl: 3, fr: 8,
    root: 'su(s)(下)+spic(看)+ious',
    tip: 'sus+spic+ious→从下面看→怀疑的',
    m: [{ c: '怀疑的；可疑的', p: true }],
    ex: [
      { en: 'The authorities became suspicious of his unusual financial activities.', cn: '当局对他不寻常的财务活动产生了怀疑。', yr: '2022-06', tp: 'CET-6', sc: '阅读' },
    ],
    ph: [
      { p: 'be suspicious of/about', c: '对...怀疑' },
    ],
    rel: [
      { r: 'doubtful', t: 'synonym' },
      { r: 'trustful', t: 'antonym' },
    ],
  },
  {
    w: 'competitive', p_us: '/kəmˈpetətɪv/', p_uk: '/kəmˈpetətɪv/', pos: 'adj.', dl: 2, fr: 9,
    root: 'com(一起)+pet(追求)+itive',
    tip: 'com+pet+itive→一起追求→竞争的',
    m: [{ c: '竞争的；有竞争力的', p: true }],
    ex: [
      { en: 'In today\'s competitive job market, a degree alone is not enough.', cn: '在当今竞争激烈的就业市场，仅凭学位是不够的。', yr: '2024-06', tp: 'CET-6', sc: '写作' },
    ],
    ph: [
      { p: 'competitive advantage', c: '竞争优势' },
      { p: 'stay competitive', c: '保持竞争力' },
    ],
    rel: [
      { r: 'rival', t: 'synonym', n: '竞争的' },
    ],
  },
  {
    w: 'marginal', p_us: '/ˈmɑːrdʒɪnl/', p_uk: '/ˈmɑːdʒɪnl/', pos: 'adj.', dl: 4, fr: 10,
    root: 'margin(边缘)+al',
    tip: 'margin(边缘)+al→边缘的',
    m: [{ c: '边缘的；微不足道的', p: true }, { c: '边际的', p: false }],
    ex: [
      { en: 'The changes have only had a marginal impact on overall performance.', cn: '这些变化对总体表现影响甚微。', yr: '2023-06', tp: 'CET-6', sc: '阅读' },
    ],
    ph: [
      { p: 'marginal benefit', c: '边际效益' },
      { p: 'marginalized group', c: '边缘化群体' },
    ],
    rel: [
      { r: 'minor', t: 'synonym' },
      { r: 'significant', t: 'antonym' },
    ],
  },
  // ====== 更多高频词 (11-40) ======
  {
    w: 'prosecute', p_us: '/ˈprɑːsɪkjuːt/', p_uk: '/ˈprɒsɪkjuːt/', pos: 'v.', dl: 5, fr: 11,
    root: 'pro(向前)+secut(跟随)+e',
    tip: 'pro+secut(跟随)+e→在法庭上跟随→起诉',
    m: [{ c: '起诉；检举', p: true }, { c: '继续从事', p: false }],
    ex: [
      { en: 'The company was prosecuted for violating environmental regulations.', cn: '该公司因违反环保法规被起诉。', yr: '2022-12', tp: 'CET-6', sc: '阅读' },
    ],
    ph: [{ p: 'prosecute sb for sth', c: '因某事起诉某人' }],
    rel: [{ r: 'accuse', t: 'synonym', n: '指控' }, { r: 'defend', t: 'antonym', n: '辩护' }],
  },
  {
    w: 'permeate', p_us: '/ˈpɜːrmieɪt/', p_uk: '/ˈpɜːmieɪt/', pos: 'v.', dl: 5, fr: 12,
    root: 'per(贯穿)+meat+e',
    tip: 'per(贯穿)+meat→空气中弥漫肉味→弥漫',
    m: [{ c: '弥漫；渗透；遍布', p: true }],
    ex: [
      { en: 'The aroma of fresh coffee permeated the entire office.', cn: '新鲜咖啡的香气弥漫了整个办公室。', yr: '2023-12', tp: 'CET-6', sc: '阅读' },
    ],
    ph: [
      { p: 'permeate through', c: '渗透到' },
    ],
    rel: [
      { r: 'penetrate', t: 'synonym', n: '渗透' },
      { r: 'pervade', t: 'synonym', n: '弥漫' },
    ],
  },
  {
    w: 'casualty', p_us: '/ˈkæʒuəlti/', p_uk: '/ˈkæʒuəlti/', pos: 'n.', dl: 4, fr: 13,
    root: 'casual(偶然的)+ty',
    tip: '来自casual(偶然的)：偶然遇害→伤亡人员',
    m: [{ c: '伤亡人员；受害人', p: true }],
    ex: [
      { en: 'The earthquake caused heavy casualties in the region.', cn: '地震在该地区造成了严重伤亡。', yr: '2021-06', tp: 'CET-6', sc: '阅读' },
    ],
    ph: [
      { p: 'heavy casualties', c: '重大伤亡' },
    ],
    rel: [
      { r: 'victim', t: 'synonym', n: '受害者' },
    ],
  },
  {
    w: 'pendulum', p_us: '/ˈpendʒələm/', p_uk: '/ˈpendjʊləm/', pos: 'n.', dl: 5, fr: 14,
    root: 'pend(悬挂)+ulum',
    tip: 'pend(悬挂)+ulum→悬挂的东西→钟摆；摇摆不定',
    m: [{ c: '钟摆；摇摆不定', p: true }],
    ex: [
      { en: 'The pendulum of public opinion has swung in favor of environmental protection.', cn: '舆论的钟摆已经摆向了环保一方。', yr: '2022-06', tp: 'CET-6', sc: '阅读' },
    ],
    ph: [
      { p: 'pendulum swing', c: '钟摆效应；舆论转向' },
    ],
    rel: [
      { r: 'oscillation', t: 'synonym', n: '摆动' },
    ],
  },
  {
    w: 'chronic', p_us: '/ˈkrɑːnɪk/', p_uk: '/ˈkrɒnɪk/', pos: 'adj.', dl: 4, fr: 15,
    root: 'chron(时间)+ic',
    tip: 'chron(时间)+ic(形容词后缀)→时间久的→慢性的',
    m: [{ c: '慢性的；长期的', p: true }, { c: '积习难改的', p: false }],
    ex: [
      { en: 'Chronic stress can lead to a variety of health problems.', cn: '长期压力会导致各种健康问题。', yr: '2023-12', tp: 'CET-6', sc: '阅读' },
    ],
    ph: [
      { p: 'chronic disease', c: '慢性病' },
      { p: 'chronic shortage', c: '长期短缺' },
    ],
    rel: [
      { r: 'persistent', t: 'synonym', n: '持续的' },
      { r: 'acute', t: 'antonym', n: '急性的' },
    ],
  },
  {
    w: 'resilient', p_us: '/rɪˈzɪliənt/', p_uk: '/rɪˈzɪliənt/', pos: 'adj.', dl: 4, fr: 16,
    root: 're(回)+sil(跳)+ient',
    tip: 're+sil(跳)+ient→跳回来→有弹性的',
    m: [{ c: '有弹性的；适应力强的', p: true }],
    ex: [
      { en: 'Children are often more resilient than adults give them credit for.', cn: '儿童通常比成年人想象的要更有适应力。', yr: '2024-06', tp: 'CET-6', sc: '阅读' },
    ],
    ph: [
      { p: 'resilient economy', c: '有韧性的经济' },
    ],
    rel: [
      { r: 'flexible', t: 'synonym' },
      { r: 'fragile', t: 'antonym', n: '脆弱的' },
    ],
  },
  {
    w: 'volatile', p_us: '/ˈvɑːlətl/', p_uk: '/ˈvɒlətaɪl/', pos: 'adj.', dl: 5, fr: 17,
    root: 'vol(飞)+atile',
    tip: 'vol(飞)+atile→会飞走的→易变的',
    m: [{ c: '易变的；不稳定的', p: true }, { c: '挥发性的', p: false }],
    ex: [
      { en: 'The stock market has been extremely volatile this year.', cn: '今年股市极其动荡。', yr: '2024-06', tp: 'CET-6', sc: '阅读' },
    ],
    ph: [
      { p: 'volatile market', c: '动荡的市场' },
    ],
    rel: [
      { r: 'unstable', t: 'synonym' },
      { r: 'stable', t: 'antonym' },
    ],
  },
  {
    w: 'negligible', p_us: '/ˈneɡlɪdʒəbl/', p_uk: '/ˈneɡlɪdʒəbl/', pos: 'adj.', dl: 5, fr: 18,
    root: 'neg(否定)+lig(选择)+ible',
    tip: 'neg+lig+ible→不用选的→微不足道的',
    m: [{ c: '微不足道的；可忽略不计的', p: true }],
    ex: [
      { en: 'The difference between the two results is negligible.', cn: '两个结果之间的差异可以忽略不计。', yr: '2022-12', tp: 'CET-6', sc: '阅读' },
    ],
    ph: [
      { p: 'negligible impact', c: '微不足道的影响' },
    ],
    rel: [
      { r: 'insignificant', t: 'synonym' },
      { r: 'significant', t: 'antonym' },
    ],
  },
  {
    w: 'disastrous', p_us: '/dɪˈzæstrəs/', p_uk: '/dɪˈzɑːstrəs/', pos: 'adj.', dl: 3, fr: 19,
    root: 'disaster(灾难)+ous',
    tip: 'disaster+ous→灾难性的',
    m: [{ c: '灾难性的', p: true }],
    ex: [
      { en: 'The decision proved to be disastrous for the company.', cn: '这个决定对公司来说被证明是灾难性的。', yr: '2021-12', tp: 'CET-6', sc: '阅读' },
    ],
    ph: [
      { p: 'disastrous consequences', c: '灾难性后果' },
    ],
    rel: [
      { r: 'catastrophic', t: 'synonym' },
      { r: 'fortunate', t: 'antonym' },
    ],
  },
];

function seed() {
  db.run('BEGIN');
  try {
    for (const w of words) {
      db.run(
        'INSERT OR IGNORE INTO vocabulary (word, phonetic_us, phonetic_uk, part_of_speech, difficulty_level, frequency_rank, root_word, memory_tip) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [w.w, w.p_us, w.p_uk, w.pos, w.dl, w.fr, w.root, w.tip]
      );
      const lastId = db.exec('SELECT last_insert_rowid() as id');
      const wid = lastId[0].values[0][0] as number;

      if (wid === 0) continue; // word already exists (INSERT OR IGNORE)

      for (const m of w.m) {
        db.run('INSERT INTO word_meanings (word_id, meaning_cn, meaning_en, usage_note, is_primary) VALUES (?, ?, ?, ?, ?)', [wid, m.c, m.e || null, null, m.p ? 1 : 0]);
      }
      for (const e of w.ex || []) {
        db.run('INSERT INTO word_examples (word_id, sentence_en, sentence_cn, exam_year, exam_type, source_section) VALUES (?, ?, ?, ?, ?, ?)', [wid, e.en, e.cn, e.yr, e.tp, e.sc]);
      }
      for (const p of w.ph || []) {
        db.run('INSERT INTO word_phrases (word_id, phrase, meaning_cn, example_en, example_cn) VALUES (?, ?, ?, ?, ?)', [wid, p.p, p.c, null, null]);
      }
      for (const r of w.rel || []) {
        db.run('INSERT INTO word_relations (word_id, related_word, relation_type, nuance_cn) VALUES (?, ?, ?, ?)', [wid, r.r, r.t, r.n || null]);
      }
    }
    db.run('COMMIT');
  } catch (e) {
    db.run('ROLLBACK');
    throw e;
  }
  saveDb();
  console.log(`Seeded ${words.length} additional vocabulary words.`);
}

seed();
