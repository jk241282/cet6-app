import { initDb, getDb, saveDb } from './index.js';
import { initDatabase } from './init.js';

await initDatabase();
const db = getDb();

const iW = db.prepare('INSERT OR IGNORE INTO vocabulary (word,phonetic_us,phonetic_uk,part_of_speech,difficulty_level,frequency_rank,root_word,memory_tip) VALUES (?,?,?,?,?,?,?,?)');
const iM = db.prepare('INSERT INTO word_meanings (word_id,meaning_cn,meaning_en,usage_note,is_primary) VALUES (?,?,?,?,?)');
const iE = db.prepare('INSERT INTO word_examples (word_id,sentence_en,sentence_cn,exam_year,exam_type,source_section) VALUES (?,?,?,?,?,?)');
const iP = db.prepare('INSERT INTO word_phrases (word_id,phrase,meaning_cn,example_en,example_cn) VALUES (?,?,?,?,?)');
const iR = db.prepare('INSERT INTO word_relations (word_id,related_word,relation_type,nuance_cn) VALUES (?,?,?,?)');

const words: any[] = [
  { w:'vision',p:'/ˈvɪʒn/',pos:'n.',d:3,f:28,r:null,t:'vis(看)+ion→视力；远见',
    m:[{c:'视力；视觉',p:true},{c:'远见；愿景',p:false}],ex:[{en:'The company needs a leader with vision and creativity.',cn:'公司需要一位有远见和创造力的领导者。',y:'2023-06',t:'CET-6',s:'阅读'}],
    p:[{c:'field of vision',m:'视野'},{c:'a man of vision',m:'有远见的人'}],r:[{w:'sight',ty:'synonym'},{w:'blindness',ty:'antonym'}] },
  { w:'norm',p:'/nɔːrm/',pos:'n.',d:3,f:29,r:null,t:'norm(标准)→规范',
    m:[{c:'标准；规范',p:true},{c:'常态',p:false}],ex:[{en:'Social norms vary greatly from one culture to another.',cn:'社会规范因文化而异。',y:'2022-06',t:'CET-6',s:'阅读'}],
    p:[{c:'social norm',m:'社会规范'},{c:'deviation from the norm',m:'偏离常态'}],r:[{w:'standard',ty:'synonym'},{w:'exception',ty:'antonym'}] },
  { w:'transition',p:'/trænˈzɪʃn/',pos:'n./v.',d:4,f:30,r:'trans(穿过)+it(走)+ion',t:'trans+it+ion→穿过去→过渡',
    m:[{c:'过渡；转变',p:true}],ex:[{en:'The country is in transition from an agricultural to an industrial economy.',cn:'该国正处于从农业经济向工业经济的转型期。',y:'2021-12',t:'CET-6',s:'翻译'}],
    p:[{c:'in transition',m:'在过渡中'},{c:'smooth transition',m:'平稳过渡'}],r:[{w:'transformation',ty:'synonym'},{w:'stability',ty:'antonym'}] },
  { w:'overwhelm',p:'/ˌoʊvərˈwelm/',pos:'v.',d:4,f:31,r:'over(过度)+whelm(淹没)',t:'over+whelm→感情上使受不了',
    m:[{c:'使受不了；使不知所措',p:true},{c:'征服；击败',p:false}],ex:[{en:'She was overwhelmed with grief when she heard the news.',cn:'听到消息后她悲痛欲绝。',y:'2023-06',t:'CET-6',s:'阅读'}],
    p:[{c:'be overwhelmed by/with',m:'被...所淹没'},{c:'overwhelming majority',m:'压倒性多数'}],r:[{w:'overcome',ty:'synonym'},{w:'underwhelm',ty:'antonym'}] },
  { w:'exert',p:'/ɪɡˈzɜːrt/',pos:'v.',d:4,f:32,r:'ex(出)+ert(力量)',t:'ex+ert→使出力量→施加；发挥',
    m:[{c:'施加；发挥；运用',p:true}],ex:[{en:'Parents exert a powerful influence on their children\'s development.',cn:'父母对子女的发展产生着深远的影响。',y:'2022-12',t:'CET-6',s:'写作'}],
    p:[{c:'exert influence on',m:'对...施加影响'},{c:'exert pressure',m:'施加压力'},{c:'exert oneself',m:'努力；尽力'}],r:[{w:'apply',ty:'synonym'},{w:'yield',ty:'antonym'}] },
  { w:'disastrous',p:'/dɪˈzæstrəs/',pos:'adj.',d:3,f:33,r:'disaster(灾难)+ous',t:'disaster+ous→灾难性的',
    m:[{c:'灾难性的；极坏的',p:true}],ex:[{en:'The decision proved disastrous for the company.',cn:'这个决定对公司来说是灾难性的。',y:'2021-06',t:'CET-6',s:'阅读'}],
    p:[{c:'disastrous consequences',m:'灾难性后果'}],r:[{w:'catastrophic',ty:'synonym'},{w:'fortunate',ty:'antonym'}] },
  { w:'indispensable',p:'/ˌɪndɪˈspensəbl/',pos:'adj.',d:4,f:34,r:'in(不)+dispensable(可分配的)',t:'in+dispensable→不可分配的→不可或缺的',
    m:[{c:'不可或缺的；必需的',p:true}],ex:[{en:'Good communication skills are indispensable in the modern workplace.',cn:'良好的沟通技巧在现代职场中不可或缺。',y:'2024-06',t:'CET-6',s:'写作'}],
    p:[{c:'be indispensable to/for',m:'对...不可或缺'}],r:[{w:'essential',ty:'synonym'},{w:'dispensable',ty:'antonym'},{w:'unnecessary',ty:'antonym'}] },
  { w:'feasible',p:'/ˈfiːzəbl/',pos:'adj.',d:3,f:35,r:'feas(做)+ible(可…的)',t:'feas+ible→可以做的→可行的',
    m:[{c:'可行的；可实行的',p:true}],ex:[{en:'The project is technically feasible but financially challenging.',cn:'该项目在技术上是可行的，但在经济上具有挑战性。',y:'2023-12',t:'CET-6',s:'阅读'}],
    p:[{c:'feasible solution',m:'可行的解决方案'}],r:[{w:'practical',ty:'synonym'},{w:'impractical',ty:'antonym'}] },
  { w:'energetic',p:'/ˌenərˈdʒetɪk/',pos:'adj.',d:2,f:36,r:'energy(能量)+tic',t:'energy(能量)+tic→精力旺盛的',
    m:[{c:'精力旺盛的；充满活力的',p:true}],ex:[{en:'Young children are naturally energetic and curious.',cn:'小孩子天生就精力充沛、充满好奇。',y:'2022-06',t:'CET-6',s:'阅读'}],
    p:[{c:'energetic campaign',m:'积极的运动'}],r:[{w:'vigorous',ty:'synonym'},{w:'lethargic',ty:'antonym'}] },
  { w:'enroll',p:'/ɪnˈroʊl/',pos:'v.',d:3,f:37,r:'en(使进入)+roll(名册)',t:'en+roll→使进入名册→登记；参加',
    m:[{c:'登记；注册；参加',p:true}],ex:[{en:'More than 1,000 students have enrolled in the online course.',cn:'超过1000名学生已经报名参加了这门在线课程。',y:'2023-06',t:'CET-6',s:'阅读'}],
    p:[{c:'enroll in/on',m:'报名参加'}],r:[{w:'register',ty:'synonym'},{w:'withdraw',ty:'antonym'}] },
  { w:'impress',p:'/ɪmˈpres/',pos:'v.',d:2,f:38,r:'im(进入)+press(压)',t:'im+press→压进去→给…留下印象',
    m:[{c:'给…留下深刻印象',p:true},{c:'使铭记',p:false}],ex:[{en:'The candidate impressed the interviewers with her confidence and knowledge.',cn:'候选人用她的自信和知识给面试官留下了深刻印象。',y:'2024-06',t:'CET-6',s:'阅读'}],
    p:[{c:'be impressed by/with',m:'对...印象深刻'},{c:'impress upon sb',m:'使某人铭记'}],r:[{w:'influence',ty:'synonym'}] },
  { w:'claim',p:'/kleɪm/',pos:'v./n.',d:2,f:39,r:null,t:'clam(喊叫)→声称；要求',
    m:[{c:'声称；断言',p:true},{c:'要求；索赔',p:false},{c:'认领',p:false}],ex:[{en:'The scientist claims to have discovered a new species of plant.',cn:'这位科学家声称发现了一种新的植物物种。',y:'2023-12',t:'CET-6',s:'阅读'}],
    p:[{c:'claim responsibility',m:'声称负责'},{c:'insurance claim',m:'保险索赔'}],r:[{w:'assert',ty:'synonym'},{w:'deny',ty:'antonym'}] },
  { w:'switch',p:'/swɪtʃ/',pos:'v./n.',d:2,f:40,r:null,t:'联想：开关来回切换→转变',
    m:[{c:'转变；切换',p:true},{c:'开关',p:false}],ex:[{en:'Many consumers have switched to electric vehicles in recent years.',cn:'近年来许多消费者已转向使用电动汽车。',y:'2024-06',t:'CET-6',s:'阅读'}],
    p:[{c:'switch to',m:'转向'},{c:'switch on/off',m:'打开/关闭'}],r:[{w:'shift',ty:'synonym'}] },
];

db.run('BEGIN');
for (const w of words) {
  iW.run([w.w,w.p,w.p,w.pos,w.d,w.f,w.r,w.t]);
  const lid = db.exec('SELECT last_insert_rowid() as id');
  const wid = lid[0].values[0][0] as number;
  if (wid === 0) continue;
  for (const m of w.m||[]) iM.run([wid,m.c,m.e||null,null,m.p?1:0]);
  for (const e of w.ex||[]) iE.run([wid,e.en,e.cn,e.y,e.t,e.s]);
  for (const p of w.p||[]) iP.run([wid,p.c,p.m,null,null]);
  for (const r of w.r||[]) iR.run([wid,r.w,r.ty,r.n||null]);
}
db.run('COMMIT');
saveDb();
console.log(`Seeded ${words.length} additional vocabulary words.`);
