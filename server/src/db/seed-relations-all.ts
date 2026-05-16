// 为全部缺失近反义关系的词汇补充关系
import { initDb, getDb, saveDb } from './index.js';
import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url';
const __dirname=path.dirname(fileURLToPath(import.meta.url));
await initDb(); const db=getDb();
db.run(fs.readFileSync(path.join(__dirname,'schema.sql'),'utf-8'));

const iR=db.prepare('INSERT OR IGNORE INTO word_relations (word_id,related_word,relation_type) VALUES (?,?,?)');

// 按词性/语义分类的通用近反义
const commonSyn:[string,RegExp,string[],string[]][]=[
  // 正面/负面形容词
  ['adj+',/good|great|excellent|wonderful|positive|nice|fine|superb|outstanding|splendid|favorable|beneficial|advantageous|profitable|rewarding/,['beneficial','favorable','positive','advantageous'],['harmful','negative','detrimental']],
  ['adj-',/bad|poor|terrible|awful|horrible|dreadful|negative|harmful|damaging|detrimental|disadvantageous/,['harmful','negative','detrimental','unfavorable'],['beneficial','positive','favorable']],
  ['adj+',/important|significant|crucial|vital|essential|critical|key|major|fundamental/,['important','significant','essential','vital'],['unimportant','trivial','minor']],
  ['adj+',/large|big|huge|enormous|massive|vast|giant|immense|tremendous|great/,['large','enormous','vast','immense'],['small','tiny','minute']],
  ['adj-',/small|tiny|little|minute|minor|slight/,['small','tiny','minor','slight'],['large','huge','enormous']],
  ['adj+',/beautiful|pretty|lovely|gorgeous|attractive|handsome|elegant|stunning/,['beautiful','attractive','elegant','gorgeous'],['ugly','unattractive','hideous']],
  ['adj+',/smart|clever|intelligent|bright|wise|brilliant|talented|gifted/,['intelligent','clever','bright','wise'],['stupid','foolish','dull']],
  ['adj-',/stupid|foolish|silly|dumb|ridiculous|absurd/,['foolish','absurd','ridiculous'],['intelligent','wise','sensible']],
  ['adj+',/brave|courageous|bold|fearless|heroic|daring/,['brave','courageous','bold','fearless'],['cowardly','timid','fearful']],
  ['adj+',/kind|nice|friendly|gentle|warm|considerate|thoughtful|generous/,['kind','friendly','generous','considerate'],['cruel','unkind','mean']],
  ['adj-',/cruel|mean|unkind|ruthless|merciless|brutal/,['cruel','ruthless','brutal'],['kind','merciful','compassionate']],
  ['adj+',/happy|glad|pleased|delighted|cheerful|joyful|content|satisfied/,['happy','cheerful','delighted','satisfied'],['sad','unhappy','miserable']],
  ['adj-',/sad|unhappy|miserable|depressed|sorrowful|gloomy|melancholy/,['sad','miserable','gloomy'],['happy','cheerful','delighted']],
  ['adj+',/strong|powerful|mighty|sturdy|robust|tough|solid|firm/,['strong','powerful','robust','sturdy'],['weak','feeble','fragile']],
  ['adj-',/weak|feeble|fragile|frail|delicate|vulnerable|brittle/,['weak','fragile','vulnerable','feeble'],['strong','robust','sturdy']],
  ['adj+',/fast|quick|rapid|swift|speedy|prompt/,['fast','rapid','swift','quick'],['slow','sluggish','gradual']],
  ['adj-',/slow|sluggish|gradual|leisurely|tardy|delayed/,['slow','gradual','sluggish'],['fast','rapid','quick']],
  ['adj+',/rich|wealthy|affluent|prosperous|well-off/,['rich','wealthy','affluent','prosperous'],['poor','impoverished','destitute']],
  ['adj-',/poor|needy|impoverished|destitute|penniless/,['poor','impoverished','destitute'],['rich','wealthy','affluent']],
  ['adj+',/easy|simple|straightforward|effortless|simple/,['easy','simple','straightforward'],['difficult','hard','complex']],
  ['adj-',/difficult|hard|tough|challenging|complex|complicated/,['difficult','hard','challenging','complex'],['easy','simple','straightforward']],
  ['adj+',/new|novel|fresh|modern|recent|innovative|original/,['new','novel','innovative','modern'],['old','ancient','outdated']],
  ['adj-',/old|ancient|aged|elderly|outdated|obsolete|antique/,['old','ancient','outdated'],['new','modern','innovative']],
  ['adj+',/safe|secure|protected|guarded|sheltered/,['safe','secure','protected'],['dangerous','risky','unsafe']],
  ['adj-',/dangerous|risky|unsafe|hazardous|perilous|threatening/,['dangerous','risky','hazardous'],['safe','secure','protected']],
  ['adj+',/true|real|genuine|authentic|actual|factual|legitimate/,['true','genuine','authentic','real'],['false','fake','counterfeit']],
  ['adj-',/false|fake|untrue|bogus|counterfeit|artificial/,['false','fake','counterfeit'],['true','genuine','authentic']],
  ['adj+',/clear|obvious|evident|apparent|plain|distinct|transparent/,['clear','obvious','evident','apparent'],['unclear','vague','obscure']],
  ['adj-',/vague|unclear|obscure|ambiguous|fuzzy|blurry|dim/,['vague','unclear','obscure','ambiguous'],['clear','obvious','evident']],
  // 动作/过程
  ['v+',/increase|rise|grow|expand|extend|enlarge|boost|enhance|improve|raise|elevate/,['increase','expand','enhance','improve'],['decrease','reduce','diminish']],
  ['v-',/decrease|reduce|drop|fall|decline|shrink|diminish|lessen|lower|cut/,['decrease','reduce','decline','diminish'],['increase','expand','enhance']],
  ['v+',/create|make|build|construct|produce|generate|establish|form|develop|design/,['create','build','produce','establish'],['destroy','demolish','ruin']],
  ['v-',/destroy|ruin|demolish|wreck|devastate|damage|harm|break|shatter/,['destroy','ruin','damage','harm'],['create','build','repair','restore']],
  ['v+',/begin|start|commence|initiate|launch|open|undertake|embark/,['begin','start','initiate','launch'],['end','finish','stop','terminate']],
  ['v-',/end|finish|stop|cease|halt|terminate|conclude|complete|quit/,['end','stop','finish','terminate'],['begin','start','initiate']],
  ['v+',/help|aid|assist|support|encourage|facilitate|promote|boost/,['help','assist','support','encourage'],['hinder','obstruct','impede']],
  ['v-',/hinder|obstruct|block|prevent|stop|impede|hamper|inhibit/,['hinder','obstruct','prevent','block'],['help','assist','facilitate']],
  ['v+',/accept|receive|take|adopt|approve|agree|embrace|welcome/,['accept','receive','adopt','approve'],['reject','refuse','decline','deny']],
  ['v-',/reject|refuse|decline|deny|dismiss|oppose|resist|protest/,['reject','refuse','decline','deny'],['accept','approve','agree']],
  ['n+',/success|achievement|triumph|victory|accomplishment|feat/,['success','achievement','triumph','victory'],['failure','defeat','loss']],
  ['n-',/failure|defeat|loss|setback|collapse|breakdown|disaster|catastrophe/,['failure','defeat','loss','disaster'],['success','achievement','triumph']],
  ['n+',/advantage|benefit|gain|profit|merit|strength|asset|plus/,['advantage','benefit','gain','asset'],['disadvantage','drawback','weakness']],
  ['n-',/disadvantage|drawback|weakness|flaw|defect|shortcoming|handicap/,['disadvantage','drawback','weakness','flaw'],['advantage','benefit','strength']],
  ['n+',/peace|harmony|calm|tranquility|serenity|order|stability/,['peace','harmony','calm','stability'],['war','conflict','chaos','disorder']],
  ['n-',/war|conflict|chaos|disorder|violence|turmoil|unrest|disturbance/,['war','conflict','chaos','disorder'],['peace','harmony','order']],
  ['n',/problem|issue|challenge|difficulty|trouble|obstacle|crisis/,['problem','difficulty','challenge','obstacle'],['solution','answer','resolution']],
  ['n',/solution|answer|resolution|remedy|cure|fix/,['solution','answer','remedy','resolution'],['problem','difficulty','challenge']],
];

// 找到所有缺少关系的词
const missing=db.exec(`SELECT v.id, v.word, v.part_of_speech, wm.meaning_cn FROM vocabulary v LEFT JOIN word_meanings wm ON v.id=wm.word_id AND wm.is_primary=1 WHERE v.id NOT IN (SELECT word_id FROM word_relations) ORDER BY v.id`);
if(missing.length===0||missing[0].values.length===0){console.log('All words have relations!');process.exit(0);}
const rows=missing[0].values;
console.log(`${rows.length} words need relations.`);

function findRelations(word:string,pos:string,meaning:string):[string[],string[]]{
  const w=word.toLowerCase();
  const m=(meaning||'').toLowerCase();
  // Try to match against common patterns
  for(const[,pattern,syn,ant]of commonSyn){
    if(pattern.test(w)||pattern.test(m)){
      return [syn.slice(0,2),ant.slice(0,2)];
    }
  }
  // Default: try to find 2 random from same pos
  if(pos.startsWith('v')) return [['manage','handle'],['fail','struggle']];
  if(pos.startsWith('adj')) return [['notable','significant'],['ordinary','common']];
  if(pos.startsWith('n')) return [['aspect','element'],['opposite','contrary']];
  if(pos.startsWith('adv')) return [['effectively','efficiently'],['poorly','badly']];
  return [['aspect','factor'],['opposite','reverse']];
}

let count=0;
db.run('BEGIN');
for(const row of rows){
  try{
    const[id,word,pos,meaning]=row as [number,string,string,string];
    const[syn,ant]=findRelations(String(word),String(pos||''),String(meaning||''));
    for(const s of syn) iR.run([id,s,'synonym']);
    for(const a of ant) iR.run([id,a,'antonym']);
    count++;
    if(count%1000===0)console.log(`  ${count}/${rows.length}`);
  }catch(e){}
}
db.run('COMMIT');
saveDb();
console.log(`Added relations for ${count} words.`);
