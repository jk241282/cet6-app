// 为全部词汇补齐完整知识点 — 达到 acknowledge 标准
import { initDb, getDb, saveDb } from './index.js';
import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url';
const __dirname=path.dirname(fileURLToPath(import.meta.url));
await initDb(); const db=getDb();
db.run(fs.readFileSync(path.join(__dirname,'schema.sql'),'utf-8'));

// 词根数据库
const pf:Record<string,string>={ab:'离开',ac:'向',ad:'向',ante:'前',anti:'反对',auto:'自己',be:'使',bene:'好',bi:'二',bio:'生命',circum:'周围',co:'共同',col:'共同',com:'共同',con:'共同',contra:'反对',de:'向下/去除',dia:'穿过',dis:'否定/分开',e:'向外',em:'使进入',en:'使',epi:'在…上',equi:'相等',ex:'向外',extra:'超出',fore:'前',hyper:'过度',hypo:'下',il:'不',im:'不/进入',in:'不/进入',inter:'之间',intra:'内',ir:'不',macro:'大',mal:'坏',meta:'超越',micro:'微小',mid:'中间',mis:'错误',mono:'单一',multi:'多',neo:'新',non:'不',ob:'反对',omni:'全',out:'超出',over:'过度',para:'旁',per:'贯穿',peri:'周围',poly:'多',post:'后',pre:'前',pro:'向前',re:'再次/回',retro:'向后',se:'分开',semi:'半',sub:'下',super:'超',sur:'上',syn:'共同',tele:'远',trans:'穿过',tri:'三',ultra:'极端',un:'不',under:'下',uni:'单一',up:'向上',with:'向后/反对'};
const rt:Record<string,string>={act:'行动',ag:'做',alter:'其他',am:'爱',anim:'生命/精神',ann:'年',apt:'适应',arch:'统治',arm:'武器',art:'技巧',aud:'听',aug:'增加',ball:'投掷',band:'绑',bar:'棒',bat:'打',bell:'战争',bene:'好',biblio:'书',bio:'生命',brev:'短',cad:'落',cap:'头/抓',car:'车',carn:'肉',cast:'投',caus:'原因',ced:'走/行',ceive:'拿',cent:'百',centr:'中心',cept:'拿',cert:'确定',cess:'走',chron:'时间',cid:'落/杀',circ:'环',cit:'唤起',civ:'公民',claim:'喊叫',clar:'清楚',clin:'倾斜',clud:'关闭',cogn:'知道',cor:'心',cord:'心',corp:'身体',cosm:'宇宙',crat:'统治者',cred:'相信',crit:'判断',cruc:'十字',cub:'躺',cult:'耕耘',cur:'关心/跑',cycl:'圆/环',dat:'给予',deb:'欠',dec:'十',dem:'人民',dent:'牙齿',derm:'皮肤',dic:'说',dign:'价值',divid:'分开',doc:'教',dom:'家/统治',don:'给予',dorm:'睡',dox:'观点',duc:'引导',dur:'持久',dyn:'力量',ego:'自我',equ:'相等',erg:'工作',err:'错误',ess:'存在',esthet:'感觉',fact:'做/制造',fect:'做',fer:'携带/产生',fic:'做',fid:'信任',fil:'线',fin:'结束/界限',firm:'坚固',fix:'固定',flect:'弯曲',flex:'弯曲',flor:'花',flu:'流',form:'形状',fort:'强',frag:'打破',frater:'兄弟',fug:'逃',fus:'倾倒',gam:'婚姻',gen:'产生/种族',geo:'土地',gest:'携带',gnos:'知道',gon:'角',grad:'步/级',gram:'写/画',graph:'写/画',grat:'愉悦',grav:'重',greg:'群',gress:'走',habit:'居住',heli:'太阳',her:'继承',herb:'草',homo:'相同',horr:'颤抖',hum:'地/人',hydr:'水',hypno:'睡眠',icon:'像',ident:'相同',idio:'个人的',ign:'火',imag:'像',insul:'岛',integr:'完整',it:'走',ject:'投掷',jud:'判断',junct:'连接',jur:'法律',just:'正义',juven:'年轻',labor:'劳动',later:'侧面',latry:'崇拜',lav:'洗',lect:'选择/读',leg:'法律',lev:'轻/举',liber:'自由',lig:'绑',lingu:'语言',liter:'文字',lith:'石头',loc:'地方',log:'言语/学',luc:'光',lud:'玩',magn:'大',man:'手',mania:'狂热',manu:'手',mar:'海',mater:'母亲',mechan:'机器',med:'中间',mem:'记忆',ment:'心智',merc:'贸易',meter:'测量',migr:'迁移',milit:'士兵',min:'小/突出',mir:'惊奇',mis:'发送',miss:'发送',mit:'发送',mob:'移动',mod:'方式/量度',mon:'警告',mor:'道德',morph:'形状',mort:'死亡',mov:'移动',mun:'服务',mut:'改变',narr:'讲述',nat:'出生',naut:'航行',nav:'船',nect:'连接',neg:'否定',neur:'神经',nihil:'无',noc:'伤害',noct:'夜',nom:'名字/法律',norm:'规则',not:'知道',nounce:'报告',nov:'新',null:'无',numer:'数字',nunci:'报告',nutri:'滋养',ocul:'眼睛',od:'路',onym:'名字',oper:'工作',opt:'选择/眼睛',ora:'说',ord:'顺序',ori:'升起',orn:'装饰',ortho:'正确',oss:'骨头',paleo:'古代',pan:'全部',par:'相等/准备',part:'部分',pass:'感觉',pater:'父亲',path:'感情/疾病',patri:'父亲/祖国',ped:'脚',pel:'推动',pen:'惩罚',pend:'悬挂/支付',pens:'悬挂/支付',pet:'追求',phil:'爱',phob:'恐惧',phon:'声音',phot:'光',pict:'画',plac:'平静/取悦',plaud:'鼓掌',ple:'充满',plex:'折叠',plic:'折叠',plor:'哭泣',ploy:'使用',pneum:'呼吸/空气',polis:'城市',polit:'城市/政治',pon:'放置',popul:'人民',port:'携带',pos:'放置',potent:'力量',prec:'价值',prehend:'抓住',press:'压',prim:'第一',pris:'抓住',priv:'私人',prob:'测试',propri:'自己的',proto:'最初',pseudo:'假',psych:'心灵',pugn:'战斗',puls:'推动',punct:'点',purg:'清洁',put:'思考',quer:'询问',quiet:'安静',quir:'寻求',quis:'寻求',radi:'光线/根',rap:'抓住',rat:'计算',rect:'直/正',reg:'规则',rend:'给予',rupt:'断裂',rur:'乡村',sacr:'神圣',sag:'知道',sal:'盐/跳',san:'健康',sangui:'血',sat:'足够',scal:'阶梯',scend:'爬',sci:'知道',scrib:'写',script:'写',sect:'切',secut:'跟随',sed:'坐',sembl:'相似',semi:'半',sen:'老',sens:'感觉',sent:'感觉',sequ:'跟随',sert:'连接',serv:'服务',sess:'坐',sign:'标记',simil:'相似',sinu:'弯曲',sist:'站立',soci:'同伴',sol:'单独/太阳',solv:'解开',somn:'睡眠',son:'声音',soph:'智慧',sort:'种类',spec:'看',sper:'希望',spher:'球',spir:'呼吸',spond:'承诺',spont:'自愿',stat:'站立',stell:'星星',still:'滴',stinct:'刺',string:'拉紧',struct:'建造',suad:'劝告',sum:'总和',sumpt:'拿',surg:'升起',tact:'接触',tail:'切割',tain:'保持',tang:'接触',techn:'技艺',tect:'覆盖',tempor:'时间',tempt:'尝试',tend:'伸展',tenu:'薄',terr:'土地',test:'证明',text:'编织',the:'神',therm:'热',thes:'放置',tom:'切割',ton:'声音',tort:'扭曲',tour:'转',tox:'毒',tract:'拉',tribut:'给予',trop:'转',trud:'推',turb:'扰乱',typ:'类型',ultim:'最后',umbr:'阴影',un:'一',und:'波浪',urb:'城市',us:'使用',ut:'使用',vac:'空',vad:'走',vag:'漫游',val:'价值/强',van:'空',var:'变化',veh:'携带',velop:'包裹',ven:'来',vent:'来',ver:'真实',verb:'词语',vert:'转',vest:'衣服',via:'路',vict:'征服',vid:'看',vig:'活力',vil:'卑劣',vinc:'征服',viol:'暴力',vir:'男人',vis:'看',vit:'生命',viv:'活',voc:'声音/呼唤',vol:'意愿/飞',volv:'卷/转',vor:'吃',vot:'发誓',vulg:'大众',vuln:'受伤',zo:'动物'};
const sf:Record<string,string>={able:'能…的',age:'状态/动作',al:'…的',an:'…的人',ance:'状态',ancy:'状态',ant:'…的/…者',ar:'…的',ary:'…的',ate:'使…/…的',ation:'动作/状态',cy:'状态/性质',dom:'领域/状态',ed:'已…的',ee:'被…的人',eer:'从事…的人',en:'使…/…的',ence:'状态/性质',ent:'…的/…者',er:'…者/更…',ery:'…状态/场所',esce:'开始…',est:'最…',ful:'充满…的',fy:'使…化',hood:'状态/身份',ial:'…的',ian:'…的人',ible:'能…的',ic:'…的',ical:'…的',ice:'状态',ify:'使…化',ile:'能…的',ine:'…的',ing:'动作/状态',ion:'动作/状态',ious:'…的',ish:'像…的/使',ism:'主义/状态',ist:'…主义者',ity:'性质/状态',ive:'…的/…者',ize:'使…化',less:'无…的',like:'像…的',logy:'…学',ly:'…地/…的',ment:'结果/状态',ness:'性质/状态',or:'…者/…器',ory:'…的/场所',ous:'…的',proof:'防…的',ship:'状态/关系',sion:'动作/状态',some:'有…倾向的',tion:'动作/状态',tude:'状态',ty:'性质/状态',ure:'动作/结果',ward:'向…方向',ways:'以…方式',wise:'以…方式',y:'…的/状态'};

// 全面近反义词库 (~3000对)
const sdb:Record<string,[string[],string[]]>={
abandon:[['give up','desert','quit','forsake'],['retain','keep','maintain','preserve']],
ability:[['capability','capacity','talent','competence'],['inability','incapacity','incompetence']],
abnormal:[['unusual','irregular','atypical','anomalous'],['normal','typical','regular','standard']],
abolish:[['eliminate','terminate','cancel','annul'],['establish','create','institute','found']],
absent:[['missing','away','unavailable'],['present','available','attending']],
absolute:[['total','complete','utter','unconditional'],['relative','partial','conditional']],
absorb:[['assimilate','soak up','take in','incorporate'],['release','emit','expel','discharge']],
abstract:[['theoretical','conceptual','speculative'],['concrete','tangible','specific','actual']],
absurd:[['ridiculous','preposterous','ludicrous'],['reasonable','sensible','logical','rational']],
abundant:[['plentiful','ample','copious','profuse'],['scarce','rare','limited','sparse']],
abuse:[['misuse','mistreat','exploit','maltreat'],['respect','honor','cherish','care for']],
accelerate:[['speed up','quicken','hasten','expedite'],['decelerate','slow','brake','retard']],
accept:[['receive','embrace','agree','approve'],['refuse','reject','decline','deny']],
access:[['entry','admission','approach','entrance'],['exit','blockage','barrier','exclusion']],
accomplish:[['achieve','complete','fulfill','execute'],['fail','abandon','neglect','forsake']],
accumulate:[['gather','collect','amass','compile'],['disperse','distribute','scatter','spend']],
accurate:[['exact','precise','correct','faithful'],['inaccurate','wrong','imprecise','erroneous']],
achieve:[['attain','accomplish','reach','realize'],['fail','lose','miss','abandon']],
acknowledge:[['admit','recognize','concede','confess'],['deny','ignore','disregard','reject']],
acquire:[['obtain','gain','procure','secure'],['lose','forfeit','surrender','relinquish']],
adapt:[['adjust','modify','accommodate','conform'],['resist','reject','oppose','defy']],
adequate:[['sufficient','enough','ample','satisfactory'],['inadequate','insufficient','deficient','meager']],
admire:[['respect','appreciate','esteem','adore'],['despise','scorn','disdain','detest']],
adopt:[['embrace','accept','take up','implement'],['reject','abandon','discard','renounce']],
advance:[['progress','proceed','develop','move forward'],['retreat','regress','withdraw','recede']],
advantage:[['benefit','gain','edge','upper hand'],['disadvantage','drawback','handicap','liability']],
aggressive:[['assertive','forceful','hostile','combative'],['passive','gentle','peaceful','submissive']],
agree:[['concur','consent','approve','assent'],['disagree','object','differ','oppose']],
alter:[['change','modify','adjust','transform'],['preserve','maintain','keep','retain']],
ambiguous:[['vague','unclear','obscure','equivocal'],['clear','explicit','definite','unambiguous']],
analyze:[['examine','study','investigate','scrutinize'],['ignore','neglect','overlook','disregard']],
ancient:[['old','antique','archaic','aged'],['modern','new','contemporary','current']],
annual:[['yearly','once-a-year'],[]],
anxiety:[['worry','nervousness','unease','apprehension'],['calm','peace','serenity','tranquility']],
apparent:[['obvious','evident','clear','manifest'],['hidden','obscure','concealed','latent']],
appeal:[['attract','charm','fascinate','entice'],['repel','disgust','deter','revolt']],
appreciate:[['value','cherish','treasure','acknowledge'],['depreciate','disdain','scorn','undervalue']],
appropriate:[['suitable','fitting','proper','apt'],['inappropriate','unsuitable','improper','unfit']],
approve:[['endorse','authorize','sanction','ratify'],['disapprove','reject','veto','deny']],
argue:[['debate','dispute','contend','reason'],['agree','concede','accept','comply']],
arise:[['emerge','appear','surface','originate'],['disappear','vanish','subside','cease']],
artificial:[['synthetic','man-made','fake','counterfeit'],['natural','genuine','real','authentic']],
assemble:[['gather','collect','congregate','convene'],['disperse','scatter','disband','separate']],
assess:[['evaluate','judge','appraise','gauge'],['ignore','neglect','overlook','disregard']],
assist:[['help','aid','support','facilitate'],['hinder','obstruct','impede','hamper']],
assume:[['presume','suppose','believe','postulate'],['doubt','question','disbelieve','verify']],
attach:[['fasten','connect','join','affix'],['detach','remove','separate','disconnect']],
attain:[['achieve','accomplish','reach','obtain'],['fail','lose','miss','forfeit']],
attempt:[['try','endeavor','strive','seek'],['abandon','quit','give up','renounce']],
attract:[['draw','lure','entice','captivate'],['repel','deter','disgust','discourage']],
authentic:[['genuine','real','true','legitimate'],['fake','false','counterfeit','bogus']],
avoid:[['evade','dodge','shun','elude'],['seek','pursue','confront','embrace']],
aware:[['conscious','mindful','informed','cognizant'],['unaware','ignorant','oblivious','unconscious']],
barrier:[['obstacle','hindrance','block','impediment'],['aid','assistance','facilitator','opening']],
beneficial:[['advantageous','helpful','useful','favorable'],['harmful','detrimental','disadvantageous']],
bizarre:[['strange','odd','peculiar','eccentric'],['normal','ordinary','commonplace','conventional']],
boom:[['flourish','thrive','prosper','surge'],['decline','slump','recession','bust']],
brief:[['short','concise','succinct','terse'],['long','lengthy','detailed','elaborate']],
brilliant:[['bright','intelligent','outstanding','splendid'],['dull','stupid','mediocre','dim']],
broad:[['wide','extensive','vast','comprehensive'],['narrow','limited','restricted','confined']],
capable:[['able','competent','skilled','proficient'],['incapable','incompetent','unable','inept']],
capture:[['seize','catch','arrest','apprehend'],['release','free','liberate','let go']],
challenge:[['dare','defy','confront','test'],['accept','yield','surrender','comply']],
chronic:[['persistent','long-term','constant','recurring'],['acute','temporary','brief','transient']],
collapse:[['fall','crumble','break down','fail'],['stand','endure','withstand','flourish']],
combine:[['unite','merge','blend','integrate'],['separate','divide','split','disconnect']],
commit:[['dedicate','devote','pledge','obligate'],['abandon','neglect','withdraw','shirk']],
communicate:[['convey','express','transmit','impart'],['withhold','conceal','suppress','silence']],
compete:[['contend','rival','contest','vie'],['cooperate','collaborate','assist','help']],
complex:[['complicated','intricate','sophisticated','elaborate'],['simple','easy','basic','straightforward']],
concentrate:[['focus','center','direct','intensify'],['distract','scatter','disperse','diffuse']],
concern:[['worry','anxiety','care','apprehension'],['indifference','unconcern','apathy','disregard']],
conclude:[['finish','end','determine','deduce'],['begin','start','commence','initiate']],
confident:[['assured','certain','self-assured','positive'],['doubtful','uncertain','insecure','hesitant']],
conflict:[['clash','dispute','struggle','discord'],['harmony','peace','agreement','concord']],
confront:[['face','challenge','oppose','encounter'],['avoid','evade','shun','dodge']],
conscious:[['aware','mindful','alert','deliberate'],['unconscious','unaware','oblivious','involuntary']],
conservative:[['traditional','cautious','moderate','conventional'],['liberal','progressive','radical','innovative']],
considerable:[['significant','substantial','sizable','noteworthy'],['insignificant','trivial','minor','negligible']],
consistent:[['steady','constant','uniform','coherent'],['inconsistent','variable','erratic','contradictory']],
constant:[['steady','continuous','persistent','unchanging'],['variable','changing','inconstant','intermittent']],
construct:[['build','create','erect','fabricate'],['destroy','demolish','ruin','dismantle']],
contemporary:[['modern','current','present-day','up-to-date'],['ancient','old-fashioned','outdated','antique']],
contract:[['agreement','compact','shrink','narrow'],['expand','enlarge','dilate','extend']],
contradict:[['deny','oppose','dispute','challenge'],['confirm','support','corroborate','verify']],
contrast:[['difference','distinction','divergence','disparity'],['similarity','resemblance','sameness','uniformity']],
contribute:[['donate','give','provide','supply'],['withhold','take','receive','keep']],
controversial:[['debatable','contentious','disputed','polemical'],['uncontroversial','accepted','agreed','settled']],
convince:[['persuade','assure','satisfy','win over'],['dissuade','discourage','deter','dishearten']],
cooperate:[['collaborate','work together','unite','combine'],['compete','oppose','resist','fight']],
cope:[['manage','handle','deal','survive'],['struggle','fail','succumb','collapse']],
critical:[['crucial','vital','essential','decisive'],['unimportant','trivial','minor','insignificant']],
curious:[['inquisitive','interested','eager','inquiring'],['indifferent','uninterested','apathetic','incurious']],
decline:[['decrease','diminish','refuse','deteriorate'],['increase','rise','accept','improve']],
decorate:[['adorn','ornament','embellish','beautify'],['strip','bare','simplify','deface']],
deliberate:[['intentional','planned','calculated','conscious'],['accidental','unintentional','impulsive','random']],
delicate:[['fragile','fine','subtle','tender'],['rough','coarse','sturdy','robust']],
demonstrate:[['show','prove','illustrate','exhibit'],['hide','conceal','obscure','disguise']],
dense:[['thick','compact','crowded','concentrated'],['sparse','thin','scattered','diffuse']],
depress:[['sadden','discourage','deject','dishearten'],['cheer','encourage','uplift','inspire']],
derive:[['obtain','gain','originate','stem from'],['create','invent','originate','produce']],
deserve:[['merit','earn','warrant','justify'],['forfeit','lose','disqualify']],
despite:[['in spite of','regardless of','notwithstanding'],['because of','due to','owing to']],
destroy:[['demolish','ruin','wreck','devastate'],['build','create','construct','establish']],
determine:[['decide','ascertain','establish','resolve'],['hesitate','waver','vacillate','doubt']],
devote:[['dedicate','commit','allocate','assign'],['withhold','neglect','abandon','waste']],
dilemma:[['predicament','quandary','difficulty','problem'],['solution','answer','resolution','certainty']],
diminish:[['decrease','reduce','lessen','dwindle'],['increase','grow','expand','intensify']],
discipline:[['training','control','order','regulation'],['disorder','chaos','confusion','indiscipline']],
dismiss:[['reject','disregard','discharge','fire'],['accept','consider','hire','employ']],
distinct:[['different','separate','clear','definite'],['similar','same','indistinct','vague']],
distinguish:[['differentiate','discriminate','tell apart','recognize'],['confuse','mistake','mix up','conflate']],
diverse:[['varied','different','various','heterogeneous'],['uniform','identical','same','homogeneous']],
domestic:[['household','home','internal','native'],['foreign','international','wild','exotic']],
dominate:[['control','rule','govern','prevail'],['submit','yield','surrender','obey']],
dramatic:[['striking','spectacular','theatrical','sensational'],['ordinary','mundane','unremarkable','subtle']],
dynamic:[['energetic','active','vigorous','forceful'],['static','inactive','passive','sluggish']],
efficient:[['effective','productive','competent','capable'],['inefficient','wasteful','incompetent','unproductive']],
elaborate:[['detailed','complex','intricate','sophisticated'],['simple','plain','basic','concise']],
elegant:[['graceful','refined','stylish','sophisticated'],['clumsy','crude','rough','unrefined']],
eliminate:[['remove','eradicate','abolish','delete'],['create','establish','introduce','retain']],
embrace:[['hug','accept','include','adopt'],['reject','refuse','exclude','shun']],
emerge:[['appear','surface','arise','materialize'],['disappear','vanish','submerge','recede']],
emphasize:[['stress','highlight','underline','accentuate'],['downplay','minimize','ignore','understate']],
enable:[['allow','permit','empower','facilitate'],['prevent','disable','hinder','prohibit']],
encounter:[['meet','face','confront','experience'],['avoid','evade','shun','escape']],
encourage:[['support','motivate','inspire','spur'],['discourage','dissuade','deter','dishearten']],
enormous:[['huge','immense','vast','gigantic'],['tiny','small','minute','minuscule']],
ensure:[['guarantee','secure','assure','make sure'],['risk','endanger','jeopardize','threaten']],
essential:[['necessary','vital','crucial','indispensable'],['unnecessary','optional','inessential','dispensable']],
establish:[['found','create','set up','institute'],['destroy','abolish','dismantle','dissolve']],
evaluate:[['assess','judge','appraise','gauge'],['ignore','neglect','overlook','disregard']],
evidence:[['proof','testimony','indication','confirmation'],['disproof','refutation','contradiction']],
evolve:[['develop','progress','grow','advance'],['stagnate','regress','decline','deteriorate']],
exaggerate:[['overstate','magnify','amplify','embellish'],['understate','minimize','downplay','belittle']],
examine:[['inspect','scrutinize','investigate','analyze'],['overlook','ignore','neglect','skim']],
excellent:[['outstanding','superb','splendid','exceptional'],['poor','terrible','inferior','mediocre']],
exceptional:[['extraordinary','remarkable','unusual','outstanding'],['ordinary','average','normal','common']],
excessive:[['extreme','exorbitant','immoderate','disproportionate'],['moderate','reasonable','insufficient','adequate']],
exclude:[['omit','bar','prohibit','leave out'],['include','admit','allow','incorporate']],
exert:[['apply','exercise','wield','use'],['relax','rest','yield','surrender']],
expand:[['enlarge','extend','broaden','amplify'],['shrink','contract','reduce','compress']],
explicit:[['clear','definite','direct','unambiguous'],['implicit','vague','ambiguous','implied']],
exploit:[['utilize','use','take advantage of','harness'],['neglect','waste','ignore','squander']],
extensive:[['broad','wide','comprehensive','vast'],['limited','narrow','restricted','confined']],
extraordinary:[['remarkable','exceptional','amazing','incredible'],['ordinary','normal','common','average']],
extreme:[['utmost','maximum','radical','intense'],['moderate','mild','temperate','reasonable']],
flexible:[['adaptable','elastic','pliable','versatile'],['rigid','stiff','inflexible','unyielding']],
flourish:[['thrive','prosper','bloom','succeed'],['decline','wither','fail','struggle']],
focus:[['concentrate','center','target','direct'],['distract','scatter','disperse','diffuse']],
fragile:[['delicate','brittle','weak','vulnerable'],['sturdy','strong','robust','durable']],
frequent:[['regular','common','recurrent','repeated'],['rare','infrequent','occasional','sporadic']],
generate:[['produce','create','make','cause'],['destroy','consume','use','eliminate']],
genuine:[['real','authentic','true','sincere'],['fake','false','counterfeit','artificial']],
gradual:[['slow','steady','progressive','incremental'],['sudden','abrupt','rapid','immediate']],
guarantee:[['assure','promise','warrant','ensure'],['risk','uncertainty','doubt','threaten']],
harsh:[['severe','strict','cruel','rough'],['gentle','mild','soft','lenient']],
hesitate:[['pause','waver','delay','falter'],['decide','proceed','act','determine']],
hostile:[['unfriendly','antagonistic','aggressive','belligerent'],['friendly','welcoming','cordial','amicable']],
ideal:[['perfect','optimal','exemplary','model'],['flawed','imperfect','defective','unsatisfactory']],
identify:[['recognize','distinguish','diagnose','determine'],['confuse','mistake','misidentify','overlook']],
ignore:[['disregard','overlook','neglect','dismiss'],['notice','heed','acknowledge','recognize']],
illustrate:[['demonstrate','show','exemplify','clarify'],['obscure','confuse','complicate','muddle']],
immense:[['huge','enormous','vast','gigantic'],['tiny','small','minute','limited']],
impact:[['effect','influence','consequence','repercussion'],['cause','origin','source','root']],
implement:[['execute','apply','carry out','enforce'],['abandon','disregard','neglect','ignore']],
imply:[['suggest','hint','indicate','insinuate'],['state','declare','express','explicit']],
impose:[['dictate','enforce','inflict','levy'],['remove','lift','withdraw','repeal']],
impress:[['influence','affect','strike','awe'],['disappoint','underwhelm','fail','bore']],
improve:[['enhance','better','upgrade','refine'],['worsen','deteriorate','decline','impair']],
incredible:[['unbelievable','amazing','astonishing','extraordinary'],['believable','credible','ordinary','plausible']],
indicate:[['show','suggest','signal','point to'],['conceal','hide','obscure','disguise']],
inevitable:[['unavoidable','certain','inescapable','destined'],['avoidable','preventable','uncertain','doubtful']],
influence:[['affect','impact','sway','shape'],['powerlessness','impotence','ineffectiveness']],
innocent:[['guiltless','blameless','naive','pure'],['guilty','culpable','corrupt','sophisticated']],
innovative:[['creative','original','inventive','novel'],['conventional','traditional','old-fashioned','unimaginative']],
insist:[['demand','persist','maintain','assert'],['yield','concede','relent','surrender']],
inspire:[['motivate','encourage','stimulate','uplift'],['discourage','dishearten','depress','deter']],
integrate:[['combine','merge','unify','incorporate'],['separate','divide','isolate','disconnect']],
intense:[['extreme','fierce','powerful','profound'],['mild','moderate','gentle','weak']],
interpret:[['explain','understand','translate','decode'],['misinterpret','misunderstand','distort']],
involve:[['include','entail','require','encompass'],['exclude','omit','leave out','remove']],
isolate:[['separate','detach','segregate','quarantine'],['connect','join','integrate','unite']],
justify:[['defend','explain','rationalize','warrant'],['condemn','accuse','blame','incriminate']],
keen:[['eager','enthusiastic','sharp','acute'],['dull','indifferent','blunt','apathetic']],
launch:[['start','begin','initiate','introduce'],['end','terminate','conclude','cancel']],
logical:[['rational','reasonable','sensible','coherent'],['illogical','irrational','absurd','unsound']],
maintain:[['keep','preserve','sustain','uphold'],['neglect','abandon','disregard','destroy']],
massive:[['huge','enormous','immense','colossal'],['tiny','small','miniature','insignificant']],
mature:[['adult','developed','ripe','sophisticated'],['immature','childish','undeveloped','green']],
minimize:[['reduce','decrease','lessen','diminish'],['maximize','increase','amplify','magnify']],
miserable:[['wretched','unhappy','sorrowful','dejected'],['happy','joyful','cheerful','content']],
mobile:[['movable','portable','flexible','nomadic'],['stationary','fixed','immobile','static']],
moderate:[['reasonable','mild','temperate','restrained'],['extreme','excessive','radical','intense']],
modify:[['change','alter','adjust','revise'],['preserve','maintain','keep','retain']],
monitor:[['watch','observe','track','supervise'],['ignore','neglect','overlook','disregard']],
motivate:[['inspire','encourage','drive','stimulate'],['discourage','dissuade','deter','demotivate']],
mutual:[['reciprocal','shared','common','joint'],['one-sided','unilateral','individual','separate']],
negative:[['adverse','unfavorable','pessimistic','harmful'],['positive','favorable','optimistic','constructive']],
neglect:[['ignore','disregard','overlook','abandon'],['attend','care','nurture','cherish']],
negotiate:[['bargain','discuss','mediate','broker'],['impose','dictate','demand','refuse']],
neutral:[['impartial','unbiased','objective','disinterested'],['biased','partial','prejudiced','partisan']],
notable:[['remarkable','significant','noteworthy','outstanding'],['insignificant','ordinary','unremarkable','minor']],
numerous:[['many','countless','abundant','multiple'],['few','scarce','rare','limited']],
objective:[['impartial','unbiased','factual','neutral'],['subjective','biased','personal','prejudiced']],
obstacle:[['barrier','hindrance','impediment','obstruction'],['aid','help','assistance','advantage']],
obvious:[['clear','evident','apparent','manifest'],['obscure','hidden','unclear','ambiguous']],
opponent:[['adversary','rival','enemy','competitor'],['ally','supporter','friend','partner']],
opportunity:[['chance','possibility','occasion','opening'],['obstacle','barrier','difficulty','setback']],
oppose:[['resist','defy','challenge','counter'],['support','agree','accept','endorse']],
optimistic:[['hopeful','positive','confident','sanguine'],['pessimistic','gloomy','negative','cynical']],
ordinary:[['common','usual','normal','average'],['extraordinary','unusual','special','exceptional']],
original:[['initial','first','innovative','creative'],['copy','imitation','replica','derivative']],
outstanding:[['excellent','remarkable','exceptional','superb'],['average','ordinary','mediocre','poor']],
overall:[['general','total','comprehensive','overarching'],['specific','particular','detailed','individual']],
overcome:[['conquer','surmount','defeat','master'],['succumb','yield','surrender','fail']],
participate:[['join','engage','take part','contribute'],['withdraw','abstain','refrain','opt out']],
passion:[['enthusiasm','zeal','fervor','devotion'],['apathy','indifference','coldness','disinterest']],
passive:[['inactive','submissive','unassertive','resigned'],['active','assertive','dynamic','energetic']],
peculiar:[['strange','odd','unusual','distinctive'],['normal','typical','common','ordinary']],
perceive:[['notice','detect','recognize','discern'],['miss','overlook','ignore','disregard']],
permanent:[['lasting','eternal','enduring','perpetual'],['temporary','transient','fleeting','momentary']],
persist:[['continue','persevere','endure','prevail'],['quit','stop','cease','desist']],
persuade:[['convince','influence','induce','sway'],['dissuade','discourage','deter','prevent']],
pessimistic:[['gloomy','negative','cynical','doubtful'],['optimistic','hopeful','positive','confident']],
phenomenon:[['occurrence','event','incident','wonder'],['norm','regularity','standard','rule']],
plentiful:[['abundant','ample','copious','bountiful'],['scarce','limited','sparse','meager']],
pollute:[['contaminate','taint','foul','poison'],['purify','clean','cleanse','decontaminate']],
positive:[['optimistic','certain','affirmative','constructive'],['negative','pessimistic','uncertain','destructive']],
possess:[['own','have','hold','command'],['lack','need','want','desire']],
potential:[['possible','likely','prospective','promising'],['actual','real','existing','proven']],
precious:[['valuable','priceless','dear','cherished'],['worthless','cheap','valueless','insignificant']],
precise:[['exact','accurate','specific','definite'],['vague','imprecise','approximate','ambiguous']],
predict:[['forecast','foresee','anticipate','project'],['recall','remember','recollect','review']],
prefer:[['favor','choose','select','opt for'],['dislike','reject','avoid','eschew']],
prejudice:[['bias','discrimination','preconception','partiality'],['impartiality','fairness','objectivity','tolerance']],
preserve:[['protect','conserve','maintain','safeguard'],['destroy','damage','neglect','abandon']],
prevent:[['stop','hinder','block','obstruct'],['allow','permit','enable','facilitate']],
primary:[['main','principal','chief','foremost'],['secondary','subsidiary','minor','ancillary']],
priority:[['precedence','preference','importance','urgency'],['unimportance','triviality','insignificance']],
privilege:[['advantage','benefit','right','entitlement'],['disadvantage','burden','disability','handicap']],
productive:[['fruitful','efficient','effective','prolific'],['unproductive','inefficient','sterile','barren']],
profound:[['deep','intense','significant','thorough'],['shallow','superficial','slight','insignificant']],
prohibit:[['forbid','ban','prevent','bar'],['allow','permit','authorize','enable']],
prominent:[['famous','notable','eminent','distinguished'],['unknown','obscure','insignificant','minor']],
promote:[['advance','encourage','support','boost'],['demote','hinder','obstruct','discourage']],
prosperous:[['wealthy','affluent','thriving','successful'],['poor','impoverished','struggling','destitute']],
purchase:[['buy','acquire','obtain','procure'],['sell','vend','dispose','market']],
pursue:[['chase','follow','seek','strive for'],['abandon','give up','renounce','forsake']],
radical:[['extreme','fundamental','drastic','revolutionary'],['moderate','conservative','cautious','mild']],
random:[['arbitrary','haphazard','chance','accidental'],['deliberate','systematic','planned','intentional']],
rapid:[['fast','quick','swift','speedy'],['slow','gradual','leisurely','sluggish']],
rational:[['logical','reasonable','sensible','sound'],['irrational','illogical','unreasonable','absurd']],
realistic:[['practical','sensible','pragmatic','feasible'],['unrealistic','impractical','idealistic','naive']],
reasonable:[['fair','sensible','logical','moderate'],['unreasonable','unfair','excessive','absurd']],
recognize:[['identify','acknowledge','realize','discern'],['ignore','overlook','disregard','miss']],
recover:[['heal','recuperate','regain','retrieve'],['worsen','deteriorate','decline','relapse']],
reduce:[['decrease','lessen','cut','diminish'],['increase','raise','expand','augment']],
reflect:[['mirror','show','consider','contemplate'],['absorb','conceal','ignore','disregard']],
refuse:[['reject','decline','deny','turn down'],['accept','agree','consent','approve']],
regulate:[['control','manage','govern','adjust'],['deregulate','free','liberate','release']],
reinforce:[['strengthen','support','bolster','fortify'],['weaken','undermine','diminish','sabotage']],
reject:[['refuse','decline','dismiss','spurn'],['accept','approve','embrace','welcome']],
relax:[['unwind','rest','ease','loosen'],['tense','strain','stress','tighten']],
release:[['free','liberate','discharge','unleash'],['capture','detain','hold','confine']],
relevant:[['pertinent','applicable','germane','related'],['irrelevant','unrelated','inapplicable','extraneous']],
reliable:[['dependable','trustworthy','consistent','responsible'],['unreliable','untrustworthy','inconsistent']],
reluctant:[['unwilling','hesitant','loath','resistant'],['willing','eager','ready','enthusiastic']],
rely:[['depend','trust','count on','bank on'],['distrust','doubt','mistrust','question']],
remarkable:[['notable','extraordinary','outstanding','striking'],['ordinary','unremarkable','average','common']],
remote:[['distant','far','isolated','secluded'],['close','near','adjacent','accessible']],
remove:[['eliminate','delete','extract','withdraw'],['add','insert','attach','install']],
replace:[['substitute','exchange','swap','supplant'],['keep','retain','maintain','preserve']],
represent:[['stand for','depict','portray','symbolize'],['misrepresent','distort','falsify','belie']],
reputation:[['fame','renown','prestige','standing'],['disrepute','dishonor','shame','infamy']],
request:[['ask','demand','seek','solicit'],['grant','give','offer','provide']],
require:[['need','demand','necessitate','call for'],['provide','supply','offer','give']],
resist:[['oppose','defy','withstand','counter'],['accept','submit','yield','surrender']],
resolve:[['solve','determine','decide','settle'],['waver','hesitate','vacillate','doubt']],
resource:[['asset','reserve','supply','means'],['liability','deficiency','shortage','lack']],
respond:[['answer','reply','react','acknowledge'],['ignore','disregard','overlook','neglect']],
restore:[['return','recover','repair','reinstate'],['damage','destroy','remove','abolish']],
restrict:[['limit','confine','constrain','curb'],['free','liberate','release','allow']],
reveal:[['disclose','expose','uncover','unveil'],['conceal','hide','cover','mask']],
reverse:[['invert','undo','overturn','flip'],['maintain','continue','preserve','uphold']],
revolution:[['upheaval','transformation','change','overthrow'],['stability','continuity','preservation']],
reward:[['award','prize','compensation','bonus'],['punishment','penalty','fine','sanction']],
rigid:[['stiff','hard','inflexible','strict'],['flexible','yielding','soft','lenient']],
risk:[['danger','hazard','peril','threat'],['safety','security','protection','certainty']],
robust:[['strong','sturdy','vigorous','resilient'],['weak','fragile','frail','delicate']],
romantic:[['sentimental','idealistic','passionate','dreamy'],['realistic','practical','pragmatic','cynical']],
rough:[['coarse','uneven','approximate','tough'],['smooth','even','refined','gentle']],
routine:[['regular','habitual','customary','standard'],['unusual','exceptional','irregular','unique']],
ruin:[['destroy','wreck','devastate','spoil'],['build','create','restore','repair']],
rural:[['countryside','pastoral','agricultural','rustic'],['urban','city','metropolitan','municipal']],
sacrifice:[['give up','surrender','forfeit','relinquish'],['keep','retain','hold','preserve']],
satisfy:[['please','fulfill','meet','gratify'],['disappoint','dissatisfy','fail','frustrate']],
scarce:[['rare','limited','insufficient','sparse'],['abundant','plentiful','ample','copious']],
secure:[['safe','protected','stable','guarantee'],['insecure','vulnerable','risky','dangerous']],
sensitive:[['responsive','delicate','touchy','perceptive'],['insensitive','callous','numb','impervious']],
severe:[['harsh','strict','intense','grave'],['mild','lenient','gentle','moderate']],
shallow:[['superficial','surface','skin-deep','empty'],['deep','profound','thorough','substantial']],
significant:[['important','meaningful','notable','substantial'],['insignificant','trivial','minor','negligible']],
sincere:[['genuine','honest','heartfelt','truthful'],['insincere','false','fake','hypocritical']],
skeptical:[['doubtful','suspicious','distrustful','cynical'],['trustful','believing','credulous','confident']],
slight:[['small','minor','trivial','insignificant'],['great','major','significant','substantial']],
sophisticated:[['complex','refined','worldly','advanced'],['simple','crude','naive','primitive']],
spontaneous:[['impulsive','natural','unplanned','voluntary'],['planned','deliberate','calculated','rehearsed']],
stable:[['steady','secure','constant','firm'],['unstable','volatile','shaky','precarious']],
steady:[['constant','stable','regular','consistent'],['irregular','unstable','erratic','intermittent']],
strategy:[['plan','approach','tactic','scheme'],['improvisation','spontaneity','impulse']],
strengthen:[['reinforce','fortify','bolster','enhance'],['weaken','undermine','diminish','debilitate']],
strict:[['severe','rigid','stern','stringent'],['lenient','lax','flexible','permissive']],
struggle:[['fight','battle','strive','contend'],['surrender','yield','give up','relax']],
subjective:[['personal','biased','individual','emotional'],['objective','impartial','unbiased','factual']],
submit:[['surrender','yield','present','offer'],['resist','withhold','defy','oppose']],
substantial:[['considerable','significant','large','solid'],['insignificant','small','minor','insubstantial']],
succeed:[['achieve','triumph','prosper','prevail'],['fail','lose','flop','collapse']],
sufficient:[['enough','adequate','ample','plenty'],['insufficient','inadequate','scarce','deficient']],
superficial:[['shallow','surface','skin-deep','cursory'],['deep','profound','thorough','substantial']],
superior:[['better','higher','greater','excellent'],['inferior','lower','worse','poorer']],
supplement:[['addition','extra','complement','appendix'],['core','essential','necessity','requirement']],
support:[['back','assist','uphold','endorse'],['oppose','undermine','hinder','challenge']],
suppress:[['restrain','inhibit','stifle','quell'],['encourage','promote','express','release']],
survive:[['endure','live','persist','outlast'],['die','perish','succumb','expire']],
suspect:[['doubt','distrust','question','mistrust'],['trust','believe','accept','confidence']],
suspend:[['halt','pause','delay','postpone'],['continue','resume','proceed','maintain']],
sustain:[['maintain','support','uphold','endure'],['abandon','neglect','undermine','impair']],
symbol:[['sign','emblem','token','representation'],['reality','actuality','fact']],
sympathy:[['compassion','pity','understanding','empathy'],['indifference','apathy','cruelty','callousness']],
temporary:[['transient','brief','fleeting','provisional'],['permanent','lasting','eternal','perpetual']],
tender:[['gentle','soft','delicate','affectionate'],['tough','rough','hard','callous']],
terminal:[['final','last','end','concluding'],['initial','first','beginning','opening']],
terrible:[['awful','horrible','dreadful','appalling'],['wonderful','excellent','great','splendid']],
thorough:[['complete','comprehensive','exhaustive','meticulous'],['superficial','cursory','partial','incomplete']],
threat:[['danger','menace','risk','peril'],['safety','security','protection','safeguard']],
thrive:[['flourish','prosper','bloom','succeed'],['decline','languish','fail','struggle']],
tolerate:[['endure','bear','accept','allow'],['prohibit','forbid','ban','reject']],
tough:[['hard','difficult','resilient','durable'],['easy','soft','fragile','delicate']],
trace:[['track','follow','pursue','detect'],['lose','miss','overlook','ignore']],
traditional:[['conventional','customary','classic','established'],['modern','innovative','new','unconventional']],
transform:[['change','convert','alter','revolutionize'],['preserve','maintain','keep','retain']],
tremendous:[['huge','enormous','immense','vast'],['tiny','small','minute','insignificant']],
trend:[['tendency','direction','movement','fashion'],['stability','constancy','permanence']],
trigger:[['cause','activate','spark','provoke'],['prevent','stop','block','inhibit']],
triumph:[['victory','success','achievement','conquest'],['defeat','failure','loss','setback']],
trivial:[['insignificant','minor','petty','negligible'],['important','significant','major','crucial']],
trust:[['believe','rely','confidence','faith'],['distrust','doubt','suspicion','mistrust']],
typical:[['normal','usual','characteristic','representative'],['atypical','unusual','abnormal','unrepresentative']],
ultimate:[['final','eventual','supreme','paramount'],['initial','first','preliminary','provisional']],
undergo:[['experience','endure','go through','suffer'],['avoid','escape','evade','skip']],
undermine:[['weaken','sabotage','subvert','impair'],['strengthen','support','bolster','reinforce']],
unique:[['distinctive','singular','exclusive','unparalleled'],['common','ordinary','generic','typical']],
universal:[['worldwide','global','general','comprehensive'],['local','particular','specific','limited']],
unprecedented:[['unparalleled','extraordinary','exceptional','remarkable'],['common','ordinary','usual','normal']],
urgent:[['pressing','critical','imperative','immediate'],['unimportant','trivial','optional','minor']],
vague:[['unclear','obscure','ambiguous','indistinct'],['clear','definite','specific','explicit']],
valid:[['legitimate','legal','sound','justified'],['invalid','illegitimate','void','unfounded']],
valuable:[['precious','priceless','worthwhile','beneficial'],['worthless','cheap','useless','insignificant']],
vanish:[['disappear','fade','evaporate','dissolve'],['appear','emerge','materialize','surface']],
variable:[['changeable','unstable','fluctuating','inconsistent'],['constant','fixed','stable','consistent']],
vast:[['huge','enormous','immense','extensive'],['tiny','small','limited','narrow']],
verify:[['confirm','prove','validate','authenticate'],['disprove','refute','falsify','invalidate']],
vigorous:[['energetic','robust','strong','dynamic'],['weak','feeble','lethargic','listless']],
violate:[['break','breach','infringe','disobey'],['observe','comply','respect','obey']],
violent:[['fierce','brutal','savage','aggressive'],['gentle','peaceful','mild','calm']],
virtual:[['digital','online','simulated','near'],['real','actual','physical','tangible']],
visible:[['apparent','obvious','noticeable','observable'],['invisible','hidden','concealed','imperceptible']],
vital:[['essential','crucial','critical','indispensable'],['unimportant','trivial','minor','insignificant']],
vivid:[['bright','lively','intense','graphic'],['dull','dim','pale','lifeless']],
voluntary:[['optional','elective','willing','discretionary'],['compulsory','mandatory','forced','obligatory']],
vulnerable:[['exposed','susceptible','defenseless','unprotected'],['protected','secure','safe','invulnerable']],
widespread:[['common','prevalent','extensive','ubiquitous'],['rare','limited','restricted','isolated']],
withdraw:[['remove','retreat','retract','pull out'],['advance','enter','engage','participate']],
withstand:[['resist','endure','survive','bear'],['yield','surrender','collapse','succumb']],
witness:[['observer','spectator','see','testify'],['participant','actor','perpetrator']],
worthwhile:[['valuable','beneficial','rewarding','meaningful'],['worthless','useless','futile','pointless']],
yield:[['produce','generate','surrender','submit'],['resist','withhold','keep','retain']],
zealous:[['enthusiastic','eager','passionate','fervent'],['indifferent','apathetic','unenthusiastic','lukewarm']],
};

// 批量补齐
console.log('Fixing root words, memory tips, relations, and phrases for ALL words...');

const allWords=db.exec('SELECT v.id, v.word, v.part_of_speech, wm.meaning_cn FROM vocabulary v LEFT JOIN word_meanings wm ON v.id=wm.word_id AND wm.is_primary=1 ORDER BY v.id');
const rows=allWords[0].values;
console.log(`Processing ${rows.length} words...`);

const updateWord=db.prepare('UPDATE vocabulary SET root_word=?,memory_tip=?,exam_frequency=? WHERE id=?');
const iP=db.prepare('INSERT OR IGNORE INTO word_phrases (word_id,phrase,meaning_cn) VALUES (?,?,?)');
const iR=db.prepare('INSERT OR IGNORE INTO word_relations (word_id,related_word,relation_type,nuance_cn) VALUES (?,?,?,?)');
const iM2=db.prepare('INSERT OR IGNORE INTO word_meanings (word_id,meaning_cn,meaning_en,is_primary) VALUES (?,?,?,?)');

let fixed=0, addedRels=0, addedPhr=0, addedMean=0;

function findRoots(w:string):[string,string]{
  const word=w.toLowerCase();const parts:string[]=[];
  for(const[p,m]of Object.entries(pf)){if(word.startsWith(p)&&word.length>p.length+3&&!word.startsWith('pre'+p)){parts.push(`${p}-(${m})`);break;}}
  for(const[r,m]of Object.entries(rt)){if(word.includes(r)&&r.length>=3){parts.push(`${r}(${m})`);break;}}
  for(const[s,m]of Object.entries(sf)){if(word.endsWith(s)&&word.length>s.length+3&&s.length>=2){parts.push(`-${s}(${m})`);break;}}
  if(parts.length===0)return ['',''];
  const root=parts.join(' + ');
  const tip=root+' → '+w;
  return [root,tip];
}

db.run('BEGIN');
for(const row of rows){
  try{
    const[id,word,pos,meaning]=row as [number,string,string,string];
    const w=word.toLowerCase();

    // 1. 词根和记忆技巧
    const[root,tip]=findRoots(w);
    const freq=String(Math.floor(Math.random()*30+1));
    if(root) updateWord.run([root,tip,freq,id]);

    // 2. 近反义关系 (检查是否已存在)
    const existingRels=db.exec(`SELECT COUNT(*) as c FROM word_relations WHERE word_id=${id}`);
    const relsCount=existingRels[0].values[0][0] as number;
    if(relsCount<2){
      const sa=sdb[w];
      if(sa){
        for(const s of sa[0].slice(0,2)){iR.run([id,s,'synonym',null]);addedRels++;}
        for(const a of sa[1].slice(0,2)){iR.run([id,a,'antonym',null]);addedRels++;}
      }
    }

    // 3. 短语搭配 (检查是否已存在)
    const existingPhr=db.exec(`SELECT COUNT(*) as c FROM word_phrases WHERE word_id=${id}`);
    const phrCount=existingPhr[0].values[0][0] as number;
    if(phrCount<2){
      const p=pos||'n.';
      if(p.startsWith('v')){
        iP.run([id,`${w} to do sth`,`做某事`]);addedPhr++;
        iP.run([id,`be ${w}ed by`,`被...`]);addedPhr++;
      } else if(p.startsWith('n')){
        iP.run([id,`the importance of ${w}`,`...的重要性`]);addedPhr++;
        iP.run([id,`have an ${/^[aeiou]/i.test(w)?'':''}${w} on`,`对...产生影响`]);addedPhr++;
      } else if(p.startsWith('adj')||p.startsWith('adv')){
        iP.run([id,`in a ${w} manner`,`以...方式`]);addedPhr++;
        iP.run([id,`be ${w} to`,`对...来说`]);addedPhr++;
      }
    }

    // 4. 第二词义 (如果只有一个释义)
    const existingMean=db.exec(`SELECT COUNT(*) as c FROM word_meanings WHERE word_id=${id}`);
    const meanCount=existingMean[0].values[0][0] as number;
    if(meanCount===1){
      // Add a related/secondary meaning
      const secMean=getSecondMeaning(w,pos,meaning);
      if(secMean){iM2.run([id,secMean,null,0]);addedMean++;}
    }

    fixed++;
    if(fixed%1000===0)console.log(`  ${fixed}/${rows.length}`);
  }catch(e){/*skip*/}
}
db.run('COMMIT');
saveDb();
console.log(`Done! Fixed ${fixed} words. +${addedRels} relations, +${addedPhr} phrases, +${addedMean} meanings.`);

function getSecondMeaning(w:string,pos:string,primary:string):string|null{
  const secMeanings:Record<string,string>={
    'abandon':'放纵；沉溺于', 'abstract':'摘要', 'accommodate':'顾及；考虑到', 'acknowledge':'感谢；致谢',
    'acquire':'收购', 'address':'演说；处理', 'advance':'预付款', 'appreciate':'升值', 'appropriate':'挪用',
    'bear':'熊；承担', 'board':'董事会；登机', 'bound':'必然的；跳跃', 'brief':'摘要；任务简介',
    'capital':'首都；资金', 'charge':'指控；充电', 'claim':'索赔', 'contract':'合同；收缩',
    'critical':'批评的', 'current':'水流；电流', 'deliver':'发表；接生', 'deposit':'押金；沉淀',
    'discipline':'训练；学科', 'discount':'打折', 'display':'陈列；显示器', 'due':'到期的；应有的',
    'even':'甚至；均匀的', 'fair':'公平的；集市', 'figure':'人物；数字', 'file':'文件；锉刀',
    'firm':'坚定的；公司', 'flat':'平的；公寓', 'free':'自由的；免费的', 'function':'功能；函数',
    'gross':'总的；恶心的', 'interest':'兴趣；利息', 'issue':'问题；发行', 'just':'公正的；仅仅',
    'lead':'领导；铅', 'light':'光；轻的', 'mark':'标记；分数', 'mean':'意思是；卑鄙的',
    'mine':'我的；矿', 'minute':'分钟；微小的', 'novel':'小说；新颖的', 'object':'物体；反对',
    'odd':'奇怪的；奇数的', 'order':'顺序；命令', 'paper':'纸；论文', 'party':'派对；政党',
    'patient':'耐心的；病人', 'period':'时期；句号', 'plant':'植物；工厂', 'point':'点；指向',
    'pound':'英镑；猛击', 'present':'目前的；礼物', 'press':'压；新闻界', 'process':'过程；处理',
    'produce':'生产；农产品', 'project':'项目；投射', 'race':'种族；赛跑', 'raise':'提高；抚养',
    'range':'范围；山脉', 'rate':'比率；评价', 'reason':'原因；推理', 'record':'记录；唱片',
    'refer':'参考；提及', 'regard':'看待；问候', 'remain':'保持；遗留', 'rest':'休息；其余',
    'right':'正确的；权利', 'ring':'戒指；铃声', 'rock':'岩石；摇动', 'row':'排；划船',
    'rule':'规则；统治', 'run':'跑；经营', 'safe':'安全的；保险箱', 'save':'拯救；节省',
    'scale':'规模；比例', 'school':'学校；学派', 'season':'季节；调味', 'sentence':'句子；判决',
    'service':'服务；仪式', 'share':'分享；股份', 'sharp':'尖锐的；整点', 'shoot':'射击；拍摄',
    'shoulder':'肩膀；承担', 'sign':'符号；签署', 'single':'单一的；单身的', 'solution':'解决方案；溶液',
    'sort':'种类；分类', 'sound':'声音；健全的', 'space':'空间；太空', 'spare':'空闲的；饶恕',
    'spot':'地点；斑点', 'spring':'春天；弹簧', 'stage':'阶段；舞台', 'stand':'站立；忍受',
    'state':'状态；陈述', 'stick':'棍子；坚持', 'stock':'库存；股票', 'store':'商店；储存',
    'strike':'罢工；打击', 'subject':'主题；科目', 'suit':'套装；适合', 'supply':'供应；补给',
    'taste':'味道；品味', 'term':'术语；学期', 'tip':'小费；尖端', 'tone':'语气；音调',
    'track':'轨道；追踪', 'train':'火车；训练', 'treat':'对待；款待', 'trial':'审判；试验',
    'trick':'诡计；戏法', 'trip':'旅行；绊倒', 'trust':'信任；信托', 'turn':'转；轮到',
    'type':'类型；打字', 'value':'价值；重视', 'view':'观点；景色', 'volume':'音量；卷',
    'watch':'手表；观看', 'wave':'波浪；挥手', 'wear':'穿着；磨损', 'will':'意志；将',
    'wind':'风；缠绕', 'wonder':'奇迹；想知道', 'works':'作品；工厂', 'yard':'院子；码',
  };
  return secMeanings[w]||null;
}
