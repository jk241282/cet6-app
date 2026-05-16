// 为所有缺少例句的词汇批量生成基础例句
import { initDb, getDb, saveDb } from './index.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');

await initDb();
const db = getDb();
db.run(schema);

// 查缺例句的词汇
const missing = db.exec(`
  SELECT v.id, v.word, v.part_of_speech, COALESCE(wm.meaning_cn,'') as meaning_cn
  FROM vocabulary v
  LEFT JOIN word_meanings wm ON v.id = wm.word_id AND wm.is_primary = 1
  WHERE v.id NOT IN (SELECT DISTINCT word_id FROM word_examples)
  ORDER BY v.word
`);

if (missing.length === 0 || missing[0].values.length === 0) {
  console.log('All words have examples!');
  process.exit(0);
}

const rows = missing[0].values;
console.log(`${rows.length} words need examples. Generating...`);

const iE = db.prepare('INSERT INTO word_examples (word_id, sentence_en, sentence_cn, exam_year, exam_type, source_section) VALUES (?,?,?,?,?,?)');

// 按词性选择例句模板
function makeExample(word: string, pos: string, meaning: string): [string, string] {
  const W = word.charAt(0).toUpperCase() + word.slice(1);

  const vTemplates = [
    [`We should learn how to ${word} in our daily life.`, `我们应该学会在日常生活中${meaning || word}。`],
    [`The company plans to ${word} its operations next year.`, `公司计划明年${meaning || '进行'}其业务。`],
    [`It is essential to ${word} the importance of this issue.`, `${meaning || '重视'}这个问题至关重要。`],
    [`Experts recommend that we ${word} our approach to this problem.`, `专家建议我们${meaning || '调整'}解决这个问题的方法。`],
    [`The government has taken steps to ${word} the current situation.`, `政府已采取措施来${meaning || '改善'}当前状况。`],
  ];

  const nTemplates = [
    [`${W} is a key factor in modern society.`, `${meaning || word}是现代社会的一个关键因素。`],
    [`The importance of ${word} cannot be overstated.`, `${meaning || word}的重要性怎么强调都不为过。`],
    [`Many scholars have studied the impact of ${word} on economic development.`, `许多学者研究了${meaning || word}对经济发展的影响。`],
    [`Understanding the concept of ${word} is essential for students.`, `理解${meaning || word}的概念对学生来说至关重要。`],
    [`The government has paid increasing attention to ${word} in recent years.`, `近年来政府越来越重视${meaning || word}。`],
  ];

  const adjTemplates = [
    [`This is a particularly ${word} issue in today's context.`, `在当今背景下，这是一个特别${meaning || '重要的'}问题。`],
    [`The results proved to be highly ${word} for the research team.`, `结果证明对研究团队来说非常${meaning || '有价值'}。`],
    [`A more ${word} approach is needed to address this challenge.`, `需要一个更${meaning || '有效'}的方法来应对这一挑战。`],
    [`It is ${word} that we take immediate action on climate change.`, `我们立即对气候变化采取行动是${meaning || '必要'}的。`],
  ];

  const advTemplates = [
    [`The project progressed ${word} throughout the year.`, `项目全年${meaning || '顺利'}推进。`],
    [`We need to respond ${word} to the changing market conditions.`, `我们需要${meaning || '迅速'}应对不断变化的市场环境。`],
  ];

  let templates: [string,string][] = vTemplates;
  if (pos?.startsWith('n.')) templates = nTemplates;
  else if (pos?.startsWith('adj.')) templates = adjTemplates;
  else if (pos?.startsWith('adv.')) templates = advTemplates;

  const t = templates[Math.floor(Math.random() * templates.length)];
  return [t[0], t[1]];
}

let count = 0;
db.run('BEGIN');
for (const row of rows) {
  const [id, word, pos, meaning] = row as [number, string, string, string];
  const [en, cn] = makeExample(word, pos || 'n.', meaning || '');
  iE.run([id, en, cn, null, 'CET-6', '基础例句']);
  count++;
  if (count % 500 === 0) console.log(`  ${count}/${rows.length}...`);
}
db.run('COMMIT');
saveDb();
console.log(`Done! Added ${count} example sentences.`);
