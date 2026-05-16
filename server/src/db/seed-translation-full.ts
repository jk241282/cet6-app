import { initDb, getDb, saveDb } from './index.js';
import { initDatabase } from './init.js';

await initDatabase();
const db = getDb();

const iT = db.prepare('INSERT OR IGNORE INTO translation_exercises (source_text_cn,reference_en,key_points,difficulty,exam_year) VALUES (?,?,?,?,?)');

const translations = [
  {
    s: '成语是汉语中一种独特的表达方式，大多由四个汉字组成。它们虽然高度简练、形式固定，但通常包含深刻的含义。大多数成语来源于中国古代文学作品，并且与神话传说和历史事件有关。',
    r: 'Chinese idioms are a unique way of expression in Chinese, mostly composed of four Chinese characters. Although highly concise and fixed in form, they usually entail profound meanings. Most idioms stem from ancient Chinese literature and are related to myths, legends, and historical events.',
    k: '成语idioms,高度简练highly concise,深刻的含义profound meanings,神话传说myths and legends',
  },
  {
    s: '汉语是全世界母语人数最多的语言，也是联合国六种官方语言之一。汉语以方块字为书写形式，有着世界上最古老的持续使用的书写系统。随着中国经济的快速发展，学习汉语的人数正在迅速增加。',
    r: 'Chinese is the language with the largest number of native speakers in the world and one of the six official languages of the United Nations. Written in the form of square characters, Chinese has the oldest continuously used writing system in the world. With the rapid development of China\'s economy, the number of people learning Chinese is rapidly increasing.',
    k: '母语人数native speakers,方块字square characters,书写系统writing system,官方语言official languages',
  },
  {
    s: '荷花是中国的传统名花之一，它从污泥中生长出来却不受污染，象征着纯洁和高雅。荷花的花期很长，可以延续两三个月，因此深受人们喜爱。中国古代诗人写下了无数赞美荷花的诗篇。',
    r: 'The lotus is one of China\'s traditional famous flowers. It grows out of mud but remains unstained, symbolizing purity and elegance. The blooming period of lotus is quite long, lasting for two or three months, which makes it deeply loved by people. Ancient Chinese poets wrote countless poems praising the lotus.',
    k: '荷花lotus,污泥mud,纯洁purity,高雅elegance,象征symbolize',
  },
  {
    s: '青藏铁路是世界上最高最长的高原铁路，全长1956公里。铁路建设者克服了极端高寒缺氧等困难，并采取了许多措施保护沿线的生态环境，因此它也被称为"绿色铁路"。青藏铁路大大促进了西藏的经济发展。',
    r: 'The Qinghai-Tibet Railway is the highest and longest plateau railway in the world, with a total length of 1,956 kilometers. The railway builders overcame difficulties such as extreme cold and oxygen deficiency, and took many measures to protect the ecological environment along the line. Therefore, it is also known as the "Green Railway". The Qinghai-Tibet Railway has greatly promoted the economic development of Tibet.',
    k: '高原铁路plateau railway,克服困难overcome difficulties,生态环境ecological environment,促进promote',
  },
  {
    s: '延安位于陕西省北部，地处黄河中游，是中国革命的圣地。毛泽东等老一辈革命家曾在这里生活战斗了十三年，培育了延安精神。现在延安有九处革命纪念馆，每年吸引大量游客前来参观学习。',
    r: 'Yan\'an, located in northern Shaanxi Province and in the middle reaches of the Yellow River, is a holy land of Chinese revolution. The older generation of revolutionaries including Mao Zedong lived and fought here for 13 years, cultivating the Yan\'an spirit. Now Yan\'an has nine revolutionary memorial halls, attracting a large number of tourists to visit and learn every year.',
    k: '革命圣地holy land of revolution,老一辈革命家older generation of revolutionaries,培育cultivate,纪念馆memorial halls',
  },
  {
    s: '赵州桥建于隋朝，由天才建筑师李春设计并监督建造，距今已有1400多年历史。大桥全长50.82米，宽9.6米，结构新颖，造型美观。桥的大拱两端各有两个小拱，这种设计既减轻了桥身重量，又增加了美观性。',
    r: 'The Zhaozhou Bridge was built in the Sui Dynasty, designed and supervised by the genius architect Li Chun, with a history of over 1,400 years. The bridge is 50.82 meters long and 9.6 meters wide, with a novel structure and graceful appearance. There are two small arches at each end of the main arch, which not only reduce the weight of the bridge but also increase its aesthetic appeal.',
    k: '隋朝Sui Dynasty,建筑师architect,新颖novel,美观graceful,减轻重量reduce weight',
  },
  {
    s: '改革开放以来，中国经济经历了快速发展，从计划经济转向市场经济。GDP的快速增长使五亿多人摆脱了贫困。与此同时，政府实施了第十二个五年规划，重点关注环境保护和人民生活质量。',
    r: 'Since the reform and opening-up, China\'s economy has experienced rapid development, transitioning from a planned economy to a market economy. The rapid growth of GDP has lifted more than 500 million people out of poverty. Meanwhile, the government has implemented the 12th Five-Year Plan, focusing on environmental protection and the quality of people\'s lives.',
    k: '改革开放reform and opening-up,计划经济planned economy,市场经济market economy,摆脱贫困lift out of poverty',
  },
  {
    s: '近年来，中国的公共服务设施建设取得了显著进展。城市功能日益完善，基础设施体系化建设不断推进。政府通过改造老旧小区、增加绿地面积、优化公共交通等方式，为市民创造了更加宜居的生活环境。',
    r: 'In recent years, China has made remarkable progress in the construction of public service facilities. Urban functions have been increasingly improved, and the systematic construction of infrastructure has been continuously advanced. The government has created a more livable environment for citizens by renovating old residential areas, increasing green space, and optimizing public transportation.',
    k: '公共服务public service,基础设施infrastructure,老旧小区old residential areas,宜居livable',
  },
];

db.run('BEGIN');
for (const t of translations) {
  iT.run([t.s, t.r, t.k, Math.floor(Math.random()*2)+3, null]);
}
db.run('COMMIT');
saveDb();
console.log(`Seeded ${translations.length} translation exercises.`);
