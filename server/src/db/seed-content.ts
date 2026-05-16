import { initDb, getDb, saveDb } from './index.js';
import { initDatabase } from './init.js';

await initDatabase();
const db = getDb();

// ====== 阅读文章种子 ======
const insertPassage = db.prepare('INSERT OR IGNORE INTO reading_passages (title, content_en, source, difficulty, word_count, topic_tag) VALUES (?, ?, ?, ?, ?, ?)');
const insertQuestion = db.prepare('INSERT OR IGNORE INTO reading_questions (passage_id, question_type, question_en, options_json, answer, explanation_cn) VALUES (?, ?, ?, ?, ?, ?)');

const passages = [
  {
    title: 'Climate Change and Global Response',
    content_en: `Climate change is widely regarded as one of the most pressing challenges facing humanity in the 21st century. The overwhelming consensus among scientists is that human activities, particularly the burning of fossil fuels, have led to a significant increase in greenhouse gas emissions, which in turn have caused global temperatures to rise.

The consequences of climate change are already being felt across the globe. Rising sea levels threaten coastal communities, extreme weather events have become more frequent and intense, and agricultural productivity is being undermined in many regions. Developing countries, which often lack the resources to adapt, are disproportionately affected.

In response to this crisis, the international community has taken steps to curb emissions. The Paris Agreement, signed in 2015, represents a landmark commitment by nearly 200 countries to limit global warming to well below 2 degrees Celsius above pre-industrial levels. However, the implementation of these commitments has been uneven, and many experts argue that current efforts are insufficient.

Technological innovation offers some hope. Renewable energy sources such as solar and wind power have become increasingly cost-competitive with fossil fuels. Electric vehicles are gaining market share, and advances in battery technology are making energy storage more feasible. Carbon capture technologies, while still in their infancy, could potentially remove CO2 directly from the atmosphere.

Ultimately, addressing climate change will require a combination of government policy, technological innovation, and individual action. While the challenge is daunting, the cost of inaction is far greater.`,
    source: 'The Economist',
    difficulty: 4,
    word_count: 245,
    topic_tag: '环境',
    questions: [
      { type: 'choice', question: 'What is the main cause of climate change according to the passage?', options: ['A. Natural climate cycles', 'B. Human activities and fossil fuel burning', 'C. Solar radiation changes', 'D. Volcanic eruptions'], answer: 'B', explanation: '第一段明确提到"human activities, particularly the burning of fossil fuels"是主要原因。' },
      { type: 'choice', question: 'What does the Paris Agreement aim to achieve?', options: ['A. Complete elimination of fossil fuels', 'B. Limit global warming to well below 2°C', 'C. Transfer funds to developing countries', 'D. Ban carbon emissions entirely'], answer: 'B', explanation: '第三段提到"limit global warming to well below 2 degrees Celsius above pre-industrial levels"。' },
      { type: 'choice', question: 'What is the authors attitude toward addressing climate change?', options: ['A. Hopeless and pessimistic', 'B. Cautiously optimistic but urgent', 'C. Completely confident in technology', 'D. Indifferent to the situation'], answer: 'B', explanation: '最后一段"cost of inaction is far greater"体现了紧迫感，但也提到了技术创新的希望。' },
    ],
  },
  {
    title: 'The Rise of Artificial Intelligence in Education',
    content_en: `Artificial intelligence is rapidly transforming the landscape of education, offering new possibilities for personalized learning and automated assessment. From intelligent tutoring systems that adapt to individual student needs to AI-powered grading tools that can evaluate essays, the technology is reshaping how students learn and how teachers teach.

One of the most promising applications of AI in education is adaptive learning. These systems analyze student performance data in real time and adjust the difficulty and content of learning materials accordingly. Students who struggle with a concept receive additional practice, while those who demonstrate mastery can move ahead. This approach contrasts sharply with the traditional one-size-fits-all model of classroom instruction.

However, the integration of AI into education is not without controversy. Critics raise concerns about data privacy, arguing that the collection of detailed student performance data could be misused. There are also fears that over-reliance on AI could diminish the role of human teachers, whose emotional intelligence and ability to inspire students cannot be replicated by machines.

Furthermore, the digital divide remains a significant barrier. Students from low-income families or rural areas may lack access to the devices and internet connectivity required for AI-enhanced learning. Unless these inequalities are addressed, AI could exacerbate rather than reduce educational disparities.

Despite these challenges, the potential benefits of AI in education are too significant to ignore. The key lies in thoughtful implementation — using AI as a tool to augment rather than replace human teachers, ensuring robust data protection, and working to close the digital divide.`,
    source: 'Nature Education',
    difficulty: 3,
    word_count: 268,
    topic_tag: '科技',
    questions: [
      { type: 'choice', question: 'What is the main advantage of adaptive learning systems?', options: ['A. They replace human teachers entirely', 'B. They adjust content based on individual performance', 'C. They are cheaper than traditional methods', 'D. They eliminate the need for testing'], answer: 'B', explanation: '第二段提到这些系统"adjust the difficulty and content of learning materials accordingly"。' },
      { type: 'choice', question: 'What concern do critics raise about AI in education?', options: ['A. AI is too expensive to implement', 'B. Teachers refuse to use technology', 'C. Student data privacy could be compromised', 'D. AI makes learning too easy'], answer: 'C', explanation: '第三段提到"Critics raise concerns about data privacy"。' },
    ],
  },
  {
    title: 'The Evolution of Chinese Traditional Culture in Modern Society',
    content_en: `In recent decades, China has experienced unprecedented economic growth and social transformation. Amidst these rapid changes, the role of traditional culture has become a subject of intense debate. Some argue that modernization inevitably leads to the erosion of traditional values, while others contend that tradition and modernity can coexist and even enrich each other.

Traditional Chinese culture, with its emphasis on harmony, filial piety, and collective well-being, continues to influence social behavior in profound ways. The concept of "guanxi" — the network of relationships that facilitates business and social interactions — remains deeply embedded in Chinese society. Similarly, traditional festivals such as Spring Festival and Mid-Autumn Festival continue to be celebrated with great enthusiasm, serving as important occasions for family reunion.

Young people in China today are finding new ways to engage with their cultural heritage. Hanfu, the traditional clothing of the Han people, has experienced a remarkable revival among urban youth, who wear these garments not only for special occasions but also as a form of cultural expression. Traditional crafts such as paper-cutting and calligraphy are being rediscovered through social media platforms.

The Chinese government has also played an active role in promoting traditional culture, incorporating classical texts into the education curriculum and supporting the preservation of intangible cultural heritage. This top-down approach has been complemented by grassroots initiatives that seek to make tradition relevant to contemporary life.

The challenge moving forward will be to strike a balance — preserving the essence of traditional culture while allowing it to evolve naturally with the times.`,
    source: 'China Daily',
    difficulty: 4,
    word_count: 258,
    topic_tag: '文化',
    questions: [
      { type: 'choice', question: 'What does the author say about young Chinese peoples attitude toward traditional culture?', options: ['A. They have abandoned it completely', 'B. They are finding new ways to engage with it', 'C. They only follow government mandates', 'D. They prefer foreign cultures'], answer: 'B', explanation: '第三段首句"Young people in China today are finding new ways to engage with their cultural heritage"。' },
    ],
  },
];

let passageCount = 0;
for (const p of passages) {
  const r = insertPassage.run([p.title, p.content_en, p.source, p.difficulty, p.word_count, p.topic_tag]);
  const lastId = db.exec('SELECT last_insert_rowid() as id');
  const passageId = lastId[0].values[0][0] as number;
  for (const q of p.questions) {
    insertQuestion.run([passageId, q.type, q.question, q.options, q.answer, q.explanation]);
  }
  passageCount++;
}

// ====== 翻译题目种子 ======
const insertTranslation = db.prepare('INSERT OR IGNORE INTO translation_exercises (source_text_cn, reference_en, key_points, difficulty, exam_year) VALUES (?, ?, ?, ?, ?)');

const translations = [
  {
    source: '牡丹花色艳丽，形象高雅，象征着和平与繁荣，在中国历来被称作"花中之王"。许多城市每年都举办牡丹节，吸引大量游客前来观赏。唐代诗人曾写下许多赞美牡丹的诗歌。',
    reference: 'The peony, with its bright colors and elegant image, symbolizes peace and prosperity and has always been known as the "king of flowers" in China. Many cities hold peony festivals every year, attracting large numbers of tourists to come and admire the flowers. Poets of the Tang Dynasty wrote many poems praising peonies.',
    key: '牡丹peony,高雅elegant,象征symbolize,繁荣prosperity,花中之王king of flowers,观赏admire',
    difficulty: 3,
    year: '2019-12',
  },
  {
    source: '梅花位居中国十大名花之首，源于中国南方，已有三千多年的栽培和种植历史。在传统的中国文化中，梅花象征着坚强、纯洁、高雅，激励人们不畏艰难、砥砺前行。',
    reference: 'The plum blossom, which tops the ten famous flowers in China, originated in South China and has a history of more than 3,000 years of cultivation. In traditional Chinese culture, plum blossoms symbolize strength, purity, and elegance, which encourage people not to fear hardships and move forward.',
    key: '梅花plum blossom,栽培cultivation,坚强strength,纯洁purity,高雅elegance,不畏艰难not fear hardships',
    difficulty: 4,
    year: '2019-12',
  },
  {
    source: '港珠澳大桥全长55公里，是我国一项不同寻常的工程壮举。大桥将三个城市之间的行程时间从3小时缩短到30分钟。这座跨度巨大的钢筋混凝土大桥充分证明中国有能力建造创纪录的巨型建筑。',
    reference: 'With a total length of 55 kilometers, the Hong Kong-Zhuhai-Macao Bridge is an extraordinary engineering feat of our country. The bridge shortens the travel time between the three cities from three hours to 30 minutes. This huge reinforced concrete bridge fully proves China\'s ability to build record-breaking mega structures.',
    key: '工程壮举engineering feat,缩短shorten,行程时间travel time,钢筋混凝土reinforced concrete,巨型建筑mega structures',
    difficulty: 4,
    year: '2020-12',
  },
  {
    source: '近年来，越来越多的中国文化产品走向全球市场并逐渐获得海外消费者的青睐。数据显示，中国的出版物、影视作品、网络文学和动漫产品等销售量连年攀升。中国政府出台了一系列政策鼓励和支持文化产品出口。',
    reference: 'In recent years, more and more Chinese cultural products have appeared on the global market and gradually gained the favor of overseas consumers. Statistics show that the sales volume of Chinese publications, films and TV programs, internet literature and cartoon products has been on the rise for years. The Chinese government has introduced a series of policies to encourage and support the export of cultural products.',
    key: '文化产品cultural products,海外消费者overseas consumers,出版物publications,网络文学internet literature,出台政策introduced policies',
    difficulty: 4,
    year: '2023-06',
  },
  {
    source: '随着经济和社会的发展，中国的人口结构发生了显著变化，逐渐步入老龄化社会。中国政府通过改革社会保障制度，不断增加社会保障经费，逐步扩大社会保障覆盖范围。',
    reference: 'With the development of economy and society, there has been a significant change in the population structure in China, gradually transitioning into an aging society. Through the reform of the social security system, the Chinese government has continuously increased social security funds and gradually expanded the coverage of social security.',
    key: '人口结构population structure,老龄化aging,社会保障social security,覆盖范围coverage',
    difficulty: 4,
    year: '2023-12',
  },
];

let transCount = 0;
for (const t of translations) {
  insertTranslation.run([t.source, t.reference, t.key, t.difficulty, t.year]);
  transCount++;
}

// ====== 写作模板种子 ======
const insertTemplate = db.prepare('INSERT OR IGNORE INTO writing_templates (title, category, template_structure, useful_expressions_json, model_paragraph_en, model_paragraph_cn) VALUES (?, ?, ?, ?, ?, ?)');

const templates = [
  {
    title: '观点论述型模板',
    category: '议论文',
    structure: `【引言段】
In the current era of [时代背景], the issue of [话题] has triggered widespread debate. While some argue that [反方观点], I firmly believe that [我的观点]. This essay will elaborate on the reasons for my stance.

【主体段1】
First and foremost, [论点1] plays a pivotal role. A prime example is [举例], which illustrates how [论证]. The implication is clear: without [条件], [结果] would be severely compromised.

【主体段2】
Furthermore, it is worth noting that [论点2] contributes significantly to the overall picture. As the saying goes, "[引用谚语]". This wisdom reminds us that [解释谚语]. In the context of [话题], this means [与话题关联].

【结论段】
Taking all factors into account, I maintain that [重申观点]. Only by [建议行动] can we harness the benefits while mitigating the drawbacks. The future depends on our collective wisdom to strike a balance.`,
    expressions: JSON.stringify({
      开篇: ['In the current era of...', 'The issue of... has triggered widespread debate.', 'While opinions vary, it is essential to...'],
      论证: ['First and foremost...', 'Furthermore...', 'A prime example is...', 'It is worth noting that...'],
      结尾: ['Taking all factors into account...', 'Only by... can we...', 'The future depends on...'],
    }),
    paragraph_en: 'In the current era of rapid technological advancement, the issue of whether artificial intelligence will replace human workers has triggered widespread debate. While some argue that AI poses a threat to employment, I firmly believe that it will ultimately create more opportunities than it eliminates.',
    paragraph_cn: '在科技飞速发展的当下，AI是否会取代人类工作引发了广泛讨论。虽然有人认为AI对就业构成威胁，但我坚信它最终会创造比消除更多的机会。',
  },
  {
    title: '问题解决型模板',
    category: '议论文',
    structure: `【引言段】
It is an undeniable fact that [问题] has become increasingly prominent in contemporary society. This phenomenon has far-reaching implications, and it is imperative that we analyze its root causes and explore viable solutions.

【主体段1 — 原因分析】
The causes of this problem are multifaceted. To begin with, [原因1] has played a significant role. In addition, [原因2] cannot be overlooked. The interplay of these factors has contributed to the severity of the situation.

【主体段2 — 解决方案】
In light of the above analysis, several measures can be taken. On the governmental level, [措施1] should be implemented. Meanwhile, individuals need to [措施2]. Only through coordinated efforts can this issue be effectively addressed.

【结论段】
In conclusion, while [问题] presents considerable challenges, it is by no means insurmountable. What we need is the determination and collaborative spirit to confront it head-on.`,
    expressions: JSON.stringify({
      开篇: ['It is an undeniable fact that...', '...has become increasingly prominent.', 'It is imperative that we...'],
      分析: ['The causes are multifaceted.', 'To begin with...', 'In addition...', 'The interplay of these factors...'],
      方案: ['Several measures can be taken.', 'On the governmental level...', 'Only through coordinated efforts...'],
    }),
    paragraph_en: 'It is an undeniable fact that environmental pollution has become increasingly prominent in contemporary society. The causes are multifaceted — ranging from industrial emissions to individual consumption patterns. Only through coordinated efforts between governments and citizens can this issue be effectively addressed.',
    paragraph_cn: '环境污染已成为当代社会日益突出的问题，这是不可否认的事实。其原因是多方面的——从工业排放到个人消费模式。只有通过政府和公民的协调努力，这个问题才能得到有效解决。',
  },
  {
    title: '图表描述型模板',
    category: '图表作文',
    structure: `【引言段 — 描述图表】
As is vividly depicted in the chart/graph, [图表内容概述]. According to the statistics provided, [具体数据], which represents [变化方向] of approximately [幅度] compared with [参照年份].

【主体段 — 原因分析】
What accounts for this trend? From my perspective, the following factors deserve careful consideration. First, [原因1]. Moreover, [原因2] has further accelerated this development. It is also worth mentioning that [原因3].

【结论段】
Based on the analysis above, I am convinced that this trend will continue in the foreseeable future. The data not only reveals [启示1] but also reminds us that [启示2].`,
    expressions: JSON.stringify({
      描述: ['As is vividly depicted in the chart...', 'According to the statistics...', '...which represents...'],
      分析: ['What accounts for this trend?', 'From my perspective...', '...has further accelerated...'],
    }),
    paragraph_en: 'As is vividly depicted in the bar chart, the number of Chinese students studying abroad rose dramatically from 200,000 in 2010 to over 700,000 in 2023, representing an increase of approximately 250%. What accounts for this remarkable trend?',
    paragraph_cn: '如柱状图所示，中国留学生人数从2010年的20万急剧增长到2023年的70多万，增幅约250%。是什么导致了这一显著趋势？',
  },
];

let templateCount = 0;
for (const t of templates) {
  insertTemplate.run([t.title, t.category, t.structure, t.expressions, t.paragraph_en, t.paragraph_cn]);
  templateCount++;
}

// ====== 写作佳句种子 ======
const insertSentence = db.prepare('INSERT OR IGNORE INTO writing_sentences (sentence_en, sentence_cn, category, topic_tag, difficulty, exam_year) VALUES (?, ?, ?, ?, ?, ?)');

const sentences = [
  { en: 'Nothing is more important than to receive education.', cn: '没有什么比接受教育更重要。', cat: '开头句', topic: '教育', diff: 1, year: null },
  { en: 'We cannot emphasize the importance of protecting our environment too much.', cn: '保护环境的重要性怎么强调都不为过。', cat: '开头句', topic: '环境', diff: 2, year: null },
  { en: 'There is no denying that our living environment has gone from bad to worse.', cn: '不可否认，我们的生活环境已经日益恶化。', cat: '开头句', topic: '环境', diff: 2, year: null },
  { en: 'It is universally acknowledged that trees are indispensable to us.', cn: '众所周知，树木对我们来说是不可或缺的。', cat: '开头句', topic: '环境', diff: 1, year: null },
  { en: 'There is no doubt that our educational system leaves something to be desired.', cn: '毫无疑问，我们的教育制度还有待改进。', cat: '开头句', topic: '教育', diff: 2, year: null },
  { en: 'So precious is time that we cannot afford to waste it.', cn: '时间是如此珍贵，我们浪费不起。', cat: '论据句', topic: '人生', diff: 3, year: null },
  { en: 'Rich as our country is, the qualities of our living are by no means satisfactory.', cn: '虽然我们的国家很富有，但生活质量还远远不能令人满意。', cat: '让步句', topic: '社会', diff: 4, year: '2021-06' },
  { en: 'The harder you work, the more progress you make.', cn: '你越努力，进步就越大。', cat: '论据句', topic: '人生', diff: 1, year: null },
  { en: 'By taking exercise, we can always stay healthy.', cn: '通过锻炼，我们可以始终保持健康。', cat: '论据句', topic: '健康', diff: 1, year: null },
  { en: 'On no account can we ignore the value of knowledge.', cn: '我们绝对不能忽视知识的价值。', cat: '论据句', topic: '教育', diff: 3, year: null },
  { en: 'It is time the authorities concerned took proper steps to solve the traffic problems.', cn: '有关当局是时候采取适当措施来解决交通问题了。', cat: '结尾句', topic: '社会', diff: 3, year: '2022-06' },
  { en: 'The reason why we have to grow trees is that they can provide us with fresh air.', cn: '我们必须植树的原因是它们能为我们提供新鲜空气。', cat: '论据句', topic: '环境', diff: 1, year: null },
  { en: 'Education is not only a means to acquire knowledge, but also a way to shape ones character.', cn: '教育不仅是获取知识的手段，也是塑造人格的途径。', cat: '论据句', topic: '教育', diff: 2, year: '2023-06' },
  { en: 'Lifelong learning has become an inevitable trend in modern society.', cn: '终身学习已成为现代社会不可阻挡的趋势。', cat: '开头句', topic: '教育', diff: 2, year: '2023-06' },
  { en: 'The rapid development of artificial intelligence has brought profound changes to peoples lives.', cn: 'AI的快速发展给人们的生活带来了深刻变化。', cat: '开头句', topic: '科技', diff: 2, year: '2024-06' },
  { en: 'Protecting the environment is the common responsibility of all human beings.', cn: '保护环境是全人类的共同责任。', cat: '开头句', topic: '环境', diff: 1, year: null },
  { en: 'Traditional culture is the spiritual wealth of a nation, carrying its history and values.', cn: '传统文化是一个民族的精神财富，承载着其历史和价值观。', cat: '论据句', topic: '文化', diff: 3, year: '2022-12' },
  { en: 'Cultural integration helps promote mutual understanding and friendship between different countries.', cn: '文化融合有助于促进不同国家之间的相互理解和友谊。', cat: '论据句', topic: '文化', diff: 3, year: null },
  { en: 'Only by taking effective measures can we better promote the sustainable development of society.', cn: '只有采取有效措施，我们才能更好地促进社会的可持续发展。', cat: '结尾句', topic: '社会', diff: 3, year: '2021-12' },
  { en: 'From my perspective, challenges are not merely obstacles but opportunities for growth.', cn: '在我看来，挑战不仅是障碍，更是成长的机会。', cat: '结尾句', topic: '人生', diff: 2, year: null },
  { en: 'A prevailing viewpoint suggests that technology should serve humanity rather than dominate it.', cn: '一个主流的观点认为，技术应该服务于人类而非主宰人类。', cat: '论据句', topic: '科技', diff: 4, year: '2024-06' },
  { en: 'The significance of mental health can never be overstated in our fast-paced society.', cn: '在快节奏的社会中，心理健康的重要性怎么强调都不为过。', cat: '开头句', topic: '健康', diff: 3, year: '2023-12' },
  { en: 'While enjoying the convenience brought by technology, we should also be aware of its potential risks.', cn: '在享受科技便利的同时，我们也应该意识到其潜在风险。', cat: '让步句', topic: '科技', diff: 2, year: null },
  { en: 'The government has implemented a series of policies aimed at narrowing the urban-rural gap.', cn: '政府实施了一系列旨在缩小城乡差距的政策。', cat: '论据句', topic: '社会', diff: 3, year: '2023-06' },
  { en: 'In conclusion, it is not difficult to draw the conclusion that hard work is the key to success.', cn: '总之，不难得出这样的结论：努力工作是成功的关键。', cat: '结尾句', topic: '人生', diff: 1, year: null },
];

let sentenceCount = 0;
for (const s of sentences) {
  insertSentence.run([s.en, s.cn, s.cat, s.topic, s.diff, s.year]);
  sentenceCount++;
}

saveDb();
console.log(`Seeded: ${passageCount} passages, ${transCount} translations, ${templateCount} templates, ${sentenceCount} sentences.`);
