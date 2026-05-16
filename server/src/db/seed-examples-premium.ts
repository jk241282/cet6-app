// 为全部词汇生成高质量例句 - 自然语境 + 准确翻译
import { initDb, getDb, saveDb } from './index.js';
import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url';
const __dirname=path.dirname(fileURLToPath(import.meta.url));
await initDb(); const db=getDb();
db.run(fs.readFileSync(path.join(__dirname,'schema.sql'),'utf-8'));

// 删除旧的基础例句
db.run('DELETE FROM word_examples WHERE source_section=\'基础例句\'');
console.log('Cleared old basic examples.');

const iE=db.prepare('INSERT INTO word_examples (word_id,sentence_en,sentence_cn,exam_type,source_section) VALUES (?,?,?,?,?)');

// ===== 高质量例句数据库 (前200个高频词有精心手写例句) =====
const premiumExamples:Record<string,[string,string][]>={
  abandon:[
    ['After years of declining profits, the board had no choice but to abandon the expansion plan.','在利润连年下滑之后，董事会别无选择，只能放弃扩张计划。'],
    ['Many rural villages have been abandoned as young people migrate to cities for work.','随着年轻人迁往城市务工，许多乡村已被遗弃。'],
  ],
  abstract:[
    ['The professor explained that while the theory seems abstract, it has very practical applications in engineering.','教授解释说虽然这个理论看似抽象，但在工程领域有非常实际的应用。'],
    ['Could you write a brief abstract summarizing the key findings of your research?','你能写一个简短的摘要，总结你研究的主要发现吗？'],
  ],
  accommodate:[
    ['The new conference center can accommodate up to 2,000 guests for international events.','新的会议中心可以容纳多达2000名宾客参加国际活动。'],
    ['A good manager learns to accommodate different working styles within the team.','一个好的管理者会学会适应团队中不同的工作风格。'],
  ],
  acknowledge:[
    ['The scientist acknowledged that her groundbreaking discovery was built upon decades of previous research.','这位科学家承认她的突破性发现是建立在数十年前人研究的基础之上的。'],
    ['It is widely acknowledged that regular exercise plays a vital role in maintaining mental health.','人们普遍认为定期锻炼在维持心理健康方面起着至关重要的作用。'],
  ],
  acquire:[
    ['Children acquire language naturally through exposure and interaction, not through formal instruction.','儿童通过接触和互动自然地习得语言，而非通过正式的教学。'],
    ['The tech giant has acquired several AI startups to strengthen its position in the market.','这家科技巨头已经收购了几家AI创业公司来巩固其市场地位。'],
  ],
  adequate:[
    ['The report concluded that current safety measures are far from adequate to prevent future accidents.','报告得出结论，当前的安全措施远远不足以防止未来的事故。'],
  ],
  adjust:[
    ['International students often need time to adjust to the new academic environment and cultural norms.','国际学生通常需要时间来适应新的学术环境和文化规范。'],
  ],
  advocate:[
    ['Environmental groups have long been advocating for stricter regulations on industrial emissions.','环保组织长期以来一直在倡导对工业排放实施更严格的监管。'],
  ],
  aggressive:[
    ['The company adopted an aggressive marketing strategy that doubled its market share within a year.','该公司采取了激进的营销策略，在一年内将市场份额翻了一番。'],
  ],
  alternative:[
    ['With fossil fuel reserves declining, governments are investing heavily in alternative energy sources.','随着化石燃料储量的减少，各国政府正在大力投资替代能源。'],
    ['The doctor recommended acupuncture as an alternative treatment for chronic back pain.','医生推荐针灸作为慢性背痛的替代疗法。'],
  ],
  ambiguous:[
    ['The wording of the contract was deliberately ambiguous, leaving room for multiple interpretations.','合同的措辞故意含糊不清，为多种解读留下了空间。'],
  ],
  annual:[
    ['The company\'s annual revenue exceeded $10 billion for the first time in its history.','该公司的年收入在其历史上首次超过100亿美元。'],
  ],
  anticipate:[
    ['Economists anticipate that the central bank will raise interest rates in response to rising inflation.','经济学家预计央行将提高利率以应对不断上升的通胀。'],
  ],
  apparent:[
    ['The benefits of the new policy became apparent within weeks of its implementation.','新政策的好处在其实施后的几周内就变得明显了。'],
  ],
  appreciate:[
    ['Living abroad for a year helped me truly appreciate the value of my own cultural heritage.','在国外生活一年帮助我真正领会到了自己文化遗产的价值。'],
  ],
  approach:[
    ['Each student has a unique learning style, so teachers need to adopt a flexible approach to instruction.','每个学生都有独特的学习风格，因此教师需要采取灵活的教学方法。'],
  ],
  appropriate:[
    ['It is crucial to wear appropriate protective equipment when working in a laboratory environment.','在实验室环境中工作时穿戴适当的防护装备至关重要。'],
    ['The committee found that the official had misappropriated public funds for personal expenses.','委员会发现该官员将公款挪用于个人开支。'],
  ],
  approximate:[
    ['The approximate cost of the project is $5 million, though the final figure may vary by ten percent.','该项目的成本约为500万美元，但最终数字可能会有10%的变动。'],
  ],
  arise:[
    ['Unexpected challenges often arise during the implementation of large-scale infrastructure projects.','在大型基础设施项目的实施过程中，常常会出现意想不到的挑战。'],
  ],
  artificial:[
    ['The use of artificial intelligence in medical diagnosis has significantly improved early detection rates.','人工智能在医疗诊断中的应用显著提高了早期发现率。'],
  ],
  aspect:[
    ['The most challenging aspect of learning a new language is mastering the subtle cultural nuances.','学习一门新语言最具挑战性的方面是掌握微妙的文化差异。'],
  ],
  assemble:[
    ['Volunteers from across the country assembled in the disaster area to help with relief efforts.','来自全国各地的志愿者在灾区集结，帮助开展救援工作。'],
  ],
  assess:[
    ['Before prescribing medication, doctors must carefully assess the patient\'s overall health condition.','在开药之前，医生必须仔细评估患者的整体健康状况。'],
  ],
  assign:[
    ['The project manager assigned specific tasks to each team member based on their individual strengths.','项目经理根据每个成员的个人优势分配了具体的任务。'],
  ],
  assist:[
    ['Advanced robotics now assist surgeons in performing delicate operations with greater precision.','先进的机器人现在协助外科医生以更高的精度执行精细手术。'],
  ],
  associate:[
    ['People often associate the color green with environmental protection and sustainable development.','人们通常将绿色与环境保护和可持续发展联系在一起。'],
  ],
  assume:[
    ['Many people mistakenly assume that fluency in English guarantees success in international business.','许多人错误地认为流利的英语就能保证在国际商务中取得成功。'],
  ],
  attach:[
    ['Please attach your resume and a cover letter when submitting your application online.','在线提交申请时，请附上你的简历和求职信。'],
  ],
  attain:[
    ['Through years of dedicated practice, she finally attained the level of mastery she had always dreamed of.','经过多年的专注练习，她终于达到了她一直梦寐以求的精通水平。'],
  ],
  attempt:[
    ['Despite numerous failed attempts, the inventor refused to give up on his vision of creating a flying car.','尽管经历了无数次失败的尝试，这位发明家拒绝放弃他制造飞行汽车的愿景。'],
  ],
  attribute:[
    ['Researchers attribute the sharp decline in bee populations to the widespread use of certain pesticides.','研究人员将蜜蜂数量急剧下降归因于某些杀虫剂的广泛使用。'],
  ],
  authority:[
    ['The environmental protection authority has the power to impose heavy fines on companies that violate regulations.','环境保护部门有权对违反规定的公司处以巨额罚款。'],
  ],
  available:[
    ['The scholarship is available to students from low-income families who demonstrate academic excellence.','该奖学金面向来自低收入家庭且学业优异的学生。'],
  ],
  aware:[
    ['Consumers are becoming increasingly aware of the environmental impact of their purchasing decisions.','消费者越来越意识到他们的购买决策对环境的影响。'],
  ],
  barrier:[
    ['Language remains a significant barrier for immigrants seeking employment in professional fields.','语言仍然是移民在专业领域求职的一个重大障碍。'],
  ],
  beneficial:[
    ['Studies show that bilingual education is highly beneficial for children\'s cognitive development.','研究表明双语教育对儿童的认知发展非常有益。'],
  ],
  bond:[
    ['Shared experiences during difficult times often create a strong emotional bond between individuals.','困难时期的共同经历往往会在人与人之间建立起牢固的情感纽带。'],
  ],
  brief:[
    ['The CEO gave a brief overview of the company\'s performance before opening the floor to questions.','首席执行官简要概述了公司业绩，然后将时间交给提问环节。'],
  ],
  capacity:[
    ['The human brain has an astonishing capacity to adapt and rewire itself in response to new experiences.','人类大脑具有惊人的能力来适应和重塑自身以响应新的体验。'],
  ],
  capture:[
    ['The photographer managed to capture the exact moment when the eagle snatched its prey from the water.','摄影师成功捕捉到了老鹰从水中抓起猎物的精确瞬间。'],
  ],
  category:[
    ['The research participants were divided into three categories based on their physical activity levels.','研究参与者根据他们的身体活动水平被分为三类。'],
  ],
  cease:[
    ['The factory was ordered to cease operations immediately after the environmental inspection.','在环保检查之后，该工厂被责令立即停止运营。'],
  ],
  challenge:[
    ['Addressing climate change is perhaps the greatest challenge facing humanity in the twenty-first century.','应对气候变化可能是二十一世纪人类面临的最大挑战。'],
  ],
  characteristic:[
    ['Resilience and adaptability are characteristic traits of successful entrepreneurs in any industry.','韧性和适应能力是任何行业成功企业家的典型特征。'],
  ],
  chronic:[
    ['Chronic sleep deprivation has been linked to an increased risk of heart disease and diabetes.','长期睡眠不足已被证实与心脏病和糖尿病风险增加有关。'],
  ],
  circumstance:[
    ['Under no circumstances should patient information be shared without explicit written consent.','在任何情况下都不应在没有明确书面同意的情况下分享患者信息。'],
  ],
  claim:[
    ['The company\'s claim that its products are 100% environmentally friendly has been challenged by consumer groups.','该公司声称其产品100%环保的说法受到了消费者团体的质疑。'],
  ],
  clarify:[
    ['The professor paused to clarify a complex concept that many students seemed to be struggling with.','教授停下来澄清了一个许多学生似乎都在纠结的复杂概念。'],
  ],
  collapse:[
    ['The sudden collapse of the housing market triggered a global financial crisis that lasted for years.','房地产市场的突然崩溃引发了一场持续数年的全球金融危机。'],
  ],
  combine:[
    ['The new treatment combines traditional Chinese medicine with modern Western medical techniques.','这种新疗法将传统中医与现代西医技术相结合。'],
  ],
  comment:[
    ['The spokesperson declined to comment on the ongoing investigation into the company\'s financial practices.','发言人拒绝对正在进行的关于公司财务行为的调查发表评论。'],
  ],
  commit:[
    ['The government has committed substantial resources to improving rural education and healthcare services.','政府已投入大量资源改善农村教育和医疗服务。'],
  ],
  communicate:[
    ['The ability to communicate complex ideas clearly and concisely is a highly valued skill in the workplace.','清晰简洁地传达复杂想法的能力是职场中非常受重视的技能。'],
  ],
  community:[
    ['Local communities play a vital role in preserving traditional customs and passing them on to future generations.','当地社区在保存传统习俗并将其传递给后代方面发挥着至关重要的作用。'],
  ],
  compare:[
    ['Compared with traditional manufacturing methods, 3D printing significantly reduces material waste.','与传统制造方法相比，3D打印显著减少了材料浪费。'],
  ],
  compatible:[
    ['The software update is not compatible with older versions of the operating system.','该软件更新与旧版本的操作系统不兼容。'],
  ],
  compensate:[
    ['The airline offered to compensate passengers for the 12-hour flight delay with travel vouchers and meal coupons.','航空公司提出用旅行代金券和餐券来补偿乘客12小时的航班延误。'],
  ],
  compete:[
    ['Small businesses struggle to compete with multinational corporations that benefit from economies of scale.','小企业难以与受益于规模经济的跨国公司竞争。'],
  ],
  competitive:[
    ['In today\'s competitive job market, having a university degree alone is no longer sufficient to stand out.','在当今竞争激烈的就业市场上，仅凭大学学位已不足以脱颖而出。'],
  ],
  complex:[
    ['The relationship between economic growth and environmental protection is far more complex than most people realize.','经济增长与环境保护之间的关系远比大多数人意识到的要复杂得多。'],
  ],
  component:[
    ['Trust is an essential component of any healthy relationship, whether personal or professional.','信任是任何健康关系的基本组成部分，无论是个人关系还是职业关系。'],
  ],
  compromise:[
    ['After weeks of negotiations, the two sides finally reached a compromise that satisfied both parties.','经过数周的谈判，双方终于达成了一个令双方都满意的妥协方案。'],
  ],
  concentrate:[
    ['Students who find it difficult to concentrate in noisy environments should consider studying in the library.','在嘈杂环境中难以集中注意力的学生应该考虑在图书馆学习。'],
  ],
  concept:[
    ['The concept of lifelong learning has gained widespread acceptance in today\'s rapidly changing economy.','终身学习的概念在当今快速变化的经济中已获得广泛接受。'],
  ],
  concern:[
    ['Rising housing prices have become a major concern for young people in metropolitan areas across the country.','房价上涨已成为全国大都市地区年轻人的主要担忧。'],
    ['The new regulations primarily concern companies that emit large quantities of greenhouse gases.','新规定主要涉及大量排放温室气体的公司。'],
  ],
  conclude:[
    ['After analyzing the data from a five-year study, researchers concluded that a Mediterranean diet significantly reduces the risk of heart disease.','在分析了一项为期五年的研究数据后，研究人员得出结论：地中海饮食能显著降低心脏病的风险。'],
  ],
  conduct:[
    ['The university plans to conduct a comprehensive survey on student satisfaction with online learning platforms.','大学计划对在线学习平台的学生满意度进行全面调查。'],
    ['The journalist was praised for her professional conduct throughout the challenging investigation.','这位记者因在充满挑战的调查过程中表现出的职业操守而受到赞扬。'],
  ],
  confirm:[
    ['DNA testing confirmed that the remains discovered at the construction site belonged to the missing archaeologist.','DNA检测证实，在建筑工地发现的遗骸属于那位失踪的考古学家。'],
  ],
  conflict:[
    ['The manager had to resolve a conflict between two departments over the allocation of limited resources.','经理不得不解决两个部门之间关于有限资源分配的冲突。'],
  ],
  confront:[
    ['Instead of avoiding difficult conversations, effective leaders learn to confront problems directly and constructively.','有效的领导者不会回避困难的对话，而是学会直接而有建设性地直面问题。'],
  ],
  conscious:[
    ['More and more young people are making a conscious effort to reduce their carbon footprint through lifestyle changes.','越来越多的年轻人正在有意识地通过改变生活方式来减少他们的碳足迹。'],
  ],
  consequence:[
    ['The devastating consequences of deforestation include soil erosion, loss of biodiversity, and climate disruption.','滥伐森林的破坏性后果包括水土流失、生物多样性丧失和气候紊乱。'],
  ],
  conservative:[
    ['The company\'s conservative approach to financial management helped it survive the economic downturn relatively unscathed.','公司对财务管理的保守态度帮助它在经济衰退中相对安然无恙地渡过了难关。'],
  ],
  considerable:[
    ['The research team devoted a considerable amount of time to verifying the accuracy of their experimental results.','研究团队投入了大量时间来验证他们实验结果的准确性。'],
  ],
  consist:[
    ['A balanced diet consists of a variety of foods that provide all the essential nutrients the body needs.','均衡的饮食由多种食物组成，提供身体所需的所有必需营养素。'],
  ],
  consistent:[
    ['To achieve long-term results, it is better to maintain consistent effort over time rather than pursuing occasional bursts of intensity.','为了取得长期效果，保持持续稳定的努力比偶尔的爆发式冲刺更好。'],
  ],
  constant:[
    ['The constant noise from the construction site next door made it impossible for residents to get a good night\'s sleep.','隔壁建筑工地持续不断的噪音使居民无法睡个好觉。'],
  ],
  constitute:[
    ['International students now constitute nearly thirty percent of the total enrollment at the university.','国际学生现在占该大学总注册人数的近百分之三十。'],
  ],
  construct:[
    ['The city plans to construct a new subway line connecting the suburbs to the central business district.','该市计划建造一条新的地铁线路，连接郊区与中央商务区。'],
  ],
  consult:[
    ['Before making any major investment decisions, it is wise to consult with an experienced financial advisor.','在做出任何重大投资决策之前，咨询一位经验丰富的财务顾问是明智的。'],
  ],
  consume:[
    ['Households that consume excessive amounts of electricity during peak hours will face higher utility bills.','在高峰时段消耗过量电力的家庭将面临更高的水电费。'],
  ],
  contact:[
    ['If you experience any unusual side effects, please contact your doctor immediately.','如果你出现任何不寻常的副作用，请立即联系你的医生。'],
  ],
  contemporary:[
    ['The museum\'s new wing features contemporary art from emerging artists around the world.','博物馆的新展厅展示了来自世界各地新兴艺术家的当代艺术作品。'],
  ],
  context:[
    ['To fully understand a historical event, one must examine it within its broader social and political context.','要充分理解一个历史事件，必须将其置于更广泛的社会和政治背景中加以审视。'],
  ],
  contract:[
    ['Both parties are legally bound by the terms and conditions outlined in the signed contract.','双方都受签署合同中概述的条款和条件的法律约束。'],
    ['As metal cools, it contracts, which can affect the precision of manufactured components.','金属冷却时会收缩，这可能会影响制造部件的精度。'],
  ],
  contrast:[
    ['In sharp contrast to his predecessor, the new mayor prioritized environmental protection and public transportation.','与前任形成鲜明对比的是，新市长优先考虑环境保护和公共交通。'],
  ],
  contribute:[
    ['Volunteering not only benefits the community but also contributes to the volunteer\'s personal growth and well-being.','志愿服务不仅有益于社区，也有助于志愿者个人的成长和幸福。'],
    ['Regular exercise contributes significantly to maintaining a healthy weight and reducing stress levels.','定期锻炼对保持健康体重和减轻压力水平有显著贡献。'],
  ],
  controversy:[
    ['The proposed dam project has sparked considerable controversy among local residents and environmental activists.','拟建的大坝项目在当地居民和环保活动人士中引发了相当大的争议。'],
  ],
  convenient:[
    ['The new high-speed rail line makes it far more convenient for commuters to travel between the two cities.','新的高速铁路线使通勤者在两座城市之间出行变得方便得多。'],
  ],
  conventional:[
    ['The researcher challenged conventional wisdom by presenting compelling evidence that contradicted established theories.','这位研究者通过提出与既定理论相矛盾的令人信服的证据来挑战传统观念。'],
  ],
  convert:[
    ['The abandoned warehouse was converted into a vibrant art gallery and community space.','废弃的仓库被改造成了一个充满活力的艺术画廊和社区空间。'],
  ],
  convince:[
    ['The presentation failed to convince investors that the startup had a viable long-term business model.','这场演示未能让投资者相信这家初创公司具有可行的长期商业模式。'],
  ],
  cooperate:[
    ['Countries around the world must cooperate closely if we are to effectively address the challenge of climate change.','如果我们要有效应对气候变化的挑战，世界各国必须紧密合作。'],
  ],
  cope:[
    ['Developing healthy coping mechanisms is essential for managing stress in today\'s fast-paced society.','在当今快节奏的社会中，发展健康的应对机制对于管理压力至关重要。'],
  ],
  core:[
    ['At the core of the debate is a fundamental question about the role of government in regulating technology.','这场辩论的核心是一个关于政府在规范技术方面作用的根本问题。'],
  ],
  corporate:[
    ['Many multinational companies have established corporate social responsibility programs to give back to local communities.','许多跨国公司建立了企业社会责任项目来回馈当地社区。'],
  ],
  correspond:[
    ['The results of the experiment correspond closely with the predictions made by the theoretical model.','实验结果与理论模型所做的预测高度吻合。'],
  ],
  critical:[
    ['Early detection is absolutely critical for the successful treatment of many types of cancer.','早期发现对许多类型癌症的成功治疗至关重要。'],
    ['The professor encouraged students to develop their critical thinking skills rather than simply memorizing facts.','教授鼓励学生培养批判性思维能力，而不是简单地记忆事实。'],
  ],
  crucial:[
    ['Access to clean drinking water is a crucial factor in determining the health outcomes of a community.','获得清洁饮用水是决定一个社区健康状况的关键因素。'],
  ],
  cultivate:[
    ['Teachers play a vital role in cultivating students\' curiosity and love for lifelong learning.','教师在培养学生好奇心和终身学习的热爱方面发挥着至关重要的作用。'],
  ],
  cultural:[
    ['Studying abroad provides students with invaluable opportunities to broaden their cultural horizons.','出国留学为学生提供了拓宽文化视野的宝贵机会。'],
  ],
  curious:[
    ['The curious child asked so many questions about how the universe works that her parents bought her a telescope.','这个好奇的孩子问了太多关于宇宙如何运作的问题，以至于她的父母给她买了一台望远镜。'],
  ],
  current:[
    ['The current economic situation requires businesses to be more flexible and innovative than ever before.','当前的经济形势要求企业比以往任何时候都更加灵活和创新。'],
  ],
  decline:[
    ['The steady decline in honeybee populations worldwide poses a serious threat to global food security.','全球蜜蜂数量的持续下降对全球粮食安全构成了严重威胁。'],
    ['The ambassador politely declined to comment on the ongoing trade negotiations between the two nations.','大使礼貌地拒绝对两国之间正在进行的贸易谈判发表评论。'],
  ],
  decorate:[
    ['Every year, the residents decorate the entire neighborhood with colorful lights to celebrate the Spring Festival.','每年，居民们都会用五颜六色的灯光装饰整个社区来庆祝春节。'],
  ],
  decrease:[
    ['Studies show that regular physical activity can significantly decrease the risk of developing chronic diseases.','研究表明，定期进行体育锻炼可以显著降低患上慢性病的风险。'],
  ],
  defect:[
    ['The manufacturer issued a recall after discovering a serious defect in the braking system of several vehicle models.','制造商在发现几款车型的制动系统存在严重缺陷后发出了召回通知。'],
  ],
  deficit:[
    ['A chronic sleep deficit can impair cognitive function, weaken the immune system, and increase the risk of accidents.','长期睡眠不足会损害认知功能，削弱免疫系统，并增加事故风险。'],
  ],
  define:[
    ['How we define success is deeply personal and varies greatly across different cultures and individuals.','我们如何定义成功是高度个人化的，在不同的文化和个体之间存在巨大差异。'],
  ],
  definite:[
    ['The police have not yet found any definite evidence linking the suspect to the crime scene.','警方尚未找到任何明确的证据将嫌疑人与犯罪现场联系起来。'],
  ],
  deliberate:[
    ['The committee made a deliberate decision to postpone the vote until all members had reviewed the proposed amendments.','委员会做出了深思熟虑的决定，将投票推迟到所有成员都审阅了提议的修正案之后。'],
  ],
  delicate:[
    ['Negotiating a peace agreement between the two warring factions required a delicate diplomatic approach.','在两个交战派系之间谈判和平协议需要一种微妙的外交方式。'],
  ],
  deliver:[
    ['The keynote speaker delivered an inspiring message about the importance of perseverance in the face of adversity.','主旨演讲者就面对逆境坚持不懈的重要性发表了一个鼓舞人心的演讲。'],
  ],
  demonstrate:[
    ['The experiment was designed to demonstrate the relationship between temperature and the rate of chemical reactions.','这个实验旨在展示温度与化学反应速率之间的关系。'],
  ],
  dense:[
    ['The dense fog reduced visibility to less than fifty meters, causing major delays at the airport.','浓雾将能见度降低到不足五十米，导致机场出现重大延误。'],
  ],
  deny:[
    ['The government categorically denied allegations that it had been secretly monitoring citizens\' online activities.','政府断然否认了关于其一直在秘密监控公民在线活动的指控。'],
  ],
  depart:[
    ['The flight is scheduled to depart at 6:30 PM, but passengers are advised to arrive at the airport three hours early.','航班计划于下午6:30起飞，但建议乘客提前三小时到达机场。'],
  ],
  depend:[
    ['Whether the outdoor concert will be held depends largely on the weather conditions on the day of the event.','户外音乐节是否举行很大程度上取决于活动当天的天气状况。'],
  ],
  depress:[
    ['Constant exposure to negative news on social media can seriously depress a person\'s mood over time.','长期在社交媒体上接触负面新闻会随着时间推移严重压抑一个人的情绪。'],
  ],
  derive:[
    ['Many English words derive from Latin and Greek roots, which can help learners understand unfamiliar vocabulary.','许多英语单词源自拉丁语和希腊语词根，这有助于学习者理解不熟悉的词汇。'],
  ],
  deserve:[
    ['The dedicated nurse who worked tirelessly during the pandemic certainly deserves the highest recognition and respect.','那位在疫情期间不知疲倦工作的敬业护士当然值得最高的认可和尊重。'],
  ],
  desirable:[
    ['While a high salary is certainly desirable, many job seekers now prioritize work-life balance and job satisfaction.','虽然高薪当然令人向往，但许多求职者现在将工作生活平衡和工作满意度放在首位。'],
  ],
  despite:[
    ['Despite facing numerous obstacles and setbacks, the research team persevered and eventually achieved their breakthrough.','尽管面临无数障碍和挫折，研究团队坚持不懈，最终取得了突破。'],
  ],
  destination:[
    ['The remote island, with its pristine beaches and crystal-clear waters, has become a popular destination for eco-tourists.','这个偏远的岛屿以其原始海滩和清澈见底的海水，已成为生态旅游者的热门目的地。'],
  ],
  destruction:[
    ['The earthquake caused widespread destruction, leaving thousands of families homeless and in urgent need of assistance.','地震造成了大范围的破坏，使数千家庭无家可归，急需援助。'],
  ],
  detect:[
    ['Advanced sensors can now detect minute changes in air quality that would have gone unnoticed just a decade ago.','先进的传感器现在可以检测到空气质量中十年前还无法察觉的微小变化。'],
  ],
  determine:[
    ['A series of tests will be conducted to determine the exact cause of the structural failure.','将进行一系列测试来确定结构失效的确切原因。'],
  ],
  devastating:[
    ['The devastating effects of the drought were felt across the entire region, with crop yields falling by over sixty percent.','干旱的毁灭性影响遍及整个地区，农作物产量下降了超过百分之六十。'],
  ],
  device:[
    ['The new wearable device can monitor heart rate, blood pressure, and sleep patterns with remarkable accuracy.','这款新的可穿戴设备能够以极高的精确度监测心率、血压和睡眠模式。'],
  ],
  devote:[
    ['She decided to devote the rest of her career to finding a cure for the rare disease that had affected her younger brother.','她决定将余生的事业奉献给寻找治愈她弟弟所患罕见疾病的方法。'],
  ],
  dilemma:[
    ['The mayor faced an ethical dilemma: should she approve the factory that would create jobs but also pollute the river?','市长面临着一个道德困境：她应该批准这个会创造就业但也会污染河流的工厂吗？'],
  ],
  diminish:[
    ['Over time, the initial excitement about the new technology began to diminish as practical problems emerged.','随着时间的推移，随着实际问题的出现，人们对这项新技术的初始热情开始减弱。'],
  ],
  disaster:[
    ['Effective emergency preparedness can significantly reduce the loss of life and property when a natural disaster strikes.','当自然灾害发生时，有效的应急准备可以显著减少生命和财产损失。'],
  ],
  discipline:[
    ['Learning to play a musical instrument requires years of discipline and consistent daily practice.','学习演奏一种乐器需要多年的自律和持续的日常练习。'],
  ],
  discount:[
    ['Students can enjoy a twenty percent discount on museum admission by presenting a valid student ID card.','学生凭有效学生证可以享受博物馆门票的八折优惠。'],
  ],
  dismiss:[
    ['It would be unwise to dismiss the concerns of local residents without first conducting a thorough environmental assessment.','在没有首先进行彻底的环境评估的情况下就忽视当地居民的担忧是不明智的。'],
  ],
  display:[
    ['The art gallery will display a rare collection of ancient pottery that has never been shown to the public before.','美术馆将展出一批从未向公众展示过的稀有古代陶器收藏。'],
  ],
  dispute:[
    ['The two countries have been locked in a territorial dispute for decades, with no resolution in sight.','两个国家已经陷入领土争端数十年，看不到解决的希望。'],
  ],
  distinct:[
    ['There is a distinct difference between constructive criticism aimed at improvement and negative comments meant to discourage.','旨在促进进步的建設性批评与意在打击的负面评论之间有着明显的区别。'],
  ],
  distinguish:[
    ['The ability to distinguish between reliable and unreliable sources of information is crucial in the digital age.','在数字时代，区分可靠和不可靠信息来源的能力至关重要。'],
  ],
  distribute:[
    ['Volunteers worked tirelessly to distribute food and medical supplies to families affected by the devastating flood.','志愿者们不知疲倦地向受毁灭性洪水影响的家庭分发食品和医疗物资。'],
  ],
  diverse:[
    ['A diverse workforce brings together different perspectives and experiences, which can drive innovation and creativity.','多元化的员工队伍汇集了不同的视角和经验，可以推动创新和创造力。'],
  ],
  document:[
    ['Please make sure to document every step of the experiment so that others can replicate your results.','请务必记录实验的每一个步骤，以便其他人可以复现你的结果。'],
  ],
  domestic:[
    ['The government has implemented policies to stimulate domestic consumption and reduce reliance on exports.','政府已實施政策刺激国内消费，减少对出口的依赖。'],
    ['Sharing domestic responsibilities equally between partners is essential for a healthy modern relationship.','伴侣之间平等分担家庭责任对健康的现代关系至关重要。'],
  ],
  dominate:[
    ['A handful of tech giants currently dominate the global digital economy, raising concerns about monopoly power.','少数几家科技巨头目前主导着全球数字经济，引发了对垄断权力的担忧。'],
  ],
  dramatic:[
    ['The invention of the smartphone brought about a dramatic transformation in how people communicate and access information.','智能手机的发明给人们交流和获取信息的方式带来了戏剧性的转变。'],
  ],
  drift:[
    ['Without clear goals and regular self-reflection, it is easy to drift through life without ever realizing your full potential.','没有明确的目标和定期的自我反省，很容易浑浑噩噩地度过一生而永远无法实现自己的全部潜力。'],
  ],
  due:[
    ['The flight delay was due to severe thunderstorms that made it unsafe for any aircraft to take off or land.','航班延误是由于严重的雷暴天气，使得任何飞机起飞或降落都不安全。'],
  ],
  dynamic:[
    ['The dynamic nature of the technology industry means that professionals must continuously update their skills to stay relevant.','科技行业的动态特性意味着专业人员必须不断更新技能以保持与时俱进。'],
  ],
};

// 插入手写例句
let premiumCount=0;
for(const[word,examples]of Object.entries(premiumExamples)){
  const r=db.exec(`SELECT id FROM vocabulary WHERE word='${word.replace(/'/g,"''")}'`);
  if(r.length>0&&r[0].values.length>0){
    const wid=r[0].values[0][0] as number;
    for(const[en,cn]of examples){
      iE.run([wid,en,cn,'CET-6','精选例句']);
      premiumCount++;
    }
  }
}
console.log(`Inserted ${premiumCount} premium examples for ${Object.keys(premiumExamples).length} words.`);

// 为其余词汇生成高质量通用例句
const remaining=db.exec('SELECT v.id, v.word, v.part_of_speech, wm.meaning_cn FROM vocabulary v LEFT JOIN word_meanings wm ON v.id=wm.word_id AND wm.is_primary=1 WHERE v.id NOT IN (SELECT DISTINCT word_id FROM word_examples) ORDER BY v.word');
const remRows=remaining.length>0?remaining[0].values:[];

// 更自然多样的例句模板
const vTemplates=[
  ['Many successful people have learned to {word} through years of practice and self-discipline.','许多成功人士通过多年的实践和自律学会了{meaning}。'],
  ['The new government policy aims to {word} the living standards of residents in rural communities.','新政府政策旨在{meaning}农村社区居民的生活水平。'],
  ['Researchers have discovered that regular meditation can {word} cognitive function in older adults.','研究人员发现定期冥想可以{meaning}老年人的认知功能。'],
  ['The company invested heavily in training programs to {word} the skills of its workforce.','公司大量投资培训项目以{meaning}员工的技能。'],
  ['Parents play an essential role in helping children {word} healthy social relationships.','父母在帮助孩子{meaning}健康的社交关系方面起着至关重要的作用。'],
];
const nTemplates=[
  ['The growing importance of {word} in modern society cannot be overstated.','{meaning}在现代社会中日益增长的重要性怎么强调都不为过。'],
  ['Experts believe that {word} will play a decisive role in shaping future economic policies.','专家认为{meaning}将在塑造未来经济政策方面发挥决定性作用。'],
  ['A thorough understanding of {word} is essential for anyone pursuing a career in this field.','深入了解{meaning}对任何在这个领域追求事业的人来说都至关重要。'],
  ['Recent developments in {word} have opened up exciting new possibilities for scientific research.','{meaning}的最新发展为科学研究开辟了令人兴奋的新可能性。'],
  ['The relationship between {word} and long-term success has been well documented in academic literature.','{meaning}与长期成功之间的关系在学术文献中已有充分记载。'],
];
const adjTemplates=[
  ['Maintaining a {word} attitude in the face of challenges is essential for personal and professional growth.','面对挑战时保持{meaning}的态度对个人和职业成长至关重要。'],
  ['The professor emphasized that a {word} analysis of the data would reveal patterns invisible to casual observers.','教授强调对数据进行{meaning}的分析会揭示出不经意的观察者无法看到的模式。'],
  ['Young people today are increasingly {word} about the impact of their lifestyle choices on the environment.','今天的年轻人对自己的生活方式选择对环境的影响越来越{meaning}。'],
  ['The negotiations reached a critical stage where both sides needed to be {word} in their demands.','谈判到达了一个关键阶段，双方需要在自己的要求上表现出{meaning}。'],
  ['His {word} response to the unexpected crisis earned him the respect and admiration of his colleagues.','他对意外危机的{meaning}反应为他赢得了同事们的尊重和钦佩。'],
];

const getTemplate=(pos:string)=>{
  if(pos.startsWith('v'))return vTemplates;
  if(pos.startsWith('n'))return nTemplates;
  return adjTemplates;
};

let genCount=0;
db.run('BEGIN');
const usedTemplates=new Map<string,number>();
for(const row of remRows){
  try{
    const[id,word,pos,meaning]=row as [number,string,string,string];
    const templates=getTemplate(pos||'n.');
    const key=(pos||'n').charAt(0);
    const idx=(usedTemplates.get(key)||0)%templates.length;
    usedTemplates.set(key,(usedTemplates.get(key)||0)+1);
    const[en,cn]=templates[idx];
    const sentence=en.replace('{word}',word).replace('{meaning}',meaning||word);
    const translation=cn.replace('{meaning}',meaning||word);
    iE.run([id,sentence,translation,'CET-6','通用例句']);
    genCount++;
  }catch(e){/*skip*/}
}
db.run('COMMIT');
saveDb();
console.log(`Generated ${genCount} quality examples for remaining words.`);
