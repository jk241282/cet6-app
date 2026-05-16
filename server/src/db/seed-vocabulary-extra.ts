// CET-6 补充词汇 - 追加至5500+
import { initDb, getDb, saveDb } from './index.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');

await initDb();
const db = getDb();
db.run(schema);

const iW = db.prepare('INSERT OR IGNORE INTO vocabulary (word,phonetic_us,phonetic_uk,part_of_speech,difficulty_level,frequency_rank,root_word,memory_tip) VALUES (?,?,?,?,?,?,?,?)');
const iM = db.prepare('INSERT INTO word_meanings (word_id,meaning_cn,meaning_en,usage_note,is_primary) VALUES (?,?,?,?,?)');
const iE = db.prepare('INSERT INTO word_examples (word_id,sentence_en,sentence_cn,exam_year,exam_type,source_section) VALUES (?,?,?,?,?,?)');

function makeExample(word: string, pos: string, meaning: string): [string, string] {
  const W = word.charAt(0).toUpperCase() + word.slice(1);
  if (pos?.startsWith('v.')) return [`We should learn how to ${word} effectively.`, `我们应该学会如何有效地${meaning || word}。`];
  if (pos?.startsWith('n.')) return [`${W} plays a significant role in this field.`, `${meaning || word}在这个领域发挥着重要作用。`];
  if (pos?.startsWith('adj.')) return [`This is a very ${word} aspect of the problem.`, `这是问题的一个非常${meaning || '重要'}的方面。`];
  return [`Understanding ${word} is crucial for further study.`, `理解${meaning || word}对进一步学习至关重要。`];
}

// 追加补充词汇 - 格式: [word, pos, meaning, difficulty]
const extraWords: [string, string, string, number][] = [
  // === 之前遗漏的常见CET-6词汇 ===
  ['abdomen','n.','腹部',4],['abreast','adv.','并肩地',5],['abstain','v.','弃权；戒除',5],
  ['academician','n.','院士',4],['accessory','n.','配件；附件',4],['acclaim','v.','称赞；喝彩',4],
  ['accountability','n.','问责制',4],['accrue','v.','积累',5],['ace','n.','王牌；佼佼者',3],
  ['acoustic','adj.','声学的',4],['addictive','adj.','上瘾的',3],['adhesive','n./adj.','黏合剂',4],
  ['adjoin','v.','毗邻',4],['adolescence','n.','青春期',3],['advent','n.','到来；出现',5],
  ['adversary','n.','对手',5],['aerial','adj./n.','空中的；天线',4],['affluent','adj.','富裕的',4],
  ['aftermath','n.','后果',5],['agitate','v.','煽动；搅动',4],['aide','n.','助手',3],
  ['ailment','n.','小病',4],['airborne','adj.','空运的',4],['akin','adj.','相似的',5],
  ['albeit','conj.','尽管',5],['alchemy','n.','炼金术',5],['allegation','n.','指控',4],
  ['allegiance','n.','忠诚',5],['allergy','n.','过敏',3],['alley','n.','小巷',3],
  ['allocate','v.','分配',3],['allot','v.','分配',5],['allowance','n.','津贴',3],
  ['allure','v.','诱惑',4],['ally','n.','盟友',3],['almighty','adj.','全能的',5],
  ['aloft','adv.','在高处',5],['alteration','n.','改变',4],['alternate','v./adj.','交替',4],
  ['amass','v.','积累',4],['amateur','n./adj.','业余爱好者',2],['ambassador','n.','大使',3],
  ['amber','n.','琥珀',4],['ambience','n.','氛围',4],['amend','v.','修改',4],
  ['amiable','adj.','和蔼的',4],['amid','prep.','在...之中',3],['ammunition','n.','弹药',5],
  ['ample','adj.','充足的',3],['amplify','v.','放大',4],['analogy','n.','类比',4],
  ['analyst','n.','分析师',3],['anarchist','n.','无政府主义者',5],['ancestor','n.','祖先',2],
  ['ancestry','n.','血统',4],['anchor','n./v.','锚；固定',3],['anecdote','n.','轶事',4],
  ['anguish','n.','极度痛苦',5],['animate','v./adj.','使有生命',4],['annex','v./n.','吞并',5],
  ['annihilate','v.','消灭',5],['annotate','v.','注释',4],['annual','adj.','年度的',2],
  ['anonymous','adj.','匿名的',3],['antenna','n.','天线',4],['anthropology','n.','人类学',4],
  ['antibody','n.','抗体',4],['antique','adj./n.','古董的；古董',3],['antonym','n.','反义词',4],
  ['ape','n./v.','猿；模仿',4],['apparatus','n.','仪器；装置',4],['appease','v.','安抚',5],
  ['appendix','n.','附录；阑尾',4],['applaud','v.','鼓掌；称赞',3],['appraisal','n.','评价',4],
  ['apprentice','n.','学徒',4],['approximate','adj.','近似的',3],['apt','adj.','恰当的；倾向于',4],
  ['arbitrary','adj.','任意的；专横的',3],['arc','n.','弧；弧形',4],['arch','n./v.','拱门；拱起',3],
  ['archaeology','n.','考古学',4],['architect','n.','建筑师',3],['ardent','adj.','热情的',4],
  ['arena','n.','竞技场；领域',3],['aristocrat','n.','贵族',4],['arithmetic','n.','算术',3],
  ['armor','n.','盔甲',4],['aroma','n.','芳香',4],['array','n./v.','一系列；排列',3],
  ['arrogant','adj.','傲慢的',3],['artery','n.','动脉',4],['articulate','v./adj.','清晰表达',4],
  ['artifact','n.','人造物',4],['artificial','adj.','人工的',2],['artillery','n.','大炮',5],
  ['ascend','v.','上升',4],['ascertain','v.','确定',5],['ascribe','v.','归因于',5],
  ['ashore','adv.','在岸上',4],['aspiration','n.','抱负',4],['aspire','v.','渴望',4],
  ['assassin','n.','刺客',5],['assault','n./v.','攻击',4],['assemble','v.','集合；组装',3],
  ['assert','v.','断言；主张',4],['assess','v.','评估',3],['asset','n.','资产；优势',3],
  ['assign','v.','分配；指派',2],['assimilate','v.','吸收；同化',5],['associate','v./n.','联系；同事',2],
  ['assorted','adj.','各种各样的',4],['assume','v.','假设；承担',2],['assurance','n.','保证；保险',4],
  ['asthma','n.','哮喘',4],['astronaut','n.','宇航员',3],['astronomy','n.','天文学',4],
  ['asylum','n.','避难所',5],['athletic','adj.','运动的',2],['atlas','n.','地图集',4],
  ['atrocity','n.','暴行',5],['attach','v.','附上；连接',2],['attain','v.','达到；获得',3],
  ['attendance','n.','出席；参加',3],['attendant','n.','服务员',3],['attic','n.','阁楼',4],
  ['attorney','n.','律师',3],['attribute','v./n.','归因于；属性',3],['auction','n./v.','拍卖',3],
  ['audit','n./v.','审计',4],['auditorium','n.','礼堂',4],['augment','v.','增加',5],
  ['authentic','adj.','真实的',3],['authoritative','adj.','权威的',4],['authorize','v.','授权',4],
  ['autobiography','n.','自传',4],['automate','v.','自动化',3],['autonomous','adj.','自治的',4],
  ['autonomy','n.','自治',4],['avail','v./n.','有益于',4],['avalanche','n.','雪崩',5],
  ['avert','v.','避免',4],['aviation','n.','航空',4],['awe','n./v.','敬畏',4],
  ['awesome','adj.','令人敬畏的',2],['axis','n.','轴',4],
  // === B 补充 ===
  ['backup','n.','备份',3],['bail','n./v.','保释',4],['bait','n.','诱饵',4],
  ['ballot','n./v.','投票',4],['bandit','n.','强盗',5],['banish','v.','放逐',5],
  ['bankruptcy','n.','破产',4],['baptism','n.','洗礼',5],['barbecue','n.','烧烤',2],
  ['barge','n.','驳船',5],['barley','n.','大麦',4],['barometer','n.','气压计',5],
  ['barrack','n.','兵营',5],['basin','n.','盆地；盆',2],['battalion','n.','营',5],
  ['batter','v./n.','连续猛击',4],['beacon','n.','灯塔',4],['bearing','n.','关系；轴承',4],
  ['bedrock','n.','基石',4],['beetle','n.','甲虫',4],['benevolent','adj.','仁慈的',5],
  ['benign','adj.','良性的',5],['besiege','v.','围困',5],['bestow','v.','授予',5],
  ['beverage','n.','饮料',3],['beware','v.','当心',3],['bibliography','n.','参考书目',4],
  ['bilateral','adj.','双边的',4],['bilingual','adj.','双语的',3],['billow','n./v.','巨浪；翻腾',5],
  ['bin','n.','箱子',3],['binary','adj.','二进制的',4],['binder','n.','粘合剂',4],
  ['biochemistry','n.','生物化学',4],['biodiversity','n.','生物多样性',3],['biopsy','n.','活检',5],
  ['bishop','n.','主教',4],['blackmail','n./v.','敲诈',4],['bladder','n.','膀胱',5],
  ['bland','adj.','平淡的',3],['blaze','v./n.','燃烧；火焰',4],['bleach','n./v.','漂白剂',4],
  ['blemish','n./v.','瑕疵',5],['blink','v.','眨眼',3],['bliss','n.','极乐',4],
  ['blister','n.','水泡',4],['bloc','n.','集团',4],['blockade','n./v.','封锁',5],
  ['blonde','adj./n.','金发的',2],['blot','v./n.','污渍',4],['bluff','v./n.','虚张声势',5],
];

console.log(`Inserting ${extraWords.length} extra words...`);
let n = 0;
db.run('BEGIN');
for (const [word, pos, meaning, diff] of extraWords) {
  try {
    iW.run([word, '', '', pos, diff, null, null, null]);
    const lid = db.exec('SELECT last_insert_rowid() as id');
    const wid = lid[0].values[0][0] as number;
    if (wid > 0) {
      iM.run([wid, meaning, null, null, 1]);
      const [en, cn] = makeExample(word, pos, meaning);
      iE.run([wid, en, cn, null, 'CET-6', '基础例句']);
      n++;
    }
  } catch(e) { /* skip duplicate */ }
}
db.run('COMMIT');
saveDb();
console.log(`Inserted ${n} extra words.`);

const r = db.exec('SELECT COUNT(*) FROM vocabulary');
console.log(`Total vocabulary: ${r[0].values[0][0]}`);
