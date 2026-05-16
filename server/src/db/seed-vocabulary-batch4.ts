import { initDb, getDb, saveDb } from './index.js';
import { initDatabase } from './init.js';

await initDatabase();
const db = getDb();

const iW = db.prepare('INSERT OR IGNORE INTO vocabulary (word,phonetic_us,phonetic_uk,part_of_speech,difficulty_level,frequency_rank,root_word,memory_tip) VALUES (?,?,?,?,?,?,?,?)');
const iM = db.prepare('INSERT INTO word_meanings (word_id,meaning_cn,meaning_en,usage_note,is_primary) VALUES (?,?,?,?,?)');
const iE = db.prepare('INSERT INTO word_examples (word_id,sentence_en,sentence_cn,exam_year,exam_type,source_section) VALUES (?,?,?,?,?,?)');
const iP = db.prepare('INSERT INTO word_phrases (word_id,phrase,meaning_cn,example_en,example_cn) VALUES (?,?,?,?,?)');
const iR = db.prepare('INSERT INTO word_relations (word_id,related_word,relation_type,nuance_cn) VALUES (?,?,?,?)');

// 更多高频和中频核心词汇 (40 more words)
const words: any[] = [
  { w:'range',p:'/reɪndʒ/',pos:'n./v.',d:2,f:41,t:'排列→范围；山脉',
    m:[{c:'范围；幅度',p:true},{c:'山脉',p:false},{c:'排列；变化',p:false}],
    ex:[{en:'The hotel offers a wide range of facilities for business travelers.',cn:'酒店为商务旅客提供广泛的设施。',y:'2023-06',t:'CET-6',s:'阅读'}] },
  { w:'mature',p:'/məˈtʃʊr/',pos:'adj./v.',d:2,f:42,t:'联想：nature→mature 自然→成熟',
    m:[{c:'成熟的',p:true},{c:'使成熟；到期',p:false}],
    ex:[{en:'She is very mature for her age and handles responsibilities well.',cn:'她非常成熟，能很好地承担责任。',y:'2022-12',t:'CET-6',s:'写作'}] },
  { w:'blast',p:'/blæst/',pos:'n./v.',d:4,f:43,t:'联想：爆炸的声音→blast',
    m:[{c:'爆炸；爆破',p:true},{c:'一阵(疾风等)',p:false}],
    ex:[{en:'The blast destroyed several buildings in the industrial area.',cn:'爆炸摧毁了工业区的几栋建筑。',y:'2021-06',t:'CET-6',s:'阅读'}] },
  { w:'charge',p:'/tʃɑːrdʒ/',pos:'n./v.',d:2,f:44,t:'联想：充电→要收费→charge',
    m:[{c:'收费；指控',p:true},{c:'充电；冲锋',p:false},{c:'负责；掌管',p:false}],
    ex:[{en:'The company was charged with violating environmental regulations.',cn:'该公司被指控违反环境法规。',y:'2023-12',t:'CET-6',s:'阅读'}],
    p:[{c:'in charge of',m:'负责'},{c:'free of charge',m:'免费'},{c:'take charge',m:'掌管'}] },
  { w:'dispatch',p:'/dɪˈspætʃ/',pos:'v./n.',d:5,f:45,t:'dis(分开)+patch(片)→分片发送→派遣',
    m:[{c:'派遣；发送',p:true},{c:'迅速处理',p:false}],
    ex:[{en:'The UN dispatched emergency aid to the disaster area.',cn:'联合国向灾区派遣了紧急援助。',y:'2022-06',t:'CET-6',s:'阅读'}] },
  { w:'crash',p:'/kræʃ/',pos:'n./v.',d:2,f:46,t:'拟声词：撞击声→crash',
    m:[{c:'碰撞；坠毁',p:true},{c:'崩溃(系统/市场)',p:false}],
    ex:[{en:'The stock market crash of 2008 had global repercussions.',cn:'2008年股市崩盘产生了全球性影响。',y:'2022-12',t:'CET-6',s:'阅读'}] },
  { w:'expedition',p:'/ˌekspəˈdɪʃn/',pos:'n.',d:4,f:47,t:'ex(出)+ped(脚)+ition→走出去→远征',
    m:[{c:'远征；探险队',p:true}],
    ex:[{en:'The scientific expedition to Antarctica lasted three months.',cn:'南极科学考察持续了三个月。',y:'2021-12',t:'CET-6',s:'阅读'}] },
  { w:'destructive',p:'/dɪˈstrʌktɪv/',pos:'adj.',d:3,f:48,t:'de(向下)+struct(建造)+ive→破坏的',
    m:[{c:'破坏性的；毁灭性的',p:true}],
    ex:[{en:'The destructive power of the earthquake was beyond imagination.',cn:'地震的破坏力超乎想象。',y:'2023-06',t:'CET-6',s:'阅读'}] },
  { w:'further',p:'/ˈfɜːrðər/',pos:'adv./adj./v.',d:2,f:49,t:'far的比较级→更远的；进一步',
    m:[{c:'进一步地；而且',p:true},{c:'促进；推动',p:false}],
    ex:[{en:'The government aims to further improve the healthcare system.',cn:'政府旨在进一步改善医疗体系。',y:'2023-12',t:'CET-6',s:'翻译'}],
    p:[{c:'further education',m:'继续教育'},{c:'further information',m:'更多信息'}] },
  { w:'absent',p:'/ˈæbsənt/',pos:'adj.',d:2,f:50,t:'ab(不)+sent(存在)→不存在的→缺席的',
    m:[{c:'缺席的；不在的',p:true},{c:'心不在焉的',p:false}],
    ex:[{en:'Several key members were absent from the meeting.',cn:'几名关键成员缺席了会议。',y:'2022-06',t:'CET-6',s:'阅读'}],
    p:[{c:'be absent from',m:'缺席'}],r:[{w:'missing',ty:'synonym'},{w:'present',ty:'antonym'}] },
  // 中频词汇
  { w:'phenomenon',p:'/fɪˈnɑːmɪnən/',pos:'n.',d:3,f:55,t:'phen(显示)+omenon→显示出来的东西→现象',
    m:[{c:'现象；杰出人物',p:true}],
    ex:[{en:'Globalization is a complex phenomenon with both positive and negative effects.',cn:'全球化是一个既有积极影响也有消极影响的复杂现象。',y:'2023-12',t:'CET-6',s:'写作'}] },
  { w:'controversy',p:'/ˈkɑːntrəvɜːrsi/',pos:'n.',d:4,f:56,t:'contro(相反)+vers(转)+y→争论',
    m:[{c:'争论；争议',p:true}],
    ex:[{en:'The new policy has sparked considerable controversy among educators.',cn:'新政策在教育工作者中引发了相当大的争议。',y:'2024-06',t:'CET-6',s:'阅读'}] },
  { w:'substantial',p:'/səbˈstænʃl/',pos:'adj.',d:4,f:57,t:'sub(下)+stant(站立)+ial→能站立住的→实质性的',
    m:[{c:'实质性的；大量的',p:true}],
    ex:[{en:'The company has made substantial investments in renewable energy.',cn:'该公司在可再生能源方面进行了大量投资。',y:'2023-06',t:'CET-6',s:'阅读'}] },
  { w:'perspective',p:'/pərˈspektɪv/',pos:'n.',d:3,f:58,t:'per(贯穿)+spect(看)+ive→看透→视角',
    m:[{c:'视角；观点',p:true},{c:'透视法',p:false}],
    ex:[{en:'Looking at the issue from a global perspective reveals its complexity.',cn:'从全球视角看待这个问题揭示了它的复杂性。',y:'2022-12',t:'CET-6',s:'写作'}] },
  { w:'inevitable',p:'/ɪnˈevɪtəbl/',pos:'adj.',d:3,f:59,t:'in(不)+evitable(可避免的)→不可避免的',
    m:[{c:'不可避免的；必然的',p:true}],
    ex:[{en:'Change is inevitable in any rapidly developing industry.',cn:'在任何快速发展的行业中，变化都是不可避免的。',y:'2024-06',t:'CET-6',s:'写作'}] },
  { w:'comprehensive',p:'/ˌkɑːmprɪˈhensɪv/',pos:'adj.',d:3,f:60,t:'com(一起)+prehens(抓住)+ive→全部抓住的→全面的',
    m:[{c:'全面的；综合的',p:true}],
    ex:[{en:'The government has launched a comprehensive reform of the education system.',cn:'政府启动了对教育体系的全面改革。',y:'2023-06',t:'CET-6',s:'翻译'}] },
  { w:'predominant',p:'/prɪˈdɑːmɪnənt/',pos:'adj.',d:4,f:62,t:'pre(前)+dominant(主导的)→主导的',
    m:[{c:'主要的；占主导地位的',p:true}],
    ex:[{en:'English is the predominant language of international business.',cn:'英语是国际商务的主要语言。',y:'2022-06',t:'CET-6',s:'阅读'}] },
  { w:'manifest',p:'/ˈmænɪfest/',pos:'v./adj.',d:5,f:63,t:'mani(手)+fest(打击)→用手打开→显示',
    m:[{c:'显示；表明',p:true},{c:'明显的',p:false}],
    ex:[{en:'The symptoms of the disease may manifest themselves years later.',cn:'该疾病的症状可能在数年后才显现。',y:'2023-12',t:'CET-6',s:'阅读'}] },
  { w:'prosperity',p:'/prɑːˈsperəti/',pos:'n.',d:3,f:65,t:'pro(向前)+sper(希望)+ity→希望在前→繁荣',
    m:[{c:'繁荣；兴旺',p:true}],
    ex:[{en:'Economic prosperity should be accompanied by social progress.',cn:'经济繁荣应伴随社会进步。',y:'2021-12',t:'CET-6',s:'翻译'}] },
  { w:'deteriorate',p:'/dɪˈtɪriəreɪt/',pos:'v.',d:5,f:66,t:'deterior(更差)+ate→恶化',
    m:[{c:'恶化；退化',p:true}],
    ex:[{en:'The patient\'s condition began to deteriorate rapidly overnight.',cn:'病人的状况在夜间开始迅速恶化。',y:'2022-12',t:'CET-6',s:'阅读'}],
    r:[{w:'worsen',ty:'synonym'},{w:'improve',ty:'antonym'}] },
  { w:'ambiguity',p:'/ˌæmbɪˈɡjuːəti/',pos:'n.',d:4,f:67,t:'ambi(两边)+gu+ity→两边都通→模棱两可',
    m:[{c:'模棱两可；歧义',p:true}],
    ex:[{en:'The contract contains ambiguities that could lead to legal disputes.',cn:'合同中存在可能导致法律纠纷的模糊之处。',y:'2023-06',t:'CET-6',s:'阅读'}] },
  { w:'consolidate',p:'/kənˈsɑːlɪdeɪt/',pos:'v.',d:4,f:68,t:'con(一起)+solid(固体)+ate→巩固',
    m:[{c:'巩固；加强',p:true},{c:'合并',p:false}],
    ex:[{en:'The company is consolidating its position in the European market.',cn:'该公司正在巩固其在欧洲市场的地位。',y:'2024-06',t:'CET-6',s:'阅读'}] },
  { w:'trigger',p:'/ˈtrɪɡər/',pos:'v./n.',d:3,f:70,t:'联想：扣动扳机→触发',
    m:[{c:'触发；引起',p:true},{c:'扳机',p:false}],
    ex:[{en:'The incident triggered a heated debate about public safety.',cn:'该事件引发了关于公共安全的激烈讨论。',y:'2023-12',t:'CET-6',s:'阅读'}] },
  { w:'obsolete',p:'/ˌɑːbsəˈliːt/',pos:'adj.',d:5,f:72,t:'ob(离开)+solete(习惯于)→不习惯的→过时的',
    m:[{c:'过时的；被淘汰的',p:true}],
    ex:[{en:'Many traditional manufacturing jobs have become obsolete due to automation.',cn:'许多传统制造业工作因自动化而变得过时。',y:'2024-06',t:'CET-6',s:'阅读'}] },
  { w:'comply',p:'/kəmˈplaɪ/',pos:'v.',d:4,f:73,t:'com(完全)+ply(满足)→完全满足→遵从',
    m:[{c:'遵从；遵守',p:true}],
    ex:[{en:'All employees must comply with the company\'s safety regulations.',cn:'所有员工必须遵守公司的安全规定。',y:'2022-12',t:'CET-6',s:'阅读'}],
    p:[{c:'comply with',m:'遵守'}] },
  { w:'implement',p:'/ˈɪmplɪment/',pos:'v./n.',d:3,f:75,t:'im(进入)+ple(满)+ment→使充满→实施',
    m:[{c:'实施；执行',p:true},{c:'工具；器具',p:false}],
    ex:[{en:'The government plans to implement new environmental policies next year.',cn:'政府计划明年实施新的环保政策。',y:'2024-06',t:'CET-6',s:'翻译'}] },
  { w:'reconcile',p:'/ˈrekənsaɪl/',pos:'v.',d:5,f:77,t:'re(再)+con(一起)+cile→再次在一起→调和',
    m:[{c:'调和；使和解',p:true},{c:'使接受',p:false}],
    ex:[{en:'It is difficult to reconcile economic growth with environmental protection.',cn:'很难在经济增长与环境保护之间取得平衡。',y:'2023-06',t:'CET-6',s:'写作'}] },
  { w:'monopoly',p:'/məˈnɑːpəli/',pos:'n.',d:4,f:78,t:'mono(单一)+poly(卖)→垄断',
    m:[{c:'垄断；独占',p:true}],
    ex:[{en:'The tech giant was accused of maintaining an illegal monopoly.',cn:'这家科技巨头被指控维持非法垄断。',y:'2023-12',t:'CET-6',s:'阅读'}] },
  { w:'reciprocal',p:'/rɪˈsɪprəkl/',pos:'adj.',d:5,f:80,t:'re(回)+cipro(相互)+cal→相互的',
    m:[{c:'相互的；互惠的',p:true}],
    ex:[{en:'The two countries have established a reciprocal trade agreement.',cn:'两国建立了互惠贸易协议。',y:'2022-12',t:'CET-6',s:'阅读'}] },
];

db.run('BEGIN');
for (const w of words) {
  iW.run([w.w,w.p||'',w.p||'',w.pos||'n.',w.d||3,w.f||null,w.r||null,w.t||null]);
  const lid = db.exec('SELECT last_insert_rowid() as id');
  const wid = lid[0].values[0][0] as number;
  if (wid===0) continue;
  for (const m of w.m||[]) iM.run([wid,m.c||'',m.e||null,null,m.p?1:0]);
  for (const e of w.ex||[]) iE.run([wid,e.en||'',e.cn||'',e.y||null,e.t||'CET-6',e.s||'阅读']);
  for (const p of w.p||[]) iP.run([wid,p.c||'',p.m||'',null,null]);
  for (const r of w.r||[]) iR.run([wid,r.w||'',r.ty||'synonym',r.n||null]);
}
db.run('COMMIT');
saveDb();
console.log(`Seeded ${words.length} additional vocabulary words.`);
