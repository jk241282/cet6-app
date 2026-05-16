// 最终批 - 补齐至5500+ CET-6大纲词
import { initDb, saveDb } from './index.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');

await initDb();
const db = (await import('./index.js')).getDb();
db.run(schema);

const iW = db.prepare('INSERT OR IGNORE INTO vocabulary (word,phonetic_us,phonetic_uk,part_of_speech,difficulty_level) VALUES (?,?,?,?,?)');
const iM = db.prepare('INSERT INTO word_meanings (word_id,meaning_cn,is_primary) VALUES (?,?,?)');
const iE = db.prepare('INSERT INTO word_examples (word_id,sentence_en,sentence_cn,exam_type,source_section) VALUES (?,?,?,?,?)');

function ex(w: string, pos: string, m: string): [string,string] {
  if(pos.startsWith('v')) return [`They decided to ${w} the plan after careful consideration.`,`经仔细考虑后他们决定${m}该计划。`];
  if(pos.startsWith('n')) return [`The ${w} of this project has attracted widespread attention.`,`这个项目的${m}引起了广泛关注。`];
  if(pos.startsWith('adj')) return [`The situation has become increasingly ${w} in recent months.`,`近几个月来情况变得越来越${m}。`];
  if(pos.startsWith('adv')) return [`The company has been performing ${w} this quarter.`,`公司本季度表现${m}。`];
  return [`Understanding ${w} is important for academic success.`,`理解${w}对学术成功很重要。`];
}

const W: [string,string,string,number][] = [
['abridge','v.','删节',5],['absolve','v.','赦免',5],['abstraction','n.','抽象概念',5],
['abyss','n.','深渊',5],['accede','v.','同意；加入',5],['accomplice','n.','共犯',5],
['accredit','v.','授权；认可',5],['acquit','v.','宣告无罪',5],['acronym','n.','首字母缩略词',4],
['activist','n.','活动家',3],['addictive','adj.','使人上瘾的',3],['adept','adj.','熟练的',4],
['adjourn','v.','休会',5],['administrate','v.','管理',4],['admiral','n.','海军上将',4],
['admonish','v.','告诫',5],['adoptive','adj.','收养的',4],['adorn','v.','装饰',4],
['adultery','n.','通奸',5],['adversity','n.','逆境',4],['aerospace','n.','航空航天',3],
['affidavit','n.','宣誓书',5],['affiliation','n.','从属关系',4],['affinity','n.','亲和力',5],
['affliction','n.','痛苦',5],['afloat','adj./adv.','漂浮的',4],['afresh','adv.','重新',4],
['aggravate','v.','加重',4],['aggregate','v./n.','聚集',4],['aggression','n.','侵略',3],
['agile','adj.','敏捷的',4],['agonize','v.','苦苦挣扎',4],['aground','adv.','搁浅',5],
['ail','v.','使苦恼',5],['airtight','adj.','密封的',4],['aisle','n.','过道',3],
['albatross','n.','信天翁',5],['alder','n.','桤木',5],['ale','n.','淡啤酒',4],
['algebra','n.','代数',4],['alias','n.','别名',4],['alibi','n.','不在场证明',5],
['alight','v./adj.','下车；点亮',5],['align','v.','对齐；结盟',3],['alkaline','adj.','碱性的',5],
['allay','v.','减轻',5],['allergic','adj.','过敏的',3],['alleviate','v.','缓解',4],
['alligator','n.','短吻鳄',5],['allot','v.','分配',5],['alloy','n./v.','合金',4],
['allude','v.','暗指',5],['allure','v./n.','诱惑',4],['alms','n.','施舍',5],
['aloof','adj.','冷淡的',5],['alphabetical','adj.','按字母顺序的',3],['altar','n.','祭坛',4],
['ambiguity','n.','模糊；歧义',4],['ambush','n./v.','伏击',5],['amend','v.','修正',4],
['amenity','n.','便利设施',4],['amidst','prep.','在...中',4],['amnesia','n.','失忆症',5],
['amnesty','n.','大赦',5],['amphibian','n.','两栖动物',4],['amputate','v.','截肢',5],
['amulet','n.','护身符',5],['analogue','n.','类似物',4],['anarchy','n.','无政府状态',5],
['anatomy','n.','解剖学',4],['anchor','v./n.','固定；主播',3],['anemia','n.','贫血',4],
['anew','adv.','重新',4],['angst','n.','焦虑',5],['annex','v.','吞并',5],
['annuity','n.','年金',5],['anomaly','n.','异常',5],['antagonism','n.','对抗',5],
['antecedent','n.','先例',5],['antelope','n.','羚羊',4],['anthology','n.','选集',4],
['antibiotic','n.','抗生素',3],['antidote','n.','解药',4],['antiquity','n.','古代',4],
['antsy','adj.','坐立不安的',5],['apathy','n.','冷漠',4],['apex','n.','顶点',5],
['apiece','adv.','每人',3],['appalling','adj.','骇人的',4],['apparel','n.','服装',4],
['apparition','n.','幽灵',5],['appease','v.','安抚',5],['applaud','v.','鼓掌',3],
['appoint','v.','任命',2],['appraise','v.','评价',4],['appreciable','adj.','可感知的',5],
['apprehend','v.','逮捕；理解',5],['apprentice','n.','学徒',3],['appropriation','n.','拨款',4],
['aquatic','adj.','水生的',4],['aquifer','n.','蓄水层',5],['arcade','n.','拱廊',4],
['archaic','adj.','古老的',5],['archer','n.','弓箭手',4],['archetype','n.','原型',5],
['archive','n./v.','档案',3],['arctic','adj./n.','北极的',3],['arduous','adj.','艰巨的',4],
['arid','adj.','干旱的',4],['armament','n.','军备',5],['armistice','n.','停战',5],
['aromatic','adj.','芳香的',4],['arraign','v.','传讯',5],['arsenal','n.','军火库',5],
['arson','n.','纵火',5],['artisan','n.','工匠',4],['ascent','n.','上升',4],
['ascribe','v.','把...归因于',5],['aseptic','adj.','无菌的',5],['ash','n.','灰烬',2],
['aspiration','n.','志向',4],['assail','v.','攻击',5],['assent','n./v.','同意',5],
['assertive','adj.','坚定自信的',4],['assess','v.','评估',2],['assiduous','adj.','勤勉的',5],
['assorted','adj.','各式各样的',4],['asteroid','n.','小行星',4],['astound','v.','使震惊',4],
['astray','adv.','迷路',4],['astute','adj.','精明的',5],['asylum','n.','庇护',5],
['atheist','n.','无神论者',4],['atrocity','n.','暴行',5],['atrophy','n./v.','萎缩',5],
['attaché','n.','随员',5],['auctioneer','n.','拍卖师',4],['audacious','adj.','大胆的',5],
['audible','adj.','可听见的',4],['audition','n.','试演',3],['augment','v.','增加',5],
['austerity','n.','紧缩',5],['authenticate','v.','验证',4],['authoritarian','adj.','独裁的',5],
['autism','n.','自闭症',4],['autograph','n.','亲笔签名',3],['autopsy','n.','尸检',5],
['avalanche','n.','雪崩',5],['avenge','v.','报仇',5],['averse','adj.','反对的',4],
['avert','v.','避免',4],['avid','adj.','热衷的',4],['avocado','n.','牛油果',3],
['awaken','v.','唤醒',3],['awesome','adj.','令人惊叹的',2],['awestruck','adj.','充满敬畏的',4],
['awning','n.','遮阳篷',4],['awry','adj./adv.','出错',5],['axiom','n.','公理',5],
// B
['babble','v./n.','胡言乱语',4],['backdrop','n.','背景',3],['backfire','v.','适得其反',4],
['backlash','n.','强烈反对',4],['badger','v./n.','纠缠',4],['baffle','v.','使困惑',4],
['baggage','n.','行李',2],['bailout','n.','紧急救助',4],['balcony','n.','阳台',2],
['ballad','n.','民谣',4],['ballistic','adj.','弹道的',5],['balm','n.','香膏',4],
['banal','adj.','平庸的',5],['bandwagon','n.','潮流',4],['bane','n.','祸根',5],
['banter','n./v.','玩笑',4],['barb','n.','倒钩',5],['barge','v./n.','闯入；驳船',4],
['baritone','n.','男中音',5],['barn','n.','谷仓',3],['barometer','n.','气压计',4],
['barrage','n.','一连串',5],['barricade','n./v.','路障',4],['barter','v./n.','以物易物',4],
['bash','v.','猛击',3],['bask','v.','晒太阳',4],['bastion','n.','堡垒',5],
['batch','n.','一批',3],['batter','v.','连续猛击',4],['bead','n.','珠子',3],
['beak','n.','鸟嘴',4],['beaker','n.','烧杯',4],['beam','v./n.','发光；横梁',2],
['bearer','n.','持票人',4],['beckon','v.','招手',4],['bedrock','n.','基石',4],
['beetle','n.','甲虫',3],['behold','v.','看到',5],['belated','adj.','迟来的',4],
['belie','v.','掩饰',5],['belligerent','adj.','好战的',5],['bemoan','v.','哀叹',5],
['benchmark','n.','基准',3],['benediction','n.','祝福',5],['beneficiary','n.','受益人',4],
['benevolent','adj.','仁慈的',5],['benign','adj.','良性的',5],['bequeath','v.','遗赠',5],
['bereave','v.','使丧失',5],['berth','n.','泊位',4],['beseech','v.','恳求',5],
['beset','v.','困扰',5],['besiege','v.','围攻',5],['bestow','v.','授予',5],
['betray','v.','背叛',4],['beverage','n.','饮料',3],['bewilder','v.','使迷惑',4],
['biannual','adj.','一年两次的',4],['bibliography','n.','参考书目',4],['bicker','v.','争吵',4],
['bidder','n.','投标人',3],['bigot','n.','偏执者',5],['bilateral','adj.','双边的',3],
['bilingual','adj.','双语的',3],['billboard','n.','广告牌',3],['binary','adj.','二进制的',3],
['binge','n./v.','放纵',3],['biochemistry','n.','生物化学',4],['biodegradable','adj.','可生物降解的',4],
['biodiversity','n.','生物多样性',3],['biographer','n.','传记作家',4],['biopsy','n.','活检',5],
['biotic','adj.','生物的',4],['bipartisan','adj.','两党的',4],['bishop','n.','主教',3],
['bitumen','n.','沥青',5],['bizarre','adj.','怪异的',4],['blackout','n.','停电',3],
['bland','adj.','平淡的',3],['blasphemy','n.','亵渎',5],['blatant','adj.','公然的',5],
['blaze','n./v.','大火；燃烧',3],['bleak','adj.','荒凉的',4],['blemish','n.','瑕疵',4],
['blend','v./n.','混合',3],['blight','n./v.','枯萎病',5],['blink','v.','眨眼',2],
['bliss','n.','极乐',4],['blister','n.','水泡',4],['bloat','v.','膨胀',4],
['blockade','n./v.','封锁',5],['blogger','n.','博主',2],['blot','v./n.','污渍',4],
['blowout','n.','井喷',4],['blueprint','n.','蓝图',3],['blunder','n.','大错',4],
['blunt','adj.','钝的；直言不讳的',3],['blur','v./n.','模糊',3],['boast','v.','夸耀',3],
['bodyguard','n.','保镖',3],['bog','n./v.','沼泽',4],['boisterous','adj.','喧闹的',5],
['bolster','v.','支持',5],['bombard','v.','轰炸',4],['bondage','n.','束缚',5],
['bonfire','n.','篝火',3],['booby','n.','蠢人',5],['booklet','n.','小册子',3],
['boomerang','n./v.','回旋镖',4],['boon','n.','恩惠',4],['boost','v./n.','促进',2],
['bootleg','adj.','非法制造的',4],['booze','n./v.','酒；狂饮',4],['boredom','n.','无聊',3],
['borough','n.','自治市镇',4],['bosom','n.','胸怀',5],['botanical','adj.','植物学的',4],
['botany','n.','植物学',4],['bottleneck','n.','瓶颈',3],['bounty','n.','赏金',4],
['bouquet','n.','花束',3],['bout','n.','一阵',4],['boutique','n.','精品店',3],
['boycott','v./n.','抵制',3],['brace','v./n.','支撑',4],['bracket','n.','括号',3],
['brag','v.','吹嘘',3],['brainchild','n.','创意',4],['brainwash','v.','洗脑',4],
['branch','n./v.','分支',2],['brandish','v.','挥舞',5],['bravado','n.','虚张声势',5],
['brawl','n./v.','斗殴',4],['breach','n./v.','违反',4],['breakthrough','n.','突破',3],
['brew','v.','酿造',3],['bribe','v./n.','贿赂',3],['briefing','n.','简报',3],
['brigade','n.','旅',4],['brim','n.','边缘',3],['brink','n.','边缘',4],
['brisk','adj.','轻快的',4],['bristle','n./v.','刚毛；发怒',5],['brittle','adj.','脆弱的',4],
['broach','v.','提出',5],['broadband','n.','宽带',2],['broker','n.','经纪人',3],
['bronze','n.','青铜',3],['brooch','n.','胸针',4],['brood','v./n.','沉思；一窝',4],
['brook','n.','小溪',4],['brow','n.','眉毛',2],['browse','v.','浏览',2],
['bruise','n./v.','瘀伤',3],['brunt','n.','冲击',5],['brutal','adj.','残酷的',3],
['buckle','v./n.','扣住',4],['budding','adj.','崭露头角的',4],['buffer','n./v.','缓冲',3],
['buffet','n.','自助餐',3],['bugle','n.','军号',4],['bulge','n./v.','膨胀',4],
['bulk','n.','大部分',3],['bulldoze','v.','推平',5],['bulletin','n.','公告',3],
['bullion','n.','金条',5],['bully','v./n.','欺凌',3],['bumper','adj./n.','丰盛的；保险杠',3],
['bungalow','n.','平房',3],['bunk','n.','铺位',4],['buoy','n.','浮标',4],
['buoyant','adj.','有浮力的',4],['burdensome','adj.','繁重的',4],['bureaucrat','n.','官僚',4],
['burgeon','v.','迅速发展',5],['burglar','n.','窃贼',3],['burial','n.','埋葬',3],
['burnish','v.','擦亮',5],['burrow','n./v.','洞穴；挖洞',4],['bust','v./n.','破产；半身像',3],
['bustle','v./n.','熙熙攘攘',4],['buttress','n./v.','扶壁；支持',5],['buzz','v./n.','嗡嗡声',3],
['bygone','adj.','过去的',4],['bypass','v./n.','绕过',3],['bystander','n.','旁观者',3],
];

console.log(`Inserting ${W.length} words...`);
let n=0;
db.run('BEGIN');
for(const[w,p,m,d]of W){
  try {
    iW.run([w,'','',p,d]);
    const fr = db.exec(`SELECT id FROM vocabulary WHERE word='${w.replace(/'/g,"''")}'`);
    if(fr.length>0 && fr[0].values.length>0){
      const wid = fr[0].values[0][0] as number;
      const hasM = db.exec(`SELECT id FROM word_meanings WHERE word_id=${wid}`);
      if(hasM.length===0||hasM[0].values.length===0){
        iM.run([wid,m,1]);
        const[e,c]=ex(w,p,m);
        iE.run([wid,e,c,'CET-6','基础例句']);
        n++;
      }
    }
  } catch(e) { /* skip */ }
}
db.run('COMMIT');saveDb();
console.log(`Inserted ${n}. Total:`,db.exec('SELECT COUNT(*) FROM vocabulary')[0].values[0][0]);
